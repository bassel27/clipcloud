import { Media, MediaType } from '@/types/media';
import styles from './MediaCard.module.css';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/services/mediaService';
import { getMediaUrl, getThumbnailUrl } from '@/utils/utils';
import { TOKEN_STORAGE } from '@/utils/tokenStorage'; // New import

export default function MediaCard({ media }: { media: Media }) {
  const [isLiked, setIsLiked] = useState(media.isLiked);
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const token = TOKEN_STORAGE.getAccessToken(); // Use TOKEN_STORAGE here
        if (!token) throw new Error('No access token available');

        const response = await fetch(getMediaUrl(media.id, media.type), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch media');
        
        const blob = await response.blob();
        setMediaUrl(URL.createObjectURL(blob));

        if (media.type === MediaType.Video) {
          const thumbResponse = await fetch(getThumbnailUrl(media.id), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!thumbResponse.ok) throw new Error('Failed to fetch thumbnail');
          
          const thumbBlob = await thumbResponse.blob();
          setThumbnailUrl(URL.createObjectURL(thumbBlob));
        }
      } catch (error) {
        console.error('Error loading media:', error);
        // Handle error (e.g., show placeholder or retry)
      }
    };

    fetchMedia();

    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
    };
  }, [media.id, media.type]);

  const handleToggleLike = async () => {
    try {
      const token = TOKEN_STORAGE.getAccessToken(); // Use here too if needed
      if (!token) throw new Error('Not authenticated');
      
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