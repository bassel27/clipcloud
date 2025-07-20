import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
const mediaController = require('./controllers/mediaController');
import { IMAGES_PATH, THUMBNAILS_PATH, VIDEOS_PATH} from './constants';
import path from 'path';
import { Media, MediaType } from './models/media.model';
import { isImage, isVideo } from './utils';

dotenv.config();

const app = express();
app.use(cors());  // Allows all origins (*) to access the API
app.use(express.json());  // middleware to accept JSON body requests
app.use('/videos', express.static(VIDEOS_PATH));  // exposes the folder to the outside world  // Any request to a URL that starts with /uploads will serve the actual file from your disk.
app.use('/thumbnails', express.static(THUMBNAILS_PATH));
app.use('/images', express.static(IMAGES_PATH));

app.use((req, res, next) => { // attaches a UUID to every incoming request before file upload happens.
  (req as any).uuid = uuidv4();
  next();
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, file, cb) => {
      if (isImage(file.originalname)) {
        cb(null, IMAGES_PATH);
      } else if (isVideo(file.originalname)) {
        cb(null, VIDEOS_PATH);
      } else {
        cb(new Error('Unsupported file type'), '');
      }
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uuid = (req as any).uuid; // Get UUID set earlier
      cb(null, `${uuid}${ext}`);
    }
  })
});

app.post('/media/upload', upload.single('media'), mediaController.uploadMedia);

app.post('/media/:id/like', mediaController.toggleLike);

app.get('/media', mediaController.getAllMedia)

const PORT = process.env.PORT || 3081;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
