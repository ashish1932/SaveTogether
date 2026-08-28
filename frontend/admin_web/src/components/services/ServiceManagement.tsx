import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  ArrowLeft,
  ChevronRight,
  Star,
  Check,
  X
} from 'lucide-react';

export interface CategoryRecord {
  id: string;
  name: string;
  iconName: string;
  description: string;
  serviceCount: number;
  bookingCount: number;
  displayOrder: number;
  status: 'Active' | 'Inactive';
}

export interface ServiceRecord {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  shortDescription: string;
  description: string;
  activeDemand: number;
  totalBookings: number;
  revenue: string;
  rating: number;
  reviewCount: number;
  status: 'Active' | 'Inactive' | 'Draft' | 'Coming Soon';
  includedItems: string[];
  excludedItems: string[];
  pricingTiers: { minQty: number; maxQty: number | string; price: number }[];
  cities: string[];
  societies: string[];
  days: string[];
  timeSlots: string[];
  dailyCapacity: number;
  currentCapacity: number;
}

export const ServiceManagement: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'categories' | 'services'>('services');
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'add_service' | 'add_category'>('list');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('SVC1001');
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'availability' | 'reviews'>('overview');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Form State for Add Service
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('AC Services');
  const [basePrice, setBasePrice] = useState('799');
  const [shortDesc, setShortDesc] = useState('');
  const [includedInput, setIncludedInput] = useState('');
  const [includedList, setIncludedList] = useState<string[]>([
    'Filter cleaning',
    'Coil cleaning',
    'Indoor unit cleaning',
    'Basic inspection',
  ]);
  const [excludedInput, setExcludedInput] = useState('');
  const [excludedList, setExcludedList] = useState<string[]>([
    'Gas refill',
    'Major spare parts',
    'Compressor replacement',
  ]);

  // Categories Sample Data
  const [categories] = useState<CategoryRecord[]>([
    { id: 'CAT101', name: 'AC Services', iconName: 'Wrench', description: 'AC servicing, gas check, jet wash & repair', serviceCount: 8, bookingCount: 542, displayOrder: 1, status: 'Active' },
    { id: 'CAT102', name: 'Cleaning', iconName: 'Home', description: 'Deep home cleaning, sofa & bathroom cleaning', serviceCount: 12, bookingCount: 286, displayOrder: 2, status: 'Active' },
    { id: 'CAT103', name: 'Pest Control', iconName: 'ShieldAlert', description: 'Cockroach, termite & bed bug treatment', serviceCount: 6, bookingCount: 218, displayOrder: 3, status: 'Active' },
    { id: 'CAT104', name: 'Car Wash', iconName: 'Car', description: 'Doorstep foam car wash & interior cleaning', serviceCount: 5, bookingCount: 142, displayOrder: 4, status: 'Active' },
    { id: 'CAT105', name: 'RO Services', iconName: 'Droplet', description: 'RO water purifier service & filter replacement', serviceCount: 7, bookingCount: 186, displayOrder: 5, status: 'Active' },
  ]);

  // Services Sample Data
  const [services, setServices] = useState<ServiceRecord[]>([
    {
      id: 'SVC1001',
      name: 'AC General Service',
      category: 'AC Services',
      basePrice: 799,
      shortDescription: 'Complete AC servicing & filter jet wash for your split/window unit.',
      description: 'Comprehensive AC servicing performed by certified technicians. Includes high-pressure filter jet wash, coil inspection, drain line flushing, and cooling performance testing.',
      activeDemand: 18,
      totalBookings: 542,
      revenue: '₹4.21L',
      rating: 4.6,
      reviewCount: 186,
      status: 'Active',
      includedItems: ['Filter jet cleaning', 'Coil cleaning', 'Outdoor unit inspection', 'Basic performance check'],
      excludedItems: ['Gas refill', 'Major spare parts', 'Compressor replacement'],
      pricingTiers: [
        { minQty: 1, maxQty: 9, price: 799 },
        { minQty: 10, maxQty: 19, price: 699 },
        { minQty: 20, maxQty: 29, price: 599 },
        { minQty: 30, maxQty: '+', price: 549 },
      ],
      cities: ['Salem', 'Chennai', 'Coimbatore'],
      societies: ['ABC Residency', 'Green Meadows', 'Skyline Apartments'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timeSlots: ['09:00 AM - 12:00 PM', '12:00 PM - 03:00 PM', '03:00 PM - 06:00 PM'],
      dailyCapacity: 50,
      currentCapacity: 38,
    },
    {
      id: 'SVC1002',
      name: 'Full Home Deep Cleaning',
      category: 'Cleaning',
      basePrice: 1999,
      shortDescription: 'Deep cleaning for entire apartment including kitchen & bathrooms.',
      description: 'Complete deep cleaning of your home using commercial-grade single-disc machines and eco-friendly chemicals. Covers living room, bedrooms, kitchen degreasing, and deep bathroom sanitization.',
      activeDemand: 8,
      totalBookings: 286,
      revenue: '₹5.71L',
      rating: 4.7,
      reviewCount: 94,
      status: 'Active',
      includedItems: ['Floor scrubbing', 'Kitchen tile degreasing', 'Bathroom descaling', 'Balcony wash'],
      excludedItems: ['Repainting', 'De-cluttering personal items'],
      pricingTiers: [
        { minQty: 1, maxQty: 4, price: 1999 },
        { minQty: 5, maxQty: 9, price: 1799 },
        { minQty: 10, maxQty: '+', price: 1599 },
      ],
      cities: ['Salem', 'Chennai'],
      societies: ['ABC Residency', 'Green Meadows'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timeSlots: ['09:00 AM - 12:00 PM', '01:00 PM - 05:00 PM'],
      dailyCapacity: 20,
      currentCapacity: 14,
    },
    {
      id: 'SVC1003',
      name: 'Full Home Pest Control',
      category: 'Pest Control',
      basePrice: 999,
      shortDescription: 'Odorless spray treatment for cockroaches, ants & silverfish.',
      description: 'Government-approved odorless chemical spray treatment with 60-day warranty. Safe for kids and pets.',
      activeDemand: 14,
      totalBookings: 218,
      revenue: '₹2.17L',
      rating: 4.5,
      reviewCount: 68,
      status: 'Active',
      includedItems: ['Kitchen cabinet gel application', 'Drainage hole spray', 'Balcony barrier spray'],
      excludedItems: ['Termite drilling treatment'],
      pricingTiers: [
        { minQty: 1, maxQty: 4, price: 999 },
        { minQty: 5, maxQty: 9, price: 899 },
        { minQty: 10, maxQty: '+', price: 799 },
      ],
      cities: ['Salem', 'Coimbatore'],
      societies: ['ABC Residency', 'Skyline Apartments'],
      days: ['Mon', 'Wed', 'Fri', 'Sat'],
      timeSlots: ['09:00 AM - 12:00 PM', '03:00 PM - 06:00 PM'],
      dailyCapacity: 30,
      currentCapacity: 22,
    },
  ]);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddIncluded = () => {
    if (includedInput.trim()) {
      setIncludedList([...includedList, includedInput.trim()]);
      setIncludedInput('');
    }
  };

  const handleAddExcluded = () => {
    if (excludedInput.trim()) {
      setExcludedList([...excludedList, excludedInput.trim()]);
      setExcludedInput('');
    }
  };

  const handleCreateServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const newSvc: ServiceRecord = {
      id: `SVC100${services.length + 1}`,
      name: serviceName,
      category: serviceCategory,
      basePrice: Number(basePrice) || 799,
      shortDescription: shortDesc || 'Complete professional service for residential units.',
      description: shortDesc || 'Complete professional service for residential units.',
      activeDemand: 0,
      totalBookings: 0,
      revenue: '₹0.00L',
      rating: 5.0,
      reviewCount: 0,
      status: 'Active',
      includedItems: includedList,
      excludedItems: excludedList,
      pricingTiers: [
        { minQty: 1, maxQty: 9, price: Number(basePrice) || 799 },
        { minQty: 10, maxQty: 19, price: (Number(basePrice) || 799) - 100 },
        { minQty: 20, maxQty: '+', price: (Number(basePrice) || 799) - 200 },
      ],
      cities: ['Salem', 'Chennai'],
      societies: ['ABC Residency', 'Green Meadows'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timeSlots: ['09:00 AM - 12:00 PM', '12:00 PM - 03:00 PM', '03:00 PM - 06:00 PM'],
      dailyCapacity: 40,
      currentCapacity: 0,
    };

    setServices([newSvc, ...services]);
    setCurrentView('list');
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* HEADER & MODULE SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Service Management</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Control service catalog, pricing tiers, inclusions & regional availability</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
            <button
              onClick={() => setActiveModule('services')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeModule === 'services' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Services List (79)
            </button>
            <button
              onClick={() => setActiveModule('categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeModule === 'categories' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Categories (77)
            </button>
          </div>

          {activeModule === 'services' ? (
            <button
              onClick={() => setCurrentView('add_service')}
              className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Service (80)</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('add_category')}
              className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Category (78)</span>
            </button>
          )}
        </div>
      </div>

      {/* SCREEN 77: SERVICE CATEGORIES LIST */}
      {activeModule === 'categories' && currentView === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Service Categories ({categories.length})</h3>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Services</th>
                <th className="py-3.5 px-4">Total Bookings</th>
                <th className="py-3.5 px-4">Display Order</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      {cat.name.charAt(0)}
                    </div>
                    <span>{cat.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs">{cat.description}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{cat.serviceCount} Services</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{cat.bookingCount}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-600">Order #{cat.displayOrder}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                      {cat.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREEN 79: SERVICE LIST */}
      {activeModule === 'services' && currentView === 'list' && (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services by name or category..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs font-semibold">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              >
                <option value="All">All Categories</option>
                <option value="AC Services">AC Services</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Pest Control">Pest Control</option>
              </select>

              <button
                onClick={() => setShowFilterDrawer(true)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Filter className="w-4 h-4 text-slate-500" />
                <span>Filters (79.1)</span>
              </button>
            </div>
          </div>

          {/* Service Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Base Price</th>
                    <th className="py-3.5 px-4">Active Demand</th>
                    <th className="py-3.5 px-4">Total Bookings</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredServices.map((svc) => (
                    <tr key={svc.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <p>{svc.name}</p>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">{svc.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-600">{svc.category}</td>
                      <td className="py-3.5 px-4 font-extrabold text-blue-600">₹{svc.basePrice}</td>
                      <td className="py-3.5 px-4 font-bold text-amber-600">🔥 {svc.activeDemand} Units</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{svc.totalBookings}</td>
                      <td className="py-3.5 px-4 font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{svc.rating}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          {svc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedServiceId(svc.id);
                            setCurrentView('details');
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg transition-all text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
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

      {/* SCREEN 80: ADD SERVICE FORM */}
      {currentView === 'add_service' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setCurrentView('list')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add Service</h2>
              <p className="text-xs text-slate-500">Configure new service definitions, base price, bulk pricing tiers & inclusions</p>
            </div>
          </div>

          <form onSubmit={handleCreateServiceSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-semibold">
            {/* 80.1 Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">BASIC INFORMATION</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-700">Service Name *</label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. AC General Service"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">Category *</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="AC Services">AC Services</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Car Wash">Car Wash</option>
                    <option value="RO Services">RO Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Short Description *</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Complete AC servicing for your unit."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  required
                />
              </div>
            </div>

            {/* 80.2 & 80.3 Inclusions and Exclusions */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">INCLUSIONS & EXCLUSIONS</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Included Items */}
                <div>
                  <label className="block mb-1 text-emerald-700 font-bold">WHAT'S INCLUDED (✓)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={includedInput}
                      onChange={(e) => setIncludedInput(e.target.value)}
                      placeholder="Add item e.g. Coil cleaning"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddIncluded}
                      className="bg-emerald-600 text-white font-bold px-3 py-2 rounded-xl text-xs"
                    >
                      + Add
                    </button>
                  </div>
                  <ul className="space-y-1.5">
                    {includedList.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-medium">
                        <span>✓ {item}</span>
                        <button type="button" onClick={() => setIncludedList(includedList.filter((_, i) => i !== idx))} className="text-emerald-600 hover:text-red-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excluded Items */}
                <div>
                  <label className="block mb-1 text-red-700 font-bold">WHAT'S EXCLUDED (•)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={excludedInput}
                      onChange={(e) => setExcludedInput(e.target.value)}
                      placeholder="Add item e.g. Gas refill"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddExcluded}
                      className="bg-red-600 text-white font-bold px-3 py-2 rounded-xl text-xs"
                    >
                      + Add
                    </button>
                  </div>
                  <ul className="space-y-1.5">
                    {excludedList.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between p-2 bg-red-50 text-red-900 rounded-lg text-xs font-medium">
                        <span>• {item}</span>
                        <button type="button" onClick={() => setExcludedList(excludedList.filter((_, i) => i !== idx))} className="text-red-600 hover:text-slate-900">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 80.4 & 80.5 Pricing & Bulk Tiers */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">PRICING & BULK TIERS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-700">Base Price (Per Unit) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">Pricing Model</label>
                  <input
                    type="text"
                    value="Bulk Tier Pricing (SaveTogether Model)"
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-blue-600 font-bold"
                  />
                </div>
              </div>

              {/* Tiers Configurator Preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">AUTOMATIC TIERS GENERATED:</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  <div className="p-2 bg-white rounded border border-slate-200">1–9 Units: ₹{Number(basePrice) || 799}</div>
                  <div className="p-2 bg-white rounded border border-blue-200 text-blue-700 font-bold">10–19 Units: ₹{(Number(basePrice) || 799) - 100}</div>
                  <div className="p-2 bg-white rounded border border-emerald-200 text-emerald-700 font-bold">20+ Units: ₹{(Number(basePrice) || 799) - 200}</div>
                </div>
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
                Create Service (80)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SCREEN 82: SERVICE DETAILS */}
      {currentView === 'details' && (
        <>
          {/* Breadcrumb & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <button onClick={() => setCurrentView('list')} className="hover:text-blue-600 flex items-center gap-1 font-bold">
                <ArrowLeft className="w-4 h-4" />
                <span>Services</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-bold">{selectedService.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Service (81)</span>
              </button>
            </div>
          </div>

          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center shadow-sm">
                <Wrench className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{selectedService.name}</h2>
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedService.id}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {selectedService.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {selectedService.category} • <strong className="text-blue-600">₹{selectedService.basePrice} base price</strong>
                </p>
              </div>
            </div>
          </div>

          {/* 82.1 SERVICE METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">TOTAL BOOKINGS</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedService.totalBookings}</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">ACTIVE DEMAND</span>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">🔥 {selectedService.activeDemand} Units</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">AVERAGE RATING</span>
              <h3 className="text-2xl font-bold text-amber-500 mt-1 flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400" /> {selectedService.rating}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">SERVICE REVENUE</span>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{selectedService.revenue}</h3>
            </div>
          </div>

          {/* DETAIL TABS HEADER */}
          <div className="border-b border-slate-200 flex gap-6">
            {(['overview', 'pricing', 'availability', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'overview' && 'Overview (82)'}
                {tab === 'pricing' && 'Bulk Tiers (81.1)'}
                {tab === 'availability' && 'Availability & Capacity (83)'}
                {tab === 'reviews' && 'Reviews & Ratings (82.2)'}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">DESCRIPTION & INCLUSIONS</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedService.description}</p>

                <div className="pt-3">
                  <h4 className="text-xs font-bold text-emerald-700 mb-2">WHAT'S INCLUDED (✓)</h4>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                    {selectedService.includedItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">EXCLUSIONS & BASE PRICE</h3>
                <div className="p-4 bg-blue-50 rounded-xl font-bold text-xs text-blue-900 flex justify-between">
                  <span>Base Price Per Unit:</span>
                  <span className="text-sm text-blue-700">₹{selectedService.basePrice}</span>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-red-700 mb-2">WHAT'S EXCLUDED (•)</h4>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                    {selectedService.excludedItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING TIERS */}
          {activeTab === 'pricing' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Configured Bulk Pricing Tiers</h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Quantity Bracket</th>
                    <th className="py-3 px-4">Price Per Unit</th>
                    <th className="py-3 px-4">Customer Savings</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {selectedService.pricingTiers.map((tier, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {tier.minQty}–{tier.maxQty} Units
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-blue-600">₹{tier.price} / unit</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        Save ₹{selectedService.basePrice - tier.price} / unit
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: AVAILABILITY & CAPACITY (SCREEN 83) */}
          {activeTab === 'availability' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6 text-xs font-semibold">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Service Availability Controls</h3>
                  <p className="text-xs text-slate-400">Configure regions, societies, days, time slots & daily max capacity</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl font-bold">
                  <span>Available for Booking:</span>
                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">ON</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AVAILABLE CITIES</h4>
                  <div className="flex gap-2">
                    {selectedService.cities.map((city, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg font-bold">
                        ✓ {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">OPERATIONAL DAYS</h4>
                  <div className="flex gap-1.5">
                    {selectedService.days.map((day, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">TIME SLOTS & DAILY CAPACITY</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-slate-500">Configured Slots:</span>
                    {selectedService.timeSlots.map((slot, i) => (
                      <p key={i} className="font-bold text-slate-900">⏰ {slot}</p>
                    ))}
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
                    <span className="text-[10px] font-bold uppercase">DAILY CAPACITY MANAGER</span>
                    <p className="text-base font-extrabold">{selectedService.currentCapacity} / {selectedService.dailyCapacity} Bookings</p>
                    <span className="text-[11px] font-bold text-emerald-700">Remaining Slots Today: {selectedService.dailyCapacity - selectedService.currentCapacity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SCREEN 79.1: FILTERS DRAWER */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Service Filters</h3>
                <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option>All</option>
                    <option>AC Services</option>
                    <option>Cleaning</option>
                    <option>Pest Control</option>
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
                    <option>Inactive</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setCategoryFilter('All');
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
