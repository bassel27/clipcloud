import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/media');
    } else {
      router.push('/auth');
    }
  }, [router]);

  return <p>Redirecting...</p>;
}