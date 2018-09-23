import mongoose from 'mongoose'

export const User = mongoose.model('User', {
    email: { type: String, index: true, unique:true },
    role: String,
    password:{type: String, select: false},
    status:{ type: String, index: true },
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now}
})



