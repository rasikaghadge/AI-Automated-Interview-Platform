import mongoose from 'mongoose'

const profileSchema = mongoose.Schema({
  email: {
    type: String,
    ref: 'User',
    required: true,
    unique: true,
  },
  phoneNumber: String,
  city: String,
  country: String,
  profilePicture: String,
  website: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  }
})

const Profile = mongoose.model('Profile', profileSchema)

export default Profile