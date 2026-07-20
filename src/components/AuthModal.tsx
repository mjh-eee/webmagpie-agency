import React, { useState } from 'react';
import { X, Mail, Lock, User, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string, user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setErrorMsg('Please enter all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { name, email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess(data.token, data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-8 text-left transition-colors duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo & Heading */}
        <div className="flex flex-col items-center text-center space-y-2.5 pb-6 border-b border-slate-50 dark:border-slate-800/80">
          <div className="w-11 h-11 rounded-2xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
            <Sparkles className="w-6 h-6 fill-white/10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              {isLogin ? 'Welcome Back Client' : 'Register Secure Profile'}
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              WebMagpie Digital Portal
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="my-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          
          {/* Name Field (Register only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 pl-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. John Watson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 text-sm focus:border-teal-500 focus:outline-none dark:text-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                placeholder="e.g. client@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 text-sm focus:border-teal-500 focus:outline-none dark:text-white transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Secure Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => alert('Please contact administrator at hello@webmagpie2026.com to recover your password.')}
                  className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 text-sm focus:border-teal-500 focus:outline-none dark:text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/10 hover:shadow-teal-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{isLogin ? 'Authenticate Portal' : 'Register Secure Profile'}</span>
            )}
          </button>
        </form>

        {/* Toggle Form Mode */}
        <div className="text-center pt-6 mt-6 border-t border-slate-50 dark:border-slate-800/80">
          <p className="text-xs text-slate-500 font-semibold">
            {isLogin ? 'Are you a new client?' : 'Already have an active account?'}
            {' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
              }}
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
            >
              {isLogin ? 'Create Secure Profile' : 'Access Portal'}
            </button>
          </p>
        </div>

        {/* Quick Credentials Info */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 flex items-start gap-2 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-700 dark:text-slate-300">Quick Testing Credentials:</p>
            <p>• Admin Access: <span className="font-semibold text-teal-600 dark:text-teal-400">jewel.eee.kuet@gmail.com</span> / <span className="font-semibold text-teal-600 dark:text-teal-400">admin123</span></p>
            <p>• Client Access: <span className="font-semibold text-teal-600 dark:text-teal-400">patient@test.com</span> / <span className="font-semibold text-teal-600 dark:text-teal-400">patient123</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}
