import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, Info, Send } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [step, setStep] = useState<'request' | 'sent' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('admin@savetogether.in');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('sent');
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 600);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-10">
        {/* Top Logo */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">SaveTogether</span>
        </div>

        {step === 'request' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Forgot Password?</h2>
              <p className="text-xs text-slate-500 mt-1">No worries! Enter your email address and we'll send you reset instructions.</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSendResetLink} className="space-y-5">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-xs transition-all cursor-pointer"
              >
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-slate-400">or</span>
              </div>

              <button
                type="button"
                onClick={onBack}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Back to Login</span>
              </button>
            </form>

            {/* Paper Plane Graphic Banner */}
            <div className="my-6 p-4 bg-blue-50/50 rounded-2xl flex items-center justify-center">
              <Send className="w-12 h-12 text-blue-500 transform -rotate-12" />
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center gap-2 text-xs font-medium text-blue-800">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Check your email inbox and follow the instructions to reset your password.</span>
            </div>
          </>
        )}

        {step === 'sent' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Check Your Email</h2>
              <p className="text-xs text-slate-600 mt-2">
                If an account exists for <span className="font-bold text-slate-900">{email}</span>, we've sent reset instructions to your email.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setStep('reset')}
                className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Simulate Opening Reset Link
              </button>
              <button
                onClick={onBack}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs border border-slate-200 transition-all cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        {step === 'reset' && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
              <p className="text-xs text-slate-500 mt-1">Please enter your new password below.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-xs transition-all cursor-pointer"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Password Updated</h2>
              <p className="text-xs text-slate-600 mt-2">Your password has been changed successfully.</p>
            </div>
            <button
              onClick={onBack}
              className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>

      {/* Features Checklist Section */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Features</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Reset link sent to registered email</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Secure token-based reset process</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Link expiry for security</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Easy and user-friendly flow</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center gap-2 text-xs font-medium text-blue-800">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>If you don't receive the email, check your spam folder.</span>
        </div>
      </div>
    </div>
  );
};
