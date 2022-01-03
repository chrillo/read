import { LoaderFunction, useLoaderData } from "remix";
import { FeedList } from "~/components/feed/feedList";
import { getFeedItems } from "~/server/feeds/feeds.server";
import { FeedListEmpty } from "~/components/feed/feedListEmpty";
import { Page } from "~/components/app/page";
import { FeedItem } from "@prisma/client";
import { useRevalidateOnFocus } from "~/utils/revalidateOnFocus";



export const loader:LoaderFunction = async():Promise<FeedItem[]>=>{

  return getFeedItems()//await db.feedItem.findMany({orderBy:{createdAt:'desc'},include:{source:true},where:{read:false}})
  
}

export default function Index() {
  const items = useLoaderData<FeedItem[]>()
  useRevalidateOnFocus()
  return (
    <Page>
        {items.length ? <FeedList items={items} ></FeedList> : <FeedListEmpty/>}
    </Page>
  );
}
