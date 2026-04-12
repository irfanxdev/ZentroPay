import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.status === 200) {
        // Success - update state and redirect
        login(response.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500">
      {/* Background Blobs */}
      <div className="glow-overlay absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="glow-overlay absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card w-full max-w-md p-10 z-10"
      >
        <div className="text-center mb-10">
          <Link to="/">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block p-4 rounded-2xl bg-white/5 mb-6 border border-white/10"
            >
              <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center">
                <span className="text-[var(--bg-primary)] font-black text-2xl">Z</span>
              </div>
            </motion.div>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">Welcome back</h2>
          <p className="text-[var(--text-secondary)] font-medium">Please enter your details to sign in</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="input-field pl-14"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-[var(--text-secondary)]">Password</label>
              <a href="#" className="link-secondary text-xs">Forgot password?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-field pl-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.99 }}
            disabled={isLoading}
            className="btn-primary flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--glass-border)]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--bg-primary)] px-4 text-[var(--text-secondary)] font-medium tracking-widest transition-colors duration-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-white/10 transition-all text-[var(--text-primary)] font-medium tracking-tight">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-white/10 transition-all text-[var(--text-primary)] font-medium tracking-tight">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-[var(--text-secondary)] text-sm">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-[var(--text-primary)] font-bold hover:underline">
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
