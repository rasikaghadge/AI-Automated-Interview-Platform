import mongoose from 'mongoose'

const profileSchema = mongoose.Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    phoneNumber: String,
    contactAddress: String,
    logo: String,
    website: String
})

const Profile = mongoose.model('Profile', profileSchema)

export default Profile