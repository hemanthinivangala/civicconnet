import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { CivicMap } from '../common/CivicMap';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  Bell,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  Trash2,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface CitizenDashboardProps {
  onNavigate: (view: string, detailId?: string) => void;
  onOpenReport: () => void;
  onOpenAssist: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onNavigate,
  onOpenReport,
  onOpenAssist,
}) => {
  const { currentUser, complaints, notifications, markNotificationRead } = useCivic();

  // Filter complaints related to current user or all citizen demo items
  const userComplaints = complaints.filter(
    (c) => c.citizenId === currentUser?.id || currentUser?.role === 'CITIZEN'
  );

  const totalComplaints = userComplaints.length;
  const resolvedComplaints = userComplaints.filter(
    (c) => c.status === 'RESOLVED' || c.status === 'CLOSED'
  ).length;
  const inProgressComplaints = userComplaints.filter(
    (c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED'
  ).length;
  const pendingComplaints = userComplaints.filter(
    (c) => c.status === 'SUBMITTED' || c.status === 'ACKNOWLEDGED'
  ).length;

  const recentComplaints = userComplaints.slice(0, 5);
  const recentNotifications = notifications.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-400/30 text-xs font-semibold text-blue-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Citizen Portal Dashboard
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif">
            Welcome back, {currentUser?.name || 'Citizen'}
          </h1>
          <p className="text-blue-100 text-sm mt-2 leading-relaxed">
            Report local community issues, access statutory municipal services, view waste collection timings, and follow progress across your ward.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onOpenReport}
              className="bg-white hover:bg-blue-50 text-blue-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-blue-700" /> Report a Problem
            </button>
            <button
              onClick={() => onNavigate('track')}
              className="bg-blue-700/60 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm border border-blue-400/40 transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Track Existing Grievance
            </button>
            <button
              onClick={onOpenAssist}
              className="bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm border border-indigo-400/40 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Ask CivicAssist
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Complaints
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {totalComplaints}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Logged by citizens</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Active / In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Active / In Progress
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
              {inProgressComplaints}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Field team assigned</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Resolved
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
              {resolvedComplaints}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {totalComplaints > 0
                ? `${Math.round((resolvedComplaints / totalComplaints) * 100)}% resolution rate`
                : '100%'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Pending Verification
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {pendingComplaints}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Awaiting triage</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <button
            onClick={onOpenReport}
            className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl text-center shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-blue-900">
              Report Problem
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Pothole, light, waste</div>
          </button>

          <button
            onClick={() => onNavigate('track')}
            className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl text-center shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <Search className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-blue-900">
              Track Complaint
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Live status timeline</div>
          </button>

          <button
            onClick={() => onNavigate('services')}
            className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl text-center shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-blue-900">
              Municipal Services
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Taxes, bills, certs</div>
          </button>

          <button
            onClick={() => onNavigate('ward')}
            className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl text-center shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-blue-900">
              My Ward
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Councillor & maps</div>
          </button>

          <button
            onClick={() => onNavigate('announcements')}
            className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl text-center shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <Bell className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-blue-900">
              Announcements
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Notices & disruptions</div>
          </button>

          <button
            onClick={() => onNavigate('garbage')}
            className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl text-center shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-blue-900">
              Garbage Schedule
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Pickup & bulk waste</div>
          </button>

          <button
            onClick={onOpenAssist}
            className="p-4 bg-gradient-to-tr from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-2xl text-center shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-indigo-950">CivicAssist</div>
            <div className="text-[10px] text-indigo-600 mt-0.5">AI Citizen Guide</div>
          </button>
        </div>
      </div>

      {/* Main 2-Column Content: Recent Complaints & Notifications / Ward Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Complaints List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
            <button
              onClick={() => onNavigate('track')}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
            >
              View All Grievances →
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {recentComplaints.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate('track', c.id)}
                className="p-4 hover:bg-slate-50/80 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-900 group-hover:underline">
                      {c.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {c.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white ${
                        c.status === 'RESOLVED' || c.status === 'CLOSED'
                          ? 'bg-emerald-600'
                          : c.status === 'IN_PROGRESS'
                          ? 'bg-blue-600'
                          : c.status === 'ESCALATED'
                          ? 'bg-red-600'
                          : 'bg-amber-500'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition">
                    {c.title}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {c.locality}, {c.wardName}
                    </span>
                    <span>&bull;</span>
                    <span>
                      {new Date(c.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('track', c.id);
                    }}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold py-1.5 px-3 rounded-lg border border-blue-200 transition"
                  >
                    Track Status
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition hidden sm:inline" />
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Geographic Map of Complaints */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Interactive Municipal Complaint Map
                </h3>
                <p className="text-xs text-slate-500">
                  Geographic distribution of reported civic issues across city wards
                </p>
              </div>
            </div>
            <CivicMap
              mode="complaints"
              height="300px"
              complaints={complaints}
              onSelectComplaint={(c) => onNavigate('track', c.id)}
            />
          </div>
        </div>

        {/* Right 1 Col: In-App Notifications Feed & Ward Summary */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-600" />
                Recent Notifications
              </h3>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                View all
              </button>
            </div>

            <div className="space-y-2">
              {recentNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.complaintId) onNavigate('track', n.complaintId);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer hover:bg-slate-50 transition ${
                    !n.isRead ? 'bg-blue-50/60 border-blue-200 font-medium' : 'border-slate-100'
                  }`}
                >
                  <div className="font-bold text-slate-800 mb-0.5">{n.title}</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ward Quick Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>My Ward Profile</span>
              <button
                onClick={() => onNavigate('ward')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Ward Details →
              </button>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Registered Ward</span>
              <span className="font-bold text-slate-800 text-sm">
                Ward 1 - Downtown Civic Center
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Local Councillor</span>
              <span className="text-slate-800 font-medium">Hon. Patricia Reynolds</span>
              <span className="text-slate-500 block text-[11px]">+1 (555) 111-0001</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Zonal Ward Office</span>
              <span className="text-slate-700">100 Municipal Plaza, City Center</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
