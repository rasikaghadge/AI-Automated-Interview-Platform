import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import axios from 'axios';

dotenv.config()
const SECRET = process.env.SECRET;
const HOST = process.env.SMTP_HOST
const PORT = process.env.SMTP_PORT
const USER = process.env.SMTP_USER
const PASS = process.env.SMTP_PASS

import User from '../models/userModel.js'
import isEmailValid from '../helper/authHelper.js'


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

        //If crednetials are valid, create a token for the user
        // permissions = ["Admin", "User", "HR", "Developer"]
        jwt.sign({ 
            email: existingUser.email, 
            id: existingUser._id,
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
        newUser.save((err) => {
            if (err) {
                console.log(`Error in creating new user ${err}`)
                res.status(500).json({ message: 'Error in register', err: String(err) });
            } else {
                console.log(`User created successfully`)
                return res.status(201).json({ id: newUser._id, email: newUser.email, message: "User Created Successfully" });
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Server is not respoding", err: String(error) })
    }
}


export const forgotPassword = (req, res) => {

    const { email } = req.body

    // NODEMAILER TRANSPORT FOR SENDING POST NOTIFICATION VIA EMAIL
    const transporter = nodemailer.createTransport({
        host: HOST,
        port: PORT,
        auth: {
            user: USER,
            pass: PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })


    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User does not exist in our database" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "Accountill <hello@accountill.com>",
                        subject: "Password reset request",
                        html: `
                    <p>You requested for password reset from Arc Invoicing application</p>
                    <h5>Please click this <a href="https://accountill.com/reset/${token}">link</a> to reset your password</h5>
                    <p>Link not clickable?, copy and paste the following url in your address bar.</p>
                    <p>https://accountill.com/reset/${token}</p>
                    <P>If this was a mistake, just ignore this email and nothing will happen.</P>
                    `
                    })
                    res.json({ message: "check your email" })
                }).catch((err) => console.log(err))

            })
    })
}


export const resetPassword = (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) => {
                    res.json({ message: "password updated success" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
}
