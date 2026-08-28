import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Download,
  X,
  ShieldCheck
} from 'lucide-react';

export interface TransactionRecord {
  id: string;
  bookingId: string;
  customerName: string;
  mobile: string;
  paymentMethod: string;
  amount: number;
  basePrice: number;
  discount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  gatewayRef: string;
  date: string;
  failureReason?: string;
}

export interface RefundRecord {
  refundId: string;
  bookingId: string;
  customerName: string;
  amount: number;
  reason: string;
  paymentMethod: string;
  status: 'UNDER REVIEW' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  requestedDate: string;
}

export interface SettlementRecord {
  settlementId: string;
  vendorName: string;
  campaignId: string;
  serviceName: string;
  societyName: string;
  quantity: number;
  customerRate: number;
  customerCollection: number;
  vendorRate: number;
  vendorPayable: number;
  grossSpread: number;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'SETTLED';
  date: string;
}

export const PaymentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'failed' | 'refunds' | 'settlement' | 'reconciliation' | 'details'>('overview');
  const [selectedTxnId, setSelectedTxnId] = useState<string>('TXN1001');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Refund Approval Modal state (Screen 117)
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundRecord | null>(null);
  const [refundToast, setRefundToast] = useState(false);

  // Settlement Approval Modal state (Screen 118.5)
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementRecord | null>(null);
  const [settlementToast, setSettlementToast] = useState(false);

  // Sample Transactions Database
  const [transactions] = useState<TransactionRecord[]>([
    {
      id: 'TXN1001',
      bookingId: '#BK10245',
      customerName: 'Rahul Kumar',
      mobile: '+91 98765 43210',
      paymentMethod: 'UPI (Razorpay)',
      amount: 1198,
      basePrice: 1598,
      discount: 400,
      status: 'SUCCESS',
      gatewayRef: 'GATEWAY123456',
      date: 'Today, 11:22 AM',
    },
    {
      id: 'TXN1002',
      bookingId: '#BK10244',
      customerName: 'Priya Sharma',
      mobile: '+91 97654 32109',
      paymentMethod: 'Card (•••• 4821)',
      amount: 1299,
      basePrice: 1999,
      discount: 700,
      status: 'SUCCESS',
      gatewayRef: 'GATEWAY123457',
      date: 'Today, 11:00 AM',
    },
    {
      id: 'TXN1003',
      bookingId: '#BK10243',
      customerName: 'Arjun Nair',
      mobile: '+91 96543 21098',
      paymentMethod: 'UPI (Razorpay)',
      amount: 899,
      basePrice: 999,
      discount: 100,
      status: 'FAILED',
      failureReason: 'Gateway Timeout (Bank Response Error)',
      gatewayRef: 'GATEWAY123458',
      date: 'Today, 12:18 PM',
    },
    {
      id: 'TXN1004',
      bookingId: '#BK10242',
      customerName: 'Sneha Iyer',
      mobile: '+91 95432 10987',
      paymentMethod: 'UPI (Razorpay)',
      amount: 1398,
      basePrice: 1498,
      discount: 100,
      status: 'SUCCESS',
      gatewayRef: 'GATEWAY123459',
      date: '27 Aug 2026',
    },
  ]);

  // Sample Refunds Database (Screen 116)
  const [refunds, setRefunds] = useState<RefundRecord[]>([
    {
      refundId: 'RF1001',
      bookingId: '#BK10211',
      customerName: 'Rahul Kumar',
      amount: 1198,
      reason: 'Customer cancelled before scheduled service',
      paymentMethod: 'UPI (Razorpay)',
      status: 'UNDER REVIEW',
      requestedDate: '28 Aug 2026',
    },
    {
      refundId: 'RF1002',
      bookingId: '#BK10198',
      customerName: 'Priya Sharma',
      amount: 699,
      reason: 'Vendor capacity issue cancellation',
      paymentMethod: 'Card (•••• 4821)',
      status: 'PROCESSING',
      requestedDate: '25 Aug 2026',
    },
  ]);

  // Sample Vendor Settlements Database (Screen 118)
  const [settlements, setSettlements] = useState<SettlementRecord[]>([
    {
      settlementId: 'STL1001',
      vendorName: 'CoolCare Services Pvt Ltd',
      campaignId: 'CMP10245',
      serviceName: 'AC Servicing',
      societyName: 'ABC Residency',
      quantity: 27,
      customerRate: 599,
      customerCollection: 16173,
      vendorRate: 450,
      vendorPayable: 12150,
      grossSpread: 4023,
      status: 'PENDING',
      date: '30 Aug 2026',
    },
    {
      settlementId: 'STL1002',
      vendorName: 'FreshHome Experts',
      campaignId: 'CMP10238',
      serviceName: 'Full Home Cleaning',
      societyName: 'Green Meadows',
      quantity: 15,
      customerRate: 1299,
      customerCollection: 19485,
      vendorRate: 950,
      vendorPayable: 14250,
      grossSpread: 5235,
      status: 'PROCESSING',
      date: '29 Aug 2026',
    },
  ]);

  const selectedTxn = transactions.find((t) => t.id === selectedTxnId) || transactions[0];

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      searchQuery === '' ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveRefund = () => {
    if (!selectedRefund) return;
    setRefunds((prev) =>
      prev.map((r) => (r.refundId === selectedRefund.refundId ? { ...r, status: 'APPROVED' } : r))
    );
    setShowRefundModal(false);
    setRefundToast(true);
    setTimeout(() => setRefundToast(false), 2000);
  };

  const handleApproveSettlement = () => {
    if (!selectedSettlement) return;
    setSettlements((prev) =>
      prev.map((s) => (s.settlementId === selectedSettlement.settlementId ? { ...s, status: 'SETTLED' } : s))
    );
    setShowSettlementModal(false);
    setSettlementToast(true);
    setTimeout(() => setSettlementToast(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Administration (Phase 23)</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Real-time payment verification, transaction audit, refund approvals & vendor settlements</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer">
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Transactions (113)</span>
          </button>
        </div>
      </div>

      {refundToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>✓ Refund approved and initiated with payment gateway!</span>
        </div>
      )}

      {settlementToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>✓ Vendor settlement payout approved & transferred!</span>
        </div>
      )}

      {/* 112.1 PAYMENT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL REVENUE</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">₹8.42L</h3>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Total Payment Value</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SUCCESSFUL PAYMENTS</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">₹7.91L</h3>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Successfully Collected</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">REFUNDS</span>
          <h3 className="text-2xl font-bold text-purple-600 mt-1">₹28.4K</h3>
          <span className="text-[11px] font-bold text-purple-600 mt-1 block">Refunded / Processing</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SETTLEMENT PENDING</span>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">₹42.6K</h3>
          <span className="text-[11px] font-bold text-amber-600 mt-1 block">Vendor Settlement</span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200 flex gap-6">
        {(['overview', 'transactions', 'failed', 'refunds', 'settlement', 'reconciliation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab === 'overview' && 'Overview (112)'}
            {tab === 'transactions' && 'Transactions (113)'}
            {tab === 'failed' && 'Failed Payments (115)'}
            {tab === 'refunds' && 'Refund Requests (116)'}
            {tab === 'settlement' && 'Vendor Settlement (118)'}
            {tab === 'reconciliation' && 'Reconciliation (122)'}
          </button>
        ))}
      </div>

      {/* SCREEN 112: PAYMENT OVERVIEW & 113 TRANSACTIONS */}
      {(activeTab === 'overview' || activeTab === 'transactions') && (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transaction, booking, user..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
              >
                <option value="All">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>

          {/* 113 MASTER TRANSACTIONS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Platform Financial Transactions Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTxns.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{t.id}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{t.bookingId}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{t.customerName}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">{t.paymentMethod}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{t.amount}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            t.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{t.date}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedTxnId(t.id);
                            setActiveTab('details');
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                        >
                          View Details (114)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* SCREEN 114: TRANSACTION DETAILS & 114.1 TIMELINE */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setActiveTab('transactions')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Transaction Details — {selectedTxn.id}</h2>
              <p className="text-xs text-slate-500">Gateway reference, payment breakdown & verified transaction timeline</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-semibold">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">AMOUNT PAID</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-0.5">₹{selectedTxn.amount}</h3>
                <p className="text-slate-500 mt-1">Booking: <strong className="text-blue-600">{selectedTxn.bookingId}</strong> • Customer: <strong>{selectedTxn.customerName}</strong></p>
              </div>

              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                ✓ {selectedTxn.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
              <div>Gateway Reference: <strong className="font-mono text-slate-900 block mt-0.5">{selectedTxn.gatewayRef}</strong></div>
              <div>Payment Method: <strong className="text-slate-900 block mt-0.5">{selectedTxn.paymentMethod}</strong></div>
              <div>Date & Time: <strong className="font-mono text-slate-900 block mt-0.5">{selectedTxn.date}</strong></div>
            </div>

            {/* 114.1 Payment Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Verified Payment Gateway Timeline (114.1)</h4>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 className="w-4 h-4" /> Initiated</div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 className="w-4 h-4" /> Gateway Processing</div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 className="w-4 h-4" /> Payment Successful</div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className="flex items-center gap-1.5 text-blue-600"><CheckCircle2 className="w-4 h-4" /> Booking Confirmed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 115: FAILED PAYMENTS MONITOR */}
      {activeTab === 'failed' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-base font-bold text-slate-900">Failed Payment Attempts Monitor (115)</h3>
          </div>
          <p className="text-xs text-slate-500">
            <strong>Rule:</strong> Admin cannot manually mark failed payments as successful without verified backend gateway confirmation.
          </p>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Transaction</th>
                <th className="py-3 px-4">Booking</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Failure Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transactions
                .filter((t) => t.status === 'FAILED')
                .map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{t.id}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{t.bookingId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.customerName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{t.amount}</td>
                    <td className="py-3.5 px-4 font-bold text-red-600">{t.failureReason}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 116 & 117: REFUND REQUESTS & APPROVAL MODAL */}
      {activeTab === 'refunds' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Customer Refund Requests (116)</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Refund ID</th>
                <th className="py-3 px-4">Booking</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {refunds.map((r) => (
                <tr key={r.refundId} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{r.refundId}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{r.bookingId}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{r.customerName}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{r.amount}</td>
                  <td className="py-3.5 px-4 text-slate-600">{r.reason}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        r.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {r.status === 'UNDER REVIEW' && (
                      <button
                        onClick={() => {
                          setSelectedRefund(r);
                          setShowRefundModal(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm"
                      >
                        Approve Refund (117)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 118: VENDOR SETTLEMENT */}
      {activeTab === 'settlement' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Vendor Settlement Payouts (118)</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Campaign</th>
                  <th className="py-3 px-4">Customer Collection</th>
                  <th className="py-3 px-4">Vendor Payable</th>
                  <th className="py-3 px-4">Gross Margin Spread</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {settlements.map((s) => (
                  <tr key={s.settlementId} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.vendorName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{s.campaignId} ({s.quantity} units)</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">₹{s.customerCollection.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{s.vendorPayable.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{s.grossSpread.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          s.status === 'SETTLED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {s.status === 'PENDING' && (
                        <button
                          onClick={() => {
                            setSelectedSettlement(s);
                            setShowSettlementModal(true);
                          }}
                          className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm"
                        >
                          Process Settlement (118.5)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCREEN 122: RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-900">Payment Gateway Reconciliation (122)</h3>
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-900 font-bold text-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold">✓ PAYMENT RECONCILED</h4>
                <p className="text-emerald-700 font-medium">Platform Records (₹8,42,000) === Gateway Records (₹8,42,000) • Zero Mismatch</p>
              </div>
            </div>
            <button className="bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer">
              Run Auto-Reconciliation
            </button>
          </div>
        </div>
      )}

      {/* 117 REFUND APPROVAL MODAL */}
      {showRefundModal && selectedRefund && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Approve Refund (117)</h3>
              <button onClick={() => setShowRefundModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <p>Refund ID: <strong>{selectedRefund.refundId}</strong></p>
              <p>Booking: <strong>{selectedRefund.bookingId}</strong> ({selectedRefund.customerName})</p>
              <p>Amount to Refund: <strong className="text-emerald-700 font-extrabold">₹{selectedRefund.amount}</strong></p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowRefundModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApproveRefund}
                className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Approve Refund (117)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 118.5 SETTLEMENT APPROVAL MODAL */}
      {showSettlementModal && selectedSettlement && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Approve Settlement (118.5)</h3>
              <button onClick={() => setShowSettlementModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <p>Vendor: <strong>{selectedSettlement.vendorName}</strong></p>
              <p>Campaign: <strong>{selectedSettlement.campaignId}</strong> ({selectedSettlement.quantity} units)</p>
              <p>Vendor Payable: <strong className="text-slate-900 font-extrabold">₹{selectedSettlement.vendorPayable.toLocaleString('en-IN')}</strong></p>
              <p>Platform Gross Spread: <strong className="text-emerald-700 font-extrabold">₹{selectedSettlement.grossSpread.toLocaleString('en-IN')}</strong></p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowSettlementModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApproveSettlement}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Approve Settlement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
