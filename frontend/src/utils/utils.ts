import { MediaType } from "@/types/media";
import { API_BASE_URL } from "./constants";

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const getMediaUrl = (id: string, type: MediaType) => {
  return type === MediaType.Image 
    ? `${API_BASE_URL}/images/${id}`
    : `${API_BASE_URL}/videos/${id}`;
};

export const getThumbnailUrl = (id: string) => {
  return `${API_BASE_URL}/thumbnails/${id}`;
};

export function createObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeObjectUrl(url: string | null) {
  if (url) URL.revokeObjectURL(url);
}