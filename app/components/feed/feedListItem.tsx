import { FeedItem } from "@prisma/client"
import { Form, useFetcher } from "remix"
import { relativeTime } from "~/utils/relativeTime"


const getDomain = (link?:string)=>{
    if(!link) return null
    return new URL(link).hostname.replace('www.','')
}

export const FeedListItem = ({item}:{item:FeedItem})=>{

    let fetcher = useFetcher();

    if(fetcher.submission) return null;

    return <div className="feed-item" key={item.id}>
        <div className="feed-item-content">
            <a className="title" target="_blank" href={item.url}>{item.title}</a>
            <div className="feed-item-meta">
                <span className="source">{getDomain(item.url)}</span>
                <span className="time">{relativeTime(item.createdAt)}</span>
                {item.commentsUrl ? <a className="comments" target="_blank" href={item.commentsUrl}>Comments</a> : null}
            </div>
            {/* <small dangerouslySetInnerHTML={{__html:item.content}}></small> */}
        </div>
        <div className="feed-item-actions">
            
            <fetcher.Form method="post" action={`/item/${item.id}/read`}>
                <input 
                    className="button"
                    //disabled={fetcher.state === "submitting"}
                    type={"submit"} 
                    value="Read" />
            </fetcher.Form>
        </div>
       
    </div>
}
