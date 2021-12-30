import { FeedSource } from "@prisma/client"
import { useLoaderData } from "remix"
import { Page } from "~/components/nav/page"
import { getFeedSources } from "~/server/feeds/feeds.server"


export const loader = async()=>{
    return await getFeedSources()
}

export default function FeedsList(){
    const data = useLoaderData<FeedSource[]>()
    return <Page>
        {data.map((feed)=>{
            return <div key={feed.id} className="feed-source">
                <span>{feed.title}</span>
                {' '}
                <a target="_blank" href={feed.url}>{feed.url}</a>
            </div>
        })}
    </Page>
}