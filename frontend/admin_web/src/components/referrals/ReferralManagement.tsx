import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  Settings,
  ShieldAlert,
  X
} from 'lucide-react';

export interface ReferralRecord {
  id: string;
  referrerName: string;
  referrerId: string;
  referredUserName: string;
  referredUserId: string;
  referralCode: string;
  status: 'QUALIFIED' | 'PENDING' | 'UNDER REVIEW' | 'REJECTED' | 'EXPIRED';
  rewardAmount: number;
  qualifyingBookingId?: string;
  qualifyingService?: string;
  bookingAmount?: number;
  date: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface RewardTransaction {
  id: string;
  userName: string;
  referralId: string;
  amount: number;
  type: 'Earned' | 'Reversal' | 'Used';
  status: 'Credited' | 'Pending' | 'Used' | 'Reversed';
  date: string;
}

export interface FraudCase {
  id: string;
  userName: string;
  referralCount: number;
  pattern: string;
  risk: 'High' | 'Medium' | 'Low';
  status: 'Under Review' | 'Held' | 'Resolved';
  flags: string[];
}

export const ReferralManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'config' | 'rewards' | 'fraud' | 'details'>('overview');
  const [selectedReferralId, setSelectedReferralId] = useState<string>('RF1001');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  // Reward Config State (Screen 122)
  const [referrerReward, setReferrerReward] = useState('50');
  const [referredReward, setReferredReward] = useState('0');
  const [minBookingValue, setMinBookingValue] = useState('699');
  const [maxRewardsPerUser, setMaxRewardsPerUser] = useState('20');
  const [configToast, setConfigToast] = useState(false);

  // Fraud Review Modal state (Screen 124)
  const [showFraudModal, setShowFraudModal] = useState(false);
  const [selectedFraudCase, setSelectedFraudCase] = useState<FraudCase | null>(null);
  const [fraudAction, setFraudAction] = useState('Hold Reward');
  const [fraudToast, setFraudToast] = useState(false);

  // Sample Referrals Database
  const [referrals] = useState<ReferralRecord[]>([
    {
      id: 'RF1001',
      referrerName: 'Rahul Kumar',
      referrerId: 'USR10021',
      referredUserName: 'Arjun Nair',
      referredUserId: 'USR10345',
      referralCode: 'RAHUL50',
      status: 'QUALIFIED',
      rewardAmount: 50,
      qualifyingBookingId: '#BK10243',
      qualifyingService: 'AC General Service',
      bookingAmount: 1198,
      date: '28 Aug 2026',
      riskLevel: 'Low',
    },
    {
      id: 'RF1002',
      referrerName: 'Priya Sharma',
      referrerId: 'USR10044',
      referredUserName: 'Sneha Iyer',
      referredUserId: 'USR10389',
      referralCode: 'PRIYA50',
      status: 'PENDING',
      rewardAmount: 50,
      date: '28 Aug 2026',
      riskLevel: 'Low',
    },
    {
      id: 'RF1003',
      referrerName: 'Ashish Kumar',
      referrerId: 'USR10001',
      referredUserName: 'User123',
      referredUserId: 'USR10999',
      referralCode: 'ASHISH50',
      status: 'UNDER REVIEW',
      rewardAmount: 50,
      date: '27 Aug 2026',
      riskLevel: 'High',
    },
  ]);

  // Sample Reward Transactions (Screen 123)
  const [rewardTransactions] = useState<RewardTransaction[]>([
    { id: 'RW1001', userName: 'Rahul Kumar', referralId: 'RF1001', amount: 50, type: 'Earned', status: 'Credited', date: '28 Aug 2026' },
    { id: 'RW1002', userName: 'Priya Sharma', referralId: 'RF1002', amount: 50, type: 'Earned', status: 'Pending', date: '28 Aug 2026' },
    { id: 'RW1003', userName: 'Ashish Kumar', referralId: 'RF0998', amount: 50, type: 'Earned', status: 'Used', date: '27 Aug 2026' },
    { id: 'RW1004', userName: 'Arjun Nair', referralId: 'RF0991', amount: 50, type: 'Reversal', status: 'Reversed', date: '27 Aug 2026' },
  ]);

