import { LoaderFunction, useLoaderData } from "remix";
import { FeedList } from "~/components/feeds/feedList";
import { getFeedItems } from "~/server/feeds/feeds.server";
import { FeedItemWithSource } from "~/types/feedItem";
import { FeedListEmpty } from "~/components/feeds/feedListEmpty";
import { Page } from "~/components/nav/page";



export const loader:LoaderFunction = async():Promise<FeedItemWithSource[]>=>{

  return getFeedItems()//await db.feedItem.findMany({orderBy:{createdAt:'desc'},include:{source:true},where:{read:false}})
  
}

export default function Index() {
  const items = useLoaderData<FeedItemWithSource[]>()
  return (
    <Page>
        {items.length ? <FeedList items={items} ></FeedList> : <FeedListEmpty/>}
    </Page>
  );
}
