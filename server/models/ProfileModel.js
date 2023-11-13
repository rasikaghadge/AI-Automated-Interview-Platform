import mongoose from 'mongoose'

const profileSchema = mongoose.Schema({
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