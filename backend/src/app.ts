// app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { IMAGES_PATH, THUMBNAILS_PATH, VIDEOS_PATH } from './config/constants';
import mediaRoutes from './routes/media.routes';
import signupRoutes from './routes/signup.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/videos', express.static(VIDEOS_PATH));
app.use('/thumbnails', express.static(THUMBNAILS_PATH));
app.use('/images', express.static(IMAGES_PATH));

app.use((req, res, next) => {
  (req as any).uuid = require('uuid').v4();
  next();
});

app.use('/media', mediaRoutes);
app.use('/signup', signupRoutes);

export default app;