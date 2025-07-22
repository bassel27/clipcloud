import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Check if user is authenticated (e.g., token in localStorage or cookie)
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/media');
    } else {
      router.push('/auth');
    }
  }, [router]);

  return <p>Redirecting...</p>;
}