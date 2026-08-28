import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Mail, CheckCircle2, Info, Lock } from 'lucide-react';

interface AdminTwoFactorProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const AdminTwoFactor: React.FC<AdminTwoFactorProps> = ({ email, onSuccess, onBack }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(45);
    setOtp(Array(6).fill(''));
    setError(null);
    inputRefs.current[0]?.focus();
  };

  const handleVerify = (otpCode: string = otp.join('')) => {
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      if (otpCode === '123456' || otpCode === '000000' || otpCode === '888888') {
        onSuccess();
      } else {
        setError('Incorrect verification code. Please check the code and try again.');
      }
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

        {/* Blue Shield Icon */}
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
          <div className="relative">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
            <Lock className="w-4 h-4 text-emerald-600 absolute -bottom-1 -right-1" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Two-Factor Authentication</h2>
          <p className="text-xs text-slate-500 mt-1">Enter the 6-digit code sent to your registered email address</p>
        </div>

        {/* Green Email Notification Pill */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 mb-6">
          <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>We've sent a verification code to <strong className="text-slate-900">{email}</strong></span>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* 6-Digit Code Inputs */}
        <div className="flex justify-center gap-3 my-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
            />
          ))}
        </div>

        {/* Timer & Resend */}
        <div className="text-center mb-6">
          {timer > 0 ? (
            <p className="text-xs text-slate-500 font-semibold">
              Didn't receive the code? <span className="text-blue-600 font-bold">Resend in 00:{timer < 10 ? `0${timer}` : timer}</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleVerify()}
            disabled={isLoading}
            className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-xs transition-all cursor-pointer"
          >
            {isLoading ? 'Verifying Code...' : 'Verify & Continue'}
          </button>

          <div className="relative my-3 text-center">
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
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Verify with Authenticator App</span>
          </button>
        </div>

        <div className="text-center pt-6">
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>This extra step keeps your account secure</span>
          </p>
        </div>
      </div>

      {/* Features Checklist Section */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Features</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>6-digit OTP verification</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Auto resend with countdown</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Authenticator App support (optional)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Extra layer of security</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center gap-2 text-xs font-medium text-blue-800">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>2FA ensures that only you can access your admin account.</span>
        </div>
      </div>
    </div>
  );
};
