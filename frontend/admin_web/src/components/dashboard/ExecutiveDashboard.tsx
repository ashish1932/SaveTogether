import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Wrench,
  TrendingUp,
  CalendarCheck,
  Truck,
  CreditCard,
  Percent,
  MessageSquareWarning,
  Star,
  Gift,
  Bell,
  BarChart3,
  Settings,
  Plus,
  Search,
  Calendar,
  ChevronDown,
  Download,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  LogOut,
  Menu,
  Droplet,
  Home,
  ShieldAlert,
  UserPlus
} from 'lucide-react';

import { UserManagement } from '../users/UserManagement';
import { SocietyManagement } from '../societies/SocietyManagement';
import { ServiceManagement } from '../services/ServiceManagement';
import { PricingManagement } from '../pricing/PricingManagement';
import { DemandManagement } from '../demand/DemandManagement';
import { VendorManagement } from '../vendors/VendorManagement';
import { VendorAssignment } from '../vendors/VendorAssignment';
import { BookingManagement } from '../bookings/BookingManagement';
import { PaymentManagement } from '../payments/PaymentManagement';
import { ReferralManagement } from '../referrals/ReferralManagement';
import { SupportManagement } from '../support/SupportManagement';
import { NotificationManagement } from '../notifications/NotificationManagement';
import { ReportsManagement } from '../reports/ReportsManagement';
import { SettingsManagement } from '../settings/SettingsManagement';

