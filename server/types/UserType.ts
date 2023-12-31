// User.ts
import mongoose, { Document } from 'mongoose';
import Profile from './ProfileType';

interface User extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'candidate' | 'hr' | 'admin';
  profile?: Profile; // Use the Profile type directly
}

export default User;
