import { FeedSource } from "@prisma/client"
import { useLoaderData } from "remix"
import { Page } from "~/components/nav/page"
import { db } from "~/server/db.server"


export const loader = async()=>{
    return db.feedSource.findMany()
}

export default function FeedsList(){
    const data = useLoaderData<FeedSource[]>()
    return <Page>
        {data.map((feed)=>{
            return <div className="feed-source">
                <span>{feed.title}</span>
                {' '}
                <a target="_blank" href={feed.url}>{feed.url}</a>
            </div>
        })}
    </Page>
}