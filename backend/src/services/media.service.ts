import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import { Media, MediaType } from '../models/media.model';
import { SRC_PATH, THUMBNAILS_PATH } from '../config/constants';
import { getPublicUrl, nowDateSQLFormat } from '../utils/media.utils';
import path from 'path';
import { create, findAll }from '../repositories/media.repository';

export async function getAllMedia(): Promise<Media[]> {
  return await findAll();
}

export async function generateThumbnail(videoPath: string, thumbnailFileName: string): Promise<string> {
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

  await create({
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

export async function registerVideo(
  videoPath: string,
  uuid: string
): Promise<Media> {
  const thumbnailFileName = `${uuid}.jpg`;
  const thumbnailPath = await generateThumbnail(videoPath, thumbnailFileName);
  
  return registerMediaBase(
    videoPath,
    MediaType.Video,
    uuid,
    thumbnailPath
  );
}

export async function registerImage(
  filePath: string,
  uuid: string
): Promise<Media> {
  return registerMediaBase(
    filePath,
    MediaType.Image,
    uuid
  );
}

export async function toggleLike(id: string): Promise<Media> {
  const toggled = await toggleLike(id);

  if (!toggled) {
    throw new Error(`Media with ID ${id} not found`);
  }

  return toggled;
}