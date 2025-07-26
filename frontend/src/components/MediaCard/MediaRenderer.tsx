import { fetchMediaBlob, fetchThumbnailBlob } from '@/services/mediaService';
import { MediaType } from '@/types/media';
import { createObjectUrl, revokeObjectUrl } from '@/utils/utils';
import { useEffect, useState } from 'react';

type MediaRendererProps = {
  mediaId: string;
  type: MediaType;
  className?: string;
};

export function MediaRenderer({ mediaId, type, className }: MediaRendererProps) {
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    let mediaObjectUrl: string | null = null;
    let thumbnailObjectUrl: string | null = null;

    const loadMedia = async () => {
      try {
        const mediaBlob = await fetchMediaBlob(mediaId, type);
        mediaObjectUrl = createObjectUrl(mediaBlob);
        setMediaUrl(mediaObjectUrl);

        if (type === MediaType.Video) {
          const thumbBlob = await fetchThumbnailBlob(mediaId);
          thumbnailObjectUrl = createObjectUrl(thumbBlob);
          setThumbnailUrl(thumbnailObjectUrl);
        }
      } catch (err) {
        console.error('Error loading media:', err);
      }
    };

    loadMedia();

    return () => {
      revokeObjectUrl(mediaObjectUrl);
      revokeObjectUrl(thumbnailObjectUrl);
    };
  }, [mediaId, type]);

  if (!mediaUrl) return <div className={className} />;

  switch (type) {
    case MediaType.Image:
      return <img src={mediaUrl} className={className} crossOrigin="anonymous" />;
    case MediaType.Video:
      return (
        <video controls poster={thumbnailUrl} className={className} crossOrigin="anonymous">
          <source src={mediaUrl} type="video/mp4" />
        </video>
      );
    default:
      return <div className={className} />;
  }
}