  // Sample Fraud Review Cases (Screen 124)
  const [fraudCases, setFraudCases] = useState<FraudCase[]>([
    {
      id: 'FR1023',
      userName: 'Rahul Kumar',
      referralCount: 42,
      pattern: 'Rapid registrations (8 within 2 hours)',
      risk: 'High',
      status: 'Under Review',
      flags: ['8 registrations within 2 hours', 'Multiple accounts sharing device signals', '5 bookings cancelled after qualification'],
    },
    {
      id: 'FR1024',
      userName: 'Priya Sharma',
      referralCount: 19,
      pattern: 'Shared device fingerprint signals',
      risk: 'Medium',
      status: 'Under Review',
      flags: ['Shared device fingerprint across 3 user IDs'],
    },
  ]);

  const selectedReferral = referrals.find((r) => r.id === selectedReferralId) || referrals[0];

  const filteredReferrals = referrals.filter((r) => {
    const matchesSearch =
      searchQuery === '' ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referrerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referredUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referralCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = riskFilter === 'All' || r.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleSaveConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigToast(true);
    setTimeout(() => setConfigToast(false), 2000);
  };

  const handleResolveFraud = () => {
    if (!selectedFraudCase) return;
    setFraudCases((prev) =>
      prev.map((f) => (f.id === selectedFraudCase.id ? { ...f, status: 'Held' } : f))
    );
    setShowFraudModal(false);
    setFraudToast(true);
    setTimeout(() => setFraudToast(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Referral Administration (Phase 24)</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Growth engine control, reward rule configuration, referral qualification & fraud monitoring</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('config')}
            className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span>Reward Configuration (122)</span>
          </button>
        </div>
      </div>

      {configToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>✓ Reward configuration saved! Referrer ₹{referrerReward} per completed qualifying booking.</span>
        </div>
      )}

      {fraudToast && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>✓ Fraud review updated to {fraudAction}! Reward put on hold.</span>
        </div>
      )}

      {/* 119.1 REFERRAL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL REFERRALS</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">4,820</h3>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Total invitations sent</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SUCCESSFUL REFERRALS</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">3,142</h3>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Qualified & verified</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">REWARDS GENERATED</span>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">₹1.57L</h3>
          <span className="text-[11px] font-bold text-blue-600 mt-1 block">Credited to resident wallets</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CONVERSION RATE</span>
          <h3 className="text-2xl font-bold text-purple-600 mt-1">65.2%</h3>
          <span className="text-[11px] font-bold text-purple-600 mt-1 block">Invited → Qualified booking</span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200 flex gap-6">
        {(['overview', 'referrals', 'config', 'rewards', 'fraud'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab === 'overview' && 'Overview & Funnel (119)'}
            {tab === 'referrals' && 'Referral List (120)'}
            {tab === 'config' && 'Reward Config (122)'}
            {tab === 'rewards' && 'Reward Transactions (123)'}
            {tab === 'fraud' && 'Fraud Review (124)'}
          </button>
        ))}
      </div>

      {/* SCREEN 119: REFERRAL DASHBOARD & FUNNEL */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Funnel Progress */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Referral Growth Conversion Funnel</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs font-bold">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">INVITED</span>
                <span className="text-lg font-extrabold text-slate-900">4,820</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-blue-600 text-[10px] block">REGISTERED</span>
                <span className="text-lg font-extrabold text-blue-600">3,820</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-purple-600 text-[10px] block">BOOKED</span>
                <span className="text-lg font-extrabold text-purple-600">3,420</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 text-[10px] block">COMPLETED</span>
                <span className="text-lg font-extrabold text-emerald-700">3,142</span>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-300">
                <span className="text-emerald-900 text-[10px] block">REWARDED</span>
                <span className="text-lg font-extrabold text-emerald-900">3,142</span>
              </div>
            </div>
          </div>

          {/* 119.3 Top Referrers Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Top Platform Referrers Leaderboard (119.3)</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Invited</th>
                  <th className="py-3 px-4">Successful</th>
                  <th className="py-3 px-4">Total Rewards Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {[
                  { rank: '01', name: 'Ashish Kumar', invited: 42, success: 31, reward: '₹1,550' },
                  { rank: '02', name: 'Rahul Kumar', invited: 36, success: 27, reward: '₹1,350' },
                  { rank: '03', name: 'Priya Sharma', invited: 29, success: 21, reward: '₹1,050' },
                ].map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{row.rank}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.name}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.invited}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">{row.success}</td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600">{row.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCREEN 120: REFERRAL LIST */}
      {activeTab === 'referrals' && (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search referral, user, code..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
          </div>

          {/* 120 REFERRAL TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Referral Database</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Referral ID</th>
                  <th className="py-3 px-4">Referrer</th>
                  <th className="py-3 px-4">Referred User</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Reward</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredReferrals.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{r.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.referrerName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{r.referredUserName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-600">{r.referralCode}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{r.rewardAmount}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === 'QUALIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          r.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReferralId(r.id);
                          setActiveTab('details');
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                      >
                        View Details (121)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* SCREEN 121: REFERRAL DETAILS & TIMELINE */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setActiveTab('referrals')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Referral Details — {selectedReferral.id}</h2>
              <p className="text-xs text-slate-500 font-medium">Referrer to Referred User relationship & qualifying booking verification</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">REFERRER</span>
                <span className="font-bold text-slate-900 text-sm">{selectedReferral.referrerName}</span>
                <span className="font-mono text-slate-400 block text-[11px]">{selectedReferral.referrerId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">REFERRED USER</span>
                <span className="font-bold text-slate-900 text-sm">{selectedReferral.referredUserName}</span>
                <span className="font-mono text-slate-400 block text-[11px]">{selectedReferral.referredUserId}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
              <span className="text-[10px] font-bold uppercase tracking-wider block">QUALIFYING BOOKING VERIFIED (121.2)</span>
              <p>Booking ID: <strong>{selectedReferral.qualifyingBookingId || '#BK10243'}</strong> ({selectedReferral.qualifyingService || 'AC Service'})</p>
              <p>Status: <strong className="text-emerald-700">COMPLETED ✓</strong> | Reward Amount: <strong>₹{selectedReferral.rewardAmount} Credited</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 122: REWARD CONFIGURATION FORM */}
      {activeTab === 'config' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Reward Configuration Engine (122)</h2>

          <form onSubmit={handleSaveConfigSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Referrer Reward (₹) *</label>
                <input
                  type="number"
                  value={referrerReward}
                  onChange={(e) => setReferrerReward(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-blue-600 font-extrabold"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Referred User Reward (₹)</label>
                <input
                  type="number"
                  value={referredReward}
                  onChange={(e) => setReferredReward(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Qualification Rule *</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold">
                <option value="First Completed Booking">First Completed Booking (Recommended V1 Rule)</option>
                <option value="Registration">Registration Only</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Minimum Booking Value (₹)</label>
                <input
                  type="number"
                  value={minBookingValue}
                  onChange={(e) => setMinBookingValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Max Rewards Per User</label>
                <input
                  type="number"
                  value={maxRewardsPerUser}
                  onChange={(e) => setMaxRewardsPerUser(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer"
            >
              Save Configuration (122)
            </button>
          </form>
        </div>
      )}

      {/* SCREEN 123: REWARD TRANSACTIONS LOG */}
      {activeTab === 'rewards' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Reward Transactions Audit Log (123)</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Reward ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Referral ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rewardTransactions.map((rw) => (
                <tr key={rw.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{rw.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{rw.userName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{rw.referralId}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{rw.amount}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{rw.type}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                      {rw.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{rw.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 124: FRAUD / ABUSE REVIEW DASHBOARD */}
      {activeTab === 'fraud' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 font-bold">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>⚠ 8 Referral Abuse Cases Require Admin Investigation</span>
            </div>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Referrals</th>
                <th className="py-3 px-4">Suspicious Pattern</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {fraudCases.map((fc) => (
                <tr key={fc.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{fc.userName}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{fc.referralCount}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">{fc.pattern}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold text-[10px]">
                      {fc.risk}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-bold">{fc.status}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedFraudCase(fc);
                        setShowFraudModal(true);
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                    >
                      Fraud Review (124.2)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 124.2 FRAUD REVIEW DETAILS MODAL */}
      {showFraudModal && selectedFraudCase && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Fraud Investigation — {selectedFraudCase.id}</h3>
              <button onClick={() => setShowFraudModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-red-900">
              <p>User: <strong>{selectedFraudCase.userName}</strong> ({selectedFraudCase.referralCount} referrals)</p>
              <p>Risk Indicator Flags:</p>
              <ul className="list-disc pl-4 text-[11px] space-y-0.5">
                {selectedFraudCase.flags.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Admin Action Resolution *</label>
              <select
                value={fraudAction}
                onChange={(e) => setFraudAction(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="Hold Reward">Hold Reward (Puts wallet reward on hold)</option>
                <option value="Reject Referral">Reject Referral (Mark as non-qualifying)</option>
                <option value="Suspend Referral Rewards">Suspend Referral Rewards</option>
                <option value="No Action">No Action (Approve as legitimate)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowFraudModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveFraud}
                className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Save Review (124)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
