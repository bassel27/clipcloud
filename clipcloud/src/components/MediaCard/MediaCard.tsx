import { Media, MediaType } from '@/types/media';
import styles from './MediaCard.module.css';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/services/mediaService';
import { getAuthToken, getMediaUrl, getThumbnailUrl } from '@/utils/utils';

export default function MediaCard({ media }: { media: Media }) {
  const [isLiked, setIsLiked] = useState(media.isLiked);
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const token = getAuthToken();
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        // Fetch media with auth header
        const response = await fetch(getMediaUrl(media.id, media.type), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const blob = await response.blob();
        setMediaUrl(URL.createObjectURL(blob));

        // Fetch thumbnail if video
        if (media.type === MediaType.Video) {
          const thumbResponse = await fetch(getThumbnailUrl(media.id), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const thumbBlob = await thumbResponse.blob();
          setThumbnailUrl(URL.createObjectURL(thumbBlob));
        }
      } catch (error) {
        console.error('Error loading media:', error);
      }
    };

    fetchMedia();

    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
    };
  }, [media.id, media.type, token]);

  const handleToggleLike = async () => {
    try {
      const updatedIsLiked = await toggleLike(media.id);
      setIsLiked(updatedIsLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

 return (
    <div className={styles.card}>
      <div className={styles.mediaContainer}>
        {media.type === MediaType.Image ? (
          mediaUrl ? (
            <img
              src={mediaUrl}
              alt="image"
              className={styles.media}
              crossOrigin="anonymous"
            />
          ) : (
            <div className={styles.mediaPlaceholder} />
          )
        ) : mediaUrl ? (
          <video
            controls
            poster={thumbnailUrl || undefined} 
            className={styles.media}
            crossOrigin="anonymous"
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className={styles.mediaPlaceholder} />
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.header}>
          <p className={styles.time}>
            <small>{new Date(media.createdAt).toLocaleDateString()}</small>
          </p>
        </div>

        <button onClick={handleToggleLike} className={styles.likeButton}>
          <Heart fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'gray'} />
        </button>
      </div>
    </div>
  );
}