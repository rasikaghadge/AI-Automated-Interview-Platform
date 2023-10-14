// /services/passport.js

import { serializeUser, deserializeUser, use } from 'passport';
import { model, models } from 'mongoose';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/userModel.js';
import dotenv from 'dotenv'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

serializeUser((user, done) => {
    done(null, user.id);
});

deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    })
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({googleId: profile.id}).then(existingUser => {
        if (existingUser) {
            done(null, existingUser);
        } else {
            new User({googleId: profile.id}).save().then(user => done(null, user));
        }
    });
}));