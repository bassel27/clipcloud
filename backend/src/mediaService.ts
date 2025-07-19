import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import { Media, MediaType } from './models/media.model';
import { THUMBNAILS_PATH } from './constants';
import { nowDateSQLFormat } from './utils';
import { createMedia, getAllMedia, toggleLike } from './database';

export async function getAllMediaHandler(): Promise<Media[]> {
  return await getAllMedia();
}

export async function generateThumbnailHandler(videoPath: string, thumbnailFileName: string): Promise<string> {
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['50%'],
        filename: thumbnailFileName,
        folder: THUMBNAILS_PATH,
      })
      .on('end', () => resolve(thumbnailFileName))
      .on('error', reject);
  });
}

async function registerMediaBase(
  title: string,
  filePath: string,
  type: MediaType,
  uuid: string,
  thumbnailPath?: string
): Promise<Media> {
  const newMedia: Media = {
    id: uuid,
    title,
    filePath,
    thumbnailPath,
    isLiked: false,
    timeCreated: nowDateSQLFormat(),
    type
  };

  await createMedia(newMedia);
  return newMedia;
}

export async function registerVideoHandler(
  title: string,
  filePath: string,
  thumbnailPath: string,
  uuid: string
): Promise<Media> {
  return registerMediaBase(title, filePath, MediaType.Video, uuid, thumbnailPath);
}

export async function registerImageHandler(
  title: string,
  filePath: string,
  uuid: string 
): Promise<Media> {
  return registerMediaBase(title, filePath, MediaType.Image, uuid);
}

export async function toggleLikeHandler(id: string): Promise<Media> {
  const toggled = await toggleLike(id);

  if (!toggled) {
    throw new Error(`Media with ID ${id} not found`);
  }

  return toggled;
}