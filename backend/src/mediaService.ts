import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import { Media, MediaType } from './models/media.model';
import { SRC_PATH, THUMBNAILS_PATH } from './constants';
import { getPublicUrl, nowDateSQLFormat } from './utils';
import { createMedia, getAllMedia, toggleLike } from './database';
import path from 'path';

export async function getAllMediaHandler(): Promise<Media[]> {
  return await getAllMedia();
}

export async function generateThumbnailHandler(videoPath: string, thumbnailFileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(path.join(SRC_PATH, videoPath))
      .screenshots({
        timestamps: ['50%'],
        filename: thumbnailFileName,
        folder: THUMBNAILS_PATH,
      })
      .on('end', () => resolve(path.join('uploads', 'thumbnails', thumbnailFileName)))
      .on('error', reject);
  });
}

async function registerMediaBase(
  filePath: string,  // Relative path like 'videos/abc123.mp4'
  type: MediaType,
  fileId: string, 
  thumbnailPath?: string
): Promise<Media> {
  const createdAt = nowDateSQLFormat();

  await createMedia({
    id: fileId,
    filePath,
    thumbnailPath,
    type,
    isLiked: false,
    createdAt
  });

  return {
    id: fileId,
    type,
    isLiked: false,
    createdAt,
    url: getPublicUrl(filePath),
    thumbnailUrl: thumbnailPath ? getPublicUrl(thumbnailPath) : undefined
  };
}

export async function registerVideoHandler(
  videoPath: string,
  uuid: string
): Promise<Media> {
  const thumbnailFileName = `${uuid}.jpg`;
  const thumbnailPath = await generateThumbnailHandler(videoPath, thumbnailFileName);
  
  return registerMediaBase(
    videoPath,
    MediaType.Video,
    uuid,
    thumbnailPath
  );
}

export async function registerImageHandler(
  filePath: string,
  uuid: string
): Promise<Media> {
  return registerMediaBase(
    filePath,
    MediaType.Image,
    uuid
  );
}

export async function toggleLikeHandler(id: string): Promise<Media> {
  const toggled = await toggleLike(id);

  if (!toggled) {
    throw new Error(`Media with ID ${id} not found`);
  }

  return toggled;
}