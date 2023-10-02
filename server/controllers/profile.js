import express from 'express';
import mongoose from 'mongoose';

import Profile from '../models/ProfileModel.js';
import User from '../models/userModel.js';


export const getProfiles = async (req, res) => { 
  console.log('getProfiles')
  try {
      const page = parseInt(req.query.page) || 1; // Current page (default to 1 if not provided)
      const limit = parseInt(req.query.limit) || 10; // Number of profiles per page (default to 10 if not provided)
      const skip = (page - 1) * limit; // Calculate the number of profiles to skip

      const profiles = await Profile.find().skip(skip).limit(limit);
      const totalProfiles = await Profile.countDocuments(); // Get the total number of profiles

      res.status(200).json({
        profiles,
        currentPage: page,
        totalPages: Math.ceil(totalProfiles / limit),
      });
  } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
  }
}

export const getProfile = async (req, res) => { 
  console.log('get profile called')
  const { id } = req.params;

  try {
      const profile = await Profile.findOne({id});
      if(profile && profile.email) {
          const userEmail = profile.email;
          console.log(userEmail)
          const user = await User.findOne({email: userEmail});
          if(user) {
          res.status(200).json({
            name: `${user.firstName} ${user.lastName}`,
            profilePicture: profile.profilePicture,
            website: profile.website,
            city: profile.city
          })
        } else {
          res.status(404).json({message: 'User not found'})
        }

      }
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}

export const createProfile = async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    businessName,
    contactAddress, 
    logo,
    website,
    userId,
   } = req.body;
  
  
  const newProfile = new Profile({
    name,
    email,
    phoneNumber,
    businessName,
    contactAddress, 
    logo,
    website,
    userId,
    createdAt: new Date().toISOString() 
  })

  try {
    const existingUser = await Profile.findOne({ email })

    if(existingUser) return res.status(404).json({ message: "Profile already exist" })
      await newProfile.save();

      res.status(201).json(newProfile );
  } catch (error) {
      res.status(409).json({ message: error.message });
  }
}



export const getProfilesByUser = async (req, res) => {
  const { searchQuery } = req.query;

  try {
      // const email = new RegExp(searchQuery, "i");

      const profile = await Profile.findOne({ userId: searchQuery });

      res.json({ data: profile });
  } catch (error) {    
      res.status(404).json({ message: error.message });
  }
}



export const getProfilesBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
      const name = new RegExp(searchQuery, "i");
      const email = new RegExp(searchQuery, "i");

      const profiles = await Profile.find({ $or: [ { name }, { email } ] });

      res.json({ data: profiles });
  } catch (error) {    
      res.status(404).json({ message: error.message });
  }
}


export const updateProfile = async (req, res) => {
  const { id: _id } = req.params
  const profile = req.body

  if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No client with that id')

  const updatedProfile = await Profile.findByIdAndUpdate(_id, {...profile, _id}, { new: true})

  res.json(updatedProfile)
}


  export const deleteProfile = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No profile with id: ${id}`);

    await Profile.findByIdAndRemove(id);

    res.json({ message: "Profile deleted successfully." });
}

