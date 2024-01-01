import express, { Application, Request, Response } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io"; // Import Server class
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profile';
import interviewRoutes from './routes/interviews';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const server: HttpServer = createServer(app);
const io: SocketIOServer = new SocketIOServer(server);

const DB_URL: string | undefined = process.env.DB_URL;

if (!DB_URL) {
  console.error("Database URL is not specified in the environment variables.");
  process.exit(1);
}

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log("Database connected successfully"))
  .catch((err) => console.error(err.message));

app.use(express.json({ limit: "30mb"}));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())

app.use('/users', userRoutes);
app.use('/profiles', profileRoutes);
app.use("/interviews", interviewRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Server is ready');
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

const PORT: number = 5000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
