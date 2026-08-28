import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  ArrowLeft,
  CheckCircle2,
  X
} from 'lucide-react';

export interface DemandOpportunityRecord {
  id: string;
  campaignId: string;
  serviceName: string;
  societyName: string;
  city: string;
  userCount: number;
  quantity: number;
  unitLabel: string;
  currentPrice: number;
  currentTierLabel: string;
  nextPrice: number;
  nextTierLabel: string;
  targetQuantity: number;
  status: 'BUILDING' | 'NEAR TIER' | 'TARGET REACHED' | 'ADMIN PROCESSING' | 'VENDOR ASSIGNED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
  assignedVendor?: string;
  serviceDate: string;
  timeSlot: string;
  individualBookings: { bookingId: string; customerName: string; flat: string; qty: number; date: string; status: string }[];
}

export const DemandManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'by_society' | 'by_service' | 'details' | 'campaign'>('dashboard');
  const [selectedDemandId, setSelectedDemandId] = useState<string>('DEM1001');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Assign Vendor Modal state
  const [showAssignVendorModal, setShowAssignVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('CoolCare Services Pvt Ltd');
  const [assignedSuccessToast, setAssignedSuccessToast] = useState(false);

  // Sample Demand Opportunities Master Data
  const [demands, setDemands] = useState<DemandOpportunityRecord[]>([
    {
      id: 'DEM1001',
      campaignId: 'CMP10245',
      serviceName: 'AC Servicing',
      societyName: 'ABC Residency',
      city: 'Salem',
      userCount: 18,
      quantity: 27,
      unitLabel: 'ACs',
      currentPrice: 599,
      currentTierLabel: '20–39',
      nextPrice: 549,
      nextTierLabel: '40–59',
      targetQuantity: 40,
      status: 'NEAR TIER',
      priority: 'HIGH',
      serviceDate: 'Sunday, 30 Aug 2026',
      timeSlot: '09:00 AM - 12:00 PM',
      individualBookings: [
        { bookingId: '#BK10245', customerName: 'Rahul Kumar', flat: 'A-402', qty: 2, date: '30 Aug', status: 'Confirmed' },
        { bookingId: '#BK10242', customerName: 'Priya Sharma', flat: 'B-201', qty: 1, date: '30 Aug', status: 'Confirmed' },
        { bookingId: '#BK10238', customerName: 'Arjun Nair', flat: 'A-105', qty: 2, date: '30 Aug', status: 'Confirmed' },
        { bookingId: '#BK10231', customerName: 'Sneha Iyer', flat: 'C-302', qty: 1, date: '30 Aug', status: 'Confirmed' },
        { bookingId: '#BK10221', customerName: 'Vikram Singh', flat: 'B-104', qty: 3, date: '30 Aug', status: 'Confirmed' },
      ],
    },
    {
      id: 'DEM1002',
      campaignId: 'CMP10246',
      serviceName: 'Pest Control',
      societyName: 'Green Meadows',
      city: 'Chennai',
      userCount: 14,
      quantity: 18,
      unitLabel: 'Homes',
      currentPrice: 799,
      currentTierLabel: '10–19',
      nextPrice: 699,
      nextTierLabel: '20–29',
      targetQuantity: 20,
      status: 'TARGET REACHED',
      priority: 'HIGH',
      serviceDate: 'Saturday, 29 Aug 2026',
      timeSlot: '12:00 PM - 03:00 PM',
      individualBookings: [
        { bookingId: '#BK10210', customerName: 'Deepa V.', flat: 'D-301', qty: 1, date: '29 Aug', status: 'Confirmed' },
        { bookingId: '#BK10205', customerName: 'Manoj Kumar', flat: 'B-102', qty: 1, date: '29 Aug', status: 'Confirmed' },
      ],
    },
    {
      id: 'DEM1003',
      campaignId: 'CMP10247',
      serviceName: 'RO Service',
      societyName: 'Skyline Apartments',
      city: 'Salem',
      userCount: 12,
      quantity: 12,
      unitLabel: 'Units',
      currentPrice: 699,
      currentTierLabel: '10–19',
      nextPrice: 649,
      nextTierLabel: '20–29',
      targetQuantity: 15,
      status: 'BUILDING',
      priority: 'NORMAL',
      serviceDate: 'Monday, 31 Aug 2026',
      timeSlot: '09:00 AM - 12:00 PM',
      individualBookings: [
        { bookingId: '#BK10190', customerName: 'Ramesh K.', flat: 'A-201', qty: 1, date: '31 Aug', status: 'Confirmed' },
      ],
    },
    {
      id: 'DEM1004',
      campaignId: 'CMP10248',
      serviceName: 'Home Cleaning',
      societyName: 'Sunshine Enclave',
      city: 'Salem',
      userCount: 9,
      quantity: 15,
      unitLabel: 'Homes',
      currentPrice: 1299,
      currentTierLabel: '10–19',
      nextPrice: 1199,
      nextTierLabel: '20–29',
      targetQuantity: 20,
      status: 'NEAR TIER',
      priority: 'MEDIUM',
      serviceDate: 'Sunday, 30 Aug 2026',
      timeSlot: '01:00 PM - 05:00 PM',
      individualBookings: [
        { bookingId: '#BK10182', customerName: 'Anita Roy', flat: 'V-04', qty: 1, date: '30 Aug', status: 'Confirmed' },
      ],
    },
  ]);

  const selectedDemand = demands.find((d) => d.id === selectedDemandId) || demands[0];

  const filteredDemands = demands.filter((d) => {
    const matchesSearch =
      searchQuery === '' ||
      d.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.societyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAssignVendorSubmit = () => {
    setDemands((prev) =>
      prev.map((d) => {
        if (d.id === selectedDemand.id) {
          return {
            ...d,
            status: 'VENDOR ASSIGNED',
            assignedVendor: selectedVendor,
          };
        }
        return d;
      })
    );
    setShowAssignVendorModal(false);
    setAssignedSuccessToast(true);
    setTimeout(() => setAssignedSuccessToast(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* HEADER & TOP NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Demand Management</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Monitor automatic demand aggregation across societies & coordinate vendor fulfillment</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Demand Dashboard (88)
            </button>
            <button
              onClick={() => setActiveTab('by_society')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'by_society' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              By Society (89)
            </button>
            <button
              onClick={() => setActiveTab('by_service')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'by_service' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              By Service (90)
            </button>
          </div>
        </div>
      </div>

      {assignedSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>✓ Vendor {selectedVendor} assigned successfully for {selectedDemand.serviceName} at {selectedDemand.societyName}!</span>
        </div>
      )}

      {/* SCREEN 88: DEMAND DASHBOARD */}
      {activeTab === 'dashboard' && (
        <>
          {/* 88.1 DEMAND KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE DEMAND</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">128</h3>
              <span className="text-[11px] font-bold text-blue-600 mt-1 block">Active Opportunities</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NEAR TIER</span>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">38</h3>
              <span className="text-[11px] font-bold text-amber-600 mt-1 block">Close to Next Pricing Tier</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TARGET REACHED</span>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">24</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Ready for Admin Processing</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BUILDING DEMAND</span>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">66</h3>
              <span className="text-[11px] font-bold text-purple-600 mt-1 block">Demand Still Aggregating</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search demand by service or society..."
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
                <option value="NEAR TIER">Near Tier</option>
                <option value="TARGET REACHED">Target Reached</option>
                <option value="BUILDING">Building</option>
                <option value="VENDOR ASSIGNED">Vendor Assigned</option>
              </select>

              <button
                onClick={() => setShowFilterDrawer(true)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Filter className="w-4 h-4 text-slate-500" />
                <span>Filters (93)</span>
              </button>
            </div>
          </div>

          {/* Active Demand Opportunities Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Active Demand Opportunities Master Table</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Society / Area</th>
                    <th className="py-3.5 px-4">Users</th>
                    <th className="py-3.5 px-4">Quantity</th>
                    <th className="py-3.5 px-4">Current Price</th>
                    <th className="py-3.5 px-4">Next Tier Opportunity</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDemands.map((dem) => (
                    <tr key={dem.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{dem.serviceName}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">{dem.societyName} ({dem.city})</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{dem.userCount} Users</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">{dem.quantity} {dem.unitLabel}</td>
                      <td className="py-3.5 px-4 font-extrabold text-blue-600">₹{dem.currentPrice}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {dem.nextTierLabel} → ₹{dem.nextPrice} ({dem.targetQuantity - dem.quantity} needed)
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            dem.status === 'TARGET REACHED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : dem.status === 'NEAR TIER'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : dem.status === 'VENDOR ASSIGNED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {dem.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedDemandId(dem.id);
                            setActiveTab('details');
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg transition-all text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details (91)</span>
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

      {/* SCREEN 89: DEMAND BY SOCIETY */}
      {activeTab === 'by_society' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Demand by Society (89)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'ABC Residency', city: 'Salem', users: 18, qty: 27, opps: 4, top: 'AC Servicing', val: '₹18,420' },
              { name: 'Green Meadows', city: 'Chennai', users: 14, qty: 22, opps: 3, top: 'Pest Control', val: '₹12,840' },
              { name: 'Skyline Apartments', city: 'Salem', users: 12, qty: 18, opps: 3, top: 'RO Service', val: '₹10,620' },
            ].map((soc, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{soc.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{soc.city}</p>
                  </div>
                  <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded text-[10px]">
                    🔥 {soc.opps} Opportunities
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold p-3 bg-slate-50 rounded-xl">
                  <div>👥 {soc.users} Residents</div>
                  <div>📦 {soc.qty} Service Units</div>
                </div>

                <div className="text-xs">
                  <span className="text-slate-400 block font-medium">Top Aggregated Demand:</span>
                  <span className="font-bold text-blue-600">{soc.top}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 90: DEMAND BY SERVICE */}
      {activeTab === 'by_service' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Demand by Service (90)</h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">🔥 Top Service Demand Ranking</h3>
            <div className="space-y-3 text-xs font-semibold">
              {[
                { rank: '01', service: 'AC Servicing', qty: '126 Units', societies: '18 Societies', pct: '95%' },
                { rank: '02', service: 'Pest Control', qty: '67 Units', societies: '12 Societies', pct: '70%' },
                { rank: '03', service: 'RO Service', qty: '54 Units', societies: '9 Societies', pct: '55%' },
                { rank: '04', service: 'Car Wash', qty: '92 Units', societies: '11 Societies', pct: '45%' },
                { rank: '05', service: 'Home Cleaning', qty: '48 Units', societies: '8 Societies', pct: '35%' },
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-4">
                  <span className="font-mono font-bold text-slate-400 w-6">{item.rank}</span>
                  <span className="font-bold text-slate-900 w-32">{item.service}</span>
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div style={{ width: item.pct }} className="bg-blue-600 h-full rounded-full"></div>
                  </div>
                  <span className="font-bold text-blue-600">{item.qty}</span>
                  <span className="text-slate-400 font-medium">{item.societies}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 91: DEMAND DETAILS & 91.3 BOOKING CONTRIBUTORS */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setActiveTab('dashboard')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{selectedDemand.serviceName} — {selectedDemand.societyName}</h2>
              <p className="text-xs text-slate-500">Society Demand Opportunity Details & Contributor Bookings List</p>
            </div>
          </div>

          {/* 91.1 DEMAND SUMMARY KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">CONTRIBUTING USERS</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedDemand.userCount} Residents</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">TOTAL QUANTITY</span>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">{selectedDemand.quantity} {selectedDemand.unitLabel}</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">CURRENT PRICE</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{selectedDemand.currentPrice} / {selectedDemand.unitLabel}</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">NEXT TIER PRICE</span>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">₹{selectedDemand.nextPrice} / {selectedDemand.unitLabel}</h3>
            </div>
          </div>

          {/* 91.2 DEMAND PROGRESS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Demand Target Progress</h3>
              <span className="text-xs font-bold text-emerald-600">
                {selectedDemand.targetQuantity - selectedDemand.quantity} more {selectedDemand.unitLabel} required for ₹{selectedDemand.nextPrice} Tier
              </span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.round((selectedDemand.quantity / selectedDemand.targetQuantity) * 100))}%` }}
                className="bg-emerald-500 h-full rounded-full"
              ></div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <button
                onClick={() => setShowAssignVendorModal(true)}
                className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md cursor-pointer"
              >
                [ ASSIGN VENDOR ] (92.3)
              </button>
            </div>
          </div>

          {/* 91.3 INDIVIDUAL BOOKING CONTRIBUTORS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Individual Customer Bookings List</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Flat No</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {selectedDemand.individualBookings.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{b.bookingId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.customerName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.flat}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.qty} {selectedDemand.unitLabel}</td>
                    <td className="py-3.5 px-4 text-slate-500">{b.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCREEN 92.3 ASSIGN VENDOR MODAL */}
      {showAssignVendorModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Assign Vendor (92.3)</h3>
              <button onClick={() => setShowAssignVendorModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <p>Service: <strong>{selectedDemand.serviceName}</strong></p>
              <p>Society: <strong>{selectedDemand.societyName}</strong> ({selectedDemand.quantity} {selectedDemand.unitLabel})</p>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Select Vendor *</label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="CoolCare Services Pvt Ltd">CoolCare Services Pvt Ltd (Rating 4.9★)</option>
                <option value="Urban Tech Solutions">Urban Tech Solutions (Rating 4.8★)</option>
                <option value="CleanMax Pro">CleanMax Pro (Rating 4.7★)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-700">Vendor Capacity</label>
                <input type="text" value="35 ACs/day" readOnly className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-bold" />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">Time Slot</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold">
                  <option>09:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 03:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAssignVendorModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignVendorSubmit}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Assign Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 93 DEMAND FILTERS DRAWER */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Demand Filters (93)</h3>
                <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-2">Demand Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option value="All">All Statuses</option>
                    <option value="NEAR TIER">Near Tier</option>
                    <option value="TARGET REACHED">Target Reached</option>
                    <option value="BUILDING">Building</option>
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
