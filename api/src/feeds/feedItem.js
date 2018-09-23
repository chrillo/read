import mongoose from 'mongoose'
const Schema = mongoose.Schema

const FeedItemSchema = Schema( {
    user: { type: Schema.Types.ObjectId, ref: 'User', index:true },
    contentItem: { type: Schema.Types.ObjectId, ref: 'ContentItem',index:true },
    contentSource:{ type: Schema.Types.ObjectId, ref: 'ContentSource',index:true },
    read: {type:Boolean, index:true},
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now}
})

FeedItemSchema.index({ user: 1, contentSource: 1, contentItem:1}, { unique: true });
FeedItemSchema.index({ user: 1, read: 1}, { unique: true });

export const FeedItem = mongoose.model('FeedItem',FeedItemSchema)



