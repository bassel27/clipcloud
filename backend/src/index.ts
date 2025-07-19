import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllMediaHandler,
  registerVideoHandler,
  toggleLikeHandler,
  registerImageHandler,
} from './mediaService';
import { Request, Response } from 'express';
import { IMAGES_PATH, THUMBNAILS_PATH, VIDEOS_PATH} from './constants';
import path from 'path';
import { Media, MediaType } from './models/media.model';
import { isImage, isVideo } from './utils';

dotenv.config();

const app = express();
app.use(cors());  // Allows all origins (*) to access the API
app.use(express.json());  // middleware to accept JSON body requests
app.use('/uploads/videos', express.static(VIDEOS_PATH));  // exposes the folder to the outside world  // Any request to a URL that starts with /uploads will serve the actual file from your disk.
app.use('/uploads/thumbnails', express.static(THUMBNAILS_PATH));
app.use('/uploads/images', express.static(IMAGES_PATH));

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

app.post('/media/upload', upload.single('media'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return; // Explicit return instead of returning the response
    }

    
    const uuid = (req as any).uuid;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${uuid}${ext}`;

    if (isVideo(req.file.filename)) {
      const videoPath = path.join('uploads', 'videos', filename);
      const media = await registerVideoHandler( videoPath, uuid);
      res.status(201).json(media);
      return;
    }

    if (isImage(req.file.filename)) {
      const imagePath = path.join('uploads', 'images', filename);
      const media = await registerImageHandler( imagePath, uuid);
      res.status(201).json(media);
      return;
    }

    res.status(400).json({ message: 'Unsupported file type' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error processing upload' });
  }
});

app.post('/media/:id/like', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedMedia = await toggleLikeHandler(id);
    if (updatedMedia) {
      res.json(updatedMedia);
    } else {
      res.status(404).json({ message: 'Media not found' });
    }
  } catch (error) {
    console.error('Like toggle error:', error);
    res.status(500).json({ message: 'Error toggling like' });
  }
});

app.get('/media', async (req: Request, res: Response) => {
  try {
    const mediaList = await getAllMediaHandler();
    res.json(mediaList);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Error fetching media' });
  }
})

const PORT = process.env.PORT || 3081;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
