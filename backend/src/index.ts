import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import {
   getAllMediaHandler,
  registerVideoHandler,
  toggleLikeHandler,
  generateThumbnailHandler,
  registerImageHandler,
} from './mediaService';
import { Request, Response } from 'express';
import { IMAGES_PATH, THUMBNAILS_PATH, VIDEOS_PATH } from './constants';
import path from 'path';
import { MediaType } from './models/media.model';
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
if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const title = req.body.title;
    
    let type = null;
    if (isImage(req.file.filename)) {
      type = MediaType.Image;
    } else if (isVideo(req.file.filename)) {
      type = MediaType.Video;
    }
    else{
      res.status(400).json({ message: 'Unsupported file type' });
      return;
    }
  
    let relativeFilePath: string;
    let thumbnailPath: string | undefined = undefined;

    const uuid = (req as any).uuid; 
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (type === MediaType.Video) {
      relativeFilePath = path.join('uploads', 'videos', req.file.filename);

      const absoluteVideoPath = path.join(VIDEOS_PATH, req.file.filename);
      const thumbnailFileName = `${uuid}.jpg`;      
      await generateThumbnailHandler(absoluteVideoPath,thumbnailFileName );

      thumbnailPath = path.join('uploads', 'thumbnails',thumbnailFileName );

      const newVideo = await registerVideoHandler(title, relativeFilePath, thumbnailPath, uuid);
      res.status(201).json(newVideo);
    } else {
      relativeFilePath = path.join('uploads', 'images', `${uuid}${ext}`);

      const newImage = await registerImageHandler(title, relativeFilePath, uuid);
      res.status(201).json(newImage);
    }
  }
);

app.post('/media/:id/like',async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedVideo = await toggleLikeHandler(id);
  if (updatedVideo) {
    res.json(updatedVideo);
  } else {
    res.status(404).json({ message: 'Video not found' });
  }
});

app.get('/media', async (req: Request, res: Response) => {
  const mediaList = await getAllMediaHandler();
  res.json(mediaList);
});

const PORT = process.env.PORT || 3081;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));