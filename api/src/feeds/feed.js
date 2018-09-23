import { ContentSourceConnection } from "../contentSources/contentSourceConnection";
import { FeedItem } from "./feedItem";
import { ContentItem } from "../contentSources/contentItem";
import ApiError from "../lib/apiError";

const ERRORS = {
    NOT_AUTHORIZED:{code: 20001, message: 'not authorized to access this content', code: 401}
}

export const addSourceToFeed = async({user, userId, contentSourceId}={})=>{

    let query = {
        user: userId,
        contentSource: contentSourceId
    }

    let connection = await ContentSourceConnection.findOneAndUpdate(query,query,{upsert:true})

    if(!connection){
        connection = await ContentSourceConnection.findOne(query)
    }
    return connection

}

export const removeSourceFromFeed = async({user, userId, contentSourceId}={})=>{
    let query = {
        user: userId,
        contentSource: contentSourceId
    }
    return await ContentSourceConnection.deleteOne(query)
}

export const getFeedForUser = async({user, limit=10, skip=0}={})=>{
    if(!user) throw new ApiError(ERRORS.NOT_AUTHORIZED)
    return await FeedItem.find().where({user: user.id || user._id, read:false}).populate('contentItem').sort('-_id').limit(limit).skip(skip)
}
export const getFeedItemForUser = async({user, feedItemId})=>{
    if(!user) throw new ApiError(ERRORS.NOT_AUTHORIZED)
    let feedItem = await FeedItem.findById(feedItemId).populate('contentItem')
    if(feedItem.user !== user.id){
        throw new ApiError(ERRORS.NOT_AUTHORIZED)
    }
    return feedItem
}

export const markFeedItemsAsRead = async({user, feedItemIds})=>{
    if(!user) throw new ApiError(ERRORS.NOT_AUTHORIZED)

    let res = await FeedItem.updateMany({_id:{$in:feedItemIds}},{read:true})

    return feedItemIds.map((id)=>{
        return {id,read:true}
    })
}