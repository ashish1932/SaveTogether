import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  ChevronRight,
  Eye,
  Edit,
  MapPin,
  Flame,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';

export interface SocietyRecord {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  pinCode: string;
  users: number;
  activeDemand: number;
  bookings: number;
  revenue: string;
  status: 'Active' | 'Pending' | 'Inactive';
  totalUnits: number;
  addressLine: string;
  createdOn: string;
}

export interface SocietyDemandRecord {
  id: string;
  serviceName: string;
  customerCount: number;
  quantity: number;
  currentPrice: number;
  nextPrice: number;
  targetQuantity: number;
  unitLabel: string;
  status: 'BUILDING' | 'NEAR TARGET' | 'TARGET REACHED' | 'VENDOR ASSIGNED' | 'SCHEDULED' | 'COMPLETED';
  potentialSavingsPerUnit: number;
  potentialDemandValue: number;
  assignedVendor?: string;
  individualBookings: { customerName: string; flat: string; qty: number }[];
}

export const SocietyManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'add'>('list');
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('SOC1001');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'demand' | 'bookings' | 'analytics'>('overview');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');

  // Add Society Form state
  const [newSocietyName, setNewSocietyName] = useState('');
  const [newCity, setNewCity] = useState('Salem');
  const [newPin, setNewPin] = useState('636001');
  const [newAddress, setNewAddress] = useState('');
  const [newUnits, setNewUnits] = useState('300');
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [showCreatedToast, setShowCreatedToast] = useState(false);

  // Vendor Assignment Modal State
  const [selectedDemand, setSelectedDemand] = useState<SocietyDemandRecord | null>(null);
  const [vendorName, setVendorName] = useState('CoolCare Services Pvt Ltd');

  // Sample Societies
  const [societies] = useState<SocietyRecord[]>([
    {
      id: 'SOC1001',
      name: 'ABC Residency',
      type: 'Apartment / Residential',
      city: 'Salem',
      state: 'Tamil Nadu',
      pinCode: '636001',
      users: 248,
      activeDemand: 38,
      bookings: 542,
      revenue: '₹2.84L',
      status: 'Active',
      totalUnits: 320,
      addressLine: 'Main Road, Block A-D, Salem',
      createdOn: '20 Aug 2026',
    },
    {
      id: 'SOC1002',
      name: 'Green Meadows',
      type: 'Residential Gated Community',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pinCode: '600001',
      users: 184,
      activeDemand: 24,
      bookings: 380,
      revenue: '₹1.92L',
      status: 'Active',
      totalUnits: 250,
      addressLine: 'OMR Expressway, Perungudi, Chennai',
      createdOn: '18 Aug 2026',
    },
    {
      id: 'SOC1003',
      name: 'Skyline Apartments',
      type: 'Luxury High-Rise',
      city: 'Salem',
      state: 'Tamil Nadu',
      pinCode: '636002',
      users: 156,
      activeDemand: 18,
      bookings: 290,
      revenue: '₹1.45L',
      status: 'Active',
      totalUnits: 200,
      addressLine: 'Fairlands Main Road, Salem',
      createdOn: '15 Aug 2026',
    },
    {
      id: 'SOC1004',
      name: 'Sunshine Enclave',
      type: 'Villa Association',
      city: 'Salem',
      state: 'Tamil Nadu',
      pinCode: '636003',
      users: 132,
      activeDemand: 12,
      bookings: 210,
      revenue: '₹1.10L',
      status: 'Active',
      totalUnits: 160,
      addressLine: 'Hasthampatti Road, Salem',
      createdOn: '12 Aug 2026',
    },
    {
      id: 'SOC1005',
      name: 'Maple Heights',
      type: 'Residential Apartments',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pinCode: '641001',
      users: 98,
      activeDemand: 9,
      bookings: 150,
      revenue: '₹0.85L',
      status: 'Active',
      totalUnits: 120,
      addressLine: 'Avinashi Road, Peelamedu, Coimbatore',
      createdOn: '10 Aug 2026',
    },
  ]);

  // Sample Demand Opportunities for Selected Society (ABC Residency)
  const [demands, setDemands] = useState<SocietyDemandRecord[]>([
    {
      id: 'DEM_AC_01',
      serviceName: 'AC Servicing & Jet Wash',
      customerCount: 14,
      quantity: 18,
      currentPrice: 699,
      nextPrice: 599,
      targetQuantity: 20,
      unitLabel: 'ACs',
      status: 'NEAR TARGET',
      potentialSavingsPerUnit: 100,
      potentialDemandValue: 12582,
      individualBookings: [
        { customerName: 'Rahul Kumar', flat: 'A-402', qty: 2 },
        { customerName: 'Priya Sharma', flat: 'B-201', qty: 1 },
        { customerName: 'Arjun Nair', flat: 'A-105', qty: 2 },
        { customerName: 'Sneha Iyer', flat: 'C-302', qty: 1 },
        { customerName: 'Manoj Kumar', flat: 'D-504', qty: 3 },
        { customerName: 'Karthik Raja', flat: 'B-108', qty: 2 },
        { customerName: 'Deepa V.', flat: 'A-203', qty: 2 },
        { customerName: 'Suresh Raina', flat: 'C-401', qty: 5 },
      ],
    },
    {
      id: 'DEM_PEST_01',
      serviceName: 'Full Home Pest Control',
      customerCount: 8,
      quantity: 8,
      currentPrice: 899,
      nextPrice: 799,
      targetQuantity: 10,
      unitLabel: 'Homes',
      status: 'BUILDING',
      potentialSavingsPerUnit: 100,
      potentialDemandValue: 7192,
      individualBookings: [
        { customerName: 'Priya Sharma', flat: 'B-201', qty: 1 },
        { customerName: 'Rahul Kumar', flat: 'A-402', qty: 1 },
        { customerName: 'Vikram Singh', flat: 'B-104', qty: 1 },
        { customerName: 'Anita Roy', flat: 'C-102', qty: 1 },
      ],
    },
    {
      id: 'DEM_RO_01',
      serviceName: 'RO Water Purifier Service',
      customerCount: 6,
      quantity: 6,
      currentPrice: 749,
      nextPrice: 699,
      targetQuantity: 6,
      unitLabel: 'Units',
      status: 'TARGET REACHED',
      potentialSavingsPerUnit: 50,
      potentialDemandValue: 4494,
      assignedVendor: 'CoolCare Services Pvt Ltd',
      individualBookings: [
        { customerName: 'Arjun Nair', flat: 'A-105', qty: 1 },
        { customerName: 'Sneha Iyer', flat: 'C-302', qty: 1 },
        { customerName: 'Ramesh Krishnan', flat: 'D-202', qty: 1 },
      ],
    },
  ]);

  const selectedSociety = societies.find((s) => s.id === selectedSocietyId) || societies[0];

  const filteredSocieties = societies.filter((s) => {
    const matchesSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pinCode.includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesCity = cityFilter === 'All' || s.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  const handleAddSocietySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocietyName.trim()) return;

    // Check Duplicate
    if (newSocietyName.toLowerCase().includes('abc residency') && !showDuplicateWarning) {
      setShowDuplicateWarning(true);
      return;
    }

    setShowDuplicateWarning(false);
    setShowCreatedToast(true);
    setTimeout(() => {
      setShowCreatedToast(false);
      setCurrentView('list');
    }, 1500);
  };

  const handleAssignVendor = () => {
    if (selectedDemand) {
      setDemands((prev) =>
        prev.map((d) => {
          if (d.id === selectedDemand.id) {
            return {
              ...d,
              status: 'VENDOR ASSIGNED',
              assignedVendor: vendorName,
            };
          }
          return d;
        })
      );
      setSelectedDemand(null);
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* SCREEN 71: SOCIETY LIST */}
      {currentView === 'list' && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Societies</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Manage societies and monitor local service demand aggregation</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('add')}
                className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Society</span>
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL SOCIETIES</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">245</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Across 12 cities</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE SOCIETIES</span>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">218</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">89% active booking rate</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PENDING SOCIETIES</span>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">27</h3>
              <span className="text-[11px] font-bold text-amber-600 mt-1 block">Verification pending</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL SOCIETY USERS</span>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">1,842</h3>
              <span className="text-[11px] font-bold text-blue-600 mt-1 block">Registered residents</span>
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
                placeholder="Search society, city, PIN code..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Filter className="w-4 h-4 text-slate-500" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Society Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Society ID</th>
                    <th className="py-3.5 px-4">Society Name</th>
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">PIN Code</th>
                    <th className="py-3.5 px-4">Users</th>
                    <th className="py-3.5 px-4">Active Demand</th>
                    <th className="py-3.5 px-4">Bookings</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created On</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredSocieties.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">No societies found</p>
                        <p className="text-xs text-slate-400 mt-1">Try a different search query or add a new society.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSocieties.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{s.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>{s.name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-semibold">{s.city}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{s.pinCode}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{s.users} Users</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-0.5 rounded-lg border border-amber-200">
                            🔥 {s.activeDemand} Opportunities
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{s.bookings}</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{s.createdOn}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedSocietyId(s.id);
                              setCurrentView('details');
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg transition-all text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing 1 to {filteredSocieties.length} of 245 societies</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, '...', 25].map((p, i) => (
                  <button
                    key={i}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center ${
                      p === 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* SCREEN 72: ADD SOCIETY FORM */}
      {currentView === 'add' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setCurrentView('list')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add Society</h2>
              <p className="text-xs text-slate-500">Register a new residential society for SaveTogether local demand aggregation</p>
            </div>
          </div>

          {showCreatedToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>✓ Society Created Successfully! ID: SOC10245</span>
            </div>
          )}

          {showDuplicateWarning && (
            <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>POSSIBLE DUPLICATE DETECTED</span>
              </div>
              <p className="text-xs">A society with a similar name and address already exists on SaveTogether:</p>
              <div className="p-3 bg-white rounded-xl border border-amber-200 font-medium text-xs">
                <p className="font-bold text-slate-900">ABC Residency</p>
                <p className="text-slate-500">Main Road, Salem - 636001</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSocietyId('SOC1001');
                    setCurrentView('details');
                  }}
                  className="bg-white border border-amber-300 text-amber-900 font-bold px-3.5 py-2 rounded-xl text-xs"
                >
                  View Existing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDuplicateWarning(false);
                    setShowCreatedToast(true);
                    setTimeout(() => setCurrentView('list'), 1200);
                  }}
                  className="bg-amber-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleAddSocietySubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 text-xs font-semibold">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">BASIC INFORMATION</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Society Name *</label>
                <input
                  type="text"
                  value={newSocietyName}
                  onChange={(e) => setNewSocietyName(e.target.value)}
                  placeholder="e.g. ABC Residency"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Society Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900">
                  <option>Apartment / Residential</option>
                  <option>Gated Community</option>
                  <option>High-Rise Towers</option>
                  <option>Villa Association</option>
                </select>
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">ADDRESS DETAILS</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-slate-700">Address Line *</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Main Road, Block / Area"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-slate-700">City *</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">State *</label>
                  <input
                    type="text"
                    value="Tamil Nadu"
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">PIN Code *</label>
                  <input
                    type="text"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Total Residential Units</label>
                <input
                  type="number"
                  value={newUnits}
                  onChange={(e) => setNewUnits(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Add Society
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SCREEN 74: SOCIETY DETAILS (WITH OVERVIEW, USERS, DEMAND TABS) */}
      {currentView === 'details' && (
        <>
          {/* Breadcrumb & Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <button onClick={() => setCurrentView('list')} className="hover:text-blue-600 flex items-center gap-1 font-bold">
                <ArrowLeft className="w-4 h-4" />
                <span>Societies</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-bold">{selectedSociety.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Society (73)</span>
              </button>
            </div>
          </div>

          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center shadow-sm">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{selectedSociety.name}</h2>
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedSociety.id}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {selectedSociety.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedSociety.addressLine}, {selectedSociety.city} - {selectedSociety.pinCode}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 74.1 SOCIETY KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">REGISTERED USERS</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedSociety.users}</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">TOTAL BOOKINGS</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedSociety.bookings}</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">ACTIVE DEMAND</span>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{selectedSociety.activeDemand} Opportunities</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">SOCIETY REVENUE</span>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{selectedSociety.revenue}</h3>
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div className="border-b border-slate-200 flex gap-6">
            {(['overview', 'demand', 'users', 'bookings', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'overview' && 'Overview (74)'}
                {tab === 'demand' && '🔥 Active Society Demand (76)'}
                {tab === 'users' && 'Society Users (75)'}
                {tab === 'bookings' && 'Bookings History'}
                {tab === 'analytics' && 'Demand Analytics (77)'}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SOCIETY INFORMATION</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 block font-medium">Society ID</span>
                    <span className="font-bold text-slate-900 font-mono">{selectedSociety.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Society Name</span>
                    <span className="font-bold text-slate-900">{selectedSociety.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">City & PIN Code</span>
                    <span className="font-bold text-slate-900">{selectedSociety.city} - {selectedSociety.pinCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Total Residential Units</span>
                    <span className="font-bold text-blue-600">{selectedSociety.totalUnits} Apartments</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ACTIVE DEMAND HIGHLIGHTS</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between font-semibold text-amber-900">
                      <span>AC Servicing (18 ACs Booked)</span>
                      <span className="font-bold text-emerald-700">₹699 → ₹599 Pricing Tier Unlocked</span>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between font-semibold text-blue-900">
                      <span>Pest Control (8 Homes Booked)</span>
                      <span className="font-bold text-blue-700">2 more needed for ₹799 Tier</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 74.2 Society Activity */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">RECENT SOCIETY ACTIVITY</h3>
                <div className="space-y-3 text-xs">
                  <div className="border-l-2 border-blue-600 pl-3 py-1">
                    <p className="font-bold text-slate-900">Rahul booked AC Servicing (2 ACs)</p>
                    <span className="text-[10px] text-slate-400">2 min ago</span>
                  </div>
                  <div className="border-l-2 border-emerald-500 pl-3 py-1">
                    <p className="font-bold text-slate-900">Demand reached 18 AC bookings target</p>
                    <span className="text-[10px] text-slate-400">8 min ago</span>
                  </div>
                  <div className="border-l-2 border-purple-500 pl-3 py-1">
                    <p className="font-bold text-slate-900">Vendor assigned to Pest Control demand</p>
                    <span className="text-[10px] text-slate-400">20 min ago</span>
                  </div>
                  <div className="border-l-2 border-slate-300 pl-3 py-1">
                    <p className="font-bold text-slate-900">New resident registered in Flat B-201</p>
                    <span className="text-[10px] text-slate-400">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEMAND (SCREEN 76 - MOST IMPORTANT SCREEN) */}
          {activeTab === 'demand' && (
            <div className="space-y-6">
              {/* Business Logic Architecture Callout */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900 font-medium">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>
                    <strong>AUTOMATIC SOCIETY DEMAND AGGREGATION:</strong> Individual resident bookings in {selectedSociety.name} are aggregated by SaveTogether backend algorithms into tier pricing opportunities.
                  </span>
                </div>
              </div>

              {/* Demand Opportunity Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {demands.map((dem) => {
                  const progressPct = Math.min(100, Math.round((dem.quantity / dem.targetQuantity) * 100));
                  return (
                    <div key={dem.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                            🔥 {dem.status}
                          </span>
                          <span className="text-xs font-bold text-blue-600">{dem.customerCount} Customers</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900">{dem.serviceName}</h3>
                        <p className="text-xs text-slate-500 font-medium">{selectedSociety.name}</p>

                        <div className="my-4 p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-500">Booked Quantity:</span>
                            <span className="text-slate-900">{dem.quantity} {dem.unitLabel}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-500">Current Unit Price:</span>
                            <span className="text-slate-900">₹{dem.currentPrice}</span>
                          </div>
                          <div className="flex justify-between font-bold text-emerald-600">
                            <span>Next Tier Price:</span>
                            <span>₹{dem.nextPrice} / {dem.unitLabel}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-[11px] font-bold mb-1">
                            <span className="text-slate-600">{dem.quantity} / {dem.targetQuantity} {dem.unitLabel}</span>
                            <span className="text-blue-600">{progressPct}% Target</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div style={{ width: `${progressPct}%` }} className="bg-blue-600 h-full rounded-full transition-all"></div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        {dem.assignedVendor ? (
                          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between mb-3">
                            <span>Vendor Assigned:</span>
                            <span>{dem.assignedVendor}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedDemand(dem)}
                            className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md cursor-pointer transition-all mb-2"
                          >
                            Assign Vendor & Lock Rate
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Demand Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Individual Customer Bookings Breakdown (AC Servicing)</h3>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Flat No</th>
                      <th className="py-3 px-4">Booked Quantity</th>
                      <th className="py-3 px-4">Individual Booking Price</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {demands[0].individualBookings.map((b, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{b.customerName}</td>
                        <td className="py-3 px-4 text-slate-600">{b.flat}</td>
                        <td className="py-3 px-4 font-bold text-blue-600">{b.qty} ACs</td>
                        <td className="py-3 px-4 font-bold text-slate-900">₹{b.qty * 599}</td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                            Aggregated
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIETY USERS (SCREEN 75) */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Society Residents ({selectedSociety.users})</h3>
                  <p className="text-xs text-slate-400">All registered residents in {selectedSociety.name}</p>
                </div>
              </div>

              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Flat No</th>
                    <th className="py-3 px-4">Bookings</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { name: 'Rahul Kumar', flat: 'A-402', bookings: 24, spent: '₹18,450', status: 'Active' },
                    { name: 'Priya Sharma', flat: 'B-201', bookings: 18, spent: '₹12,840', status: 'Active' },
                    { name: 'Arjun Nair', flat: 'A-105', bookings: 12, spent: '₹8,920', status: 'Active' },
                    { name: 'Sneha Iyer', flat: 'C-302', bookings: 8, spent: '₹5,420', status: 'Active' },
                    { name: 'Vikram Singh', flat: 'B-104', bookings: 5, spent: '₹3,200', status: 'Blocked' },
                  ].map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50 cursor-pointer">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{u.flat}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">{u.bookings} Bookings</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">{u.spent}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: DEMAND ANALYTICS (SCREEN 77) */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Demand by Service Type</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>AC Servicing</span>
                      <span className="text-blue-600">18 Bookings</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="w-full bg-blue-600 h-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Pest Control</span>
                      <span className="text-emerald-600">8 Bookings</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="w-1/2 bg-emerald-500 h-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>RO Service</span>
                      <span className="text-purple-600">6 Bookings</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="w-1/3 bg-purple-500 h-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Society Demand Trend (Weekly)</h3>
                <div className="h-44 flex items-end justify-between gap-3 pt-6">
                  {[12, 18, 22, 28, 35, 38].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-600">{val}</span>
                      <div style={{ height: `${(val / 40) * 100}%` }} className="w-full bg-blue-600 rounded-t-lg"></div>
                      <span className="text-[10px] text-slate-400 font-bold">W{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SCREEN 71.3: FILTER DRAWER */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Filter Societies</h3>
                <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-2">City</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option>All</option>
                    <option>Salem</option>
                    <option>Chennai</option>
                    <option>Coimbatore</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setCityFilter('All');
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

      {/* VENDOR ASSIGNMENT MODAL */}
      {selectedDemand && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Assign Vendor for {selectedDemand.serviceName}</h3>
            <p className="text-xs text-slate-500">Society: {selectedSociety.name} ({selectedDemand.quantity} {selectedDemand.unitLabel} Booked)</p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Service Vendor</label>
              <select
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
              >
                <option value="CoolCare Services Pvt Ltd">CoolCare Services Pvt Ltd (Rating 4.9★)</option>
                <option value="Urban Tech Solutions">Urban Tech Solutions (Rating 4.8★)</option>
                <option value="CleanMax Pro">CleanMax Pro (Rating 4.7★)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setSelectedDemand(null)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignVendor}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
              >
                Confirm Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
