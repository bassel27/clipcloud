import axios from 'axios';
import { Media } from "@/types/media";
import { API_BASE_URL } from "@/utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("token is " + token)
  return config;
});

export const fetchMedia = async (): Promise<Media[]> => {
  const res = await api.get('/media');
  return res.data;
};

export const toggleLike = async (mediaId: string): Promise<boolean> => {
  const res = await api.post(`/media/${mediaId}/like`);
  return res.data.isLiked;
};

export const uploadMedia = async (file: File): Promise<Media> => {
  const formData = new FormData();
  formData.append('media', file);
  formData.append('title', 'new media!');

  const res = await api.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};