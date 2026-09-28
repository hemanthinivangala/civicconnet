import React, { useState, useEffect } from 'react';
import { useCivic } from '../../context/CivicContext';
import { ComplaintStatus, Complaint } from '../../types';
import { CivicMap } from '../common/CivicMap';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Building2,
  MapPin,
  Calendar,
  Send,
  ShieldCheck,
  AlertCircle,
  HardHat,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface TrackComplaintViewProps {
  initialComplaintId?: string;
  onNavigate: (view: string) => void;
}

const WORKFLOW_STEPS: { status: ComplaintStatus; label: string; desc: string }[] = [
  { status: 'SUBMITTED', label: 'Submitted', desc: 'Complaint registered by citizen' },
  { status: 'ACKNOWLEDGED', label: 'Acknowledged', desc: 'Verified by grievance officer' },
  { status: 'ASSIGNED', label: 'Assigned', desc: 'Dispatched to responsible department' },
  { status: 'IN_PROGRESS', label: 'In Progress', desc: 'Field team deployed on site' },
  { status: 'RESOLVED', label: 'Resolved', desc: 'Repairs finished & verified' },
  { status: 'CLOSED', label: 'Closed', desc: 'Citizen audit sign-off' },
];

export const TrackComplaintView: React.FC<TrackComplaintViewProps> = ({
  initialComplaintId,
  onNavigate,
}) => {
  const { complaints, currentUser, addComplaintComment } = useCivic();

  const [searchId, setSearchId] = useState(initialComplaintId || '');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Auto-load if initial ID passed
  useEffect(() => {
    if (initialComplaintId) {
      const found = complaints.find(
        (c) => c.id.toLowerCase() === initialComplaintId.toLowerCase()
      );
      if (found) {
        setSelectedComplaint(found);
        setSearchId(found.id);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } else if (complaints.length > 0 && !selectedComplaint) {
      // Default to the first complaint for instant preview
      setSelectedComplaint(complaints[0]);
      setSearchId(complaints[0].id);
    }
  }, [initialComplaintId, complaints]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchId.trim().toUpperCase();
    const found = complaints.find(
      (c) => c.id.toUpperCase() === cleanId || c.id.toUpperCase().includes(cleanId)
    );

    if (found) {
      setSelectedComplaint(found);
      setNotFound(false);
    } else {
      setSelectedComplaint(null);
      setNotFound(true);
    }
  };

  const handleSelectRecent = (c: Complaint) => {
    setSelectedComplaint(c);
    setSearchId(c.id);
    setNotFound(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedComplaint) return;

    setIsSubmittingComment(true);
    addComplaintComment(selectedComplaint.id, newComment.trim());
    setNewComment('');

    // Update local view
    const updated = complaints.find((c) => c.id === selectedComplaint.id);
    if (updated) setSelectedComplaint(updated);
    setIsSubmittingComment(false);
  };

  // Determine current step index in standard flow
  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return 0;
      case 'ACKNOWLEDGED':
        return 1;
      case 'ASSIGNED':
        return 2;
      case 'IN_PROGRESS':
        return 3;
      case 'RESOLVED':
        return 4;
      case 'CLOSED':
        return 5;
      default:
        return 0;
    }
  };

  const currentStepIdx = selectedComplaint ? getStepIndex(selectedComplaint.status) : 0;
  const isSpecialStatus =
    selectedComplaint?.status === 'REJECTED' || selectedComplaint?.status === 'ESCALATED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <span>Live Redressal Tracking</span>
          <span>&bull;</span>
          <span>Public Service Level Agreement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
          Track Grievance Status
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Monitor your municipal complaint timeline in real-time from acknowledgement to on-ground resolution.
        </p>
      </div>

      {/* Search Bar & Quick Chips */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Complaint ID (e.g. CC-2026-000001)"
              className="w-full pl-11 pr-4 py-3 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none uppercase"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
          >
            <span>Search Grievance</span>
          </button>
        </form>

        {/* Quick select chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Select Recent Complaints:
          </span>
          <div className="flex flex-wrap gap-2">
            {complaints.slice(0, 6).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectRecent(c)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition flex items-center gap-1.5 ${
                  selectedComplaint?.id === c.id
                    ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{c.id}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    c.status === 'RESOLVED'
                      ? 'bg-emerald-500'
                      : c.status === 'IN_PROGRESS'
                      ? 'bg-blue-600'
                      : c.status === 'ESCALATED'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {notFound && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">
          <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
          <h3 className="font-bold text-slate-800 text-lg">Complaint Not Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            No record found matching ID "{searchId}". Please verify the tracking number printed on your receipt (format: CC-2026-XXXXXX).
          </p>
        </div>
      )}

      {selectedComplaint && (
        <div className="space-y-8">
          {/* Status Header Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-mono text-base font-extrabold text-blue-900">
                  {selectedComplaint.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                  {selectedComplaint.category}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-white ${
                    selectedComplaint.status === 'RESOLVED' || selectedComplaint.status === 'CLOSED'
                      ? 'bg-emerald-600'
                      : selectedComplaint.status === 'IN_PROGRESS'
                      ? 'bg-blue-600'
                      : selectedComplaint.status === 'ESCALATED'
                      ? 'bg-red-600'
                      : selectedComplaint.status === 'REJECTED'
                      ? 'bg-slate-600'
                      : 'bg-amber-500'
                  }`}
                >
                  {selectedComplaint.status}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Priority: <strong className="text-slate-800">{selectedComplaint.priority}</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {selectedComplaint.title}
              </h2>
            </div>

            <div className="text-xs text-slate-500 text-left md:text-right shrink-0">
              <div>
                Submitted:{' '}
                <strong>
                  {new Date(selectedComplaint.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </strong>
              </div>
              <div>
                Last Updated:{' '}
                <strong>
                  {new Date(selectedComplaint.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </div>
            </div>
          </div>

          {/* Visual Timeline (Workflow: SUBMITTED → ACKNOWLEDGED → ASSIGNED → IN PROGRESS → RESOLVED → CLOSED) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              Resolution Progress Timeline
            </h3>

            {isSpecialStatus ? (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 mb-6 ${
                  selectedComplaint.status === 'ESCALATED'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <div>
                  <div className="font-bold text-sm">
                    {selectedComplaint.status === 'ESCALATED'
                      ? 'Grievance Escalated to Senior Executive Authority'
                      : 'Complaint Marked As Rejected'}
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">
                    {selectedComplaint.statusHistory[selectedComplaint.statusHistory.length - 1]?.note ||
                      'Action taken by municipal nodal officer.'}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Step Timeline Grid */}
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="hidden md:block absolute top-1/2 left-8 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(currentStepIdx / (WORKFLOW_STEPS.length - 1)) * 100}%`,
                }}
              />

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
                {WORKFLOW_STEPS.map((step, idx) => {
                  const isDone = currentStepIdx > idx;
                  const isCurrent = currentStepIdx === idx;

                  return (
                    <div
                      key={step.status}
                      className="flex flex-col items-center text-center p-2 rounded-xl transition"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition mb-2 ${
                          isDone
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div
                        className={`font-bold text-xs ${
                          isCurrent
                            ? 'text-blue-700'
                            : isDone
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details, Comments, Photos */}
            <div className="md:col-span-2 space-y-6">
              {/* Full Problem Details */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Grievance Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedComplaint.description}
                </p>

                {/* Evidence Photos */}
                {selectedComplaint.photos && selectedComplaint.photos.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Photographic Evidence
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedComplaint.photos.map((photo, i) => (
                        <a
                          key={i}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:opacity-90 transition block"
                        >
                          <img src={photo} alt="Evidence" className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">
                            Zoom ↗
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status History Log */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Official Audit & Status History
                </h3>
                <div className="space-y-4">
                  {selectedComplaint.statusHistory.map((sh, idx) => (
                    <div key={sh.id || idx} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-slate-800">
                            {sh.fromStatus} → {sh.toStatus}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(sh.timestamp).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs">{sh.note}</p>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Logged by: {sh.changedByName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen Follow-up Comments */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Citizen & Officer Notes ({selectedComplaint.comments?.length || 0})
                </h3>

                <div className="space-y-3">
                  {selectedComplaint.comments?.map((c) => (
                    <div
                      key={c.id}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        c.userRole === 'ADMIN'
                          ? 'bg-blue-50/70 border-blue-200'
                          : c.userRole === 'FIELD_WORKER'
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">
                          {c.userName}{' '}
                          <span className="text-[10px] uppercase font-mono px-1 rounded bg-white/80 border border-slate-200 text-slate-600 ml-1">
                            {c.userRole}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-700">{c.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Add Note / Citizen Feedback
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add an update, landmark clarification, or query..."
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Post
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right 1 Col: Location Map, Assigned Department & Field Worker */}
            <div className="space-y-6">
              {/* Location Card & Map */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Location Pin
                </h3>

                <CivicMap
                  mode="picker"
                  height="220px"
                  initialCenter={[selectedComplaint.location.lat, selectedComplaint.location.lng]}
                  initialZoom={16}
                  selectedLocation={selectedComplaint.location}
                />

                <div className="text-xs text-slate-600 pt-1 space-y-1">
                  <div>
                    <strong>Ward:</strong> {selectedComplaint.wardName}
                  </div>
                  <div>
                    <strong>Locality:</strong> {selectedComplaint.locality}
                  </div>
                  {selectedComplaint.landmark && (
                    <div>
                      <strong>Landmark:</strong> {selectedComplaint.landmark}
                    </div>
                  )}
                  <div className="text-slate-400 text-[11px]">
                    Coordinates: {selectedComplaint.location.lat.toFixed(4)},{' '}
                    {selectedComplaint.location.lng.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Department & Staff Assignment */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
                  Department & Staff Assignment
                </h3>

                <div>
                  <div className="text-slate-400 font-semibold mb-0.5">Assigned Department</div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    {selectedComplaint.departmentName || 'Public Works & Infrastructure'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold mb-0.5">Field Worker / Lead</div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5 text-amber-600" />
                    {selectedComplaint.assignedWorkerName || 'Dispatched Field Squad'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold mb-0.5">Citizen Reporter</div>
                  <div className="text-slate-700">
                    {selectedComplaint.citizenName} ({selectedComplaint.citizenPhone})
                  </div>
                </div>
              </div>

              {/* Citizen Service Helpline */}
              <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-100 text-xs text-blue-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Grievance Redressal SLA Guarantee
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Complaints unresolved beyond statutory turnaround can be escalated directly to the Municipal Ombudsman.
                </p>
                <div className="text-[11px] font-semibold text-blue-900 pt-1">
                  Citizen Helpline: 311 / +1 (555) 200-1000
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
