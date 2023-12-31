import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;
import Profile from '../types/ProfileType';


const profileSchema = new mongoose.Schema<Profile>({
  country: {
    type: String,
    required: false,
    default: 'India',
  },
  profilePicture: {
    type: String,
    required: false,
  },
  interviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
  }],
  technicalSkills: {
    type: [String],
    required: false,
  },
  softSkills: {
    type: [String],
    required: false,
  },
  education: {
    type: {
      degree: String,
      college: String,
      isGraduated: Boolean,
    },
    required: false,
  },
  experience: {
    type: Number,
    required: false,
    min: 0,
    max: 50,
  },
  previousRolesDescription: {
    type: String,
    required: false,
  },
  strengths: {
    type: [String],
    required: false,
  },
  weaknesses: {
    type: [String],
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Profile = mongoose.model<Profile>('Profile', profileSchema);

export default Profile;
