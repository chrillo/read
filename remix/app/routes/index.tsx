import { Link, LoaderFunction, NavLink, useLoaderData } from "remix";
import { FeedItem, FeedSource } from '@prisma/client'
import { db } from "~/server/db.server";
import { FeedList } from "~/components/feeds/feedList";
import { getFeedItems } from "~/server/feeds/feeds.service";
import { FeedItemWithSource } from "~/types/feedItem";
import { FeedListEmpty } from "~/components/feeds/feedListEmpty";
import { Page } from "~/components/nav/page";



export const loader:LoaderFunction = async():Promise<FeedItemWithSource[]>=>{

  return await db.feedItem.findMany({orderBy:{createdAt:'desc'},include:{source:true},where:{read:false}})
  
}

export default function Index() {
  const items = useLoaderData<FeedItemWithSource[]>()
  return (
    <Page>
        {items.length ? <FeedList items={items} ></FeedList> : <FeedListEmpty/>}
    </Page>
  );
}
