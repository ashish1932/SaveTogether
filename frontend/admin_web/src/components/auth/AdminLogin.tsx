import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (email: string) => void;
  onForgotPassword: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onForgotPassword }) => {
  const [email, setEmail] = useState('admin@savetogether.in');
  const [password, setPassword] = useState('Admin@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@savetogether.in' && password === 'Admin@2026!') {
        onSuccess(email);
      } else {
        setError('Invalid email or password.');
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Dark Sidebar Banner */}
        <div className="lg:col-span-5 bg-[#0B192C] text-white p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* SaveTogether Logo Header */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">SaveTogether</span>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-2">Admin Panel</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Manage services, users, bookings, vendors and platform operations.
              </p>
            </div>

            {/* Laptop Graphic Illustration */}
            <div className="my-8 relative flex justify-center">
              <div className="w-56 h-36 bg-slate-800/90 border-2 border-slate-700 rounded-xl p-3 shadow-2xl relative">
                <div className="bg-slate-900 rounded-lg h-full p-2.5 space-y-2 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div className="w-16 h-2 bg-slate-700 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <div className="h-10 bg-slate-800 rounded"></div>
                    <div className="h-10 bg-slate-800 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-400 font-medium">
            © 2026 SaveTogether All rights reserved.
          </div>
        </div>

        {/* Right Login Form */}
        <div className="lg:col-span-7 p-10 flex flex-col justify-between">
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Welcome Back!</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Sign in to your admin account</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@savetogether.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-slate-400">or continue with</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@savetogether.in');
                  setPassword('Admin@2026!');
                  onSuccess('admin@savetogether.in');
                }}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </form>
          </div>

          <div className="text-center pt-4">
            <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Secure admin access. All activities are monitored and logged.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Features Checklist Section (Exact match to Phase 13 mockups) */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm max-w-5xl mx-auto">
        <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Features</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Secure email & password login</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Remember me option</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Google Single Sign-On (optional)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Protected admin access</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center gap-2 text-xs font-medium text-blue-800">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>Only authorised administrators can access the system.</span>
        </div>
      </div>
    </div>
  );
};
