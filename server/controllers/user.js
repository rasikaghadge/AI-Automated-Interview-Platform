import jwt from "jsonwebtoken"
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.SECRET;
const HOST = process.env.SMTP_HOST
const PORT = process.env.SMTP_PORT
const USER = process.env.SMTP_USER
const PASS = process.env.SMTP_PASS

import User from '../models/userModel.js'
import isEmailValid from '../helper/authHelper.js'
import Profile from "../models/ProfileModel.js"


export const signin = async (req, res) => {
    const { email, password } = req.body

    try {
        if (!isEmailValid(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const existingUser = await User.findOne({ email })
        //get userprofile and append to login auth detail
        if (!existingUser) return res.status(404).json({ message: "User does not exist" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" })

        const userProfile = await Profile.findOne({email});
        //If crednetials are valid, create a token for the user
        // permissions = ["Admin", "User", "HR", "Developer"]
        jwt.sign({ 
            email: existingUser.email, 
            id: userProfile.id,
            permissions: ["User"]
        }, SECRET, {
            expiresIn: "24h"
        }, function (err, token) {
            if (err) {
                console.log(`Error in login ${err}`)
                return res.status(500).json({ message: 'Error in login', err: String(err) });
            } else {
                // send expiry time and token
                console.log(`User created successfully`)
                const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
                return res.status(200).json({ token, expiresIn: expirationTime });
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server not responding", err: String(error) })
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body

    try {
        if (!isEmailValid(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password !== confirmPassword) return res.status(400).json({ message: "Password does not match" })
        const existingUser = await User.findOne({ email })

        if (existingUser) return res.status(400).json({ message: "User already exist" })


        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = await new User({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
        newUser.save(async (err) => {
            if (err) {
                console.log(`Error in creating new user ${err}`)
                res.status(500).json({ message: 'Error in register', err: String(err) });
            } else {
                
                const newUserProfile = await new Profile({
                    email: newUser.email,
                    phoneNumber: "",
                    city: "",
                    profilePicture: "",
                    webSite: ""
                })
                newUserProfile.save(async(err) => {
                    if(err) {
                        res.status(500).json({ message: 'Error in register', err: String(err) });
                    } else {
                        console.log(`User created successfully`)
                        res.status(201).json({ id: newUserProfile.id, email: newUser.email, message: "User Created Successfully" });
                    }
                })
            }
        })
    } catch (error) {
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

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Set the reset token and expiration time on the user model
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour (adjust as needed)

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save the user with updated information
    await user.save();

    // Send the reset token as a response to the client
    return res.status(200).json({ resetToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


