import cors from 'cors';
import express, { Application, Request, Response } from "express";
import { Server as HttpServer, createServer } from "http";
import mongoose from 'mongoose';
import interviewRoutes from './routes/interviews.js';
import profileRoutes from './routes/profile.js';
import userRoutes from './routes/userRoutes.js';
// @ts-ignore
import dotenv from 'dotenv'; // @ts-ignore


dotenv.config();

const app: Application = express();
const server: HttpServer = createServer(app);

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

const PORT: number = 8000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
