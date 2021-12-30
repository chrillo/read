import { FeedItem } from "@prisma/client"
import { FeedListItem } from "./feedListItem"


export const FeedList = ({items}:{items:FeedItem[]})=>{
    return <div className="feed-item-list">
    {items.map((item)=>{
      return <FeedListItem item={item} key={item.id} />
    })}
  </div>
}