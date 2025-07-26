import express from 'express';
import cors from 'cors';
import { IMAGES_PATH, THUMBNAILS_PATH, VIDEOS_PATH } from './config/constants';
import mediaRoutes from './routes/media.routes';
import authRoutes from './routes/auth.routes';
import { verifyAccessToken } from './middlewares/auth.middleware';
import { ensureDirectoriesExist, serveFileById } from './utils/media.utils';

ensureDirectoriesExist([VIDEOS_PATH, THUMBNAILS_PATH, IMAGES_PATH]);
const app = express();

app.use(cors());
app.use(express.json());

app.get('/videos/:id', serveFileById(VIDEOS_PATH));
app.get('/thumbnails/:id', serveFileById(THUMBNAILS_PATH));
app.get('/images/:id', serveFileById(IMAGES_PATH));

app.use((req, res, next) => {
  (req as any).uuid = require('uuid').v4();
  next();
});

app.use('/media', verifyAccessToken, mediaRoutes);
app.use('/auth', authRoutes);

export default app;