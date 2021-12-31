import { FeedItem } from "@prisma/client";
import { promiseMap } from "~/utils/promiseMap";

type HackerNewsItem = {
    id: string
    by: string
    descendants: number
    kids?: number[]
    score: number[],
    time: number
    title: string
    type: string
    url: string
    
}

export const getHackerNewsItem = async(id:number):Promise<FeedItem>=>{
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    const item = await res.json() as HackerNewsItem
    return {
        title: item.title,
        author: item.by,
        content:`Url: ${item.url} Points: ${item.score} Comments: ${(item.kids || []).length}`,
        url:item.url,
        commentsUrl: (item.kids || []).length ? `https://news.ycombinator.com/item?id=${id}` : null,
        guid:`https://news.ycombinator.com/item?id=${id}`,
        createdAt: new Date(item.time * 1000),
        updatedAt: new Date(item.time * 1000),
        read:false,
        sourceId: null,
        id: item.id
    }
}

export const getFrontPageItems = async(from=0,count = 100):Promise<FeedItem[]>=>{
    console.log('starting hn feed assembly')
    const start = Date.now()
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const ids = await res.json() as number[] 
    console.log('got top items, took', Date.now() - start)
    const items = await promiseMap(ids.slice(from,count),getHackerNewsItem,{concurrency:25})
    console.log('got all items, took',Date.now() - start)
    return items
}