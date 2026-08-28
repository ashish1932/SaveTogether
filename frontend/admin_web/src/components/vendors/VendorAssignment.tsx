import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Star,
  Sparkles,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';

export interface VendorOption {
  id: string;
  name: string;
  rate: number;
  initialRate: number;
  capacity: number;
  rating: number;
  onTimeRate: number;
  available: boolean;
  areaCovered: boolean;
  recommended: boolean;
  shortfall?: number;
}

export const VendorAssignment: React.FC = () => {
  const [step, setStep] = useState<'dashboard' | 'negotiate' | 'confirm' | 'success'>('dashboard');

  // Selected Demand Context
  const demandContext = {
    campaignId: 'CMP10245',
    serviceName: 'AC Service',
    societyName: 'ABC Residency',
    city: 'Salem',
    quantity: 27,
    unitLabel: 'ACs',
    serviceDate: 'Sunday, 30 Aug 2026',
    timeSlot: '09:00 AM - 12:00 PM',
    customerPrice: 599,
  };

  // Vendor Options List
  const [vendors] = useState<VendorOption[]>([
    {
      id: 'VEN1001',
      name: 'CoolCare Services Pvt Ltd',
      rate: 450,
      initialRate: 475,
      capacity: 35,
      rating: 4.8,
      onTimeRate: 95,
      available: true,
      areaCovered: true,
      recommended: true,
    },
    {
      id: 'VEN1002',
      name: 'FreshAir Solutions',
      rate: 470,
      initialRate: 490,
      capacity: 40,
      rating: 4.6,
      onTimeRate: 91,
      available: true,
      areaCovered: true,
      recommended: false,
    },
    {
      id: 'VEN1003',
      name: 'AC Experts India',
      rate: 430,
      initialRate: 460,
      capacity: 20,
      rating: 4.4,
      onTimeRate: 86,
      available: true,
      areaCovered: true,
      recommended: false,
      shortfall: 7,
    },
  ]);

  const [selectedVendor, setSelectedVendor] = useState<VendorOption>(vendors[0]);
  const [negotiatedRate, setNegotiatedRate] = useState<number>(450);
  const [negotiationNotes, setNegotiationNotes] = useState(
    'Vendor agreed to discounted rate due to 27 AC volume in ABC Residency.'
  );
  const [sortBy, setSortBy] = useState<'Recommended' | 'Lowest Price' | 'Highest Rating'>('Recommended');

  // Calculations
  const customerRevenue = demandContext.quantity * demandContext.customerPrice; // 27 * 599 = 16,173
  const vendorCost = demandContext.quantity * negotiatedRate; // 27 * 450 = 12,150
  const grossDifference = customerRevenue - vendorCost; // 4,023
  const grossSpreadPerUnit = demandContext.customerPrice - negotiatedRate; // 149

  const sortedVendors = [...vendors].sort((a, b) => {
    if (sortBy === 'Lowest Price') return a.rate - b.rate;
    if (sortBy === 'Highest Rating') return b.rating - a.rating;
    return (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0);
  });

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Assignment (Phase 21)</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Operational bridge connecting society demand aggregation to vendor negotiation & campaign scheduling
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>Campaign ID:</span>
          <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {demandContext.campaignId}
          </span>
        </div>
      </div>

      {/* 102.1 DEMAND SUMMARY HEADER CARD */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TARGET DEMAND CONTEXT</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {demandContext.serviceName} — {demandContext.societyName} ({demandContext.city})
            </h2>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
            🔥 TARGET REACHED (27 ACs)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-semibold p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 text-[10px] block font-bold">QUANTITY</span>
            <span className="text-slate-900 font-bold text-sm">{demandContext.quantity} {demandContext.unitLabel}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block font-bold">SERVICE DATE</span>
            <span className="text-slate-900 font-bold text-sm">{demandContext.serviceDate}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block font-bold">TIME SLOT</span>
            <span className="text-slate-900 font-bold text-sm">{demandContext.timeSlot}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block font-bold">CUSTOMER TIER PRICE</span>
            <span className="text-blue-600 font-extrabold text-sm">₹{demandContext.customerPrice} / AC</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block font-bold">TOTAL REVENUE</span>
            <span className="text-emerald-600 font-extrabold text-sm">₹{customerRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* STEP 1: ASSIGNMENT DASHBOARD & VENDOR SELECTION (SCREEN 102) */}
      {step === 'dashboard' && (
        <div className="space-y-6">
          {/* 102.4 RECOMMENDED VENDOR HIGHLIGHT BOX */}
          <div className="bg-gradient-to-r from-blue-900 to-[#1769E0] text-white p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 fill-amber-300" />
              <span>✨ RECOMMENDED VENDOR FOR THIS DEMAND</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{vendors[0].name}</h3>
                <p className="text-xs text-blue-100 mt-1">
                  Quoted Cost: <strong className="text-white text-sm">₹{vendors[0].rate} / AC</strong> • Rating: <strong className="text-amber-300">4.8★</strong> • On-Time Rate: <strong>95%</strong>
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedVendor(vendors[0]);
                  setNegotiatedRate(vendors[0].rate);
                  setStep('negotiate');
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                [ SELECT RECOMMENDED VENDOR ]
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold pt-2 border-t border-blue-400/40">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Capacity Sufficient (35 ≥ 27)</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Confirmed Available for 30 Aug</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Service Area Covered (Salem)</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Lowest Reliable Vendor Cost</div>
            </div>
          </div>

          {/* 102.2 & 102.3 VENDOR OPTIONS GRID & COMPARISON */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold text-slate-900">Available Vendor Options & Comparison (102.3)</h3>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold"
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Lowest Price">Lowest Price</option>
                  <option value="Highest Rating">Highest Rating</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sortedVendors.map((v) => (
                <div
                  key={v.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 ${
                    v.id === selectedVendor.id
                      ? 'border-blue-500 bg-blue-50/40 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{v.name}</h4>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{v.rating}★ ({v.onTimeRate}% on-time)</span>
                      </div>
                    </div>
                    {v.recommended && (
                      <span className="bg-blue-100 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quoted Vendor Rate:</span>
                      <span className="font-extrabold text-slate-900">₹{v.rate} / AC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Capacity:</span>
                      <span className="font-bold text-slate-900">{v.capacity} ACs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Required Demand:</span>
                      <span className="font-bold text-slate-900">27 ACs</span>
                    </div>
                  </div>

                  {v.shortfall ? (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>⚠ Insufficient Capacity (Shortfall: {v.shortfall} ACs)</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>✓ Available & Capacity Confirmed</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedVendor(v);
                      setNegotiatedRate(v.rate);
                      setStep('negotiate');
                    }}
                    className={`w-full font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all ${
                      v.id === selectedVendor.id
                        ? 'bg-[#1769E0] text-white hover:bg-blue-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    [ SELECT VENDOR ] (102.2)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: VENDOR NEGOTIATION & GROSS MARGIN PREVIEW (SCREEN 103) */}
      {step === 'negotiate' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <button onClick={() => setStep('dashboard')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Vendor Negotiation (103)</h2>
              <p className="text-xs text-slate-500">Record negotiated vendor rate, calculate gross platform margins & review savings</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-semibold">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <span className="text-blue-900 font-bold text-sm">{selectedVendor.name}</span>
              <p className="text-slate-600">Selected for {demandContext.serviceName} at {demandContext.societyName} ({demandContext.quantity} ACs)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">Initial Quoted Price (₹)</label>
                <input
                  type="number"
                  value={selectedVendor.initialRate}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Negotiated Final Rate (₹ / AC) *</label>
                <input
                  type="number"
                  value={negotiatedRate}
                  onChange={(e) => setNegotiatedRate(Number(e.target.value))}
                  className="w-full bg-white border border-blue-500 rounded-xl p-2.5 text-xs font-extrabold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 103.3 GROSS MARGIN & FINANCIAL CALCULATOR */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">GROSS MARGIN & FINANCIAL SPREAD PREVIEW (103.3)</h4>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">CUSTOMER TIER PRICE</span>
                  <span className="text-lg font-extrabold text-blue-600">₹{demandContext.customerPrice}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">NEGOTIATED COST</span>
                  <span className="text-lg font-extrabold text-slate-900">₹{negotiatedRate}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">GROSS MARGIN / UNIT</span>
                  <span className="text-lg font-extrabold text-emerald-600">₹{grossSpreadPerUnit}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-bold pt-2 border-t border-slate-200/60 text-slate-700">
                <div>Total Customer Revenue: <strong className="text-blue-600">₹{customerRevenue.toLocaleString('en-IN')}</strong></div>
                <div>Total Vendor Cost: <strong className="text-slate-900">₹{vendorCost.toLocaleString('en-IN')}</strong></div>
                <div>Gross Difference: <strong className="text-emerald-600">₹{grossDifference.toLocaleString('en-IN')}</strong></div>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Internal Admin Negotiation Notes</label>
              <textarea
                value={negotiationNotes}
                onChange={(e) => setNegotiationNotes(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('dashboard')}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Back to Vendor Options
              </button>
              <button
                type="button"
                onClick={() => setStep('confirm')}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Save & Proceed to Confirmation (104)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: ASSIGNMENT CONFIRMATION MODAL & CHECKLIST (SCREEN 104) */}
      {step === 'confirm' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-5 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Confirm Vendor Assignment (104)</h3>
              <button onClick={() => setStep('negotiate')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Vendor:</span>
                <span className="font-bold text-slate-900">{selectedVendor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service & Society:</span>
                <span className="font-bold text-slate-900">{demandContext.serviceName} • {demandContext.societyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Demand Quantity:</span>
                <span className="font-bold text-blue-600">{demandContext.quantity} ACs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Final Vendor Rate:</span>
                <span className="font-bold text-slate-900">₹{negotiatedRate} / AC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Tier Price:</span>
                <span className="font-bold text-blue-600">₹{demandContext.customerPrice} / AC</span>
              </div>
            </div>

            {/* 104.1 Operational Checklist */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
              <span className="text-[10px] font-bold uppercase tracking-wider block">OPERATIONAL CHECKLIST VERIFIED (104.1)</span>
              <div className="space-y-1 text-[11px] font-bold">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Vendor provides AC Servicing</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Service coverage verified for ABC Residency</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Available for Sunday, 30 Aug (09:00 AM - 12:00 PM)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Daily capacity verified ({selectedVendor.capacity} ≥ 27)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Final rate recorded at ₹{negotiatedRate} / AC</div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('negotiate')}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep('success')}
                className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                CONFIRM VENDOR (104)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: ASSIGNMENT SUCCESS (SCREEN 104.2) */}
      {step === 'success' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">CAMPAIGN SCHEDULED (104.2)</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Vendor Assigned Successfully!</h2>
            <p className="text-xs text-slate-500 mt-1">
              {selectedVendor.name} has been assigned to complete {demandContext.quantity} AC Servicing jobs at {demandContext.societyName}.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold space-y-2 text-slate-700 text-left">
            <div className="flex justify-between"><span>Campaign ID:</span><span className="font-mono font-bold text-blue-600">{demandContext.campaignId}</span></div>
            <div className="flex justify-between"><span>Assigned Vendor:</span><span className="font-bold text-slate-900">{selectedVendor.name}</span></div>
            <div className="flex justify-between"><span>Service Date & Time:</span><span className="font-bold text-slate-900">{demandContext.serviceDate} ({demandContext.timeSlot})</span></div>
            <div className="flex justify-between"><span>Final Vendor Rate:</span><span className="font-bold text-slate-900">₹{negotiatedRate} / AC</span></div>
            <div className="flex justify-between"><span>Total Vendor Cost:</span><span className="font-extrabold text-slate-900">₹{vendorCost.toLocaleString('en-IN')}</span></div>
          </div>

          <button
            onClick={() => setStep('dashboard')}
            className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer"
          >
            [ VIEW CAMPAIGN ]
          </button>
        </div>
      )}
    </div>
  );
};
