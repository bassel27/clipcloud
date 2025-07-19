import mysql, { FieldPacket, RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';
import { Media, MediaType } from './models/media.model';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise();

export async function getAllMedia(): Promise<Media[]> {
  const [rows] = await pool.query('SELECT * FROM media ORDER BY time_created DESC');
  return (rows as RowDataPacket[]).map(mapRowToMedia);
}

export async function getMedia(id: string): Promise<Media | undefined> {
  const [rows] = await pool.query(
    `SELECT * FROM media WHERE id = ?`,
    [id]
  ) as [RowDataPacket[], FieldPacket[]];

  return rows.length > 0 ? mapRowToMedia(rows[0]) : undefined;
}

export async function toggleLike(id: string): Promise<Media | null> {
  try {
    const media = await getMedia(id);
    if (!media) return null;

    const newIsLiked = !media.isLiked;

    await pool.query(
      'UPDATE media SET is_liked = ? WHERE id = ?',
      [newIsLiked, id]
    );

    return { ...media, isLiked: newIsLiked };
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

export async function createMedia(media: Media): Promise<Media> {
  await pool.query(`
    INSERT INTO media (id, title, file_path, thumbnail_path, is_liked, time_created, type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    media.id,
    media.title,
    media.filePath,
    media.thumbnailPath ?? null,
    media.isLiked,
    media.timeCreated,
    media.type
  ]);

  return media;
}

function mapRowToMedia(row: any): Media {
  return {
    id: row.id,
    title: row.title,
    filePath: row.file_path,
    thumbnailPath: row.thumbnail_path || undefined,
    isLiked: !!row.is_liked,
    timeCreated: row.time_created,
    type: row.type as MediaType
  };
}