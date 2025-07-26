import styles from './MediaCard.module.css';
import { Media } from '@/types/media';
import { MediaRenderer } from './MediaRenderer';
import { LikeButton } from './LikeButton';


type MediaCardProps = {
  media: Media;
};

export function MediaCard({ media }: MediaCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.mediaContainer}>
        <MediaRenderer 
          mediaId={media.id} 
          type={media.type} 
          className={styles.media}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.header}>
          <p className={styles.time}>
            {new Date(media.createdAt).toLocaleDateString()}
          </p>
        </div>
        <LikeButton 
          mediaId={media.id} 
          initialLiked={media.isLiked} 
          className={styles.likeButton}
        />
      </div>
    </div>
  );
}