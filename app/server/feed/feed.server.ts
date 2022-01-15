import { FeedDelivery, FeedItem, FeedSource, Prisma, prisma } from "@prisma/client";
import { db } from "../db.server";
import RssParser from 'rss-parser';
import { promiseMap } from "~/utils/promiseMap";
import crypto from 'crypto'
import { isString } from "~/utils/typeGuards";
import { getUtcOffsetForTimezoneInMinutes } from "~/utils/timezone";
import { zonedTimeToUtc } from "date-fns-tz";
import { addDays } from "date-fns";

const HOUR_IN_MS = 3600 * 1000
const DAY_IN_MS = 24 * 3600 * 1000

const getSHA256 = (input:object)=>{
    return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex')
}

export const getFeedSources = async()=>{
    return await db.feedSource.findMany({orderBy:{updatedAt:'desc'}})
}
export const getFeedSource = async({id}:{id:string})=>{
    return await db.feedSource.findUnique({where:{id}})
}

export const validateFeedUrl = async({url}:{url:string})=>{
    const parser = getFeedParser()
    const feed = await parser.parseURL(url) 
    return feed
}
export const updateFeedSource = async(id:string, data:{title:string,url:string,active?:boolean})=>{
    return await db.feedSource.update({where:{id},data})
}
export const createFeedSource = async({title,url}:{title:string,url:string})=>{

    return await db.feedSource.create({
        data:{
            title,
            url,
            active:true,
            type:'rss'
        }
    })
}

export const getActiveFeedSources = async()=>{
    return await db.feedSource.findMany({where:{active:true}})
}


export const createFeedDelivery = async({hour,active, activeDays,timeZone}:{timeZone:string, hour:number,active?:boolean,activeDays:number[]})=>{
    return db.feedDelivery.create({data:{
        hour,
        timeZone,
        active:active ? true : false,
        activeDays,
        lastDeliveredAt:null
    }})
}
export const getFeedDeliveries = async()=>{
    return await db.feedDelivery.findMany()
}
export const updateFeedDelivery = async(id:string, data:Partial<FeedDelivery>)=>{
    return db.feedDelivery.update({where:{id},data})
}
export const getFeedDelivery = async(id:string)=>{
    return db.feedDelivery.findUnique({where:{id}})
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

export const updateFeedItem = async(id:string, data:Partial<FeedItem>)=>{
    return db.feedItem.update({
        where:{
            id
        },
        data
    })
}
export const getFeedItemsWithCount = async()=>{
    const [items,count] = await Promise.all([
        db.feedItem.findMany({orderBy:{createdAt:'desc'},where:{read:false,delivered:true}}),
        db.feedItem.count({orderBy:{createdAt:'desc'},where:{read:false,delivered:true}})
    ])
    return {items,count}
}

const getGuid = (remoteItem:({id: string
} & RssParser.Item))=>{
    return remoteItem.guid || remoteItem.id || getSHA256(remoteItem)
}

const isItemChanged = (item:FeedItem,updateItem:Partial<FeedItem>)=>{
    const keys = ['commentsUrl','title','url'] as (keyof FeedItem)[]
    return keys.reduce((changed,key)=>{
        if(item[key] !== updateItem[key]) changed = true
        return changed
    },false)
}

const getFeedParser = ()=>{
    return new RssParser( {timeout:90000,customFields: {
        item: ['hn:comments','id'],
    }
    });
}

export const getNextDelivery = (delivery:FeedDelivery,now:Date):Date=>{

    const {hour,timeZone,lastDeliveredAt,activeDays} = delivery

    const date = lastDeliveredAt ? lastDeliveredAt : new Date()
    date.setHours(hour)
    date.setSeconds(0)
    date.setMilliseconds(0)
    date.setMinutes(0)
    let nextDelivery = zonedTimeToUtc(date, timeZone)

    if(nextDelivery < now){
        nextDelivery = addDays(nextDelivery,1);
    }
    let day = nextDelivery.getDay()
    if(activeDays.length){
        while(!activeDays.includes(day)){
            nextDelivery = addDays(nextDelivery,1);
            day = nextDelivery.getDay()
        }
    }
    return nextDelivery
}

export const deliverItems = async()=>{
    const deliveriesToBeMade = await getDeliveriesToBeMade()
    return await runDeliveries(deliveriesToBeMade)
}
export const getDeliveriesToBeMade = async()=>{
    const deliveries = await db.feedDelivery.findMany({where:{active:true}}) 
    const now = new Date()
    const currentUtcHour = now.getUTCHours()
    const currentUtcDay = now.getUTCDay()
    return deliveries.filter((delivery)=>{
        // TODO: handle timezones here
        const nextDelivery = getNextDelivery(delivery,now)
        if(nextDelivery.getUTCDay() !== currentUtcDay ) return false
        if(nextDelivery.getUTCHours() !== currentUtcHour) return false
        return true
    })
}
export const runDeliveries = async(deliveries:FeedDelivery[])=>{
    console.log('run deliveries',deliveries.length)
    return await promiseMap(deliveries, async(delivery)=>{
        // TODO: scoping of deliveries
        console.log('run delivery',delivery)
        const [items, updatedDelivery] = await db.$transaction([
            db.feedItem.updateMany({where:{delivered:false},data:{delivered:true}}),
            db.feedDelivery.update({where:{id:delivery.id}, data:{lastDeliveredAt:new Date()}}),
        ])
        console.log('delivered items',items)
        return updatedDelivery
    },{concurrency:1})
}

export const syncFeed = async(feedId:string)=>{
    try{
        const start = Date.now()
        const feed = await db.feedSource.findFirst({where:{id:feedId}})
        if(!feed || !feed.active) return
        const parser = getFeedParser()
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
                    author: isString(remoteItem.creator) ? remoteItem.creator : null,
                    commentsUrl: remoteItem['hn:comments'] || null,
                    content:'',
                    sourceId:feed?.id,
                    guid
                }
                const existingItem = existingMap[guid]
                if(!existingItem){
                    agg.creates.push({...item, read:false, delivered:false})
                }else if(existingItem && isItemChanged(existingItem,item)){
                    agg.updates.push({where:{id:existingItem.id},data:item})
                }
              
            return agg
        },{updates:[],creates:[]} as {
            updates:Prisma.FeedItemUpdateArgs[],
            creates:Prisma.FeedItemCreateInput[]
        });
        const writeStart = Date.now()
        if(creates.length){
            await db.feedItem.createMany({data:creates})
        }
        if(updates.length){
            await db.$transaction(updates.map((input)=>db.feedItem.update(input)))
        }
        if(updates.length || creates.length){
            await db.feedSource.update({where:{id:feed.id},data:{updatedAt:new Date()}})
        }
        console.log('updates written',feed.title, 'took',Date.now() - writeStart,updates.length,creates.length)
       
        console.log('feed updated',feed.title,'took in total',Date.now() - start,'ms, updates: ',updates.length)
    }catch(e){
        console.error("error syncing feed",feedId)
        if(e instanceof Error){
            console.error(e.message)
        }
    } 
   
}
