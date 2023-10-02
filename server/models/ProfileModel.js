import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid';

const profileSchema = mongoose.Schema({
  id: {
    required: true,
    type: String,
    default: () => uuidv4()
  },
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