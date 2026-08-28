import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  History
} from 'lucide-react';

export interface PricingTierDetail {
  tierId: string;
  minQty: number;
  maxQty: number | string;
  pricePerUnit: number;
  label: string;
  status: 'Active' | 'Inactive' | 'Draft';
  savingsPerUnit: number;
}

export interface PricingRuleRecord {
  pricingRuleId: string;
  serviceId: string;
  serviceName: string;
  category: string;
  basePrice: number;
  currentTierLabel: string;
  currentPrice: number;
  demandQty: number;
  nextTierLabel: string;
  nextPrice: number;
  nextTargetQty: number;
  unitLabel: string;
  status: 'Active' | 'Inactive';
  tiers: PricingTierDetail[];
  potentialSavingsTotal: number;
  lastChanged: string;
}

export interface PricingHistoryItem {
  historyId: string;
  serviceName: string;
  pricingTier: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  reason: string;
  effectiveDate: string;
  changedAt: string;
}

export const PricingManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create_tier' | 'edit_tier' | 'history'>('dashboard');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('RULE101');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Form State for Create Tier (Screen 85)
  const [selectedServiceForTier, setSelectedServiceForTier] = useState('AC Service');
  const [minQtyInput, setMinQtyInput] = useState('20');
  const [maxQtyInput, setMaxQtyInput] = useState('39');
  const [priceInput, setPriceInput] = useState('599');
  const [tierLabelInput, setTierLabelInput] = useState('Community Tier 3');
  const [effectiveFromInput, setEffectiveFromInput] = useState('Immediately');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Warning Modal State for Price Change (Screen 86.1)
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [newEditPrice, setNewEditPrice] = useState(549);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Sample Pricing Rules Data
  const [pricingRules, setPricingRules] = useState<PricingRuleRecord[]>([
    {
      pricingRuleId: 'RULE101',
      serviceId: 'SVC1001',
      serviceName: 'AC Service',
      category: 'AC',
      basePrice: 799,
      currentTierLabel: '10–19',
      currentPrice: 699,
      demandQty: 18,
      nextTierLabel: '20–39',
      nextPrice: 599,
      nextTargetQty: 20,
      unitLabel: 'ACs',
      status: 'Active',
      potentialSavingsTotal: 12582,
      lastChanged: 'Today, 10:42 AM',
      tiers: [
        { tierId: 'T1', minQty: 1, maxQty: 9, pricePerUnit: 799, label: 'Standard Tier', status: 'Active', savingsPerUnit: 0 },
        { tierId: 'T2', minQty: 10, maxQty: 19, pricePerUnit: 699, label: 'Community Tier 2', status: 'Active', savingsPerUnit: 100 },
        { tierId: 'T3', minQty: 20, maxQty: 39, pricePerUnit: 599, label: 'Community Tier 3', status: 'Active', savingsPerUnit: 200 },
        { tierId: 'T4', minQty: 40, maxQty: 59, pricePerUnit: 549, label: 'Community Tier 4', status: 'Active', savingsPerUnit: 250 },
        { tierId: 'T5', minQty: 60, maxQty: '+', pricePerUnit: 499, label: 'Mega Society Tier', status: 'Active', savingsPerUnit: 300 },
      ],
    },
    {
      pricingRuleId: 'RULE102',
      serviceId: 'SVC1002',
      serviceName: 'Pest Control',
      category: 'Pest',
      basePrice: 999,
      currentTierLabel: '10–19',
      currentPrice: 899,
      demandQty: 12,
      nextTierLabel: '20–29',
      nextPrice: 799,
      nextTargetQty: 20,
      unitLabel: 'Homes',
      status: 'Active',
      potentialSavingsTotal: 8400,
      lastChanged: '25 Aug 2026',
      tiers: [
        { tierId: 'T1', minQty: 1, maxQty: 9, pricePerUnit: 999, label: 'Standard Tier', status: 'Active', savingsPerUnit: 0 },
        { tierId: 'T2', minQty: 10, maxQty: 19, pricePerUnit: 899, label: 'Tier 2', status: 'Active', savingsPerUnit: 100 },
        { tierId: 'T3', minQty: 20, maxQty: 29, pricePerUnit: 799, label: 'Tier 3', status: 'Active', savingsPerUnit: 200 },
      ],
    },
    {
      pricingRuleId: 'RULE103',
      serviceId: 'SVC1003',
      serviceName: 'RO Service',
      category: 'RO',
      basePrice: 749,
      currentTierLabel: '5–9',
      currentPrice: 699,
      demandQty: 8,
      nextTierLabel: '10–19',
      nextPrice: 649,
      nextTargetQty: 10,
      unitLabel: 'Units',
      status: 'Active',
      potentialSavingsTotal: 4200,
      lastChanged: '23 Aug 2026',
      tiers: [
        { tierId: 'T1', minQty: 1, maxQty: 4, pricePerUnit: 749, label: 'Standard Tier', status: 'Active', savingsPerUnit: 0 },
        { tierId: 'T2', minQty: 5, maxQty: 9, pricePerUnit: 699, label: 'Tier 2', status: 'Active', savingsPerUnit: 50 },
        { tierId: 'T3', minQty: 10, maxQty: 19, pricePerUnit: 649, label: 'Tier 3', status: 'Active', savingsPerUnit: 100 },
      ],
    },
    {
      pricingRuleId: 'RULE104',
      serviceId: 'SVC1004',
      serviceName: 'Home Cleaning',
      category: 'Cleaning',
      basePrice: 1499,
      currentTierLabel: '10–19',
      currentPrice: 1299,
      demandQty: 15,
      nextTierLabel: '20–29',
      nextPrice: 1199,
      nextTargetQty: 20,
      unitLabel: 'Homes',
      status: 'Active',
      potentialSavingsTotal: 15000,
      lastChanged: '20 Aug 2026',
      tiers: [
        { tierId: 'T1', minQty: 1, maxQty: 9, pricePerUnit: 1499, label: 'Standard Tier', status: 'Active', savingsPerUnit: 0 },
        { tierId: 'T2', minQty: 10, maxQty: 19, pricePerUnit: 1299, label: 'Tier 2', status: 'Active', savingsPerUnit: 200 },
        { tierId: 'T3', minQty: 20, maxQty: 29, pricePerUnit: 1199, label: 'Tier 3', status: 'Active', savingsPerUnit: 300 },
      ],
    },
  ]);

  // Pricing Audit History Items (Screen 87)
  const [historyLogs] = useState<PricingHistoryItem[]>([
    {
      historyId: 'HIST101',
      serviceName: 'AC Service',
      pricingTier: 'Tier 20–39',
      oldPrice: 649,
      newPrice: 599,
      changedBy: 'Ashish Admin (Super Admin)',
      reason: 'Vendor cost reduction approved',
      effectiveDate: '28 Aug 2026 • 11:00 AM',
      changedAt: 'Today • 10:42 AM',
    },
    {
      historyId: 'HIST102',
      serviceName: 'AC Service',
      pricingTier: 'Tier 40–59',
      oldPrice: 579,
      newPrice: 549,
      changedBy: 'Ashish Admin (Super Admin)',
      reason: 'Volume discount expansion',
      effectiveDate: '25 Aug 2026 • 12:00 AM',
      changedAt: '25 Aug 2026 • 04:15 PM',
    },
    {
      historyId: 'HIST103',
      serviceName: 'RO Service',
      pricingTier: 'Tier 10–19',
      oldPrice: 749,
      newPrice: 699,
      changedBy: 'Admin 02 (Ops Manager)',
      reason: 'Society demand promotion',
      effectiveDate: '23 Aug 2026 • 09:00 AM',
      changedAt: '23 Aug 2026 • 08:30 AM',
    },
    {
      historyId: 'HIST104',
      serviceName: 'Pest Control',
      pricingTier: 'Tier 10–19',
      oldPrice: 949,
      newPrice: 899,
      changedBy: 'Ashish Admin (Super Admin)',
      reason: 'Seasonal discount',
      effectiveDate: '20 Aug 2026 • 10:00 AM',
      changedAt: '20 Aug 2026 • 09:45 AM',
    },
  ]);

  const selectedRule = pricingRules.find((r) => r.pricingRuleId === selectedRuleId) || pricingRules[0];

  const filteredRules = pricingRules.filter((r) => {
    const matchesSearch =
      searchQuery === '' ||
      r.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleValidateAndCreateTier = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const min = Number(minQtyInput);
    const max = Number(maxQtyInput);
    const price = Number(priceInput);

    if (isNaN(min) || isNaN(max) || isNaN(price)) {
      setValidationError('Please enter valid numeric values.');
      return;
    }

    if (max < min) {
      setValidationError('Maximum quantity must be greater than or equal to minimum quantity.');
      return;
    }

    if (price <= 0) {
      setValidationError('Price per unit must be greater than 0.');
      return;
    }

    // Success Toast
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
      setCurrentView('dashboard');
    }, 1200);
  };

  const handleConfirmPriceChange = () => {
    setPricingRules((prev) =>
      prev.map((r) => {
        if (r.pricingRuleId === selectedRule.pricingRuleId) {
          return {
            ...r,
            currentPrice: newEditPrice,
            lastChanged: 'Just now',
          };
        }
        return r;
      })
    );
    setShowWarningModal(false);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
      setCurrentView('dashboard');
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* HEADER & MODULE SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pricing Management</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Manage pricing tiers, bulk pricing rules and automatic society savings opportunities</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('history')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Pricing History (87)</span>
          </button>
          <button
            onClick={() => setCurrentView('create_tier')}
            className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Pricing (85)</span>
          </button>
        </div>
      </div>

      {/* SCREEN 84: PRICING DASHBOARD */}
      {currentView === 'dashboard' && (
        <>
          {/* 84.1 PRICING KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL SERVICES</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">48</h3>
              <span className="text-[11px] font-bold text-slate-500 mt-1 block">Services with Pricing</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BULK PRICING SERVICES</span>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">42</h3>
              <span className="text-[11px] font-bold text-blue-600 mt-1 block">Using Bulk Pricing</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE PRICING TIERS</span>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">186</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Active Tiers</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">POTENTIAL SAVINGS</span>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">₹2.84L</h3>
              <span className="text-[11px] font-bold text-purple-600 mt-1 block">Customer Savings Opportunity</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search service..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              >
                <option value="All">All Categories</option>
                <option value="AC">AC Services</option>
                <option value="Pest">Pest Control</option>
                <option value="RO">RO Services</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
          </div>

          {/* 84.2 PRICING OVERVIEW TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Pricing Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Base Price</th>
                    <th className="py-3.5 px-4">Current Tier</th>
                    <th className="py-3.5 px-4">Current Price</th>
                    <th className="py-3.5 px-4">Demand</th>
                    <th className="py-3.5 px-4">Next Tier Opportunity</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRules.map((rule) => (
                    <tr key={rule.pricingRuleId} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{rule.serviceName}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{rule.category}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{rule.basePrice}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">
                        {rule.currentTierLabel} {rule.unitLabel}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-blue-600">₹{rule.currentPrice}</td>
                      <td className="py-3.5 px-4 font-bold text-amber-600">🔥 {rule.demandQty} {rule.unitLabel}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {rule.nextTierLabel} → ₹{rule.nextPrice}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          {rule.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRuleId(rule.pricingRuleId);
                            setCurrentView('edit_tier');
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg transition-all text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>View / Edit (86)</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SCREEN 90: DEMAND + PRICING CONNECTION CARD & 89 PRICING LADDER */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 90. DEMAND + PRICING CONNECTION CARD */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">AC SERVICE — DEMAND & PRICING MONITOR</h3>
                <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                  🔥 ACTIVE AGGREGATION
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-3 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Aggregated Demand:</span>
                  <span className="font-bold text-slate-900">18 ACs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Tier Applied:</span>
                  <span className="font-bold text-blue-600">10–19 Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Price / AC:</span>
                  <span className="font-extrabold text-blue-600">₹699</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Next Tier (20–39 Units):</span>
                  <span>₹599 / AC (Save ₹100 more!)</span>
                </div>
              </div>

              {/* Progress Bar (18 / 20 ACs) */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">Progress to Next Tier: 18 / 20 ACs</span>
                  <span className="text-emerald-600">2 more ACs needed</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="w-[90%] bg-emerald-500 h-full rounded-full"></div>
                </div>
              </div>
            </div>

            {/* 89. PRICING LADDER VISUALIZATION */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">AC SERVICE — PRICING LADDER (88/89)</h3>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="w-20 font-bold text-slate-600">1–9 Units</span>
                  <div className="flex-1 mx-4 bg-blue-100 h-2.5 rounded-full overflow-hidden">
                    <div className="w-full bg-blue-600 h-full"></div>
                  </div>
                  <span className="font-extrabold text-slate-900">₹799</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
                  <span className="w-20 font-bold">10–19 Units</span>
                  <div className="flex-1 mx-4 bg-blue-200 h-2.5 rounded-full overflow-hidden">
                    <div className="w-[85%] bg-blue-600 h-full"></div>
                  </div>
                  <span className="font-extrabold text-blue-700">₹699 (Active)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <span className="w-20 font-bold">20–39 Units</span>
                  <div className="flex-1 mx-4 bg-emerald-200 h-2.5 rounded-full overflow-hidden">
                    <div className="w-[70%] bg-emerald-600 h-full"></div>
                  </div>
                  <span className="font-extrabold text-emerald-700">₹599 (Next Tier)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="w-20 font-bold text-slate-600">40–59 Units</span>
                  <div className="flex-1 mx-4 bg-purple-100 h-2.5 rounded-full overflow-hidden">
                    <div className="w-[55%] bg-purple-600 h-full"></div>
                  </div>
                  <span className="font-extrabold text-purple-700">₹549</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="w-20 font-bold text-slate-600">60+ Units</span>
                  <div className="flex-1 mx-4 bg-amber-100 h-2.5 rounded-full overflow-hidden">
                    <div className="w-[40%] bg-amber-600 h-full"></div>
                  </div>
                  <span className="font-extrabold text-amber-700">₹499</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SCREEN 85: CREATE PRICING TIER FORM & LIVE PREVIEW */}
      {currentView === 'create_tier' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setCurrentView('dashboard')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create Pricing Tier (85)</h2>
              <p className="text-xs text-slate-500">Define quantity brackets, price per unit & status with real-time tier preview</p>
            </div>
          </div>

          {validationError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 font-bold text-xs">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {showSaveToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>✓ Pricing tier created successfully!</span>
            </div>
          )}

          <form onSubmit={handleValidateAndCreateTier} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 text-xs font-semibold">
            <div>
              <label className="block mb-1 text-slate-700">Select Service *</label>
              <select
                value={selectedServiceForTier}
                onChange={(e) => setSelectedServiceForTier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="AC Service">AC Service (Base ₹799)</option>
                <option value="Pest Control">Pest Control (Base ₹999)</option>
                <option value="RO Service">RO Service (Base ₹749)</option>
                <option value="Home Cleaning">Home Cleaning (Base ₹1,499)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Minimum Quantity *</label>
                <input
                  type="number"
                  value={minQtyInput}
                  onChange={(e) => setMinQtyInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Maximum Quantity *</label>
                <input
                  type="text"
                  value={maxQtyInput}
                  onChange={(e) => setMaxQtyInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Price Per Unit (₹) *</label>
                <input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-blue-600 font-extrabold"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Pricing Label</label>
                <input
                  type="text"
                  value={tierLabelInput}
                  onChange={(e) => setTierLabelInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* 85.3 CUSTOMER SAVINGS PREVIEW */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
              <span className="text-[10px] font-bold uppercase tracking-wider block">CUSTOMER SAVINGS PREVIEW (85.3)</span>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <div>Base Price: ₹799</div>
                <div>Tier Price: ₹{priceInput || '599'}</div>
                <div className="text-emerald-700 font-extrabold">Saving: ₹{799 - Number(priceInput || 599)} / unit</div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentView('dashboard')}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Create Tier (85)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SCREEN 86: EDIT PRICING TIER & 86.1 CHANGE WARNING */}
      {currentView === 'edit_tier' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setCurrentView('dashboard')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Pricing Tier — {selectedRule.serviceName}</h2>
              <p className="text-xs text-slate-500">Update tier prices and review operational impact warning</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 text-xs font-semibold">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <span className="text-blue-900 font-bold">Service: {selectedRule.serviceName}</span>
              <p className="text-slate-600">Current Demand: <strong>18 ACs</strong> | Applicable Price: <strong>₹699 / AC</strong></p>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Quantity Bracket</label>
              <input
                type="text"
                value="20–39 Units"
                readOnly
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Current Price (₹)</label>
                <input
                  type="number"
                  value={selectedRule.nextPrice}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600 font-bold"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">New Price (₹) *</label>
                <input
                  type="number"
                  value={newEditPrice}
                  onChange={(e) => setNewEditPrice(Number(e.target.value))}
                  className="w-full bg-white border border-blue-500 rounded-xl p-2.5 text-xs text-blue-600 font-extrabold focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Effective Date Rule (86.2)</label>
              <select
                value={effectiveFromInput}
                onChange={(e) => setEffectiveFromInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              >
                <option value="Immediately">Immediately</option>
                <option value="Schedule for later">Schedule for later (01 Sep 2026 12:00 AM)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentView('dashboard')}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowWarningModal(true)}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Save Changes (86)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 86.1 PRICING CHANGE WARNING MODAL */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">⚠ Pricing Change Warning</h3>
                <p className="text-xs text-slate-500">Affects future eligible bookings in active demand</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Changing this tier price will adjust the pricing engine calculations for all future bookings in {selectedRule.serviceName}.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 space-y-1">
              <div>Current Price: ₹{selectedRule.nextPrice}</div>
              <div>New Price: ₹{newEditPrice}</div>
              <div>Affected Service: {selectedRule.serviceName}</div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPriceChange}
                className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Confirm Change (86.1)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 87: PRICING HISTORY AUDIT TABLE & DETAILS */}
      {currentView === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setCurrentView('dashboard')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pricing History Audit Trail (87)</h2>
              <p className="text-xs text-slate-500">Complete immutable record of all price tier modifications & effective timestamps</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Pricing Tier</th>
                  <th className="py-3 px-4">Old Price</th>
                  <th className="py-3 px-4">New Price</th>
                  <th className="py-3 px-4">Changed By</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Effective Date</th>
                  <th className="py-3 px-4">Changed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {historyLogs.map((log) => (
                  <tr key={log.historyId} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.serviceName}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">{log.pricingTier}</td>
                    <td className="py-3.5 px-4 text-slate-400 line-through font-bold">₹{log.oldPrice}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{log.newPrice}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{log.changedBy}</td>
                    <td className="py-3.5 px-4 text-slate-600">{log.reason}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{log.effectiveDate}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{log.changedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
