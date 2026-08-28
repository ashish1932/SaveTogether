import React, { useState } from 'react';
import {
  CheckCircle2,
  Send,
  Plus,
  Zap,
  X
} from 'lucide-react';

export interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  type: 'PRICE_DROP' | 'BOOKING' | 'PAYMENT' | 'REFERRAL' | 'SUPPORT' | 'PROMOTIONAL';
  audience: string;
  recipientCount: number;
  deliveredCount: number;
  failedCount: number;
  status: 'COMPLETED' | 'SCHEDULED' | 'SENDING' | 'DRAFT';
  scheduledTime?: string;
  sentTime?: string;
  createdBy: string;
}

export interface RecipientStatus {
  userName: string;
  status: 'Delivered' | 'Failed';
  failureReason?: string;
}

export const NotificationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'scheduled' | 'history' | 'automatic' | 'details'>('overview');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('NT1001');

  // Create Notification Form State (Screen 132)
  const [notifType, setNotifType] = useState<'PROMOTIONAL' | 'PRICE_DROP' | 'BOOKING' | 'SERVICE_REMINDER'>('PRICE_DROP');
  const [notifTitle, setNotifTitle] = useState('🔥 Your AC service price dropped!');
  const [notifMessage, setNotifMessage] = useState('{{society_name}} reached 20 AC bookings. Your price is now {{current_price}} per AC.');
  const [targetAudience, setTargetAudience] = useState('ABC Residency (126 Users)');
  const [ctaText, setCtaText] = useState('BOOK NOW');
  const [deliveryMode, setDeliveryMode] = useState<'NOW' | 'SCHEDULE'>('NOW');
  const [scheduleDateTime, setScheduleDateTime] = useState('2026-08-30T09:00');

  // Send Progress Modal State (Screen 133)
  const [showSendModal, setShowSendModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendComplete, setSendComplete] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sample Notification Campaigns Database
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([
    {
      id: 'NT1001',
      title: '🔥 Your AC service price dropped!',
      message: 'ABC Residency reached 20 AC bookings. Your price is now ₹599 per AC.',
      type: 'PRICE_DROP',
      audience: 'ABC Residency (126 Users)',
      recipientCount: 126,
      deliveredCount: 121,
      failedCount: 5,
      status: 'COMPLETED',
      sentTime: 'Today, 11:35 AM',
      createdBy: 'Ashish Admin',
    },
    {
      id: 'NT1002',
      title: 'Reminder: Your AC Service is Tomorrow',
      message: 'Technician from CoolCare Services will visit tomorrow between 09:00 AM - 12:00 PM.',
      type: 'BOOKING',
      audience: 'Upcoming AC Customers (84 Users)',
      recipientCount: 84,
      deliveredCount: 82,
      failedCount: 2,
      status: 'COMPLETED',
      sentTime: 'Yesterday, 06:00 PM',
      createdBy: 'System Automatic',
    },
    {
      id: 'NT1003',
      title: 'Weekend Full Home Cleaning Offer',
      message: 'Get ₹300 off on Full Home Deep Cleaning in Green Meadows this Sunday.',
      type: 'PROMOTIONAL',
      audience: 'Green Meadows (150 Users)',
      recipientCount: 150,
      deliveredCount: 0,
      failedCount: 0,
      status: 'SCHEDULED',
      scheduledTime: '30 Aug 2026, 09:00 AM',
      createdBy: 'Ashish Admin',
    },
  ]);

  // Sample Recipient Breakdown (Screen 135.3)
  const sampleRecipients: RecipientStatus[] = [
    { userName: 'Rahul Kumar', status: 'Delivered' },
    { userName: 'Priya Sharma', status: 'Delivered' },
    { userName: 'Arjun Nair', status: 'Delivered' },
    { userName: 'Sneha Iyer', status: 'Failed', failureReason: 'Device push token invalid / expired' },
    { userName: 'Karthik Kumar', status: 'Delivered' },
  ];

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const insertVariable = (variable: string) => {
    setNotifMessage((prev) => prev + ` ${variable}`);
  };

  const handleStartSend = () => {
    if (deliveryMode === 'SCHEDULE') {
      const newCamp: NotificationCampaign = {
        id: `NT${Math.floor(1000 + Math.random() * 9000)}`,
        title: notifTitle,
        message: notifMessage,
        type: 'PRICE_DROP',
        audience: targetAudience,
        recipientCount: 126,
        deliveredCount: 0,
        failedCount: 0,
        status: 'SCHEDULED',
        scheduledTime: scheduleDateTime,
        createdBy: 'Ashish Admin',
      };
      setCampaigns([newCamp, ...campaigns]);
      setActiveTab('scheduled');
      setToastMessage('✓ Notification campaign scheduled successfully!');
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }

    setShowSendModal(true);
    setIsSending(true);
    setSendProgress(0);
    setSendComplete(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setSendProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsSending(false);
        setSendComplete(true);

        const newCamp: NotificationCampaign = {
          id: `NT${Math.floor(1000 + Math.random() * 9000)}`,
          title: notifTitle,
          message: notifMessage,
          type: 'PRICE_DROP',
          audience: targetAudience,
          recipientCount: 126,
          deliveredCount: 121,
          failedCount: 5,
          status: 'COMPLETED',
          sentTime: 'Just Now',
          createdBy: 'Ashish Admin',
        };
        setCampaigns([newCamp, ...campaigns]);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Administration (Phase 26)</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Customer push notifications, demand price-drop alerts, schedule engine & delivery audit</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('create')}
            className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Notification (132)</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 131.1 NOTIFICATION KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL SENT</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">24,580</h3>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Push notifications sent</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DELIVERED</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">22,940</h3>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Successfully delivered</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DELIVERY RATE</span>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">93.3%</h3>
          <span className="text-[11px] font-bold text-blue-600 mt-1 block">High delivery accuracy</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FAILED TOKENS</span>
          <h3 className="text-2xl font-bold text-red-600 mt-1">1,640</h3>
          <span className="text-[11px] font-bold text-red-600 mt-1 block">Invalid or expired tokens</span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200 flex gap-6">
        {(['overview', 'create', 'scheduled', 'history', 'automatic'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab === 'overview' && 'Overview (131)'}
            {tab === 'create' && 'Create Campaign (132)'}
            {tab === 'scheduled' && 'Scheduled (134)'}
            {tab === 'history' && 'History & Delivery (135)'}
            {tab === 'automatic' && 'Automatic Rules (136)'}
          </button>
        ))}
      </div>

      {/* SCREEN 131: OVERVIEW & RECENT CAMPAIGNS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Notification Types Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Notification Category Distribution (131.2)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs font-bold">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-blue-600 text-[10px] block">BOOKING</span>
                <span className="text-lg font-extrabold text-blue-600">42%</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-purple-600 text-[10px] block">DEMAND / PRICE DROP</span>
                <span className="text-lg font-extrabold text-purple-600">25%</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 text-[10px] block">PAYMENT</span>
                <span className="text-lg font-extrabold text-emerald-700">14%</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-amber-700 text-[10px] block">REFERRAL</span>
                <span className="text-lg font-extrabold text-amber-700">9%</span>
              </div>
              <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                <span className="text-red-700 text-[10px] block">SUPPORT</span>
                <span className="text-lg font-extrabold text-red-700">6%</span>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-slate-600 text-[10px] block">MARKETING</span>
                <span className="text-lg font-extrabold text-slate-800">4%</span>
              </div>
            </div>
          </div>

          {/* Recent Campaigns Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Recent Notification Campaigns Log</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Audience</th>
                  <th className="py-3 px-4">Recipients</th>
                  <th className="py-3 px-4">Delivered</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.title}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">{c.audience}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.recipientCount}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">{c.deliveredCount}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          c.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedCampaignId(c.id);
                          setActiveTab('details');
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                      >
                        View Breakdown (135)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCREEN 132: CREATE NOTIFICATION FORM */}
      {activeTab === 'create' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Create Notification Campaign (132)</h2>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 text-xs font-semibold">
            <div>
              <label className="block mb-1.5 text-slate-700">Notification Category *</label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="PRICE_DROP">Demand / Price Drop Alert</option>
                <option value="BOOKING">Booking Status Update</option>
                <option value="SERVICE_REMINDER">Service Reminder</option>
                <option value="PROMOTIONAL">Promotional Announcement</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-slate-700">Notification Title * (40–60 chars)</label>
              <input
                type="text"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Message Body *</label>
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                required
              />

              {/* 132.3 Dynamic Variables Pills */}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-[10px] text-slate-400 font-bold block w-full">INSERT DYNAMIC VARIABLES (132.3):</span>
                {['{{user_name}}', '{{service_name}}', '{{society_name}}', '{{current_price}}', '{{next_price}}', '{{remaining_quantity}}'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer"
                  >
                    + {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-slate-700">Target Audience (132.4) *</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                >
                  <option value="ABC Residency (126 Users)">ABC Residency (126 Users)</option>
                  <option value="Green Meadows (150 Users)">Green Meadows (150 Users)</option>
                  <option value="AC Service Customers (842 Users)">AC Service Customers (842 Users)</option>
                  <option value="All Platform Users (12,450 Users)">All Platform Users (12,450 Users)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-700">CTA Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-slate-700">Delivery Timing *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timing"
                    checked={deliveryMode === 'NOW'}
                    onChange={() => setDeliveryMode('NOW')}
                    className="text-blue-600"
                  />
                  <span>Send Immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timing"
                    checked={deliveryMode === 'SCHEDULE'}
                    onChange={() => setDeliveryMode('SCHEDULE')}
                    className="text-blue-600"
                  />
                  <span>Schedule for Later</span>
                </label>
              </div>
            </div>

            {deliveryMode === 'SCHEDULE' && (
              <div>
                <label className="block mb-1 text-slate-700">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleStartSend}
              className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{deliveryMode === 'NOW' ? 'Preview & Send Notification (133)' : 'Save Schedule (134)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 134: SCHEDULED NOTIFICATIONS */}
      {activeTab === 'scheduled' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Scheduled Notification Queue (134)</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4">Scheduled Date/Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {campaigns
                .filter((c) => c.status === 'SCHEDULED')
                .map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.title}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">{c.audience}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-600">{c.scheduledTime}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        SCHEDULED
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer">
                        Edit / Cancel (134.2)
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 135: HISTORY & RECIPIENT AUDIT */}
      {activeTab === 'history' || activeTab === 'details' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Campaign Delivery Audit — {selectedCampaign.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl text-xs font-semibold">
              <div>Total Sent: <strong className="text-slate-900 font-extrabold">{selectedCampaign.recipientCount}</strong></div>
              <div>Delivered: <strong className="text-emerald-600 font-extrabold">{selectedCampaign.deliveredCount}</strong></div>
              <div>Failed: <strong className="text-red-600 font-extrabold">{selectedCampaign.failedCount}</strong></div>
              <div>Delivery Rate: <strong className="text-blue-600 font-extrabold">{((selectedCampaign.deliveredCount / selectedCampaign.recipientCount) * 100).toFixed(1)}%</strong></div>
            </div>

            {/* 135.3 Recipient Audit List */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Recipient Delivery Log (135.3)</h4>
              <div className="space-y-2 text-xs font-semibold">
                {sampleRecipients.map((r, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-900 font-bold">{r.userName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {r.status} {r.failureReason ? `(${r.failureReason})` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* SCREEN 136: AUTOMATIC SYSTEM NOTIFICATIONS MONITOR */}
      {activeTab === 'automatic' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Zap className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Automatic Backend Transactional Triggers (136)</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">System automatically dispatches transactional push alerts without requiring manual Admin creation.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-blue-600 font-bold uppercase text-[10px]">BOOKING ENGINE TRIGGERS</span>
              <p>• Booking Confirmed ("🔧 Your AC service is confirmed")</p>
              <p>• Service Reminder 24h ("⏰ Your AC service is scheduled tomorrow")</p>
              <p>• Service Started ("🚚 Technician arrived at address")</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-purple-600 font-bold uppercase text-[10px]">DEMAND & PRICING ENGINE TRIGGERS</span>
              <p>• Price Drop Alert ("🎉 ABC Residency reached Tier 20! Price dropped to ₹599")</p>
              <p>• Next Tier Target ("🔥 3 more ACs needed for ₹549 tier!")</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 133: SEND PROGRESS & CONFIRMATION MODAL */}
      {showSendModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Push Notification Delivery (133)</h3>
              {!isSending && (
                <button onClick={() => setShowSendModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <p>Title: <strong>{notifTitle}</strong></p>
              <p>Audience: <strong>{targetAudience}</strong></p>
            </div>

            {isSending ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Dispatching FCM Push Tokens...</span>
                  <span>{sendProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-[#1769E0] h-full transition-all duration-300" style={{ width: `${sendProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
                <h4 className="font-bold text-sm text-emerald-700">✓ NOTIFICATION DISPATCHED</h4>
                <p>126 Push notifications delivered to ABC Residency residents!</p>
              </div>
            )}

            {sendComplete && (
              <button
                type="button"
                onClick={() => {
                  setShowSendModal(false);
                  setActiveTab('history');
                }}
                className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                View Delivery Report (135)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
