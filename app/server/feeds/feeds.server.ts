import { FeedItem, FeedSource, Prisma, prisma } from "@prisma/client";
import { db } from "../db.server";
import RssParser from 'rss-parser';
import { promiseMap } from "~/utils/promiseMap";
import crypto from 'crypto'

const getSHA256 = (input:object)=>{
    return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex')
}

export const getFeedSources = async()=>{
    return await db.feedSource.findMany()
}

export const getActiveFeedSources = async()=>{
    return await db.feedSource.findMany({where:{active:true}})
}


export const syncFeeds = async()=>{
    const start = Date.now()
    const feeds = await getActiveFeedSources()
    for(let index in feeds){
        await syncFeed(feeds[index].id)
    }
    const time = Date.now() - start
    return {
        time,
        feeds
    }
}

export const updateFeedItem = async(itemId:string, data:Partial<FeedItem>)=>{
    const feedItem = await db.feedItem.update({
        where:{
            id:itemId
        },
        data:{
            read:true
        }
    })
    return feedItem
}
export const getFeedItems = async()=>{
    return await db.feedItem.findMany({orderBy:{createdAt:'desc'},where:{read:false}})
}

const getGuid = (remoteItem:({id: string
} & RssParser.Item))=>{
    return remoteItem.guid || remoteItem.id || getSHA256(remoteItem)
}

const isItemChanged = (item:FeedItem,updateItem:Partial<FeedItem>)=>{
    const keys = ['commentsUrl','title','url'] as (keyof FeedItem)[]
    return keys.reduce((changed,key)=>{
        if(item[key] ==! updateItem[key]) changed = true
        return changed
    },false)
}

export const syncFeed = async(feedId:string)=>{
    try{
        const start = Date.now()
        const feed = await db.feedSource.findFirst({where:{id:feedId}})
        if(!feed || !feed.active) return
        const parser = new RssParser( {timeout:90000,customFields: {
            item: ['hn:comments','id'],
        }
        });
        console.log('fetch feed',feed.url)
        const fetchStart = Date.now()
        const remoteFeed = await parser.parseURL(feed.url);
        console.log('feed fetched',feed.title, 'took',Date.now() - fetchStart,'ms')

        const guids = remoteFeed.items.map(getGuid)

        const existing = await db.feedItem.findMany({where:{guid: {in:guids}}})

        const existingMap = existing.reduce((agg,item)=>{
            agg[item.guid] = item
            return agg
        },{} as{[key:string]:FeedItem})

        const {updates,creates} = remoteFeed.items.reduce((agg,remoteItem) => {
           
                const guid = getGuid(remoteItem)
                const item = {
                    title:remoteItem.title || '',
                    url:remoteItem.link || '',
                    author: remoteItem.creator || null,
                    commentsUrl: remoteItem['hn:comments'] || null,
                    content:'',
                    sourceId:feed?.id,
                    guid,
                }
                const existingItem = existingMap[guid]
                if(!existingItem){
                    agg.creates.push({...item, read:false})
                }else if(existingItem && isItemChanged(existingItem,item)){
                    agg.updates.push(db.feedItem.update({where:{id:existingItem.id},data:item}))
                }
              
            return agg
        },{updates:[],creates:[]} as {
            updates:(Prisma.Prisma__FeedItemClient<FeedItem>)[],
            creates:Prisma.FeedItemCreateInput[]
        });
        const writeStart = Date.now()
        if(creates.length){
            await db.feedItem.createMany({data:creates})
        }
        if(updates.length){
            await db.$transaction(updates)
        }
        console.log('updates written',feed.title, 'took',Date.now() - writeStart,updates.length,creates.length)
       
        console.log('feed updated',feed.title,'took in total',Date.now() - start,'ms, updates: ',updates.length)
    }catch(e){
        console.error("error syncing feed",feedId)
        console.error(e)
    } 
   
}