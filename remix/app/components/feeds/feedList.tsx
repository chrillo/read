import type { FeedItemWithSource } from "~/types/feedItem"
import { FeedListItem } from "./feedListItem"


export const FeedList = ({items}:{items:FeedItemWithSource[]})=>{
    return <div className="feed-item-list">
    {items.map((item)=>{
      return <FeedListItem item={item} key={item.id} />
    })}
  </div>
}