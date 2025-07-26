import { Media, MediaType } from '@/types/media';
import styles from './MediaCard.module.css';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { fetchMediaBlob, fetchThumbnailBlob, toggleLike } from '@/services/mediaService';
import { createObjectUrl, getMediaUrl, getThumbnailUrl, revokeObjectUrl } from '@/utils/utils';
import { TOKEN_STORAGE } from '@/utils/tokenStorage';
import axios from 'axios';

export default function MediaCard({ media }: { media: Media }) {
  const [isLiked, setIsLiked] = useState(media.isLiked);
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    let mediaObjectUrl: string | null = null;
    let thumbnailObjectUrl: string | null = null;

    const loadMedia = async () => {
      try {
        const mediaBlob = await fetchMediaBlob(media.id, media.type);
        mediaObjectUrl = createObjectUrl(mediaBlob);
        setMediaUrl(mediaObjectUrl);

        if (media.type === MediaType.Video) {
          const thumbBlob = await fetchThumbnailBlob(media.id);
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
  }, [media.id, media.type]);

  const handleToggleLike = async () => {
    try {
      const updatedIsLiked = await toggleLike(media.id);
      setIsLiked(updatedIsLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

 const renderMedia = () => {
    if (!mediaUrl) return <div className={styles.mediaPlaceholder} />;

    switch (media.type) {
      case MediaType.Image:
        return (
          <img
            src={mediaUrl}
            alt="Media content"
            className={styles.media}
            crossOrigin="anonymous"
          />
        );
      case MediaType.Video:
        return (
          <video
            controls
            poster={thumbnailUrl || undefined}
            className={styles.media}
            crossOrigin="anonymous"
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return <div className={styles.mediaPlaceholder} />;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.mediaContainer}>
        {renderMedia()}
      </div>

      <div className={styles.footer}>
        <div className={styles.header}>
          <p className={styles.time}>
            <small>{new Date(media.createdAt).toLocaleDateString()}</small>
          </p>
        </div>

        <button 
          onClick={handleToggleLike} 
          className={styles.likeButton}
          aria-label={isLiked ? 'Unlike media' : 'Like media'}
        >
          <Heart fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'gray'} />
        </button>
      </div>
    </div>
  );
}