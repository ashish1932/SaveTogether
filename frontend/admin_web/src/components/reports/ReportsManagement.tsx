import React, { useState } from 'react';
import {
  Download,
  TrendingUp,
  CheckCircle2,
  X
} from 'lucide-react';

export const ReportsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'executive' | 'revenue' | 'booking' | 'service' | 'society' | 'vendor' | 'savings' | 'referral' | 'cancellation'>('executive');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'year'>('30d');

  // Export Modal State (Screen 146)
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'CSV' | 'Excel' | 'PDF'>('PDF');
  const [exportToast, setExportToast] = useState(false);

  const handleExportSubmit = () => {
    setShowExportModal(false);
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* MODULE HEADER & DATE FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Business Analytics (Phase 27)</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Executive business intelligence, revenue breakdown, society demand performance & customer savings analytics</p>
        </div>

        <div className="flex items-center gap-3">
          {/* 136.2 DATE RANGE SELECTOR */}
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center gap-1 text-xs font-bold shadow-sm">
            {(['7d', '30d', '90d', 'year'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  dateRange === r ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === '7d' && 'Last 7 Days'}
                {r === '30d' && 'Last 30 Days'}
                {r === '90d' && 'Last 90 Days'}
                {r === 'year' && 'This Year'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Report (146)</span>
          </button>
        </div>
      </div>

      {exportToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>✓ Executive Analytics Report downloaded in {exportFormat} format!</span>
        </div>
      )}

      {/* 136.1 EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL REVENUE</span>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-2xl font-bold text-slate-900">₹8.42L</h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> ↑ 18.4%</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Gross customer transactions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL BOOKINGS</span>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-2xl font-bold text-blue-600">1,284</h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> ↑ 22.7%</span>
          </div>
          <span className="text-[11px] font-bold text-blue-600 mt-1 block">946 Completed / 184 Active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE RESIDENTS</span>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-2xl font-bold text-purple-600">4,820</h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> ↑ 15.2%</span>
          </div>
          <span className="text-[11px] font-bold text-purple-600 mt-1 block">Across 36 registered societies</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CUSTOMER SAVINGS</span>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-2xl font-bold text-emerald-600">₹1.57L</h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> ↑ 12.8%</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Saved via society bulk tiers</span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200 flex gap-6 overflow-x-auto">
        {(['executive', 'revenue', 'booking', 'service', 'society', 'vendor', 'savings', 'referral', 'cancellation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab === 'executive' && 'Executive (136)'}
            {tab === 'revenue' && 'Revenue (137)'}
            {tab === 'booking' && 'Bookings (138)'}
            {tab === 'service' && 'Services (139)'}
            {tab === 'society' && 'Societies (140)'}
            {tab === 'vendor' && 'Vendors (141)'}
            {tab === 'savings' && 'Customer Savings (142)'}
            {tab === 'referral' && 'Referral ROI (143)'}
            {tab === 'cancellation' && 'Cancellations (144)'}
          </button>
        ))}
      </div>

      {/* SCREEN 136: EXECUTIVE OVERVIEW & BUSINESS HEALTH */}
      {activeTab === 'executive' && (
        <div className="space-y-6">
          {/* 136.3 Business Health Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Platform Business Health Indicator (136.3)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs font-bold">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="text-[10px] text-emerald-700 block">REVENUE</span>
                <span className="text-base font-extrabold">↑ 18.4%</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="text-[10px] text-emerald-700 block">BOOKINGS</span>
                <span className="text-base font-extrabold">↑ 22.7%</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="text-[10px] text-emerald-700 block">NEW USERS</span>
                <span className="text-base font-extrabold">↑ 15.2%</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="text-[10px] text-emerald-700 block">SAVINGS</span>
                <span className="text-base font-extrabold">↑ 12.8%</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="text-[10px] text-emerald-700 block">CANCELLATIONS</span>
                <span className="text-base font-extrabold">↓ 3.1%</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
                <span className="text-[10px] text-blue-700 block">AVG RATING</span>
                <span className="text-base font-extrabold">4.8 ★</span>
              </div>
            </div>
          </div>

          {/* Quick Category Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 text-xs font-semibold">
              <span className="text-[10px] font-bold text-slate-400 uppercase">TOP PERFORMING SERVICE</span>
              <h4 className="text-base font-bold text-slate-900">AC General Service</h4>
              <p className="text-slate-600">420 Bookings • ₹2.84L Revenue • 94% Completion</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 text-xs font-semibold">
              <span className="text-[10px] font-bold text-slate-400 uppercase">TOP DEMAND SOCIETY</span>
              <h4 className="text-base font-bold text-slate-900">ABC Residency</h4>
              <p className="text-slate-600">284 Bookings • ₹1.84L Revenue • ₹38K Saved</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 text-xs font-semibold">
              <span className="text-[10px] font-bold text-slate-400 uppercase">TOP SERVICE VENDOR</span>
              <h4 className="text-base font-bold text-slate-900">CoolCare Services Pvt Ltd</h4>
              <p className="text-slate-600">184 Jobs Completed • 96% On-Time • 4.8★</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 137: REVENUE REPORT */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-semibold">
            <h3 className="text-base font-bold text-slate-900">Revenue Waterfall Breakdown (137.3)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">CUSTOMER COLLECTION</span>
                <span className="text-xl font-extrabold text-slate-900">₹8,42,000</span>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-600 uppercase font-bold block">VENDOR PAYOUT</span>
                <span className="text-xl font-extrabold text-blue-600">₹6,42,500</span>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[10px] text-purple-600 uppercase font-bold block">CUSTOMER REFUNDS</span>
                <span className="text-xl font-extrabold text-purple-600">₹28,400</span>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] text-amber-700 uppercase font-bold block">PAYMENT FEES</span>
                <span className="text-xl font-extrabold text-amber-700">₹14,800</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block">PLATFORM COMMISSION</span>
                <span className="text-xl font-extrabold text-emerald-700">₹1,26,300</span>
              </div>
            </div>

            {/* 137.2 Revenue by Service Table */}
            <h4 className="font-bold text-slate-900 text-sm pt-4 border-t border-slate-100">Revenue Breakdown by Service Category (137.2)</h4>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Bookings</th>
                  <th className="py-3 px-4">Customer Revenue</th>
                  <th className="py-3 px-4">Avg. Order Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {[
                  { name: 'AC General Service', bookings: 420, revenue: '₹2,84,000', avg: '₹676' },
                  { name: 'Full Home Deep Cleaning', bookings: 245, revenue: '₹1,96,000', avg: '₹800' },
                  { name: 'Car Wash & Polish', bookings: 310, revenue: '₹1,42,000', avg: '₹458' },
                  { name: 'Full Home Pest Control', bookings: 140, revenue: '₹1,18,000', avg: '₹843' },
                  { name: 'RO Water Purifier Service', bookings: 169, revenue: '₹1,02,000', avg: '₹604' },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.name}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.bookings}</td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600">{row.revenue}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{row.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCREEN 138: BOOKING REPORT */}
      {activeTab === 'booking' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4 text-xs font-semibold">
          <h3 className="text-base font-bold text-slate-900">Booking Performance & Fulfillment Analytics (138)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
            <div>Total Bookings: <strong className="text-slate-900 font-bold block mt-0.5">1,284</strong></div>
            <div>Completed Services: <strong className="text-emerald-600 font-bold block mt-0.5">946 (73.7%)</strong></div>
            <div>Active Scheduled: <strong className="text-blue-600 font-bold block mt-0.5">184 (14.3%)</strong></div>
            <div>Cancelled Bookings: <strong className="text-red-600 font-bold block mt-0.5">154 (12.0%)</strong></div>
          </div>
        </div>
      )}

      {/* SCREEN 139: SERVICE PERFORMANCE & OPPORTUNITY CARDS */}
      {activeTab === 'service' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs font-semibold">
              <span className="text-emerald-700 font-bold uppercase text-[10px]">🔥 HIGH OPPORTUNITY SERVICE (139.2)</span>
              <h4 className="text-base font-bold text-emerald-900">AC General Service</h4>
              <p className="text-emerald-800">High demand volume (420 bookings), 94% completion rate, strong ₹400 savings per customer. Recommendation: Expand vendor coverage in new societies.</p>
            </div>

            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs font-semibold">
              <span className="text-amber-700 font-bold uppercase text-[10px]">⚠ NEEDS ATTENTION (139.2)</span>
              <h4 className="text-base font-bold text-amber-900">Pest Control</h4>
              <p className="text-amber-800">High demand but 18.6% cancellation rate due to vendor capacity bottleneck. Recommendation: Onboard 2 additional pest control vendors.</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 140: SOCIETY PERFORMANCE */}
      {activeTab === 'society' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Society Demand & Revenue Leaderboard (140)</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Society Name</th>
                <th className="py-3 px-4">Registered Users</th>
                <th className="py-3 px-4">Bookings</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Customer Savings</th>
                <th className="py-3 px-4">Active Demand Tiers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[
                { name: 'ABC Residency', users: 420, bookings: 284, revenue: '₹1,84,000', savings: '₹38,000', tiers: '12 Active Tiers' },
                { name: 'Green Meadows', users: 315, bookings: 216, revenue: '₹1,42,000', savings: '₹31,000', tiers: '8 Active Tiers' },
                { name: 'Lake View Apartments', users: 280, bookings: 182, revenue: '₹1,18,000', savings: '₹26,000', tiers: '6 Active Tiers' },
              ].map((s) => (
                <tr key={s.name} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{s.users}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.bookings}</td>
                  <td className="py-3.5 px-4 font-extrabold text-blue-600">{s.revenue}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">{s.savings}</td>
                  <td className="py-3.5 px-4 font-semibold text-purple-600">{s.tiers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 141: VENDOR PERFORMANCE SCORECARD */}
      {activeTab === 'vendor' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Vendor Performance Scorecard (141)</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Jobs</th>
                <th className="py-3 px-4">Completion Rate</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Complaints</th>
                <th className="py-3 px-4">Avg Vendor Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[
                { name: 'CoolCare Services Pvt Ltd', jobs: 184, completion: '96%', rating: '4.8 ★', complaints: 4, rate: '₹450 / AC' },
                { name: 'AquaFix Solutions', jobs: 142, completion: '94%', rating: '4.7 ★', complaints: 6, rate: '₹420 / unit' },
                { name: 'CleanPro Services', jobs: 126, completion: '91%', rating: '4.6 ★', complaints: 9, rate: '₹510 / unit' },
              ].map((v) => (
                <tr key={v.name} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{v.name}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{v.jobs}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{v.completion}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{v.rating}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">{v.complaints}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{v.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 142: CUSTOMER SAVINGS REPORT (Core SaveTogether Metric) */}
      {activeTab === 'savings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-semibold">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Total Customer Society Savings (142)</h3>
              <p className="text-xs text-slate-500">Core value proposition metric: aggregated society demand savings</p>
            </div>
            <span className="text-3xl font-extrabold text-emerald-600">₹1,57,000 Saved</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
            <div>Average Savings / Booking: <strong className="font-extrabold text-base block mt-0.5">₹122</strong></div>
            <div>Benefited Residents: <strong className="font-extrabold text-base block mt-0.5">3,842 Users</strong></div>
            <div>Average Discount: <strong className="font-extrabold text-base block mt-0.5">14.8% Saved</strong></div>
          </div>

          {/* 142.1 Savings Calculation Example */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">SAVINGS CALCULATION PROOF (142.1)</span>
            <p>Normal Baseline Price (27 ACs × ₹799): <strong>₹21,573</strong></p>
            <p>Actual Aggregated Bulk Tier Price (27 ACs × ₹599): <strong>₹16,173</strong></p>
            <p className="text-emerald-600 font-bold border-t border-slate-200 pt-2">Society Total Direct Customer Savings: ₹5,400 Saved (25%)</p>
          </div>
        </div>
      )}

      {/* SCREEN 143: REFERRAL ROI */}
      {activeTab === 'referral' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-semibold">
          <h3 className="text-base font-bold text-slate-900">Referral Program Growth ROI (143)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
            <div>Referral Rewards Spent: <strong className="font-extrabold block text-base mt-0.5">₹1,57,000</strong></div>
            <div>Generated Customer Revenue: <strong className="font-extrabold block text-base mt-0.5">₹2,84,000</strong></div>
            <div>Referral Program ROI: <strong className="text-emerald-700 font-extrabold block text-base mt-0.5">1.81x ROI</strong></div>
          </div>
        </div>
      )}

      {/* SCREEN 144: CANCELLATION ANALYTICS */}
      {activeTab === 'cancellation' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-semibold">
          <h3 className="text-base font-bold text-slate-900">Cancellation Reasons & Churn Analytics (144)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 space-y-1">
              <span className="text-[10px] font-bold uppercase">CANCELLATION RATE</span>
              <h4 className="text-2xl font-extrabold text-red-700">12.0% (154 Bookings)</h4>
              <p>Refund Amount Issued: <strong>₹28,400</strong></p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">PRIMARY CANCELLATION REASONS (144.1)</span>
              <p>• Customer Schedule Change: <strong>38%</strong></p>
              <p>• Vendor Unavailable: <strong>22%</strong></p>
              <p>• Price / Expectation: <strong>14%</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 146: REPORT EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Export Analytics Report (146)</h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block mb-2 text-slate-700">Export File Format *</label>
              <div className="flex gap-3">
                {(['PDF', 'Excel', 'CSV'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setExportFormat(fmt)}
                    className={`w-1/3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      exportFormat === fmt ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExportSubmit}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Report (146)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
