import { Form, useFetcher } from "remix"
import type { FeedItemWithSource } from "~/types/feedItem"

const getDomain = (link?:string)=>{
    if(!link) return null
    return new URL(link).hostname.replace('www.','')
}

export const FeedListItem = ({item}:{item:FeedItemWithSource})=>{

    let fetcher = useFetcher();

    return <div className="feed-item" key={item.id}>
        <div className="feed-item-content">
            <a className="title" target="_blank" href={item.url}>{item.title}</a>
            <div className="feed-item-meta">
                <span className="source">{getDomain(item.url)}</span>
                {item.commentsUrl ? <a className="comments" target="_blank" href={item.commentsUrl}>Comments</a> : null}
            </div>
            {/* <small dangerouslySetInnerHTML={{__html:item.content}}></small> */}
        </div>
        <div className="feed-item-actions">
            
            <fetcher.Form method="post" action={`/feeds/${item.id}/read`}>
                <input 
                    className="button"
                    disabled={fetcher.state === "submitting"}
                    type={"submit"} 
                    value="Mark as Read" />
            </fetcher.Form>
        </div>
       
    </div>
}
