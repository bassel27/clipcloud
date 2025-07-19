export enum MediaType {
  Video = 'video',
  Image = 'image',
}

export interface Media {
  id: string; 
  type: MediaType;
  isLiked: boolean;
  createdAt: string; 
  url: string; 
  thumbnailUrl?: string; 
}