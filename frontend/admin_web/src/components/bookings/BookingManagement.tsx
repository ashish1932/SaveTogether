import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  ArrowLeft,
  CheckCircle2,
  Download,
  X
} from 'lucide-react';

export interface BookingRecord {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  societyName: string;
  flatNo: string;
  city: string;
  serviceName: string;
  quantity: number;
  unitLabel: string;
  basePrice: number;
  appliedUnitPrice: number;
  totalAmount: number;
  savingsTotal: number;
  bookingDate: string;
  serviceDate: string;
  timeSlot: string;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  assignedVendor?: string;
  vendorCost?: number;
  demandQuantity: number;
  demandTierLabel: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'DEMAND_AGGREGATING'
    | 'ADMIN_PROCESSING'
    | 'VENDOR_ASSIGNED'
    | 'SCHEDULED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'REFUND_PENDING'
    | 'REFUNDED';
  cancellationReason?: string;
  timeline: { step: string; timestamp: string; done: boolean; current?: boolean }[];
}

export const BookingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed' | 'cancelled' | 'details'>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('BK10245');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Status Update Modal state (Screen 111)
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('IN_PROGRESS');
  const [statusNotes, setStatusNotes] = useState('Technician arrived at customer address.');
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [showStatusToast, setShowStatusToast] = useState(false);

  // Sample Bookings Master Database
  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: '#BK10245',
      customerName: 'Rahul Kumar',
      mobile: '+91 98765 43210',
      email: 'rahul.k@gmail.com',
      societyName: 'ABC Residency',
      flatNo: 'A-402',
      city: 'Salem',
      serviceName: 'AC General Service',
      quantity: 2,
      unitLabel: 'ACs',
      basePrice: 799,
      appliedUnitPrice: 599,
      totalAmount: 1198,
      savingsTotal: 400,
      bookingDate: '26 Aug 2026',
      serviceDate: 'Sunday, 30 Aug 2026',
      timeSlot: '09:00 AM - 12:00 PM',
      paymentStatus: 'Paid',
      assignedVendor: 'CoolCare Services Pvt Ltd',
      vendorCost: 450,
      demandQuantity: 27,
      demandTierLabel: '20–39 Units',
      status: 'SCHEDULED',
      timeline: [
        { step: 'Booking Created', timestamp: '26 Aug, 10:15 AM', done: true },
        { step: 'Payment Confirmed', timestamp: '26 Aug, 10:16 AM', done: true },
        { step: 'Demand Aggregated (27 ACs)', timestamp: '27 Aug, 02:00 PM', done: true },
        { step: 'Vendor Assigned (CoolCare)', timestamp: '28 Aug, 11:35 AM', done: true },
        { step: 'Service Scheduled', timestamp: '28 Aug, 11:40 AM', done: true, current: true },
        { step: 'Service In Progress', timestamp: 'Pending', done: false },
        { step: 'Completed & Reviewed', timestamp: 'Pending', done: false },
      ],
    },
    {
      id: '#BK10244',
      customerName: 'Priya Sharma',
      mobile: '+91 97654 32109',
      email: 'priya.s@gmail.com',
      societyName: 'Green Meadows',
      flatNo: 'B-201',
      city: 'Chennai',
      serviceName: 'Full Home Deep Cleaning',
      quantity: 1,
      unitLabel: 'Home',
      basePrice: 1999,
      appliedUnitPrice: 1299,
      totalAmount: 1299,
      savingsTotal: 700,
      bookingDate: '27 Aug 2026',
      serviceDate: 'Sunday, 30 Aug 2026',
      timeSlot: '01:00 PM - 05:00 PM',
      paymentStatus: 'Paid',
      assignedVendor: 'CleanPro Services',
      vendorCost: 950,
      demandQuantity: 15,
      demandTierLabel: '10–19 Homes',
      status: 'CONFIRMED',
      timeline: [
        { step: 'Booking Created', timestamp: '27 Aug, 11:00 AM', done: true },
        { step: 'Payment Confirmed', timestamp: '27 Aug, 11:01 AM', done: true },
        { step: 'Service Scheduled', timestamp: 'Pending', done: false },
      ],
    },
    {
      id: '#BK10243',
      customerName: 'Arjun Nair',
      mobile: '+91 96543 21098',
      email: 'arjun.n@gmail.com',
      societyName: 'ABC Residency',
      flatNo: 'A-105',
      city: 'Salem',
      serviceName: 'Full Home Pest Control',
      quantity: 1,
      unitLabel: 'Home',
      basePrice: 999,
      appliedUnitPrice: 899,
      totalAmount: 899,
      savingsTotal: 100,
      bookingDate: '27 Aug 2026',
      serviceDate: 'Monday, 31 Aug 2026',
      timeSlot: '10:00 AM - 01:00 PM',
      paymentStatus: 'Paid',
      demandQuantity: 18,
      demandTierLabel: '10–19 Homes',
      status: 'ADMIN_PROCESSING',
      timeline: [
        { step: 'Booking Created', timestamp: '27 Aug, 03:20 PM', done: true },
        { step: 'Payment Confirmed', timestamp: '27 Aug, 03:21 PM', done: true },
      ],
    },
    {
      id: '#BK10242',
      customerName: 'Sneha Iyer',
      mobile: '+91 95432 10987',
      email: 'sneha.i@gmail.com',
      societyName: 'Skyline Apartments',
      flatNo: 'C-302',
      city: 'Salem',
      serviceName: 'RO Water Purifier Service',
      quantity: 2,
      unitLabel: 'Units',
      basePrice: 749,
      appliedUnitPrice: 699,
      totalAmount: 1398,
      savingsTotal: 100,
      bookingDate: '24 Aug 2026',
      serviceDate: 'Thursday, 27 Aug 2026',
      timeSlot: '02:00 PM - 04:00 PM',
      paymentStatus: 'Paid',
      assignedVendor: 'AquaFix Solutions',
      vendorCost: 500,
      demandQuantity: 12,
      demandTierLabel: '10–19 Units',
      status: 'COMPLETED',
      timeline: [
        { step: 'Booking Created', timestamp: '24 Aug, 09:00 AM', done: true },
        { step: 'Payment Confirmed', timestamp: '24 Aug, 09:01 AM', done: true },
        { step: 'Completed & Reviewed', timestamp: '27 Aug, 04:30 PM', done: true },
      ],
    },
    {
      id: '#BK10211',
      customerName: 'Vikram Singh',
      mobile: '+91 94321 09876',
      email: 'vikram.s@gmail.com',
      societyName: 'ABC Residency',
      flatNo: 'B-104',
      city: 'Salem',
      serviceName: 'AC General Service',
      quantity: 1,
      unitLabel: 'AC',
      basePrice: 799,
      appliedUnitPrice: 599,
      totalAmount: 599,
      savingsTotal: 200,
      bookingDate: '22 Aug 2026',
      serviceDate: 'Sunday, 30 Aug 2026',
      timeSlot: '09:00 AM - 12:00 PM',
      paymentStatus: 'Refunded',
      demandQuantity: 27,
      demandTierLabel: '20–39 Units',
      status: 'CANCELLED',
      cancellationReason: 'Customer Change of Plans',
      timeline: [
        { step: 'Booking Created', timestamp: '22 Aug, 02:00 PM', done: true },
        { step: 'Cancelled by Customer', timestamp: '23 Aug, 10:00 AM', done: true },
        { step: 'Refund Processed', timestamp: '23 Aug, 10:15 AM', done: true },
      ],
    },
  ]);

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      searchQuery === '' ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.societyName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'pending') return matchesSearch && (b.status === 'PENDING' || b.status === 'ADMIN_PROCESSING');
    if (activeTab === 'active') return matchesSearch && (b.status === 'CONFIRMED' || b.status === 'VENDOR_ASSIGNED' || b.status === 'SCHEDULED' || b.status === 'IN_PROGRESS');
    if (activeTab === 'completed') return matchesSearch && b.status === 'COMPLETED';
    if (activeTab === 'cancelled') return matchesSearch && (b.status === 'CANCELLED' || b.status === 'REFUNDED');

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatusSubmit = () => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === selectedBooking.id) {
          return {
            ...b,
            status: newStatus as any,
          };
        }
        return b;
      })
    );
    setShowStatusModal(false);
    setShowStatusToast(true);
    setTimeout(() => setShowStatusToast(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* MODULE HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Booking Administration</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Monitor individual customer bookings, demand links, vendor assignments & lifecycle status</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer">
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV (113)</span>
          </button>
        </div>
      </div>

      {showStatusToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>✓ Booking {selectedBooking.id} status updated to {newStatus}! {notifyCustomer && '(Customer notified)'}</span>
        </div>
      )}

      {/* SCREEN 105: ALL BOOKINGS DASHBOARD */}
      {activeTab !== 'details' && (
        <>
          {/* 105.1 BOOKING KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL BOOKINGS</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1,284</h3>
              <span className="text-[11px] font-bold text-slate-500 mt-1 block">Platform lifetime bookings</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PENDING REVIEW</span>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">184</h3>
              <span className="text-[11px] font-bold text-amber-600 mt-1 block">Requires Admin action</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE IN PROGRESS</span>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">946</h3>
              <span className="text-[11px] font-bold text-blue-600 mt-1 block">Scheduled or in progress</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">COMPLETED</span>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">154</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Successfully fulfilled</span>
            </div>
          </div>

          {/* TAB CATEGORIES (105-109) */}
          <div className="border-b border-slate-200 flex gap-6">
            {(['all', 'pending', 'active', 'completed', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'all' && 'All Bookings (105)'}
                {tab === 'pending' && 'Pending (106)'}
                {tab === 'active' && 'Active (107)'}
                {tab === 'completed' && 'Completed (108)'}
                {tab === 'cancelled' && 'Cancelled (109)'}
              </button>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Booking ID, customer, service..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              >
                <option value="All">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="ADMIN_PROCESSING">Admin Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <button
                onClick={() => setShowFilterDrawer(true)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Filter className="w-4 h-4 text-slate-500" />
                <span>Filters (105.4)</span>
              </button>
            </div>
          </div>

          {/* 105.2 MASTER BOOKING TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Society</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Qty</th>
                    <th className="py-3.5 px-4">Service Date</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Assigned Vendor</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{b.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{b.customerName}</td>
                      <td className="py-3.5 px-4 text-slate-700">{b.societyName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{b.serviceName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{b.quantity} {b.unitLabel}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{b.serviceDate}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                          {b.paymentStatus} (₹{b.totalAmount})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {b.assignedVendor || '— (Vendor Pending)'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            b.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.status === 'SCHEDULED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : b.status === 'CANCELLED'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBookingId(b.id);
                            setActiveTab('details');
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg transition-all text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details (110)</span>
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

      {/* SCREEN 110: BOOKING DETAILS & TIMELINE */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('all')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Booking Details — {selectedBooking.id}</h2>
                <p className="text-xs text-slate-500">Individual Customer Booking Operational Lifecycle & Financial Breakdown</p>
              </div>
            </div>

            <button
              onClick={() => setShowStatusModal(true)}
              className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              <span>Update Status (111)</span>
            </button>
          </div>

          {/* 110 KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">CUSTOMER</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{selectedBooking.customerName}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{selectedBooking.mobile}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">SOCIETY & LOCATION</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{selectedBooking.societyName}</h3>
              <p className="text-[11px] text-slate-500 font-medium">Flat {selectedBooking.flatNo}, {selectedBooking.city}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">SERVICE DATE & SLOT</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{selectedBooking.serviceDate}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{selectedBooking.timeSlot}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">PAYMENT PAID</span>
              <h3 className="text-base font-bold text-emerald-600 mt-1">₹{selectedBooking.totalAmount} Paid</h3>
              <p className="text-[11px] text-emerald-700 font-bold">Saved ₹{selectedBooking.savingsTotal} via bulk tier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 110F VERTICAL BOOKING TIMELINE */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Booking Operational Timeline (110F)</h3>
              <div className="space-y-4 text-xs font-semibold">
                {selectedBooking.timeline.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${
                        t.done ? 'bg-emerald-600' : t.current ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {t.done ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 className={`font-bold ${t.done || t.current ? 'text-slate-900' : 'text-slate-400'}`}>{t.step}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{t.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 110.2 PRICING BREAKDOWN & DEMAND RELATIONSHIP */}
            <div className="lg:col-span-2 space-y-6">
              {/* 110.2 Pricing Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Pricing Breakdown & Customer Savings (110.2)</h3>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Catalog Price:</span>
                    <span className="text-slate-900 font-bold">₹{selectedBooking.basePrice} × {selectedBooking.quantity} {selectedBooking.unitLabel} = ₹{selectedBooking.basePrice * selectedBooking.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applied Aggregated Bulk Tier Price:</span>
                    <span className="text-blue-600 font-bold">₹{selectedBooking.appliedUnitPrice} × {selectedBooking.quantity} {selectedBooking.unitLabel} = ₹{selectedBooking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 border-t border-slate-200 pt-2 font-bold">
                    <span>Customer Total Savings via Bulk Tier:</span>
                    <span>₹{selectedBooking.savingsTotal} Saved</span>
                  </div>
                </div>
              </div>

              {/* 110.3 Demand & 110.4 Vendor Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 text-xs font-semibold">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">LINKED DEMAND POOL (110.3)</span>
                  <h4 className="text-sm font-bold text-slate-900">{selectedBooking.societyName} — {selectedBooking.serviceName}</h4>
                  <p className="text-slate-600">Current Aggregated Demand: <strong>{selectedBooking.demandQuantity} ACs</strong></p>
                  <p className="text-blue-600">Applied Tier: <strong>{selectedBooking.demandTierLabel} (₹{selectedBooking.appliedUnitPrice}/unit)</strong></p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 text-xs font-semibold">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">ASSIGNED VENDOR (110.4)</span>
                  <h4 className="text-sm font-bold text-slate-900">{selectedBooking.assignedVendor || 'Pending Vendor Assignment'}</h4>
                  <p className="text-slate-600">Vendor Cost Price: <strong>₹{selectedBooking.vendorCost || 450} / unit</strong></p>
                  <p className="text-emerald-600">Vendor Rating: <strong>4.8★</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 111: BOOKING STATUS UPDATE MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Update Booking Status (111)</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <p>Booking: <strong>{selectedBooking.id}</strong> ({selectedBooking.customerName})</p>
              <p>Current Status: <strong>{selectedBooking.status}</strong></p>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">New Operational Status *</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="VENDOR_ASSIGNED">VENDOR_ASSIGNED</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Service Started)</option>
                <option value="COMPLETED">COMPLETED (Service Finished)</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Admin Operational Notes</label>
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 rounded-xl text-slate-700">
              <input
                type="checkbox"
                checked={notifyCustomer}
                onChange={(e) => setNotifyCustomer(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Send push notification to customer (Phase 8 integration)</span>
            </label>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatusSubmit}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Update Status (111)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 105.4 BOOKING FILTERS DRAWER */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Booking Filters (105.4)</h3>
                <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-2">Booking Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  >
                    <option value="All">All Statuses</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setShowFilterDrawer(false);
                }}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
