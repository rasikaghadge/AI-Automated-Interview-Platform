import express from "express";
import { createServer } from "http";
import { Server } from "socket.io"; // Import Server class
import userRoutes from './routes/userRoutes.js'
import profile from './routes/profile.js'
import mongoose from 'mongoose'
import cors from 'cors';
import dotenv from 'dotenv'
import passport from 'passport';
import expressSession from 'express-session';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';



dotenv.config()

const app = express();
const server = createServer(app);
const io = new Server(server);

const DB_URL = process.env.DB_URL;
const SECRET = process.env.SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err.message));

app.set('view engine', 'ejs');

app.use(expressSession({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((express.json({ limit: "30mb", extended: true })))
app.use((express.urlencoded({ limit: "30mb", extended: true })))
app.use(cors({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "1800",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS",
}))

app.use('/users', userRoutes)
app.use('/profiles', profile)
var userProfile;

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// import { Strategy as GoogleStrategy, OAuth2Strategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

// Middleware used in protected routes to check if the user has been authenticated
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

app.get('/', function (req, res) {
  res.render('pages/auth');
});

app.get('/success', (req, res) => {
  res.render('pages/success', { user: userProfile });
});
app.get('/error', (req, res) => res.send("error logging in"));


app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));


app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

app.get('/api/logout', (req, res) => {
  req.logout();
  res.send(req.user);
});

app.get('/api/current_user', isLoggedIn, (req, res) => {
  res.send(req.user);
});


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});


server.listen(5000, () => {
  console.log('server running at http://localhost:5000');
});


