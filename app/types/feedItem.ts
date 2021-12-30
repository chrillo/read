import { FeedItem, FeedSource } from "@prisma/client";


export  type FeedItemWithSource = FeedItem & {source:FeedSource | null}