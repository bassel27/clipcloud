import multer from 'multer';
import path from 'path';
import { IMAGES_PATH, VIDEOS_PATH } from '../config/constants';
import { isImage, isVideo } from '../utils/media.utils';

export const upload = multer({
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
      const uuid = (req as any).uuid;
      cb(null, `${uuid}${ext}`);
    }
  })
});