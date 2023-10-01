import mongoose from 'mongoose'

const HomeSchema = mongoose.Schema({
    title: String,
    description: String,
    image: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    metaTags: {
        type: Array,
        default: []
    },
    socialLinks: {
        type: Object,
        default: {}
    },
    interviewSheduleSteps: {
        type: Object,
        default: {}
    }
})

const HomePage = mongoose.model('HomePage', HomeSchema)

export default HomePage