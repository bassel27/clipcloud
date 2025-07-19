export enum MediaType {
  Video = 'video',
  Image = 'image',
}

export interface Media {
  id: string;
  title: string;
  filePath: string;
  thumbnailPath?: string;
  isLiked: boolean;
  timeCreated: string;
  type: MediaType;
}