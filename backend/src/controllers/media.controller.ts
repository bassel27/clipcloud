import path from "path";
import { getAllMedia, registerImage, registerVideo, toggleLike } from "../services/media.service";
import { Request, Response } from 'express';
import { isImage, isVideo } from "../utils/media.utils";

export const toggleLikeHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedMedia = await toggleLike(id);
    if (updatedMedia) {
      res.json(updatedMedia);
    } else {
      res.status(404).json({ message: 'Media not found' });
    }
  } catch (error) {
    console.error('Like toggle error:', error);
    res.status(500).json({ message: 'Error toggling like' });
  }
}


export const getAllMediaHandler = async (req: Request, res: Response) => {
  try {
    const mediaList = await getAllMedia();
    res.json(mediaList);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Error fetching media' });
  }
}

export const uploadMediaHandler = async (req: Request, res: Response) => {
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
      const media = await registerVideo(videoPath, uuid);
      res.status(201).json(media);
      return;
    }

    if (isImage(req.file.filename)) {
      const imagePath = path.join('uploads', 'images', filename);
      const media = await registerImage(imagePath, uuid);
      res.status(201).json(media);
      return;
    }

    res.status(400).json({ message: 'Unsupported file type' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error processing upload' });
  }
}
