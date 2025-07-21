import { Media } from "@/types/media";
import { API_BASE_URL } from "./constats";

export const fetchMedia = async () => {
  const res = await fetch(`${API_BASE_URL}/media`);

  if (!res.ok) {
    throw new Error('Failed to fetch media');
  }

  const data = await res.json();
  return data;
};

export async function toggleLike(mediaId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/media/${mediaId}/like`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to toggle like');
  }

  const data = await response.json();
  return data.isLiked;
}

export async function uploadMedia(file: File): Promise<Media> {
  const formData = new FormData();
  formData.append('media', file);
  formData.append('title', 'new media!');

  const res = await fetch(`${API_BASE_URL}/media/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Upload failed');

  return res.json();
}


export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important if using cookies for auth
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
}

export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important if using cookies for auth
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}