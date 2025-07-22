import { Media, MediaType } from '@/types/media';
import styles from './MediaCard.module.css';
import { API_BASE_URL } from '@/utils/constants';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/services/mediaService';

export default function MediaCard({ media }: { media: Media }) {
  const [isLiked, setIsLiked] = useState(media.isLiked);

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
          <img
            src={media.url}
            alt={"image"}
            className={styles.media}
            onError={(e) => (e.currentTarget.src = '/fallback.jpg')}
          />
        ) : (
          <video
            controls
            poster={media.thumbnailUrl}
            className={styles.media}
          >
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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