interface ExecutiveDashboardProps {
  adminEmail: string;
  onLogout: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ adminEmail, onLogout }) => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [dateRange] = useState('27 Aug 2026 - 27 Aug 2026');
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Services', icon: Wrench },
    { name: 'Demand Management', icon: TrendingUp },
    { name: 'Bookings', icon: CalendarCheck },
    { name: 'Vendors', icon: Truck },
    { name: 'Payments', icon: CreditCard },
    { name: 'Commission', icon: Percent },
    { name: 'Complaints', icon: MessageSquareWarning },
    { name: 'Reviews & Ratings', icon: Star },
    { name: 'Referral & Rewards', icon: Gift },
    { name: 'Notifications', icon: Bell },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  const kpis = [
    { title: 'TOTAL USERS', value: '12,450', growth: '+12.5%', icon: Users, isUp: true, color: 'blue' },
    { title: 'TOTAL BOOKINGS', value: '1,284', growth: '+8.7%', icon: CalendarCheck, isUp: true, color: 'emerald' },
    { title: 'ACTIVE DEMAND', value: '38', growth: '+15.2%', icon: TrendingUp, isUp: true, color: 'purple' },
    { title: 'REVENUE', value: '₹8.42L', growth: '+18.3%', icon: CreditCard, isUp: true, color: 'amber' },
    { title: 'COMMISSION', value: '₹1.26L', growth: '+17.6%', icon: Percent, isUp: true, color: 'teal' },
  ];

  const topServices = [
    { name: 'AC Servicing', bookings: 542, icon: Wrench, color: 'bg-blue-500' },
    { name: 'Pest Control', bookings: 218, icon: ShieldAlert, color: 'bg-emerald-500' },
    { name: 'RO Water Purifier Service', bookings: 186, icon: Droplet, color: 'bg-purple-500' },
    { name: 'Home Cleaning', bookings: 142, icon: Home, color: 'bg-amber-500' },
    { name: 'Plumbing', bookings: 98, icon: Wrench, color: 'bg-blue-600' },
  ];

  const demandOpportunities = [
    { service: 'AC Servicing', society: 'ABC Residency', potential: '+24' },
    { service: 'Pest Control', society: 'Green Meadows', potential: '+18' },
    { service: 'RO Service', society: 'Skyline Apartments', potential: '+15' },
    { service: 'Home Cleaning', society: 'Sunshine Enclave', potential: '+12' },
    { service: 'Water Tank Cleaning', society: 'Maple Heights', potential: '+10' },
  ];

  const pendingActions = [
    { title: 'Pending Vendor Approvals', subtitle: 'Vendors awaiting approval', count: 12, color: 'bg-red-100 text-red-700 border-red-200' },
    { title: 'Pending Refund Requests', subtitle: 'Refunds waiting for approval', count: 8, color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { title: 'Open Complaints', subtitle: 'Complaints need to be resolved', count: 15, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { title: 'Unverified Services', subtitle: 'Services awaiting verification', count: 6, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { title: 'Low Demand Services', subtitle: 'Services need promotion', count: 9, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  ];

  const recentActivity = [
    { type: 'booking', title: 'New booking received', subtitle: '#BK10248 • AC Servicing', time: '2 min ago', icon: CalendarCheck, iconBg: 'bg-blue-100 text-blue-600' },
    { type: 'payment', title: 'Payment received', subtitle: '₹2,998 • BK10247', time: '5 min ago', icon: CreditCard, iconBg: 'bg-emerald-100 text-emerald-600' },
    { type: 'user', title: 'New user registered', subtitle: 'Rahul Kumar', time: '12 min ago', icon: UserPlus, iconBg: 'bg-purple-100 text-purple-600' },
    { type: 'complaint', title: 'Complaint raised', subtitle: '#C1023 • Payment Issue', time: '25 min ago', icon: MessageSquareWarning, iconBg: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex font-sans antialiased text-[#102A56]">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shadow-sm z-20 flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
              <img src="/app_logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-lg" onError={(e) => (e.target as HTMLElement).style.display = 'none'} />
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">SaveTogether</h1>
              <span className="text-[10px] font-semibold text-emerald-600 tracking-wide uppercase">Admin Portal</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1769E0] text-white shadow-md shadow-blue-500/20 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions & Footer */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Quick Actions</span>
            <button className="w-full bg-[#1769E0] hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
            <div className="grid grid-cols-2 gap-1.5">
              <button className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px] py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer">
                Manage Pricing
              </button>
              <button className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px] py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer">
                View Bookings
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>SaveTogether Admin</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* 2. TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900">{activeNav}</h2>

            {/* Search Bar */}
            <div className="relative ml-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-all">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  8
                </span>
              </button>
            </div>

            {/* Admin Avatar Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-sm">
                  A
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Ashish Admin</p>
                  <p className="text-[10px] font-semibold text-slate-400">Super Admin</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{adminEmail}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">● Session Active</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. MAIN DASHBOARD CONTENT */}
        <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          {activeNav === 'Users' ? (
            <UserManagement />
          ) : activeNav === 'Demand Management' || activeNav === 'Demand' ? (
            <DemandManagement />
          ) : activeNav === 'Societies' ? (
            <SocietyManagement />
          ) : activeNav === 'Services' ? (
            <ServiceManagement />
          ) : activeNav === 'Commission' || activeNav === 'Pricing' ? (
            <PricingManagement />
          ) : activeNav === 'Vendors' ? (
            <VendorManagement />
          ) : activeNav === 'Vendor Assignment' || activeNav === 'Assignment' ? (
            <VendorAssignment />
          ) : activeNav === 'Bookings' ? (
            <BookingManagement />
          ) : activeNav === 'Payments' ? (
            <PaymentManagement />
          ) : activeNav === 'Referral & Rewards' || activeNav === 'Referrals' ? (
            <ReferralManagement />
          ) : activeNav === 'Complaints & Support' || activeNav === 'Support' || activeNav === 'Complaints' ? (
            <SupportManagement />
          ) : activeNav === 'Notifications' ? (
            <NotificationManagement />
          ) : activeNav === 'Reports & Analytics' || activeNav === 'Reports' ? (
            <ReportsManagement />
          ) : activeNav === 'Settings' ? (
            <SettingsManagement />
          ) : (
            <>
              {/* Header Title & Export */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Real-time overview of your SaveTogether platform performance & society demand aggregation
                  </p>
                </div>
            <button className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>

          {/* 5 KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{kpi.title}</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1769E0] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</h3>
                  <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-emerald-600">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{kpi.growth}</span>
                    <span className="text-slate-400 font-normal text-[10px] ml-1">vs last 30 days</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CHARTS SECTION (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Overview Chart Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Revenue Overview</h3>
                  <p className="text-xs text-slate-400 font-medium">₹ in Lakhs</p>
                </div>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                  <option>This Month</option>
                </select>
              </div>

              {/* Mock Line Chart Visualization */}
              <div className="h-56 w-full pt-4 flex flex-col justify-between relative">
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-300 pointer-events-none border-b border-slate-100">
                  <div className="border-b border-slate-100 pb-1">10L</div>
                  <div className="border-b border-slate-100 pb-1">8L</div>
                  <div className="border-b border-slate-100 pb-1">6L</div>
                  <div className="border-b border-slate-100 pb-1">4L</div>
                  <div className="border-b border-slate-100 pb-1">2L</div>
                </div>

                {/* SVG Trend Path */}
                <svg className="w-full h-44 overflow-visible z-10" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1769E0" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1769E0" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 110 Q 50 90, 100 70 T 200 65 T 300 40 T 400 50 T 500 20"
                    fill="none"
                    stroke="#1769E0"
                    strokeWidth="3"
                  />
                  <path
                    d="M 0 110 Q 50 90, 100 70 T 200 65 T 300 40 T 400 50 T 500 20 L 500 150 L 0 150 Z"
                    fill="url(#revenueGrad)"
                  />
                  {/* Interactive Tooltip Node */}
                  <circle cx="350" cy="45" r="5" fill="#1769E0" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Tooltip Overlay */}
                <div className="absolute top-6 left-2/3 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg z-20">
                  20 Aug 2026: ₹ 8.42 Lakhs
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-2">
                  <span>28 Jul</span>
                  <span>02 Aug</span>
                  <span>07 Aug</span>
                  <span>12 Aug</span>
                  <span>17 Aug</span>
                  <span>22 Aug</span>
                  <span>27 Aug</span>
                </div>
              </div>
            </div>

            {/* Bookings Overview Chart Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Bookings Overview</h3>
                  <p className="text-xs text-slate-400 font-medium">Daily Completed & Aggregated Bookings</p>
                </div>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                  <option>This Month</option>
                </select>
              </div>

              {/* Mock Bar Chart Visualization */}
              <div className="h-56 w-full pt-4 flex flex-col justify-between relative">
                <div className="flex items-end justify-between gap-1.5 h-44 px-2">
                  {[35, 45, 60, 50, 80, 95, 120, 75, 65, 85, 110, 140, 90, 105, 130, 115, 150, 122, 98, 110, 135, 125, 140, 105, 115, 90, 100].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${(h / 150) * 100}%` }}
                      className={`w-full rounded-t-md transition-all cursor-pointer ${
                        i === 17 ? 'bg-emerald-500' : 'bg-blue-500/80 hover:bg-blue-600'
                      }`}
                      title={`Day ${i + 1}: ${h} Bookings`}
                    ></div>
                  ))}
                </div>

                {/* Tooltip Overlay */}
                <div className="absolute top-8 right-1/4 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg z-20">
                  20 Aug 2026: Bookings: 122
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-2">
                  <span>28 Jul</span>
                  <span>02 Aug</span>
                  <span>07 Aug</span>
                  <span>12 Aug</span>
                  <span>17 Aug</span>
                  <span>22 Aug</span>
                  <span>27 Aug</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3-COLUMN SECTIONS (Top Services, Demand Opportunities, Pending Actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Services */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Top Services</h3>
                  <p className="text-xs text-slate-400 font-medium">By Number of Bookings</p>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">View All</button>
              </div>

              <div className="space-y-3">
                {topServices.map((svc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${svc.color} text-white rounded-lg flex items-center justify-center`}>
                        <svc.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{svc.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {svc.bookings}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demand Opportunities (Unique SaveTogether Aggregation Model) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Demand Opportunities</h3>
                  <p className="text-xs text-slate-400 font-medium">High potential services in your societies</p>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">View All</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                      <th className="pb-2 font-bold">Service</th>
                      <th className="pb-2 font-bold">Society / Area</th>
                      <th className="pb-2 text-right font-bold">Potential</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {demandOpportunities.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 font-bold text-slate-800">{row.service}</td>
                        <td className="py-2.5 text-slate-500">{row.society}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-600">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-extrabold">
                            {row.potential}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Pending Actions</h3>
                  <p className="text-xs text-slate-400 font-medium">Requires your attention</p>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">View All</button>
              </div>

              <div className="space-y-2.5">
                {pendingActions.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{action.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{action.subtitle}</p>
                    </div>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${action.color}`}>
                      {action.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: RECENT ACTIVITY + PLATFORM HEALTH */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Recent Activity Feed (3 Columns Width) */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentActivity.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-7 h-7 rounded-lg ${act.iconBg} flex items-center justify-center`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{act.time}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{act.title}</p>
                      <p className="text-[11px] font-semibold text-blue-600 mt-1">{act.subtitle}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform Health Card (1 Column Width) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Platform Health</h4>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      ● All systems operational
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed font-medium">
                  Payment gateways, vendor dispatch engine & society demand aggregation servers are running smoothly.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>System Uptime</span>
                <span className="text-emerald-600 font-extrabold">99.98%</span>
              </div>
            </div>
          </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
