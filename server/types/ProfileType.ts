import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;

interface Profile extends Document {
    country?: string;
    profilePicture?: string;
    interviews?: mongoose.Schema.Types.ObjectId[];
    technicalSkills?: string[];
    softSkills?: string[];
    education?: {
      degree?: string;
      college?: string;
      isGraduated?: boolean;
    };
    experience?: number;
    previousRolesDescription?: string;
    strengths?: string[];
    weaknesses?: string[];
    company?: string;
    user?: mongoose.Schema.Types.ObjectId;
  }

  export default Profile;