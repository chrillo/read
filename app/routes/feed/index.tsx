import { FeedSource } from "@prisma/client"
import { Link, useLoaderData } from "remix"
import { Page, PageActions } from "~/components/app/page"
import { getFeedSources } from "~/server/feed/feed.server"
import { relativeTime } from "~/utils/relativeTime"


export const loader = async()=>{
    return await getFeedSources()
}

export default function FeedsList(){
    const data = useLoaderData<FeedSource[]>()
    return <Page>
        <PageActions><Link className="button" to="new">New Feed Source</Link></PageActions>
        {data.map((feed)=>{
            return <div key={feed.id} className="feed-source">
                <div className="feed-source-content">
                    <Link to={`${feed.id}`}>{feed.active ? '' :'disabled: '}{feed.title}</Link>
                    <a target="_blank" href={feed.url}>{feed.url}</a>
                </div>
                <div className="feed-source-meta">
                    {relativeTime(feed.updatedAt)}
                </div>              
            </div>
        })}
    </Page>
}