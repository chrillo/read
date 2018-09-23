import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ContentSourceSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User',index:true },
    contentSource: { type: Schema.Types.ObjectId, ref: 'ContentSource',index:true },
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now}
})


ContentSourceSchema.index({ user: 1, contentSource: 1}, { unique: true });

export const ContentSourceConnection = mongoose.model('ContentSourceConnection', ContentSourceSchema )



