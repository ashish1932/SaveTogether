import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  Send,
  Lock,
  Download,
  Paperclip,
  X
} from 'lucide-react';

export interface ComplaintRecord {
  id: string;
  customerName: string;
  mobile: string;
  bookingId: string;
  serviceName: string;
  societyName: string;
  vendorName: string;
  category: 'Service Quality' | 'Payment' | 'Vendor' | 'Refund' | 'Booking' | 'Other';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo: string;
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  description: string;
  attachments: string[];
  createdDate: string;
  conversation: { sender: 'Customer' | 'Admin'; text: string; timestamp: string }[];
  internalNotes: string[];
  history: { action: string; timestamp: string }[];
}

export const SupportManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'details'>('overview');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('C1023');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Assign Modal State (Screen 128)
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedAgent, setAssignedAgent] = useState('Support Agent 01');
  const [assignNote, setAssignNote] = useState('Please investigate AC cooling complaint with CoolCare vendor team.');

  // Resolve Modal State (Screen 129)
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionType, setResolutionType] = useState('Service Revisit');
  const [resolutionNotes, setResolutionNotes] = useState('Vendor revisit scheduled for Sunday 30 Aug 10:00 AM. AC cooling issue will be reinspected at zero extra cost.');
  const [notifyCustomer, setNotifyCustomer] = useState(true);

  // Chat message input state
  const [chatInput, setChatInput] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState('');

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sample Complaints Database
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([
    {
      id: 'C1023',
      customerName: 'Rahul Kumar',
      mobile: '+91 98765 43210',
      bookingId: '#BK10245',
      serviceName: 'AC General Service (2 ACs)',
      societyName: 'ABC Residency',
      vendorName: 'CoolCare Services Pvt Ltd',
      category: 'Service Quality',
      priority: 'HIGH',
      assignedTo: 'Support Agent 01',
      status: 'IN_PROGRESS',
      description: 'The technician completed the service but the split AC in master bedroom is still not cooling properly.',
      attachments: ['ac_indoor_unit.jpg', 'temperature_reading.jpg'],
      createdDate: 'Today, 10:20 AM',
      conversation: [
        { sender: 'Customer', text: 'The technician completed the service but the AC is still not cooling.', timestamp: '10:20 AM' },
        { sender: 'Admin', text: 'We are investigating this issue with CoolCare Services. Revisit scheduled.', timestamp: '10:35 AM' },
        { sender: 'Customer', text: 'Okay thank you, please send technician on Sunday slot.', timestamp: '10:40 AM' },
      ],
      internalNotes: ['Contacted CoolCare Operations Manager. Technician Vikram assigned for free revisit on Sunday.'],
      history: [
        { action: 'Customer created complaint', timestamp: 'Today, 10:20 AM' },
        { action: 'Categorized: Service Quality', timestamp: 'Today, 10:25 AM' },
        { action: 'Priority raised to HIGH', timestamp: 'Today, 10:31 AM' },
        { action: 'Assigned to Support Agent 01', timestamp: 'Today, 10:35 AM' },
      ],
    },
    {
      id: 'C1022',
      customerName: 'Priya Sharma',
      mobile: '+91 97654 32109',
      bookingId: '#BK10244',
      serviceName: 'Full Home Deep Cleaning',
      societyName: 'Green Meadows',
      vendorName: 'CleanPro Services',
      category: 'Payment',
      priority: 'MEDIUM',
      assignedTo: 'Unassigned',
      status: 'NEW',
      description: 'Amount deducted twice during payment processing on UPI.',
      attachments: ['upi_receipt.pdf'],
      createdDate: 'Today, 11:00 AM',
      conversation: [
        { sender: 'Customer', text: 'Double payment deducted via Google Pay.', timestamp: '11:00 AM' },
      ],
      internalNotes: [],
      history: [
        { action: 'Customer created complaint', timestamp: 'Today, 11:00 AM' },
      ],
    },
    {
      id: 'C1021',
      customerName: 'Arjun Nair',
      mobile: '+91 96543 21098',
      bookingId: '#BK10243',
      serviceName: 'Full Home Pest Control',
      societyName: 'ABC Residency',
      vendorName: 'PestOff India',
      category: 'Vendor',
      priority: 'HIGH',
      assignedTo: 'Support Agent 02',
      status: 'ASSIGNED',
      description: 'Technician arrived 45 minutes late without prior call.',
      attachments: [],
      createdDate: 'Yesterday',
      conversation: [
        { sender: 'Customer', text: 'Technician delay issue.', timestamp: 'Yesterday' },
      ],
      internalNotes: ['Vendor warned about punctuality SLA breach.'],
      history: [
        { action: 'Complaint created & assigned', timestamp: 'Yesterday' },
      ],
    },
    {
      id: 'C1020',
      customerName: 'Sneha Iyer',
      mobile: '+91 95432 10987',
      bookingId: '#BK10242',
      serviceName: 'RO Water Purifier Service',
      societyName: 'Skyline Apartments',
      vendorName: 'AquaFix Solutions',
      category: 'Refund',
      priority: 'MEDIUM',
      assignedTo: 'Support Agent 01',
      status: 'RESOLVED',
      description: 'Filter replacement refund requested.',
      attachments: [],
      createdDate: '26 Aug 2026',
      conversation: [],
      internalNotes: ['Partial refund ₹200 credited to wallet.'],
      history: [
        { action: 'Complaint resolved by Support Agent 01', timestamp: '26 Aug 2026' },
      ],
    },
  ]);

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bookingId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === selectedComplaint.id) {
          return {
            ...c,
            conversation: [
              ...c.conversation,
              { sender: 'Admin', text: chatInput.trim(), timestamp: 'Just Now' },
            ],
          };
        }
        return c;
      })
    );
    setChatInput('');
  };

  const handleAddInternalNote = () => {
    if (!internalNoteInput.trim()) return;
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === selectedComplaint.id) {
          return {
            ...c,
            internalNotes: [...c.internalNotes, internalNoteInput.trim()],
          };
        }
        return c;
      })
    );
    setInternalNoteInput('');
    setToastMessage('✓ Internal note saved! (Visible to Admin team only)');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAssignSubmit = () => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === selectedComplaint.id) {
          return {
            ...c,
            assignedTo: assignedAgent,
            status: 'ASSIGNED',
            history: [...c.history, { action: `Assigned to ${assignedAgent}`, timestamp: 'Just now' }],
          };
        }
        return c;
      })
    );
    setShowAssignModal(false);
    setToastMessage(`✓ Complaint ${selectedComplaint.id} assigned to ${assignedAgent}!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleResolveSubmit = () => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === selectedComplaint.id) {
          return {
            ...c,
            status: 'RESOLVED',
            history: [...c.history, { action: `Resolved via ${resolutionType}`, timestamp: 'Just now' }],
          };
        }
        return c;
      })
    );
    setShowResolveModal(false);
    setToastMessage(`✓ Complaint ${selectedComplaint.id} resolved! ${notifyCustomer ? '(Customer notified)' : ''}`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-[#102A56]">
      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Administration (Phase 25)</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Customer complaint management, support SLA tracking & vendor resolution workflow</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer">
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Complaints Log (126)</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 125.1 COMPLAINT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL COMPLAINTS</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">128</h3>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Platform lifetime tickets</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NEW TICKETS</span>
          <h3 className="text-2xl font-bold text-red-600 mt-1">34</h3>
          <span className="text-[11px] font-bold text-red-600 mt-1 block">Unassigned & awaiting review</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IN PROGRESS</span>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">51</h3>
          <span className="text-[11px] font-bold text-amber-600 mt-1 block">Active investigation</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RESOLVED</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">43</h3>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Successfully closed</span>
        </div>
      </div>

      {/* SLA TRACKING PERFORMANCE CARDS (Screen 132) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">FIRST RESPONSE SLA (132)</span>
            <h4 className="text-lg font-bold text-slate-900 mt-0.5">12 Minutes <span className="text-xs text-slate-400 font-medium">(Target: 30 min)</span></h4>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Within SLA
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">RESOLUTION TIME SLA (132)</span>
            <h4 className="text-lg font-bold text-slate-900 mt-0.5">18 Hours <span className="text-xs text-slate-400 font-medium">(Target: 24 hrs)</span></h4>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Within SLA
          </span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200 flex gap-6">
        {(['overview', 'complaints'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab === 'overview' && 'Overview & Categories (125)'}
            {tab === 'complaints' && 'Complaint List (126)'}
          </button>
        ))}
      </div>

      {/* SCREEN 125: COMPLAINT DASHBOARD & CATEGORY DISTRIBUTION */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Category Distribution (125.2) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Complaint Categories Distribution (125.2)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              {[
                { cat: 'Service Quality', count: 42, color: 'bg-red-500' },
                { cat: 'Booking', count: 28, color: 'bg-blue-500' },
                { cat: 'Payment', count: 21, color: 'bg-purple-500' },
                { cat: 'Vendor', count: 17, color: 'bg-amber-500' },
                { cat: 'Refund', count: 11, color: 'bg-emerald-500' },
                { cat: 'Other', count: 9, color: 'bg-slate-400' },
              ].map((c) => (
                <div key={c.cat} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${c.color}`} />
                    <span className="text-slate-800 font-bold">{c.cat}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{c.count} tickets</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Cases Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">Priority Workload Summary (125.3)</h3>
            <div className="flex flex-wrap gap-4 text-xs font-bold">
              <span className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl">
                🔴 HIGH PRIORITY: 8 Cases
              </span>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-xl">
                🟠 MEDIUM PRIORITY: 19 Cases
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl">
                🟢 LOW PRIORITY: 7 Cases
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 126: COMPLAINT LIST */}
      {activeTab === 'complaints' && (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaint ID, customer, booking..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
              >
                <option value="All">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
              >
                <option value="All">All Statuses</option>
                <option value="NEW">New</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>

          {/* 126 COMPLAINT TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Customer Complaints Master Database</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{c.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.customerName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{c.bookingId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{c.category}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          c.priority === 'HIGH'
                            ? 'bg-red-100 text-red-700'
                            : c.priority === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{c.assignedTo}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          c.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.status === 'IN_PROGRESS'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedComplaintId(c.id);
                          setActiveTab('details');
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                      >
                        View Details (127)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* SCREEN 127: COMPLAINT DETAILS & LIVE CONVERSATION */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('complaints')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Complaint Details — {selectedComplaint.id}</h2>
                <p className="text-xs text-slate-500 font-medium">Customer support ticket, booking link, vendor investigation & conversation</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl cursor-pointer"
              >
                Assign Complaint (128)
              </button>
              <button
                onClick={() => setShowResolveModal(true)}
                className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md cursor-pointer"
              >
                Resolve Complaint (129)
              </button>
            </div>
          </div>

          {/* 127.1 Ticket Header Information */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-xs font-semibold">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">CUSTOMER</span>
              <h4 className="font-bold text-slate-900 mt-0.5">{selectedComplaint.customerName}</h4>
              <p className="text-[11px] text-slate-500">{selectedComplaint.mobile}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">LINKED BOOKING (135)</span>
              <h4 className="font-bold text-blue-600 mt-0.5">{selectedComplaint.bookingId}</h4>
              <p className="text-[11px] text-slate-500">{selectedComplaint.serviceName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">ASSIGNED VENDOR (137)</span>
              <h4 className="font-bold text-slate-900 mt-0.5">{selectedComplaint.vendorName}</h4>
              <p className="text-[11px] text-slate-500">{selectedComplaint.societyName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">ASSIGNED STAFF</span>
              <h4 className="font-bold text-slate-900 mt-0.5">{selectedComplaint.assignedTo}</h4>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold mt-1 inline-block">
                {selectedComplaint.priority} PRIORITY
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 133 Customer Conversation & Attachments Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Customer Description & Attachments</h3>
                <p className="p-4 bg-slate-50 rounded-xl text-xs text-slate-800 font-medium">"{selectedComplaint.description}"</p>

                {selectedComplaint.attachments.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">ATTACHED PROOF (127.2)</span>
                    <div className="flex gap-3">
                      {selectedComplaint.attachments.map((att, i) => (
                        <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" /> {att}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 133 Live Support Chat */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Customer Support Conversation (133)</h3>
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl max-h-60 overflow-y-auto text-xs">
                  {selectedComplaint.conversation.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === 'Admin' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-sm ${msg.sender === 'Admin' ? 'bg-[#1769E0] text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                        <p className="font-semibold">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-mono">{msg.sender} • {msg.timestamp}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type response to customer..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={handleSendMessage} className="bg-[#1769E0] hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 134 Internal Notes & Audit Timeline */}
            <div className="space-y-6">
              {/* 134 Internal Notes (Visually distinct yellow container) */}
              <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>INTERNAL ADMIN NOTES (134)</span>
                </div>
                <p className="text-[11px] text-amber-800">Private notes visible ONLY to SaveTogether Admin team.</p>

                <div className="space-y-2">
                  {selectedComplaint.internalNotes.map((note, i) => (
                    <div key={i} className="p-2.5 bg-white border border-amber-200 rounded-xl text-slate-800 font-medium">
                      {note}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={internalNoteInput}
                    onChange={(e) => setInternalNoteInput(e.target.value)}
                    placeholder="Add internal note..."
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                  <button onClick={handleAddInternalNote} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer">
                    Add
                  </button>
                </div>
              </div>

              {/* 130 Complaint History Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
                <h4 className="font-bold text-slate-900">Audit History Timeline (130)</h4>
                <div className="space-y-3 font-semibold">
                  {selectedComplaint.history.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-slate-800">{h.action}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{h.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 128: ASSIGN COMPLAINT MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Assign Complaint (128)</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <p>Complaint: <strong>{selectedComplaint.id}</strong> ({selectedComplaint.category})</p>
              <p>Priority: <strong className="text-red-700">{selectedComplaint.priority}</strong></p>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Assign To Staff *</label>
              <select
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="Support Agent 01">Support Agent 01 (Customer Support)</option>
                <option value="Support Agent 02">Support Agent 02 (Vendor Operations)</option>
                <option value="Super Admin Ashish">Super Admin Ashish</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Internal Assignment Note</label>
              <textarea
                value={assignNote}
                onChange={(e) => setAssignNote(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignSubmit}
                className="w-1/2 bg-[#1769E0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Assign Staff (128)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 129: RESOLVE COMPLAINT MODAL */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Resolve Complaint (129)</h3>
              <button onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <p>Complaint: <strong>{selectedComplaint.id}</strong> ({selectedComplaint.customerName})</p>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Resolution Type *</label>
              <select
                value={resolutionType}
                onChange={(e) => setResolutionType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="Service Revisit">Service Revisit Scheduled</option>
                <option value="Partial Refund">Partial Refund Issued</option>
                <option value="Full Refund">Full Refund Issued</option>
                <option value="Explanation Provided">Explanation Provided</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">Resolution Details *</label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
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
              <span>Send resolution notification to customer</span>
            </label>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveSubmit}
                className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Resolve Complaint (129)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
