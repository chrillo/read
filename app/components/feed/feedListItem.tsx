import { FeedItem } from "@prisma/client"
import { useCallback, useState } from "react"
import { relativeTime } from "~/utils/relativeTime"


const getDomain = (link?:string)=>{
    if(!link) return null
    return new URL(link).hostname.replace('www.','')
}

export const FeedListItem = ({item}:{item:FeedItem})=>{

    const [read,setRead] = useState(false)
    const [submission,setSubmission] = useState(false)

    const markAsRead = useCallback(async()=>{
        setSubmission(true)
        setRead(true)
        try{
            await fetch(`/item/${item.id}/read`,{method:'post'})
        }catch(e){
            console.error(e)
            setRead(false)
        }
        setSubmission(false)
     
    },[item])

    if(read) return null

    return <div className="feed-item" key={item.id}>
        <div className="feed-item-content">
            <a className="title" target="_blank" href={item.url}>{item.title}</a>
            <div className="feed-item-meta">
                <span className="source">{getDomain(item.url)}</span>
                <span className="time">{relativeTime(item.createdAt)}</span>
                {item.commentsUrl ? <a className="comments" target="_blank" href={item.commentsUrl}>Comments</a> : null}
            </div>
        </div>
        <div className="feed-item-actions">
            <button disabled={submission} className="button" onClick={markAsRead}>Read</button>
        </div>
    </div>
}
