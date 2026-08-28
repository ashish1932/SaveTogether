import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Plus,
  X
} from 'lucide-react';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Operations' | 'Support' | 'Finance' | 'Marketing';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  requiresTwoFactor: boolean;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  adminName: string;
  module: string;
  action: string;
  beforeVal: string;
  afterVal: string;
  status: 'Success' | 'Failed';
}

export const SettingsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'business' | 'pricing' | 'payment' | 'refund' | 'referral' | 'notification' | 'admins' | 'permissions' | 'audit' | 'danger'>('general');

  // General Settings State (Screen 145)
  const [appName, setAppName] = useState('SaveTogether');
  const [tagline, setTagline] = useState('Save More. Together.');
  const [supportEmail, setSupportEmail] = useState('support@savetogether.in');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [currency] = useState('INR (₹)');
  const [timezone] = useState('Asia/Kolkata');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Business Rules State (Screen 146)
  const [minQty, setMinQty] = useState('1');
  const [maxQty, setMaxQty] = useState('10');
  const [cancellationWindow, setCancellationWindow] = useState('12');
  const [demandAggregation, setDemandAggregation] = useState(true);

  // Pricing Impact Preview Modal state (Screen 147.2)
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Add Admin Modal State (Screen 152.1)
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'Operations' | 'Support' | 'Finance'>('Operations');
  const [requireTwoFactor, setRequireTwoFactor] = useState(true);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Users Database (Screen 152)
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([
    { id: 'ADM1001', name: 'Ashish Kumar', email: 'ashish.admin@savetogether.in', role: 'Super Admin', status: 'Active', lastLogin: '2 min ago', requiresTwoFactor: true },
    { id: 'ADM1002', name: 'Rahul Kumar', email: 'rahul.support@savetogether.in', role: 'Support', status: 'Active', lastLogin: '12 min ago', requiresTwoFactor: true },
    { id: 'ADM1003', name: 'Priya Sharma', email: 'priya.finance@savetogether.in', role: 'Finance', status: 'Active', lastLogin: '1 hour ago', requiresTwoFactor: true },
  ]);

  // Audit Logs Database (Screen 154)
  const [auditLogs] = useState<AuditLogRecord[]>([
    { id: 'AL10245', timestamp: 'Today, 11:42 AM', adminName: 'Ashish Kumar', module: 'Pricing Rules', action: 'Tier Price Updated', beforeVal: '20–39 Units: ₹599', afterVal: '20–39 Units: ₹549', status: 'Success' },
    { id: 'AL10244', timestamp: 'Today, 11:30 AM', adminName: 'Rahul Kumar', module: 'Booking Admin', action: 'Status Changed to SCHEDULED', beforeVal: 'VENDOR_ASSIGNED', afterVal: 'SCHEDULED', status: 'Success' },
    { id: 'AL10243', timestamp: 'Today, 11:12 AM', adminName: 'Priya Sharma', module: 'Refund Admin', action: 'Refund RF1001 Approved', beforeVal: 'UNDER REVIEW', afterVal: 'APPROVED', status: 'Success' },
    { id: 'AL10242', timestamp: 'Yesterday', adminName: 'Ashish Kumar', module: 'Vendor Admin', action: 'New Vendor Added', beforeVal: '—', afterVal: 'CoolCare Services', status: 'Success' },
  ]);

  const handleGeneralSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('✓ General platform configuration saved successfully!');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleBusinessSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('✓ Business & Demand Aggregation rules updated!');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;
    const newAdmin: AdminUserRecord = {
      id: `ADM${Math.floor(1000 + Math.random() * 9000)}`,
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      status: 'Active',
      lastLogin: 'Never',
      requiresTwoFactor: requireTwoFactor,
    };
    setAdminUsers([...adminUsers, newAdmin]);
    setShowAddAdminModal(false);
    setNewAdminName('');
    setNewAdminEmail('');
    setToastMessage(`✓ Admin user ${newAdminName} created successfully!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Control Center & Settings (Phase 28)</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Platform configuration, business rules, payment gateways, admin roles & audit trail logging</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('audit')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Audit Trail Logs (154)</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200 flex gap-6 overflow-x-auto">
        {(['general', 'business', 'pricing', 'payment', 'refund', 'referral', 'notification', 'admins', 'permissions', 'audit', 'danger'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab === 'general' && 'General (145)'}
            {tab === 'business' && 'Business Rules (146)'}
            {tab === 'pricing' && 'Pricing Rules (147)'}
            {tab === 'payment' && 'Payments (148)'}
            {tab === 'refund' && 'Refund Policy (149)'}
            {tab === 'referral' && 'Referral Rules (150)'}
            {tab === 'notification' && 'Notifications (151)'}
            {tab === 'admins' && 'Admin Users (152)'}
            {tab === 'permissions' && 'Permissions (153)'}
            {tab === 'audit' && 'Audit Logs (154)'}
            {tab === 'danger' && 'Danger Zone (156)'}
          </button>
        ))}
      </div>

      {/* SCREEN 145: GENERAL SETTINGS */}
      {activeTab === 'general' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-slate-900">General Platform Information (145)</h2>

          <form onSubmit={handleGeneralSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-semibold">
            <div>
              <label className="block mb-1 text-slate-700">Platform App Name *</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Support Email *</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">Support Phone *</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Default Currency</label>
                <input
                  type="text"
                  value={currency}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-bold"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-bold"
                />
              </div>
            </div>

            {/* 145.2 Maintenance Mode Toggle */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">Platform Maintenance Mode (145.2)</h4>
                <p className="text-[11px] text-slate-500">Temporarily restrict new bookings while platform updates are deployed.</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  maintenanceMode ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {maintenanceMode ? 'Maintenance ON' : 'Operational'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer"
            >
              Save General Settings (145)
            </button>
          </form>
        </div>
      )}

      {/* SCREEN 146: BUSINESS RULES & DEMAND ENGINE */}
      {activeTab === 'business' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Operational Business & Demand Rules (146)</h2>

          <form onSubmit={handleBusinessSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 text-xs font-semibold">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">BOOKING RULES (146.1)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Min Quantity Per Booking</label>
                <input
                  type="number"
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Max Quantity Per Booking</label>
                <input
                  type="number"
                  value={maxQty}
                  onChange={(e) => setMaxQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Free Cancellation Window (Hours)</label>
              <input
                type="number"
                value={cancellationWindow}
                onChange={(e) => setCancellationWindow(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              />
            </div>

            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 pt-2">DEMAND AGGREGATION RULES (146.2)</h3>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-blue-900">
              <label className="flex items-center gap-2 cursor-pointer font-bold">
                <input
                  type="checkbox"
                  checked={demandAggregation}
                  onChange={(e) => setDemandAggregation(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Enable Automatic Society-Level Demand Aggregation Engine</span>
              </label>
              <p className="text-[11px] text-blue-800">
                Individual resident bookings automatically aggregate into society demand. Pricing tiers update automatically.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer"
            >
              Save Business Rules (146)
            </button>
          </form>
        </div>
      )}

      {/* SCREEN 147: PRICING RULES */}
      {activeTab === 'pricing' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-semibold">
            <h3 className="text-base font-bold text-slate-900">Bulk Tier Pricing Engine Configuration (147)</h3>
            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <p>Pricing Engine Model: <strong>Tier-Based Aggregated Demand</strong></p>
              <p>Baseline Price Calculation: <strong>Automatic Tier Matching</strong></p>
            </div>

            <button
              onClick={() => setShowPricingModal(true)}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 rounded-xl text-xs border border-blue-200 cursor-pointer"
            >
              Preview Pricing Rule Impact Modal (147.2)
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 148: PAYMENT SETTINGS */}
      {activeTab === 'payment' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-semibold">
          <h3 className="text-base font-bold text-slate-900">Payment Gateway Configuration (148)</h3>
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <p>Active Provider: <strong>Razorpay Integration</strong></p>
            <p>Payment Mode: <strong className="text-emerald-600">Production Live Mode</strong></p>
            <p>API Key: <strong className="font-mono">rzp_live_••••••••••••4821</strong></p>
          </div>
        </div>
      )}

      {/* SCREEN 149: REFUND POLICY SETTINGS */}
      {activeTab === 'refund' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-semibold">
          <h3 className="text-base font-bold text-slate-900">Platform Refund Policy Configuration (149)</h3>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
            <p>Cancellation Before Window (12h): <strong>100% Full Refund</strong></p>
            <p>Cancellation Inside Window (&lt;12h): <strong>0% (Admin Approval Required)</strong></p>
            <p>Target Refund Processing Time: <strong>5 Business Days</strong></p>
          </div>
        </div>
      )}

      {/* SCREEN 150: REFERRAL SETTINGS */}
      {activeTab === 'referral' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-semibold">
          <h3 className="text-base font-bold text-slate-900">Referral Program Rules (150)</h3>
          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <p>Referrer Reward: <strong>₹50</strong> per completed qualifying booking</p>
            <p>Referred User Reward: <strong>₹0</strong></p>
            <p>Qualification Trigger: <strong>First Completed Booking (₹699 Min Value)</strong></p>
            <p>Max Referrals Per User: <strong>20 successful referrals</strong></p>
          </div>
        </div>
      )}

      {/* SCREEN 151: NOTIFICATION SETTINGS */}
      {activeTab === 'notification' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-semibold">
          <h3 className="text-base font-bold text-slate-900">Global Notification Controls (151)</h3>
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <p>Push Notifications Channel: <strong className="text-emerald-600">ENABLED</strong></p>
            <p>Marketing Quiet Hours: <strong>10:00 PM → 08:00 AM (Suppresses non-urgent promo pushes)</strong></p>
          </div>
        </div>
      )}

      {/* SCREEN 152: ADMIN USER MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">SaveTogether Admin Staff Users (152)</h3>
            <button
              onClick={() => setShowAddAdminModal(true)}
              className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Admin User (152.1)</span>
            </button>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">2FA Security</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {adminUsers.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{a.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{a.email}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{a.role}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    {a.requiresTwoFactor ? '✓ 2FA Enabled' : 'Disabled'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{a.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 153: ROLES & PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4 text-xs font-semibold">
          <h3 className="text-base font-bold text-slate-900">Admin Roles & Permission Matrix (153)</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Super Admin</th>
                <th className="py-3 px-4">Operations</th>
                <th className="py-3 px-4">Support</th>
                <th className="py-3 px-4">Finance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {[
                { mod: 'Demand & Societies', super: '✓ Full', ops: '✓ Full', supp: 'View', fin: 'View' },
                { mod: 'Bookings & Assignment', super: '✓ Full', ops: '✓ Full', supp: '✓ Edit', fin: 'View' },
                { mod: 'Payments & Refunds', super: '✓ Full', ops: 'View', supp: 'View', fin: '✓ Full' },
                { mod: 'Settings & Security', super: '✓ Full', ops: '—', supp: '—', fin: '—' },
              ].map((row) => (
                <tr key={row.mod} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.mod}</td>
                  <td className="py-3.5 px-4 text-emerald-600 font-bold">{row.super}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{row.ops}</td>
                  <td className="py-3.5 px-4 font-bold text-purple-600">{row.supp}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">{row.fin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 154: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Security Audit Trail Log (154)</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin User</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Previous Value</th>
                <th className="py-3 px-4">New Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{log.adminName}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{log.module}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{log.action}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{log.beforeVal}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">{log.afterVal}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 156: DANGER ZONE */}
      {activeTab === 'danger' && (
        <div className="bg-red-50/60 rounded-2xl border border-red-200 p-6 space-y-4 text-xs font-semibold text-red-900">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-base font-bold">Admin Danger Zone (156)</h3>
          </div>
          <p>High-impact security actions requiring Super Admin password verification and 2FA authentication.</p>

          <div className="space-y-3 pt-2">
            <div className="p-4 bg-white border border-red-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-red-900">Reset All Payment Webhook Credentials</h4>
                <p className="text-[11px] text-red-700">Invalidates active gateway keys.</p>
              </div>
              <button className="bg-red-600 text-white font-bold px-3 py-2 rounded-xl cursor-pointer">
                Reset Keys
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 147.2 PRICING IMPACT PREVIEW MODAL */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Pricing Impact Preview (147.2)</h3>
              <button onClick={() => setShowPricingModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-amber-900">
              <h4 className="font-bold text-sm">⚠ PRICING RULE CHANGE IMPACT</h4>
              <p>Current Tier 20–39 ACs: <strong>₹599 / AC</strong></p>
              <p>Proposed Tier 20–39 ACs: <strong>₹549 / AC</strong></p>
              <div className="pt-2 border-t border-amber-200">
                <p>• Affected Active Demand Campaigns: <strong>8 Campaigns</strong></p>
                <p>• Affected Active Bookings: <strong>184 Residents</strong></p>
                <p>• Customer Price Change: <strong>-₹50 / unit additional savings</strong></p>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPricingModal(false);
                  setToastMessage('✓ Pricing rule change confirmed & applied to 8 active campaigns!');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Confirm Pricing Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 152.1 ADD ADMIN MODAL */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Admin User (152.1)</h3>
              <button onClick={() => setShowAddAdminModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Full Name *</label>
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Work Email *</label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="vikram@savetogether.in"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Admin Role Permission *</label>
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="Operations">Operations Admin (Demand, Societies, Vendors)</option>
                <option value="Support">Support Admin (Complaints, Users, Bookings)</option>
                <option value="Finance">Finance Admin (Payments, Refunds, Settlements)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 rounded-xl text-slate-700">
              <input
                type="checkbox"
                checked={requireTwoFactor}
                onChange={(e) => setRequireTwoFactor(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Require Two-Factor Authentication (2FA) login</span>
            </label>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddAdminModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAdminSubmit}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Create Admin User (152)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
