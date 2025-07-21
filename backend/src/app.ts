// app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { IMAGES_PATH, THUMBNAILS_PATH, VIDEOS_PATH } from './config/constants';
import mediaRoutes from './routes/media.routes';
import authRoutes from './routes/auth.routes';
import { verifyAccessToken } from './middlewares/auth.middleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/videos',verifyAccessToken ,express.static(VIDEOS_PATH));
app.use('/thumbnails', verifyAccessToken ,express.static(THUMBNAILS_PATH));
app.use('/images',verifyAccessToken , express.static(IMAGES_PATH));

app.use((req, res, next) => {
  (req as any).uuid = require('uuid').v4();
  next();
});

app.use('/media', verifyAccessToken, mediaRoutes);
app.use('/auth', authRoutes);

export default app;