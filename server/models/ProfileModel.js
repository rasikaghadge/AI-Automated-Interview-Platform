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
  phoneNumber: {
    type: String,
    required: false
  },
  city: {
    type:String,
    required: false
  },
  country: {
    type: String,
    required: false,
    default: 'India'
  },
  profilePicture: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  },
  interviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }],
  skills: {
    type: [String],
    required: false
  }
})

const Profile = mongoose.model('Profile', profileSchema)

export default Profile