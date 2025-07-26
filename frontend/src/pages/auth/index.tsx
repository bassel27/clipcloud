import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login, register, isAuthenticated } from '@/services/authService';
import styles from './auth.module.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    const validateInputs = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                router.push('/media');
            } else {
                await register(email, password);
                setError('');
                setIsLogin(true); 
                setPassword(''); 
                alert('Registration successful! Please sign in.');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               err.message || 
                               'Something went wrong';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
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
                    disabled={isLoading}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={6}
                />

                <button 
                    type="submit" 
                    className={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>

                <p className={styles.switchText}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button
                        type="button"
                        className={styles.switchButton}
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(''); // Clear errors when switching
                        }}
                        disabled={isLoading}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </form>
        </div>
    );
}