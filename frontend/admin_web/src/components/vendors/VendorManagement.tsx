import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Star,
  X
} from 'lucide-react';

export interface VendorServiceDetail {
  serviceName: string;
  vendorCost: number;
  customerPrice: number;
  grossMargin: number;
  status: 'Active' | 'Inactive';
}

export interface VendorRecord {
  id: string;
  businessName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  pinCode: string;
  address: string;
  serviceCount: number;
  areaCount: number;
  rating: number;
  completedJobs: number;
  completionRate: number;
  onTimeRate: number;
  capacityLevel: 'High' | 'Medium' | 'Low';
  maxDailyCapacity: number;
  assignedCapacity: number;
  status: 'Active' | 'Pending' | 'Inactive' | 'Suspended';
  services: VendorServiceDetail[];
  priceTiers: { minQty: number; maxQty: number | string; vendorPrice: number }[];
}

export interface VendorPriceAudit {
  date: string;
  serviceName: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  reason: string;
}

export const VendorManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'add_vendor' | 'comparison'>('list');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('VEN1001');
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'pricing' | 'availability' | 'capacity' | 'performance' | 'history'>('overview');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Form State for Add Vendor
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Salem');
  const [showCreatedToast, setShowCreatedToast] = useState(false);

  // Sample Vendors Master Data
  const [vendors, setVendors] = useState<VendorRecord[]>([
    {
      id: 'VEN1001',
      businessName: 'CoolCare Services Pvt Ltd',
      contactPerson: 'Raj Kumar',
      mobile: '+91 98765 43210',
      email: 'contact@coolcare.in',
      city: 'Salem',
      state: 'Tamil Nadu',
      pinCode: '636001',
      address: '124 Main Road, Salem - 636001',
      serviceCount: 4,
      areaCount: 8,
      rating: 4.8,
      completedJobs: 248,
      completionRate: 92,
      onTimeRate: 95,
      capacityLevel: 'High',
      maxDailyCapacity: 35,
      assignedCapacity: 22,
      status: 'Active',
      services: [
        { serviceName: 'AC General Service', vendorCost: 450, customerPrice: 599, grossMargin: 149, status: 'Active' },
        { serviceName: 'AC Deep Cleaning', vendorCost: 700, customerPrice: 999, grossMargin: 299, status: 'Active' },
        { serviceName: 'AC Gas Check', vendorCost: 250, customerPrice: 499, grossMargin: 249, status: 'Active' },
        { serviceName: 'AC Installation', vendorCost: 900, customerPrice: 1299, grossMargin: 399, status: 'Active' },
      ],
      priceTiers: [
        { minQty: 1, maxQty: 9, vendorPrice: 500 },
        { minQty: 10, maxQty: 19, vendorPrice: 475 },
        { minQty: 20, maxQty: 39, vendorPrice: 450 },
        { minQty: 40, maxQty: 59, vendorPrice: 425 },
        { minQty: 60, maxQty: '+', vendorPrice: 400 },
      ],
    },
    {
      id: 'VEN1002',
      businessName: 'FreshHome Experts',
      contactPerson: 'Anand Roy',
      mobile: '+91 97654 32109',
      email: 'info@freshhome.in',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pinCode: '600001',
      address: '45 OMR Road, Chennai',
      serviceCount: 6,
      areaCount: 5,
      rating: 4.6,
      completedJobs: 186,
      completionRate: 88,
      onTimeRate: 91,
      capacityLevel: 'Medium',
      maxDailyCapacity: 20,
      assignedCapacity: 14,
      status: 'Active',
      services: [
        { serviceName: 'Full Home Deep Cleaning', vendorCost: 1400, customerPrice: 1799, grossMargin: 399, status: 'Active' },
        { serviceName: 'Sofa Cleaning', vendorCost: 650, customerPrice: 899, grossMargin: 249, status: 'Active' },
      ],
      priceTiers: [
        { minQty: 1, maxQty: 4, vendorPrice: 1500 },
        { minQty: 5, maxQty: '+', vendorPrice: 1400 },
      ],
    },
    {
      id: 'VEN1003',
      businessName: 'AquaFix Solutions',
      contactPerson: 'Suresh Raina',
      mobile: '+91 96543 21098',
      email: 'support@aquafix.in',
      city: 'Salem',
      state: 'Tamil Nadu',
      pinCode: '636002',
      address: '88 Fairlands Road, Salem',
      serviceCount: 3,
      areaCount: 4,
      rating: 4.7,
      completedJobs: 142,
      completionRate: 94,
      onTimeRate: 96,
      capacityLevel: 'High',
      maxDailyCapacity: 30,
      assignedCapacity: 18,
      status: 'Active',
      services: [
        { serviceName: 'RO Water Purifier Service', vendorCost: 500, customerPrice: 699, grossMargin: 199, status: 'Active' },
      ],
      priceTiers: [
        { minQty: 1, maxQty: 4, vendorPrice: 550 },
        { minQty: 5, maxQty: '+', vendorPrice: 500 },
      ],
    },
  ]);

  // Price History Audit Trail (Screen 101)
  const [priceHistory] = useState<VendorPriceAudit[]>([
    { date: '28 Aug 2026', serviceName: 'AC General Service', oldPrice: 475, newPrice: 450, changedBy: 'Ashish Admin (Super Admin)', reason: 'Volume discount negotiation for 20+ AC demand' },
    { date: '15 Aug 2026', serviceName: 'AC General Service', oldPrice: 500, newPrice: 475, changedBy: 'Ashish Admin (Super Admin)', reason: 'Seasonal vendor rate adjustment' },
    { date: '01 Aug 2026', serviceName: 'AC General Service', oldPrice: 525, newPrice: 500, changedBy: 'Admin 02 (Ops Manager)', reason: 'New service vendor onboarding agreement' },
  ]);

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      searchQuery === '' ||
      v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    const newVen: VendorRecord = {
      id: `VEN100${vendors.length + 1}`,
      businessName,
      contactPerson: contactPerson || 'Operations Manager',
      mobile: mobile || '+91 98765 00000',
      email: email || 'vendor@savetogether.in',
      city,
      state: 'Tamil Nadu',
      pinCode: '636001',
      address: `${city} Central Area`,
      serviceCount: 2,
      areaCount: 4,
      rating: 4.8,
      completedJobs: 0,
      completionRate: 100,
      onTimeRate: 100,
      capacityLevel: 'High',
      maxDailyCapacity: 30,
      assignedCapacity: 0,
      status: 'Active',
      services: [
        { serviceName: 'AC General Service', vendorCost: 450, customerPrice: 599, grossMargin: 149, status: 'Active' },
      ],
      priceTiers: [
        { minQty: 1, maxQty: 9, vendorPrice: 500 },
        { minQty: 10, maxQty: '+', vendorPrice: 450 },
      ],
    };

    setVendors([newVen, ...vendors]);
    setShowCreatedToast(true);
    setTimeout(() => {
      setShowCreatedToast(false);
      setCurrentView('list');
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* MODULE HEADER & TOP ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Management</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Manage service providers, vendor costs, margins & operational capacity (Admin V1 Control)</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('comparison')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Vendor Comparison & Assignment (103)</span>
          </button>
          <button
            onClick={() => setCurrentView('add_vendor')}
            className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Vendor (94)</span>
          </button>
        </div>
      </div>

      {/* V1 VENDOR ARCHITECTURE CALLOUT */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900 font-medium">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <span>
          <strong>V1 ARCHITECTURE RULE:</strong> Vendors have NO login, NO password, and NO self-service app in V1. Admin manages vendor profiles, capacity, costs and campaign assignments directly.
        </span>
      </div>

      {/* SCREEN 93: VENDOR LIST */}
      {currentView === 'list' && (
        <>
          {/* 93 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL VENDORS</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">86</h3>
              <span className="text-[11px] font-bold text-slate-500 mt-1 block">Registered providers</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE VENDORS</span>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">72</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Available for booking</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PENDING VENDORS</span>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">9</h3>
              <span className="text-[11px] font-bold text-amber-600 mt-1 block">Verification pending</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">INACTIVE VENDORS</span>
              <h3 className="text-2xl font-bold text-red-600 mt-1">5</h3>
              <span className="text-[11px] font-bold text-red-600 mt-1 block">Capacity paused</span>
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
                placeholder="Search vendor, service, city..."
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
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                onClick={() => setShowFilterDrawer(true)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Filter className="w-4 h-4 text-slate-500" />
                <span>Filters (93.4)</span>
              </button>
            </div>
          </div>

          {/* 93.1 VENDOR TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Vendor</th>
                    <th className="py-3.5 px-4">Vendor ID</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Services</th>
                    <th className="py-3.5 px-4">Areas</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Capacity</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredVendors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <Truck className="w-4 h-4" />
                        </div>
                        <span>{v.businessName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{v.id}</td>
                      <td className="py-3.5 px-4 text-slate-600">{v.mobile}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">{v.serviceCount} Services</td>
                      <td className="py-3.5 px-4 text-slate-700">{v.areaCount} Areas</td>
                      <td className="py-3.5 px-4 font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{v.rating}★</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{v.capacityLevel} ({v.assignedCapacity}/{v.maxDailyCapacity})</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            v.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedVendorId(v.id);
                            setCurrentView('details');
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg transition-all text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details (95)</span>
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

      {/* SCREEN 94: ADD VENDOR FORM */}
      {currentView === 'add_vendor' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setCurrentView('list')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add Vendor (94)</h2>
              <p className="text-xs text-slate-500">Register a new service provider for Admin management & campaign assignment</p>
            </div>
          </div>

          {showCreatedToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>✓ Vendor added successfully! ID: VEN1004</span>
            </div>
          )}

          <form onSubmit={handleAddVendorSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 text-xs font-semibold">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">BUSINESS INFORMATION</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Vendor / Business Name *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. CoolCare Services"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Contact Person *</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Raj Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Mobile Number *</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@coolcare.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">BUSINESS LOCATION & SERVICES</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">State</label>
                <input
                  type="text"
                  value="Tamil Nadu"
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block mb-2 text-slate-700">Offered Services</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>AC Servicing</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>AC Deep Cleaning</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span>Pest Control</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span>RO Service</span>
                </label>
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
                Add Vendor (94)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SCREEN 95: VENDOR DETAILS */}
      {currentView === 'details' && (
        <>
          {/* Breadcrumb & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <button onClick={() => setCurrentView('list')} className="hover:text-blue-600 flex items-center gap-1 font-bold">
                <ArrowLeft className="w-4 h-4" />
                <span>Vendors</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-bold">{selectedVendor.businessName}</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Vendor</span>
              </button>
            </div>
          </div>

          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center shadow-sm">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{selectedVendor.businessName}</h2>
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedVendor.id}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {selectedVendor.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-3">
                  <span>👤 {selectedVendor.contactPerson}</span>
                  <span>📱 {selectedVendor.mobile}</span>
                  <span>✉️ {selectedVendor.email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 95.1 VENDOR OVERVIEW KPIS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">SERVICES OFFERED</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedVendor.serviceCount} Services</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">COMPLETED JOBS</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedVendor.completedJobs} Jobs</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">AVERAGE RATING</span>
              <h3 className="text-2xl font-bold text-amber-500 mt-1 flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400" /> {selectedVendor.rating}★
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">COMPLETION RATE</span>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{selectedVendor.completionRate}%</h3>
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div className="border-b border-slate-200 flex gap-6">
            {(['overview', 'services', 'pricing', 'availability', 'capacity', 'performance', 'history'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'overview' && 'Overview (95)'}
                {tab === 'services' && 'Services (96)'}
                {tab === 'pricing' && 'Pricing & Margins (97)'}
                {tab === 'availability' && 'Availability (98)'}
                {tab === 'capacity' && 'Capacity (99)'}
                {tab === 'performance' && 'Performance (100)'}
                {tab === 'history' && 'Price History (101)'}
              </button>
            ))}
          </div>

          {/* TAB 2: VENDOR SERVICES (SCREEN 96) */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Configured Vendor Services & Cost Prices</h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Vendor Cost Price</th>
                    <th className="py-3 px-4">Customer Tier Price</th>
                    <th className="py-3 px-4">Estimated Platform Margin</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {selectedVendor.services.map((svc, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{svc.serviceName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{svc.vendorCost} / unit</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">₹{svc.customerPrice} / unit</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{svc.grossMargin} / unit</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                          {svc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: VENDOR PRICING & MARGIN PREVIEW (SCREEN 97) */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">CUSTOMER PRICE</span>
                  <h3 className="text-3xl font-extrabold text-blue-600 mt-1">₹599 / AC</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">VENDOR COST</span>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">₹450 / AC</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">ESTIMATED GROSS MARGIN</span>
                  <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">₹149 / AC</h3>
                </div>
              </div>

              {/* 97.1 Vendor Quantity Pricing Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Vendor Volume Pricing Tiers (97.1)</h3>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Quantity Bracket</th>
                      <th className="py-3 px-4">Vendor Quote Price</th>
                      <th className="py-3 px-4">Customer Tier Price</th>
                      <th className="py-3 px-4">Platform Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedVendor.priceTiers.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{t.minQty}–{t.maxQty} Units</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">₹{t.vendorPrice}</td>
                        <td className="py-3.5 px-4 font-bold text-blue-600">₹{599 - idx * 50}</td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{(599 - idx * 50) - t.vendorPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CAPACITY MANAGER (SCREEN 99) */}
          {activeTab === 'capacity' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6 text-xs font-semibold">
              <h3 className="text-base font-bold text-slate-900">Vendor Daily Capacity Manager (99)</h3>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span>Max Daily Capacity: <strong>{selectedVendor.maxDailyCapacity} ACs</strong></span>
                  <span>Assigned Today: <strong>{selectedVendor.assignedCapacity} ACs</strong></span>
                  <span className="text-emerald-700 font-extrabold">Remaining: {selectedVendor.maxDailyCapacity - selectedVendor.assignedCapacity} ACs</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div style={{ width: `${(selectedVendor.assignedCapacity / selectedVendor.maxDailyCapacity) * 100}%` }} className="bg-blue-600 h-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PRICE HISTORY (SCREEN 101) */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Vendor Cost Price Change Audit Log (101)</h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Old Vendor Price</th>
                    <th className="py-3 px-4">New Vendor Price</th>
                    <th className="py-3 px-4">Changed By</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {priceHistory.map((ph, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono text-slate-500">{ph.date}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{ph.serviceName}</td>
                      <td className="py-3.5 px-4 text-slate-400 line-through">₹{ph.oldPrice}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{ph.newPrice}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">{ph.changedBy}</td>
                      <td className="py-3.5 px-4 text-slate-600">{ph.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* SCREEN 103: VENDOR COMPARISON & ASSIGNMENT PANEL */}
      {currentView === 'comparison' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setCurrentView('list')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Vendor Comparison & Assignment Panel (103)</h2>
              <p className="text-xs text-slate-500">Compare vendor cost, capacity & performance rating before assigning to society demand</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900 font-medium">
            <span>Demand Context: <strong>ABC Residency — AC Servicing (27 ACs requested)</strong></span>
            <span>Customer Tier Price: <strong>₹599 / AC</strong></span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Vendor Cost Price</th>
                  <th className="py-3 px-4">Max Capacity</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">On-Time Rate</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {[
                  { name: 'CoolCare Services Pvt Ltd', cost: '₹450', cap: '35 ACs/day', rating: '4.8★', onTime: '95%' },
                  { name: 'FreshAir Solutions', cost: '₹470', cap: '25 ACs/day', rating: '4.6★', onTime: '91%' },
                  { name: 'AC Experts India', cost: '₹430', cap: '20 ACs/day', rating: '4.4★', onTime: '86%' },
                ].map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{v.name}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{v.cost} / AC</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">{v.cap}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-500">{v.rating}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">{v.onTime}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          alert(`Assigned ${v.name} to ABC Residency AC Servicing demand campaign!`);
                          setCurrentView('list');
                        }}
                        className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm"
                      >
                        Select Vendor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCREEN 93.4 VENDOR FILTERS DRAWER */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Vendor Filters (93.4)</h3>
                <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-2">Vendor Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
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
