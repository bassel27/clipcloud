
import mysql, { FieldPacket, RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Media, MediaType } from '../models/media.model';
import { getPublicUrl } from '../utils/media.utils';
import pool from '../config/database';


export async function findAll(): Promise<Media[]> {
  const [rows] = await pool.query('SELECT * FROM media ORDER BY created_at DESC');
  return (rows as RowDataPacket[]).map(mapRowToMedia);
}

export async function findById(id: string): Promise<Media | undefined> {
  const [rows] = await pool.query(
    `SELECT * FROM media WHERE id = ?`,
    [id]
  ) as [RowDataPacket[], FieldPacket[]];

  return rows.length > 0 ? mapRowToMedia(rows[0]) : undefined;
}

export async function toggleLike(id: string): Promise<Media | null> {
  try {
    const media = await findById(id);
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

export async function create(media: {
  id: string;
  filePath: string;
  thumbnailPath?: string;
  type: MediaType;
  isLiked: boolean;
  createdAt: string;
}): Promise<void> {
  await pool.query(`
    INSERT INTO media (id, file_path, thumbnail_path, is_liked, created_at, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    media.id,
    media.filePath,
    media.thumbnailPath || null,
    media.isLiked,
    media.createdAt,
    media.type
  ]);
}

function mapRowToMedia(row: RowDataPacket): Media {
  return {
    id: row.id,
    type: row.type as MediaType,
    isLiked: !!row.is_liked,
    createdAt: row.created_at,
    url: getPublicUrl(row.file_path),
    thumbnailUrl: row.thumbnail_path ? getPublicUrl(row.thumbnail_path) : undefined
  };
}