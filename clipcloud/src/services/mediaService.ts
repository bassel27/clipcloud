import axios from 'axios';
import { Media } from "@/types/media";
import { API_BASE_URL } from "@/utils/constants";
import { apiClient } from './authService';

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