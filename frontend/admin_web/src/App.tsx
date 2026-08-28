import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { AdminLogin } from './components/auth/AdminLogin';
import { AdminTwoFactor } from './components/auth/AdminTwoFactor';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';

export function App() {
  const [authState, setAuthState] = useState<'login' | '2fa' | 'forgot' | 'dashboard'>('login');
  const [adminEmail, setAdminEmail] = useState<string>('admin@savetogether.in');

  // If authenticated, render High-Fidelity Executive Dashboard
  if (authState === 'dashboard') {
    return (
      <ExecutiveDashboard
        adminEmail={adminEmail}
        onLogout={() => setAuthState('login')}
      />
    );
  }

  // Render Split-Screen Authentication Layout (Phase 13)
  return (
    <div className="min-h-screen bg-[#F7FAFF] flex font-sans">
      {/* Left Side Banner (Desktop Only) */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#0B192C] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <img
                src="/app_logo.jpg"
                alt="SaveTogether Logo"
                className="w-10 h-10 object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">SaveTogether</h1>
              <span className="text-xs text-emerald-400 font-semibold tracking-wide">More Bookings. Better Prices.</span>
            </div>
          </div>

          <div className="mt-16 space-y-4 max-w-md">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-400/30">
              ADMIN CONTROL CENTER
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
              SaveTogether Admin Panel
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Centralized operation center for managing society demand aggregation, pricing tiers, vendors, bookings, payments, and platform security.
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="relative z-10 my-8 p-6 bg-slate-800/50 backdrop-blur-md border border-slate-700/60 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Enterprise Grade Security</h4>
              <p className="text-xs text-slate-400 mt-0.5">2FA Enabled • Audit Logging Active • Risk Controls</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex justify-between items-center border-t border-slate-800 pt-6">
          <span>© 2026 SaveTogether Tech Pvt. Ltd.</span>
          <span>v1.0.0 (Admin)</span>
        </div>

        {/* Background Decorative Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right Side Form Content */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12">
        {authState === 'login' && (
          <AdminLogin
            onSuccess={(email) => {
              setAdminEmail(email);
              setAuthState('2fa');
            }}
            onForgotPassword={() => setAuthState('forgot')}
          />
        )}

        {authState === '2fa' && (
          <AdminTwoFactor
            email={adminEmail}
            onSuccess={() => setAuthState('dashboard')}
            onBack={() => setAuthState('login')}
          />
        )}

        {authState === 'forgot' && (
          <ForgotPassword onBack={() => setAuthState('login')} />
        )}
      </div>
    </div>
  );
}

export default App;
