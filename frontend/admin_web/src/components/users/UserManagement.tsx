import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  UserPlus,
  Eye,
  ArrowLeft,
  AlertTriangle,
  Lock,
  Unlock,
  X,
  ChevronRight
} from 'lucide-react';

export interface UserRecord {
  id: string;
  name: string;
  mobile: string;
  email: string;
  society: string;
  status: 'Active' | 'Blocked';
  joinedOn: string;
  lastActive: string;
  userType: string;
  totalBookings: number;
  totalSpent: number;
  referralCode: string;
  kycVerified: boolean;
  walletBalance: number;
  pendingBalance: number;
  totalEarned: number;
  usedBalance: number;
}

export const UserManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'details'>('list');
  const [selectedUserId, setSelectedUserId] = useState<string>('USR10001');
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'referrals' | 'wallet' | 'activity'>('overview');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [societyFilter, setSocietyFilter] = useState('All Societies');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Block Modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('Suspicious Activity');
  const [blockNotes, setBlockNotes] = useState('');

  // Sample User Data
  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'USR10001',
      name: 'Rahul Kumar',
      mobile: '+91 98765 43210',
      email: 'rahul.kumar@email.com',
      society: 'ABC Residency',
      status: 'Active',
      joinedOn: '25 Aug 2026',
      lastActive: '27 Aug 2026, 09:15 AM',
      userType: 'Customer',
      totalBookings: 24,
      totalSpent: 18450,
      referralCode: 'RAHUL20',
      kycVerified: true,
      walletBalance: 300,
      pendingBalance: 100,
      totalEarned: 400,
      usedBalance: 100,
    },
    {
      id: 'USR10002',
      name: 'Priya Sharma',
      mobile: '+91 91234 56789',
      email: 'priya.sharma@email.com',
      society: 'Green Meadows',
      status: 'Active',
      joinedOn: '24 Aug 2026',
      lastActive: '26 Aug 2026',
      userType: 'Customer',
      totalBookings: 12,
      totalSpent: 9200,
      referralCode: 'PRIYA50',
      kycVerified: true,
      walletBalance: 150,
      pendingBalance: 50,
      totalEarned: 200,
      usedBalance: 50,
    },
    {
      id: 'USR10003',
      name: 'Arjun Nair',
      mobile: '+91 98767 54221',
      email: 'arjun.nair@email.com',
      society: 'Skyline Apartments',
      status: 'Active',
      joinedOn: '24 Aug 2026',
      lastActive: '25 Aug 2026',
      userType: 'Customer',
      totalBookings: 8,
      totalSpent: 6400,
      referralCode: 'ARJUN10',
      kycVerified: true,
      walletBalance: 50,
      pendingBalance: 0,
      totalEarned: 50,
      usedBalance: 0,
    },
    {
      id: 'USR10004',
      name: 'Sneha Iyer',
      mobile: '+91 87766 65444',
      email: 'sneha.iyer@email.com',
      society: 'Sunshine Enclave',
      status: 'Blocked',
      joinedOn: '22 Aug 2026',
      lastActive: '23 Aug 2026',
      userType: 'Customer',
      totalBookings: 2,
      totalSpent: 1500,
      referralCode: 'SNEHA25',
      kycVerified: false,
      walletBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      usedBalance: 0,
    },
    {
      id: 'USR10005',
      name: 'Vikram Singh',
      mobile: '+91 77665 44332',
      email: 'vikram.singh@email.com',
      society: 'Maple Heights',
      status: 'Active',
      joinedOn: '21 Aug 2026',
      lastActive: '26 Aug 2026',
      userType: 'Customer',
      totalBookings: 15,
      totalSpent: 12100,
      referralCode: 'VIKRAM90',
      kycVerified: true,
      walletBalance: 200,
      pendingBalance: 50,
      totalEarned: 250,
      usedBalance: 50,
    },
  ]);

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobile.includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSociety = societyFilter === 'All Societies' || u.society === societyFilter;
    const matchesStatus = statusFilter === 'All Status' || u.status === statusFilter;

    return matchesSearch && matchesSociety && matchesStatus;
  });

  const handleToggleBlockStatus = () => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            status: u.status === 'Active' ? 'Blocked' : 'Active',
          };
        }
        return u;
      })
    );
    setShowBlockModal(false);
  };

  return (
    <div className="space-y-6">
      {/* VIEW 1: USER LIST / SEARCH / FILTERS */}
      {currentView === 'list' && (
        <>
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Manage all platform users, accounts and permissions</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer">
                <UserPlus className="w-4 h-4" />
                <span>+ Add User</span>
              </button>
              <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export ▼</span>
              </button>
            </div>
          </div>

          {/* SCREEN 63 KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL USERS</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">12,450</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">↑ +12.5% vs last 30 days</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE USERS</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">11,245</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">↑ +10.3% vs last 30 days</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BLOCKED USERS</span>
              <h3 className="text-2xl font-bold text-red-600 mt-1">98</h3>
              <span className="text-[11px] font-bold text-red-600 mt-1 block">↓ -2.1% vs last 30 days</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NEW THIS MONTH</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1,245</h3>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">↑ +15.8% vs last 30 days</span>
            </div>
          </div>

          {/* SCREEN 64 SEARCH & SCREEN 65 FILTERS BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, mobile, email or ID..."
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
                {(societyFilter !== 'All Societies' || statusFilter !== 'All Status') && (
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                )}
              </button>
            </div>
          </div>

          {/* SCREEN 63 DATA TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Mobile</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Society / Area</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Joined On</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <p className="text-sm font-bold text-slate-700">No users found</p>
                        <p className="text-xs text-slate-400 mt-1">Try a different name, phone number, email or user ID.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{u.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <span>
                            {searchQuery && u.name.toLowerCase().includes(searchQuery.toLowerCase()) ? (
                              <mark className="bg-yellow-200 text-slate-900 rounded px-0.5">{u.name}</mark>
                            ) : (
                              u.name
                            )}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{u.mobile}</td>
                        <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-semibold">{u.society}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              u.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {u.status === 'Active' ? 'Active' : 'Blocked'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{u.joinedOn}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setCurrentView('details');
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg transition-all text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
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
              <span>Showing 1 to {filteredUsers.length} of 12,450 users</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, '...', 1245].map((p, i) => (
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

      {/* VIEW 2: USER DETAILS (SCREENS 66, 67, 68, 69, 70) */}
      {currentView === 'details' && (
        <>
          {/* Breadcrumb & Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <button onClick={() => setCurrentView('list')} className="hover:text-blue-600 flex items-center gap-1 font-bold">
                <ArrowLeft className="w-4 h-4" />
                <span>Users</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-bold">User Details</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                <span>Edit User</span>
              </button>
              <button
                onClick={() => setShowBlockModal(true)}
                className={`font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                  selectedUser.status === 'Active'
                    ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200'
                }`}
              >
                {selectedUser.status === 'Active' ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Block User (70)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unblock User</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SCREEN 66 USER PROFILE HEADER */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center shadow-sm">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{selectedUser.name}</h2>
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedUser.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedUser.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>📱 {selectedUser.mobile}</span>
                  <span>•</span>
                  <span>✉️ {selectedUser.email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* DETAIL TABS HEADER */}
          <div className="border-b border-slate-200 flex gap-6">
            {(['overview', 'bookings', 'referrals', 'wallet', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'overview' && 'Overview (66)'}
                {tab === 'bookings' && 'Bookings (67)'}
                {tab === 'referrals' && 'Referrals (68)'}
                {tab === 'wallet' && 'Wallet (69)'}
                {tab === 'activity' && 'Activity Logs'}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW (SCREEN 66) */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CONTACT & LOCATION</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Mobile Number</span>
                    <span className="font-bold text-slate-900">{selectedUser.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Email Address</span>
                    <span className="font-bold text-slate-900">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Society / Area</span>
                    <span className="font-bold text-blue-600">{selectedUser.society}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Full Address</span>
                    <span className="font-medium text-slate-800">Flat 402, Block A, {selectedUser.society}, Salem - 636001</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ACCOUNT INFORMATION</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Joined Date</span>
                    <span className="font-bold text-slate-900">{selectedUser.joinedOn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Last Active</span>
                    <span className="font-bold text-slate-900">{selectedUser.lastActive}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Total Bookings</span>
                    <span className="font-bold text-blue-600">{selectedUser.totalBookings} Bookings</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Total Spent</span>
                    <span className="font-bold text-emerald-600">₹{selectedUser.totalSpent.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">KYC Status</span>
                    <span className="font-bold text-emerald-600">✓ Verified</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Referral Code</span>
                    <span className="font-bold text-purple-600 font-mono">{selectedUser.referralCode}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS (SCREEN 67) */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Booking History</h3>
                  <p className="text-xs text-slate-400">Total {selectedUser.totalBookings} bookings recorded</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[
                      { id: '#BK10245', service: 'AC Servicing (2 ACs)', date: '25 Aug 2026', amount: '₹1,398', status: 'Completed' },
                      { id: '#BK10212', service: 'Home Cleaning', date: '20 Aug 2026', amount: '₹899', status: 'Completed' },
                      { id: '#BK10188', service: 'Pest Control', date: '15 Aug 2026', amount: '₹1,199', status: 'Completed' },
                      { id: '#BK10145', service: 'RO Service', date: '10 Aug 2026', amount: '₹749', status: 'Completed' },
                      { id: '#BK10102', service: 'Plumbing Service', date: '05 Aug 2026', amount: '₹1,249', status: 'Completed' },
                      { id: '#BK10078', service: 'AC Servicing (1 AC)', date: '28 Jul 2026', amount: '₹799', status: 'Cancelled' },
                    ].map((b, i) => (
                      <tr key={i} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{b.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{b.service}</td>
                        <td className="py-3.5 px-4 text-slate-500">{b.date}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{b.amount}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="text-slate-400 hover:text-blue-600 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: REFERRALS (SCREEN 68) */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              {/* Referral Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">INVITED</span>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">12</h4>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">SUCCESSFUL</span>
                  <h4 className="text-xl font-bold text-emerald-600 mt-1">8</h4>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">PENDING</span>
                  <h4 className="text-xl font-bold text-amber-600 mt-1">4</h4>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">REWARDS EARNED</span>
                  <h4 className="text-xl font-bold text-blue-600 mt-1">₹400</h4>
                </div>
              </div>

              {/* Referral History Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Referral History</h3>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Referred User</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Joined On</th>
                      <th className="py-3 px-4">Booking Completed</th>
                      <th className="py-3 px-4">Reward</th>
                      <th className="py-3 px-4">Reward Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[
                      { user: 'Priya Sharma', status: 'Successful', joined: '24 Aug 2026', booking: '25 Aug 2026', reward: '₹50', rStatus: 'Earned' },
                      { user: 'Arjun Nair', status: 'Successful', joined: '22 Aug 2026', booking: '24 Aug 2026', reward: '₹50', rStatus: 'Earned' },
                      { user: 'Vikram Singh', status: 'Pending', joined: '26 Aug 2026', booking: '—', reward: '₹50', rStatus: 'Pending' },
                      { user: 'Meera Joshi', status: 'Pending', joined: '27 Aug 2026', booking: '—', reward: '₹50', rStatus: 'Pending' },
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-bold text-slate-800">{r.user}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Successful' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{r.joined}</td>
                        <td className="py-3.5 px-4 text-slate-500">{r.booking}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">{r.reward}</td>
                        <td className="py-3.5 px-4 font-bold">{r.rStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WALLET (SCREEN 69) */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              {/* Wallet Summary Hero */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">AVAILABLE WALLET BALANCE</span>
                  <h2 className="text-4xl font-extrabold mt-1">₹300</h2>
                </div>
                <div className="flex gap-4 text-center">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
                    <span className="text-[10px] text-blue-200 block">Pending</span>
                    <span className="font-bold text-sm">₹100</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
                    <span className="text-[10px] text-blue-200 block">Total Earned</span>
                    <span className="font-bold text-sm">₹400</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
                    <span className="text-[10px] text-blue-200 block">Used</span>
                    <span className="font-bold text-sm">₹100</span>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Wallet Transactions</h3>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Related ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[
                      { date: '27 Aug 2026', desc: 'Referral Reward from Priya Sharma', type: 'Credit', amount: '+₹50', status: 'Earned', ref: '#BK10245' },
                      { date: '25 Aug 2026', desc: 'Referral Reward from Arjun Nair', type: 'Credit', amount: '+₹50', status: 'Earned', ref: '#BK10212' },
                      { date: '24 Aug 2026', desc: 'Rewards Used on Booking', type: 'Debit', amount: '-₹100', status: 'Used', ref: '#BK10212' },
                      { date: '20 Aug 2026', desc: 'Referral Reward from Sneha Iyer', type: 'Credit', amount: '+₹50', status: 'Pending', ref: '—' },
                    ].map((tx, i) => (
                      <tr key={i} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 text-slate-500">{tx.date}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{tx.desc}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${tx.type === 'Credit' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 font-extrabold ${tx.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'}`}>{tx.amount}</td>
                        <td className="py-3.5 px-4 font-bold">{tx.status}</td>
                        <td className="py-3.5 px-4 font-mono text-blue-600">{tx.ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* SCREEN 65 FILTER DRAWER */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">User Filters</h3>
                <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-2">Society / Area</label>
                  <select
                    value={societyFilter}
                    onChange={(e) => setSocietyFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option>All Societies</option>
                    <option>ABC Residency</option>
                    <option>Green Meadows</option>
                    <option>Skyline Apartments</option>
                    <option>Sunshine Enclave</option>
                    <option>Maple Heights</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Blocked</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setSocietyFilter('All Societies');
                  setStatusFilter('All Status');
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

      {/* SCREEN 70 BLOCK / UNBLOCK USER MODAL */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedUser.status === 'Active' ? 'Block User Account' : 'Unblock User Account'}
                </h3>
                <p className="text-xs text-slate-500">{selectedUser.name} ({selectedUser.id})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedUser.status === 'Active'
                ? 'Are you sure you want to block this user? The user will not be able to log in, book services, or use their wallet balance.'
                : 'Are you sure you want to unblock this user? This will restore complete access to their account.'}
            </p>

            {selectedUser.status === 'Active' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Blocking *</label>
                  <select
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option>Suspicious Activity</option>
                    <option>Policy Violation</option>
                    <option>Fraudulent Activity</option>
                    <option>Repeated Complaints</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes</label>
                  <textarea
                    value={blockNotes}
                    onChange={(e) => setBlockNotes(e.target.value)}
                    placeholder="Enter details regarding this action..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 h-20"
                  ></textarea>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowBlockModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleBlockStatus}
                className={`w-1/2 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer ${
                  selectedUser.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {selectedUser.status === 'Active' ? 'Confirm Block' : 'Confirm Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
