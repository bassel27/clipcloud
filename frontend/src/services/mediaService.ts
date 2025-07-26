import axios from 'axios';
import { Media, MediaType } from "@/types/media";
import { API_BASE_URL } from "@/utils/constants";
import { apiClient } from './authService';
import { getMediaUrl, getThumbnailUrl } from '@/utils/utils';

export const fetchMedia = async (): Promise<Media[]> => {
  const res = await apiClient.get('/media');
  return res.data;
};

export const toggleLike = async (mediaId: string): Promise<boolean> => {
  const res = await apiClient.post(`/media/${mediaId}/like`);
  return res.data.isLiked;
};

export const uploadMedia = async (file: File): Promise<Media> => {
  const formData = new FormData();
  formData.append('media', file);
  formData.append('title', 'new media!');

  const res = await apiClient.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export async function fetchMediaBlob(mediaId: string, mediaType: MediaType): Promise<Blob> {
  const response = await axios.get(getMediaUrl(mediaId, mediaType), {
    responseType: 'blob',
  });

  if (!response || !response.data) {
    throw new Error('Failed to fetch media');
  }

  return response.data;
}

export async function fetchThumbnailBlob(mediaId: string): Promise<Blob> {
  const response = await axios.get(getThumbnailUrl(mediaId), {
    responseType: 'blob',
  });

  if (!response || !response.data) {
    throw new Error('Failed to fetch thumbnail');
  }

  return response.data;
}