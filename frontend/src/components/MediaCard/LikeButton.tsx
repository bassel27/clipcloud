import { Heart } from 'lucide-react';
import { useState } from 'react';
import { toggleLike } from '@/services/mediaService';

type LikeButtonProps = {
  mediaId: string;
  initialLiked: boolean;
  className?: string;
};

export function LikeButton({ mediaId, initialLiked, className }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const handleClick = async () => {
    try {
      const updatedIsLiked = await toggleLike(mediaId);
      setIsLiked(updatedIsLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <button onClick={handleClick} className={className} aria-label={isLiked ? 'Unlike' : 'Like'}>
      <Heart fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'gray'} />
    </button>
  );
}