import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Backend expects 'name', we have 'fullName'
      const response = await API.post('/auth/sign-up', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500">
      {/* Background Blobs */}
      <div className="glow-overlay absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px] animate-pulse" />
      <div className="glow-overlay absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card w-full max-w-4xl grid md:grid-cols-2 overflow-hidden z-10"
      >
        {/* Left Side: Branding/Info */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-[var(--glass-bg)] border-r border-[var(--glass-border)]">
          <div>
            <Link to="/">
              <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mb-10 hover:scale-105 transition-transform">
                <span className="text-[var(--bg-primary)] font-black text-2xl">Z</span>
              </div>
            </Link>
            <h2 className="text-4xl font-black text-[var(--text-primary)] leading-tight mb-6">
              Join the future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">digital payments.</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-xs">
              Experience lightning fast transactions, zero hidden fees, and bank-grade security all in one place.
            </p>
          </div>

          <div className="space-y-5">
            {[
              "Instant secure transfers",
              "Multi-currency support",
              "Real-time analytics"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-[var(--text-secondary)] text-sm font-semibold">
                <div className="w-6 h-6 rounded-full bg-emerald-400/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-6 sm:p-10 md:p-14">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Create Account</h3>
            <p className="text-[var(--text-secondary)] text-sm">Start your journey with ZentroPay</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em] ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="John Doe" 
                  className="input-field pl-12 py-4"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em] ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="john@example.com" 
                  className="input-field pl-12 py-4"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  className="input-field pl-12 py-4"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <p className="text-[11px] text-[var(--text-secondary)] text-center px-4 leading-relaxed">
                By signing up, you agree to our <span className="text-[var(--text-primary)] font-semibold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[var(--text-primary)] font-semibold hover:underline cursor-pointer">Privacy Policy</span>.
              </p>

              <motion.button 
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                disabled={isLoading}
                className="btn-primary flex items-center justify-center gap-2 group !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <p className="mt-10 text-center text-[var(--text-secondary)] text-sm">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-[var(--text-primary)] font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
