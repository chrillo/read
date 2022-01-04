import { FeedItem } from "@prisma/client"
import { FeedListItem } from "./feedListItem"


export const FeedList = ({items,markAsRead}:{items:FeedItem[],markAsRead:(item:FeedItem)=>Promise<FeedItem>})=>{
    return <div className="feed-item-list">
    <div className="feed-items">
      {items.map((item)=>{
        return <FeedListItem markAsRead={markAsRead} item={item} key={item.id} />
      })}
    </div>
  </div>
}