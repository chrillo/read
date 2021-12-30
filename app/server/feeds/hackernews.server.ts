import { FeedItem } from "@prisma/client";

type HackerNewsItem = {
 
    by: string
    descendants: number
    id: number
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
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const ids = await res.json() as number[] 
    return await Promise.all(ids.slice(from,count).map(getHackerNewsItem))
}