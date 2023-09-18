import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: Date(),
    updatedAt: Date()
})

const User = mongoose.model('User', userSchema)

export default User