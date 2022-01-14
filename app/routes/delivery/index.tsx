import { FeedDelivery } from "@prisma/client"
import { Link, useLoaderData } from "remix"
import { Page, PageActions } from "~/components/app/page"
import { getFeedDeliveries } from "~/server/feed/feed.server"
import { formatDayOfWeek } from "~/utils/format"
import { relativeTime } from "~/utils/relativeTime"


export const loader = async()=>{
    return await getFeedDeliveries()
}

export default function FeedsList(){
    const data = useLoaderData<FeedDelivery[]>()
    return <Page>
        <PageActions><Link className="button" to="new">New Feed Delivery</Link></PageActions>
        {data.map((delivery)=>{
            return <div key={delivery.id} className="feed-delivery">
                <div className="feed-delivery-content">
                    <Link to={`${delivery.id}`}>{delivery.active ? '' :'disabled: '} at {delivery.utcHour} every {delivery.intervalHours} hours on {delivery.activeDays.map(formatDayOfWeek).join(', ')}</Link>
                </div>
                <div className="feed-delivery-meta">
                    {delivery.lastDeliveredAt ? relativeTime(delivery.lastDeliveredAt) : '-' }
                </div>              
            </div>
        })}
    </Page>
}