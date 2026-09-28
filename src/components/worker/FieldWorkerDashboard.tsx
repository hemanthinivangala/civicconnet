import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../../types';
import {
  HardHat,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Upload,
  MessageSquare,
  MapPin,
  Camera,
  Check,
  Filter,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface FieldWorkerDashboardProps {
  onNavigate: (view: string, detailId?: string) => void;
}

export const FieldWorkerDashboard: React.FC<FieldWorkerDashboardProps> = ({ onNavigate }) => {
  const {
    complaints,
    currentUser,
    updateComplaintStatus,
    addComplaintComment,
  } = useCivic();

  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Action Modals State
  const [selectedTask, setSelectedTask] = useState<Complaint | null>(null);
  const [actionType, setActionType] = useState<'update' | 'resolve' | 'photo' | null>(null);
  const [noteText, setNoteText] = useState('');
  const [beforeAfterPhoto, setBeforeAfterPhoto] = useState('');

  // Sample worker evidence photos
  const SAMPLE_WORKER_PHOTOS = [
    'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
  ];

  // Assigned tasks (in demo, all tasks or tasks with status ASSIGNED / IN_PROGRESS / RESOLVED)
  const workerTasks = complaints.filter((c) => {
    // Show tasks assigned or all tasks in demo mode
    return c.status !== 'CLOSED' && c.status !== 'REJECTED';
  });

  const highPriorityTasks = workerTasks.filter(
    (t) => (t.priority === 'HIGH' || t.priority === 'URGENT') && t.status !== 'RESOLVED'
  );
  const normalPriorityTasks = workerTasks.filter(
    (t) => t.priority === 'NORMAL' && t.status !== 'RESOLVED'
  );
  const lowPriorityTasks = workerTasks.filter(
    (t) => t.priority === 'LOW' && t.status !== 'RESOLVED'
  );
  const completedTasks = workerTasks.filter((t) => t.status === 'RESOLVED');

  const filteredList = workerTasks.filter((t) => {
    const matchesPri = filterPriority === 'ALL' || t.priority === filterPriority;
    const matchesSt =
      filterStatus === 'ALL'
        ? true
        : filterStatus === 'COMPLETED'
        ? t.status === 'RESOLVED'
        : filterStatus === 'IN_PROGRESS'
        ? t.status === 'IN_PROGRESS'
        : t.status === 'ASSIGNED' || t.status === 'SUBMITTED';
    return matchesPri && matchesSt;
  });

  // Action handlers
  const handleStartWork = (c: Complaint) => {
    updateComplaintStatus(c.id, 'IN_PROGRESS', 'Field worker started active site repairs and safety setup.');
  };

  const handleOpenAction = (c: Complaint, type: 'update' | 'resolve' | 'photo') => {
    setSelectedTask(c);
    setActionType(type);
    setNoteText('');
    setBeforeAfterPhoto('');
  };

  const handleExecuteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !actionType) return;

    if (actionType === 'update') {
      if (noteText.trim()) {
        addComplaintComment(selectedTask.id, `Field Worker Update: ${noteText.trim()}`);
      }
    } else if (actionType === 'resolve') {
      updateComplaintStatus(
        selectedTask.id,
        'RESOLVED',
        noteText.trim() || 'Work completed successfully on ground. Quality inspection verified.',
        beforeAfterPhoto || undefined
      );
    } else if (actionType === 'photo') {
      if (beforeAfterPhoto.trim()) {
        addComplaintComment(
          selectedTask.id,
          `Attached Work Site Evidence: ${beforeAfterPhoto.trim()}`
        );
      }
    }

    setActionType(null);
    setSelectedTask(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Worker Header (Mobile First) */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase mb-2">
            <HardHat className="w-3.5 h-3.5" />
            Field Operations Mobile Terminal
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Field Officer: {currentUser?.name || 'Carlos Rivera'}
          </h1>
          <p className="text-amber-100 text-xs mt-1">
            Department: <strong>Public Works & Roads Squad</strong> &bull; Duty Zone:{' '}
            <strong>Central Zone</strong>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/20 text-xs text-center self-start sm:self-auto">
          <span className="text-[10px] text-amber-200 uppercase block font-bold">Today's Assigned</span>
          <span className="text-2xl font-extrabold font-mono">{workerTasks.length}</span>
          <span className="text-[10px] text-amber-200 block">Work Orders</span>
        </div>
      </div>

      {/* Task Priority Counts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setFilterPriority('HIGH');
            setFilterStatus('ALL');
          }}
          className={`p-3.5 rounded-2xl border text-left transition ${
            filterPriority === 'HIGH'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-red-600 uppercase block">High Priority</span>
          <div className="text-2xl font-extrabold text-red-700 mt-0.5">
            {highPriorityTasks.length}
          </div>
          <span className="text-[10px] text-slate-400">Arterial / Hazard</span>
        </button>

        <button
          onClick={() => {
            setFilterPriority('NORMAL');
            setFilterStatus('ALL');
          }}
          className={`p-3.5 rounded-2xl border text-left transition ${
            filterPriority === 'NORMAL'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-blue-600 uppercase block">Normal</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-0.5">
            {normalPriorityTasks.length}
          </div>
          <span className="text-[10px] text-slate-400">Regular SLA</span>
        </button>

        <button
          onClick={() => {
            setFilterPriority('LOW');
            setFilterStatus('ALL');
          }}
          className={`p-3.5 rounded-2xl border text-left transition ${
            filterPriority === 'LOW'
              ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-600 uppercase block">Low</span>
          <div className="text-2xl font-extrabold text-slate-700 mt-0.5">
            {lowPriorityTasks.length}
          </div>
          <span className="text-[10px] text-slate-400">Scheduled repairs</span>
        </button>

        <button
          onClick={() => {
            setFilterStatus('COMPLETED');
            setFilterPriority('ALL');
          }}
          className={`p-3.5 rounded-2xl border text-left transition ${
            filterStatus === 'COMPLETED'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-600 uppercase block">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">
            {completedTasks.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Resolved today</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center justify-between text-xs bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Showing:</span>
          <span className="font-bold text-slate-800">
            {filteredList.length} Task{filteredList.length === 1 ? '' : 's'}
          </span>
        </div>
        {(filterPriority !== 'ALL' || filterStatus !== 'ALL') && (
          <button
            onClick={() => {
              setFilterPriority('ALL');
              setFilterStatus('ALL');
            }}
            className="text-blue-700 hover:underline font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Tasks Cards Stream (Mobile First design) */}
      <div className="space-y-4">
        {filteredList.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 transition hover:shadow-md"
          >
            {/* Task Top Meta */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    {task.id}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      task.priority === 'HIGH' || task.priority === 'URGENT'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      task.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">{task.title}</h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

            {/* Location & Landmark */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {task.locality}, {task.wardName}
                </span>
              </div>
              {task.landmark && (
                <div className="text-[11px] text-slate-500 pl-5">
                  Landmark: <strong>{task.landmark}</strong>
                </div>
              )}
              <div className="text-[11px] text-slate-400 pl-5">
                Reporter: {task.citizenName} ({task.citizenPhone})
              </div>
            </div>

            {/* Citizen photos if any */}
            {task.photos && task.photos.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Citizen Attached Evidence:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {task.photos.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Citizen evidence"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons for Field Staff */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              {task.status !== 'IN_PROGRESS' && task.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleStartWork(task)}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5" /> Start Work
                </button>
              )}

              <button
                onClick={() => handleOpenAction(task, 'update')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Add Update
              </button>

              <button
                onClick={() => handleOpenAction(task, 'photo')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-slate-500" /> Upload Site Photo
              </button>

              {task.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleOpenAction(task, 'resolve')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center gap-1.5 ml-auto shadow-2xs"
                >
                  <Check className="w-4 h-4" /> Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Field Worker Action Modal */}
      {selectedTask && actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {actionType === 'resolve'
                ? `Mark ${selectedTask.id} As Resolved`
                : actionType === 'photo'
                ? `Upload Before/After Photo for ${selectedTask.id}`
                : `Add Site Progress Update to ${selectedTask.id}`}
            </h3>

            <form onSubmit={handleExecuteAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {actionType === 'resolve'
                    ? 'Resolution Inspection Report'
                    : 'Field Notes & Observations'}
                </label>
                <textarea
                  rows={3}
                  required={actionType !== 'photo'}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={
                    actionType === 'resolve'
                      ? 'e.g. Asphalt patch laid, compressed with roller, traffic lane reopened.'
                      : 'e.g. Awaiting spare LED driver module from central inventory.'
                  }
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              {(actionType === 'resolve' || actionType === 'photo') && (
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">
                    Before / After Photo Proof (Demo Image Picker or URL)
                  </label>

                  <div className="flex gap-2">
                    {SAMPLE_WORKER_PHOTOS.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setBeforeAfterPhoto(img)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                          beforeAfterPhoto === img ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200'
                        }`}
                      >
                        <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <input
                    type="url"
                    value={beforeAfterPhoto}
                    onChange={(e) => setBeforeAfterPhoto(e.target.value)}
                    placeholder="Or paste photo URL..."
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTask(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow-xs ${
                    actionType === 'resolve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                >
                  {actionType === 'resolve' ? 'Confirm Resolution' : 'Save Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
