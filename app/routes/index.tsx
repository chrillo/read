import { LoaderFunction, useLoaderData } from "remix";
import { FeedList } from "~/components/feed/feedList";
import { getFeedItemsWithCount } from "~/server/feeds/feeds.server";
import { FeedListEmpty } from "~/components/feed/feedListEmpty";
import { Page } from "~/components/app/page";
import { FeedItem } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

type LoaderData ={
  items:FeedItem[],
  count:number
}

export const loader:LoaderFunction = async():Promise<LoaderData>=>{
  return getFeedItemsWithCount() 
}

const useFeedItems = ()=>{
  const {items,count:itemCount} = useLoaderData<LoaderData>()
  const [count,setCount] = useState(itemCount)
  // not doing this the remix way to avoid refetching the entire fire when one item is marked as read
  const markAsRead = useCallback(async(item)=>{
    item.read = true
    setCount(count-1)
    try{
        await fetch(`/item/${item.id}/read`,{method:'post'})
    }catch(e){
        console.error(e)
        item.read = false
        setCount(count+1)
    }
    return item
  },[count,setCount])
  
  return {items,count,markAsRead}
}

export default function Index() {
  const {items,markAsRead,count} = useFeedItems()
  return (
    <Page>
        {items.length ? <FeedList items={items} markAsRead={markAsRead} ></FeedList> : <FeedListEmpty/>}
        <div className="feed-item-count">{count}</div>
    </Page>
  );
}
