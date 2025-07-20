import { useEffect, useRef, useState, ChangeEvent } from 'react';
import MediaCard from '../components/MediaCard/MediaCard';
import { Media } from '@/types/media';
import styles from './index.module.css';
import { fetchMedia, uploadMedia } from '@/utils/api';

export default function HomePage() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMedia();
        setMediaList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);  
      }
    })();
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const newMedia = await uploadMedia(file);
      setMediaList((prev) => [newMedia, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>🎞️ Clip Cloud</h1>

      {isLoading ? (
        <p className={styles.loading}>Loading media...</p>
      ) : mediaList.length === 0 ? (
        <p className={styles.loading}>No media available.</p>
      ) : (
        <div className={styles.grid}>
          {mediaList.map((media) => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Floating upload button */}
      <button
        onClick={triggerFileSelect}
        className={styles.floatingUploadBtn}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </main>
  );
}