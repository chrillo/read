import mongoose from 'mongoose'

export const ContentItem = mongoose.model('ContentItem', {
    type: String,
    title: String,
    fingerprint: { type: String, index: true },
    url: String,
    status:{ type: String, index: true },
    sourceId: String,
    itemSourceId: String,
    time: Number,
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now}
})



