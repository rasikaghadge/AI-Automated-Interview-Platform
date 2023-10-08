import express from "express";
import { createServer } from "http";
import { Server } from "socket.io"; // Import Server class
import userRoutes from './routes/userRoutes.js'
import profile from './routes/profile.js'
import mongoose from 'mongoose'
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const server = createServer(app);
const io = new Server(server);

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err.message));


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

app.get('/', (req, res) => {
  console.log('hello');
  res.send('hello');
})

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


