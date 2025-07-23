import path from "path";
import { getAllMedia, registerImage, registerVideo, toggleLike} from "../services/media.service";
import { Request, RequestHandler, Response } from 'express';
import fs from 'fs';

export function nowDateSQLFormat() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
         `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export function isImage(filePath: string): boolean {
   const ext = path.extname(filePath).toLowerCase();
   if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      return true;
    }
   return false;
}

export function isVideo(filePathOrName: string): boolean {
   const ext = path.extname(filePathOrName).toLowerCase();
   if (['.mp4', '.mov'].includes(ext)) {
      return true;
    }
   return false;
}

export function getPublicUrl(filePath: string): string {
  const baseUrl = process.env.BASE_URL;
  const fileName = path.basename(filePath);  
   const parentFolder = path.basename(path.dirname(filePath)); 
   const result = path.join(parentFolder, fileName);
  return `${baseUrl}/${result}`;
}


export const serveFileById = (basePath: string): RequestHandler => {
  return (req: Request, res: Response): void => {
    const { id } = req.params;

    try {
      const files = fs.readdirSync(basePath);
      const matchedFile = files.find(file => file.startsWith(id + '.'));

      if (!matchedFile) {
        res.status(404).json({ message: 'File not found' });
        return;
      }

      const filePath = path.join(basePath, matchedFile);
      res.sendFile(filePath);
    } catch (error) {
      console.error('Error reading directory or sending file:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};