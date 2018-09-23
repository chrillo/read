import {gql,AuthenticationError} from 'apollo-server-express'
import ApiError from '../lib/apiError';

import {login} from '../auth/auth'
import { getFeedForUser, getFeedItemForUser, markFeedItemsAsRead } from '../feeds/feed';


export const typeDefs = gql`
    scalar Date

    type Query {
        feed(limit:Int, skip:Int ): [FeedItem],
        feedItem(feedItemId: String):FeedItem
    }

    type Mutation {
        login(email: String, password: String): User,
        markAsRead(feedItemIds:[String]): [FeedItem]
    }

    type User {
        id: String,
        email: String,
        jwt: String,
        role: String,
        createdAt:Date,
        updatedAt:Date
    }
    type ContentItem {
        id: String,
        type: String,
        title: String,
        fingerprint: String,
        url: String,
        status: String,
        sourceId: String,
        itemSourceId: String,
        itemSourceLabel: String, 
        time: Float,
        createdAt:Date,
        updatedAt:Date
    }
    type ContentSource {
        id: String,
        type: String,
        name: String,
        url: String,
        createdAt:Date,
        updatedAt:Date
    }
    type FeedItem {
        id: String,
        user: User,
        contentItem: ContentItem,
        contentSource: ContentSource,
        read: Boolean,
        createdAt:Date,
        updatedAt:Date
    }
    type ContentSourceConnection {
        user: User,
        contentSource: ContentSource,
        createdAt: Date,
        updatedAt: Date
    }
`;


export const requireUser = (fn)=>(_, args, context)=>{
    const {user} = context
    if(!user) throw new AuthenticationError('not authorized');
    return fn ? fn({...args, user}, context) : null
}

export const resolvers = {
    Query: {
        feed: requireUser(getFeedForUser),
        feedItem: requireUser(getFeedItemForUser),
    },
    Mutation:{
        login: async(_, args,{JWT_SECRET}) => login({...args,JWT_SECRET}),
        markAsRead: requireUser(markFeedItemsAsRead)
    }
};
