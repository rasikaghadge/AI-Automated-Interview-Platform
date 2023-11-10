import axios from 'axios';
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.SECRET;
const VIDEOSDK_API_KEY = process.env.VIDEOSDK_API_KEY;

import User from '../models/userModel.js'
import isEmailValid from '../helper/authHelper.js'
import Profile from "../models/ProfileModel.js"
import { createToken } from '../controllers/token.js';

async function getProfilePictureByName(name) {
    try {
        const response = await axios.get(`https://ui-avatars.com/api/name=${name}`, {
            responseType: 'arraybuffer', // Specify the response type as 'arraybuffer'
        });

        // Check if the response is successful (status code 200)
        if (response.status === 200) {
            // Convert the response data (buffer) to a base64-encoded string
            const base64String = Buffer.from(response.data, 'binary').toString('base64');
            return base64String;
        } else {
            // Handle other HTTP status codes if needed
            console.error(`Error: Received status code ${response.status}`);
            return null;
        }
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error:', error);
        return null;
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body
    if (!isEmailValid(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    const existingUser = await User.findOne({ email })
    //get userprofile and append to login auth detail
    if (!existingUser) return res.status(404).json({ message: "User does not exist" })

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" })
    try {

        const userProfile = await Profile.findOne({email});
        
        if (!userProfile) return res.status(404).json({ message: "User does not exist" })
        //If crednetials are valid, create a token for the user
        // role = ["admin", "hr", "candidate"]
        // create a token for the user
        const token = createToken(existingUser.email, userProfile.id, userProfile.role, "24h", SECRET, VIDEOSDK_API_KEY);
        const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
            return res.status(200).json({ token, expiresIn: expirationTime });
        } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server is not respoding", err: String(error) })
    }
}

export const signup = async (req, res) => {
    // check request body is empty
    if(Object.keys(req.body).length === 0) return res.status(400).json({ message: "Request body is empty" })

    const { email, password, confirmPassword, firstName, lastName, role } = req.body

    if (!isEmailValid(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password !== confirmPassword) return res.status(400).json({ message: "Password does not match" })
    const existingUser = await User.findOne({ email })

    if (existingUser) return res.status(400).json({ message: "User already exist" })

    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await new User({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            role: role
        })
        await newUser.save();   
        const profilePicture = await getProfilePictureByName(`${newUser.firstName}+${newUser.lastName}`) || ""
        const newUserProfile = await new Profile({
            email: newUser.email,
            profilePicture: profilePicture
        })
        await newUserProfile.save();
        console.log(`User created successfully`)
        const token = createToken(newUser.email, newUserProfile.id, role, "24h", SECRET, VIDEOSDK_API_KEY);
        const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
        res.status(201).json({ id: newUserProfile.id, token: token, expirationTime: expirationTime, message: "User Created Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server is not respoding", err: String(error) })
    }
}

export const forgotPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if newPassword and confirmNewPassword match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save the user with updated information
    await user.save();

    // Send the reset token as a response to the client
    return res.status(200).json({ message: "Password Changed Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const homepage = async (req, res) => {
    try {
        const userId = req.userId
        const profile = await Profile.findOne({id: userId});
        if(profile && profile.email) {
            const userEmail = profile.email;
            const user = await User.findOne({email: userEmail});
            if(user) {
            res.status(200).json({
              name: `${user.firstName} ${user.lastName}`,
              profilePicture: profile.profilePicture,
              website: profile.website,
              city: profile.city,
              country: profile.country,
              selfProfile: true
            })
          } else {
            res.status(404).json({message: 'User not found'})
          }
    
        } else{
            res.status(404).json({message: 'Profile not Found'});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
}

export const logOut = async (req, res) => {
    req.logout();
    res.redirect('/');
}
