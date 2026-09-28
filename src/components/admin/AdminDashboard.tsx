import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  User,
} from '../../types';
import { SEED_USERS } from '../../data/seedData';
import { CivicMap } from '../common/CivicMap';
import {
  ShieldAlert,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Filter,
  Search,
  Building2,
  HardHat,
  MapPin,
  Settings,
  Layers,
  Bell,
  Trash2,
  Hammer,
  Eye,
  Check,
  ChevronDown,
  X,
  Calendar,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string, detailId?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    complaints,
    wards,
    departments,
    services,
    announcements,
    projects,
    auditLogs,
    assignComplaint,
    updateComplaintStatus,
    escalateComplaint,
    addComplaintComment,
    resetToDemoData,
  } = useCivic();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'dashboard' | 'complaints' | 'citizens' | 'wards' | 'departments' | 'workers' | 'reports' | 'settings'
  >('dashboard');

  // Filters for Complaints Management
  const [filterId, setFilterId] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterWard, setFilterWard] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterDept, setFilterDept] = useState<string>('ALL');

  // Complaint Action Modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'assign' | 'status' | 'escalate' | null>(null);

  // Modal form states
  const [assignDeptId, setAssignDeptId] = useState(departments[0]?.id || 'dept-roads');
  const [assignWorkerId, setAssignWorkerId] = useState(SEED_USERS[2]?.id || 'usr-worker-1');
  const [assignNote, setAssignNote] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [statusNote, setStatusNote] = useState('');
  const [escalateReason, setEscalateReason] = useState('');

  // Statistics
  const totalComplaints = complaints.length;
  const newComplaints = complaints.filter((c) => c.status === 'SUBMITTED').length;
  const assignedComplaints = complaints.filter((c) => c.status === 'ASSIGNED').length;
  const inProgressComplaints = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const escalatedComplaints = complaints.filter((c) => c.status === 'ESCALATED').length;

  const demoCitizensCount = 1420; // Simulated active citizen user pool

  // Filtered complaints for the table
  const filteredComplaints = complaints.filter((c) => {
    const matchesId = !filterId.trim() || c.id.toLowerCase().includes(filterId.toLowerCase().trim()) || c.title.toLowerCase().includes(filterId.toLowerCase().trim());
    const matchesCat = filterCategory === 'ALL' || c.category === filterCategory;
    const matchesWard = filterWard === 'ALL' || c.wardId === filterWard;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || c.priority === filterPriority;
    const matchesDept = filterDept === 'ALL' || c.departmentId === filterDept;
    return matchesId && matchesCat && matchesWard && matchesStatus && matchesPriority && matchesDept;
  });

  // Action handlers
  const handleOpenAssign = (c: Complaint) => {
    setSelectedComplaint(c);
    setAssignDeptId(c.departmentId || departments[0]?.id || 'dept-roads');
    setAssignWorkerId(c.assignedWorkerId || SEED_USERS[2]?.id || 'usr-worker-1');
    setAssignNote('');
    setModalMode('assign');
  };

  const handleOpenStatus = (c: Complaint) => {
    setSelectedComplaint(c);
    setNewStatus(c.status);
    setStatusNote('');
    setModalMode('status');
  };

  const handleOpenEscalate = (c: Complaint) => {
    setSelectedComplaint(c);
    setEscalateReason('Critical public safety or recurring municipal delay.');
    setModalMode('escalate');
  };

  const handleOpenView = (c: Complaint) => {
    setSelectedComplaint(c);
    setModalMode('view');
  };

  const handleSaveAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedComplaint) {
      assignComplaint(selectedComplaint.id, assignDeptId, assignWorkerId, assignNote);
      setModalMode(null);
    }
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedComplaint) {
      updateComplaintStatus(selectedComplaint.id, newStatus, statusNote);
      setModalMode(null);
    }
  };

  const handleSaveEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedComplaint) {
      escalateComplaint(selectedComplaint.id, escalateReason);
      setModalMode(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Admin Top Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/30 text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            Executive Municipal Control Room
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
            Municipal Administrator Command Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Triage civic grievances, dispatch field squads, manage ward services, monitor service level agreements (SLAs), and audit municipal operations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => onNavigate('transparency')}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2 px-3 rounded-xl border border-white/20 transition flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" /> Public Stats
          </button>
          <button
            onClick={resetToDemoData}
            title="Reset storage to original demo data"
            className="bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Demo
          </button>
        </div>
      </div>

      {/* Admin Horizontal Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold scrollbar-none">
        {[
          { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
          { id: 'complaints', label: `Complaint Triage (${totalComplaints})`, icon: FileText },
          { id: 'citizens', label: 'Citizens Directory', icon: Users },
          { id: 'wards', label: 'Wards & Zones', icon: MapPin },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'workers', label: 'Field Staff', icon: HardHat },
          { id: 'reports', label: 'Audit Logs', icon: Clock },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeAdminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveAdminTab(item.id as any)}
              className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Dashboard View */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI Cards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Citizens</span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {demoCitizensCount}
              </div>
              <span className="text-[10px] text-slate-400">Registered pool</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Grievances</span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {totalComplaints}
              </div>
              <span className="text-[10px] text-slate-400">All wards</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-amber-600">New Submitted</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-0.5">
                {newComplaints}
              </div>
              <span className="text-[10px] text-amber-700">Needs review</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-indigo-600">Assigned</span>
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-0.5">
                {assignedComplaints}
              </div>
              <span className="text-[10px] text-indigo-700">Squad dispatched</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-blue-600">In Progress</span>
              <div className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-0.5">
                {inProgressComplaints}
              </div>
              <span className="text-[10px] text-blue-700">On-ground repairs</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-emerald-600">Resolved</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-0.5">
                {resolvedComplaints}
              </div>
              <span className="text-[10px] text-emerald-700">SLA satisfied</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-red-600">Escalated</span>
              <div className="text-xl sm:text-2xl font-extrabold text-red-600 mt-0.5">
                {escalatedComplaints}
              </div>
              <span className="text-[10px] text-red-700">Nodal attention</span>
            </div>
          </div>

          {/* Charts & Map Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Complaints by Category Chart */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Complaints by Department Category</h3>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Live Volume
                </span>
              </div>
              <div className="space-y-3">
                {Array.from(new Set(complaints.map((c) => c.category))).map((cat) => {
                  const count = complaints.filter((c) => c.category === cat).length;
                  const pct = Math.round((count / totalComplaints) * 100);
                  return (
                    <div key={cat} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>{cat.replace('_', ' ')}</span>
                        <span className="font-mono text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Citywide Map of Active Problems */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Live Redressal Heatmap
                </h3>
                <button
                  onClick={() => setActiveAdminTab('complaints')}
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  Triage Table →
                </button>
              </div>
              <CivicMap
                mode="complaints"
                height="300px"
                complaints={complaints}
                onSelectComplaint={(c) => handleOpenView(c)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Complaints Management Table */}
      {activeAdminTab === 'complaints' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Advanced Redressal Filters
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <input
                type="text"
                value={filterId}
                onChange={(e) => setFilterId(e.target.value)}
                placeholder="Filter ID / Keyword..."
                className="p-2 border rounded-lg"
              />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border rounded-lg font-semibold"
              >
                <option value="ALL">Status: All</option>
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="ESCALATED">ESCALATED</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="p-2 border rounded-lg font-semibold"
              >
                <option value="ALL">Priority: All</option>
                <option value="LOW">LOW</option>
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>

              <select
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="ALL">Ward: All (5 Wards)</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    Ward {w.number}
                  </option>
                ))}
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="ALL">Category: All</option>
                <option value="GARBAGE">Garbage</option>
                <option value="ROADS_POTHOLES">Roads/Potholes</option>
                <option value="STREETLIGHT">Streetlight</option>
                <option value="WATER">Water</option>
                <option value="DRAINAGE">Drainage</option>
                <option value="SANITATION">Sanitation</option>
                <option value="TREES">Trees</option>
              </select>

              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="ALL">Department: All</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Grievance ID</th>
                    <th className="py-3.5 px-4">Problem & Category</th>
                    <th className="py-3.5 px-4">Ward / Locality</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Department / Worker</th>
                    <th className="py-3.5 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No grievances found matching active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-900">
                          {c.id}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 truncate">{c.title}</div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>{c.wardName}</div>
                          <span className="text-[11px] text-slate-400">{c.locality}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              c.priority === 'URGENT' || c.priority === 'HIGH'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              c.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'IN_PROGRESS'
                                ? 'bg-blue-100 text-blue-800'
                                : c.status === 'ESCALATED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">
                            {c.departmentName || 'Unassigned'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {c.assignedWorkerName || 'Squad pending'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenView(c)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                              title="Inspect Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenAssign(c)}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded"
                            >
                              Assign
                            </button>
                            <button
                              onClick={() => handleOpenStatus(c)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
                            >
                              Status
                            </button>
                            <button
                              onClick={() => handleOpenEscalate(c)}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                              title="Escalate"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Citizens Directory */}
      {activeAdminTab === 'citizens' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Registered Municipal Citizens Directory (Demo Pool)
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {SEED_USERS.filter((u) => u.role === 'CITIZEN').map((citizen) => (
              <div key={citizen.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={citizen.avatar}
                    alt={citizen.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <strong className="text-slate-900 block">{citizen.name}</strong>
                    <span className="text-slate-500">{citizen.email} &bull; {citizen.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Primary Ward</span>
                  <strong className="text-slate-700">Ward 1 - Downtown</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Wards & Zones View */}
      {activeAdminTab === 'wards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wards.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {w.zone}
              </span>
              <h3 className="font-bold text-sm text-slate-900">{w.name}</h3>
              <p className="text-slate-500">{w.officeAddress}</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <span>Councillor:</span>
                <strong>{w.councillorName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Population:</span>
                <strong>{w.population.toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Departments View */}
      {activeAdminTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  Code: {dept.code}
                </span>
                <span className="text-slate-500">Head: {dept.headName}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900">{dept.name}</h3>
              <p className="text-slate-600 leading-relaxed">{dept.description}</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-500">
                <span>📞 {dept.phone}</span>
                <span>✉️ {dept.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Field Workers View */}
      {activeAdminTab === 'workers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Active Municipal Field Workers & Technicians
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {SEED_USERS.filter((u) => u.role === 'FIELD_WORKER').map((worker) => (
              <div key={worker.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <strong className="text-slate-900 block text-sm">{worker.name}</strong>
                    <span className="text-slate-500">{worker.email}</span>
                    <span className="text-amber-700 font-semibold block text-[11px]">
                      Field Lead - Public Works
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('worker')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                >
                  View Tasks
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Reports & Audit Logs */}
      {activeAdminTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Official Municipal System Audit Trail</h2>
          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono font-bold text-blue-900 text-[11px] block">
                    {log.action}
                  </span>
                  <p className="text-slate-700 mt-0.5">{log.details}</p>
                  <span className="text-[10px] text-slate-400">Actor: {log.userName} ({log.userRole})</span>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedComplaint && modalMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-900 block">
                  {selectedComplaint.id}
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  {modalMode === 'assign'
                    ? 'Assign Department & Field Worker'
                    : modalMode === 'status'
                    ? 'Update Complaint Status'
                    : modalMode === 'escalate'
                    ? 'Escalate Complaint to Executive Desk'
                    : 'Inspect Grievance Record'}
                </h3>
              </div>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {modalMode === 'assign' && (
              <form onSubmit={handleSaveAssign} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Department</label>
                  <select
                    value={assignDeptId}
                    onChange={(e) => setAssignDeptId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Lead Worker</label>
                  <select
                    value={assignWorkerId}
                    onChange={(e) => setAssignWorkerId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  >
                    {SEED_USERS.filter((u) => u.role === 'FIELD_WORKER').map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assignment Directive / Dispatch Note</label>
                  <textarea
                    rows={3}
                    value={assignNote}
                    onChange={(e) => setAssignNote(e.target.value)}
                    placeholder="e.g. High school pedestrian zone. Deploy rapid asphalt crew by tomorrow 8 AM."
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-700 text-white font-bold rounded-xl"
                  >
                    Save Assignment
                  </button>
                </div>
              </form>
            )}

            {modalMode === 'status' && (
              <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transition Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason / Officer Note</label>
                  <textarea
                    rows={3}
                    required
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Enter audit explanation for this status change..."
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-700 text-white font-bold rounded-xl"
                  >
                    Update Status
                  </button>
                </div>
              </form>
            )}

            {modalMode === 'escalate' && (
              <form onSubmit={handleSaveEscalate} className="space-y-4 text-xs">
                <p className="text-red-700 font-semibold">
                  Escalating this complaint flags it with top executive priority and alerts city commissioner secretariats.
                </p>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Escalation Reason</label>
                  <textarea
                    rows={3}
                    required
                    value={escalateReason}
                    onChange={(e) => setEscalateReason(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl"
                  >
                    Confirm Escalation
                  </button>
                </div>
              </form>
            )}

            {modalMode === 'view' && (
              <div className="space-y-3 text-xs">
                <div>
                  <strong className="text-slate-900 block text-sm">{selectedComplaint.title}</strong>
                  <p className="text-slate-600 mt-1">{selectedComplaint.description}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border space-y-1">
                  <div><strong>Ward:</strong> {selectedComplaint.wardName}</div>
                  <div><strong>Locality:</strong> {selectedComplaint.locality}</div>
                  <div><strong>Reporter:</strong> {selectedComplaint.citizenName} ({selectedComplaint.citizenPhone})</div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode(null);
                      onNavigate('track', selectedComplaint.id);
                    }}
                    className="px-4 py-2 bg-blue-700 text-white font-bold rounded-xl"
                  >
                    Open Live Tracking Timeline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
