import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        immutable: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {type: String, required: true},
    createdAt: {
        type: Date, 
        default: () => Date.now(),
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    role: {
        type: String,
        enum: ['candidate', 'hr', 'admin'],
        default: 'candidate',
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
})

const User = mongoose.model('User', userSchema)

export default User