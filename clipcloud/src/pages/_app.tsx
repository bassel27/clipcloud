import type { AppProps } from 'next/app';
import '../styles/globals.css'; // this app.tsx file allows import of global styles

export default function App({ Component, pageProps }: AppProps) { // Component is whatever page you’re currently on (e.g. index.tsx, media.tsx, etc) // pageProps are any props passed to that page.
  return <Component {...pageProps} />;
}