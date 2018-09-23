import mongoose from 'mongoose'

export const ContentSource = mongoose.model('ContentSource', {
    type: String,
    name: String,
    url: String,
    status:{ type: String, index: true },
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now}
})

