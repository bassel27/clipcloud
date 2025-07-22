import { useState } from 'react';
import { useRouter } from 'next/router';
import { login, register } from '@/services/authService';
import styles from './AuthPage.module.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = isLogin
                ? await login(email, password)
                : await register(email, password);

            const accessToken = data.accessToken;
            localStorage.setItem('access_token', accessToken);
            console.log(accessToken);
            router.push('/media');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.heading}>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </h2>

                {error && <p className={styles.error}>{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className={styles.button}>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </button>

                <p className={styles.switchText}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button
                        type="button"
                        className={styles.switchButton}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </form>
        </div>
    );
}