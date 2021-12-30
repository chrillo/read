import { FeedItem, FeedSource } from "@prisma/client";
import { db } from "../db.server";
import RssParser from 'rss-parser';
const crypto = require('crypto').webcrypto;

const md5 = async(value:string)=>{
  const msgUint8 = new TextEncoder().encode(value) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
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

export const updateFeedItem = async(itemId:number, data:Partial<FeedItem>)=>{
    const feedItem = await db.feedItem.update({
        where:{
            id:Number(itemId)
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

export const syncFeed = async(feedId:number)=>{
    const feed = await db.feedSource.findFirst({where:{id:feedId}})
    if(!feed || !feed.active) return
    const parser = new RssParser( {customFields: {
        item: ['hn:comments','id'],
      }});
    const urls = feed.url.split(',')
    for(let url of urls){
        const remoteFeed = await parser.parseURL(url);
        const updates = remoteFeed.items.map((remoteItem) => {
            return async()=>{
                const guid = remoteItem.guid || remoteItem.id || await md5(JSON.stringify(remoteItem))
                
                const update = {
                    title:remoteItem.title || '',
                    url:remoteItem.link || '',
                    author: remoteItem.creator,
                    commentsUrl: remoteItem['hn:comments'] || '',
                    content:remoteItem.content || '',
                    sourceId:feed?.id,
                    guid,
                }
                const create = {
                    read:false,
                    //createdAt: remoteItem.pubDate ? new Date(remoteItem.pubDate) : undefined,
                    ...update
                }
                return await db.feedItem.upsert({update,create,where:{guid}})
            }
        });

        for(let i in updates){
            await updates[i]()
        }
    }
   
}