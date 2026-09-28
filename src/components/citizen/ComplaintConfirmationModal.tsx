import React from 'react';
import { Complaint } from '../../types';
import { CheckCircle2, Copy, ExternalLink, Printer, MapPin, Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface ComplaintConfirmationModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackComplaint: (complaintId: string) => void;
}

export const ComplaintConfirmationModal: React.FC<ComplaintConfirmationModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onTrackComplaint,
}) => {
  if (!isOpen || !complaint) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(complaint.id);
    alert(`Complaint ID ${complaint.id} copied to clipboard.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Success Header */}
        <div className="bg-emerald-600 text-white p-6 text-center relative">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight font-serif">
            Grievance Registered Successfully
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-sm mx-auto">
            Your complaint has been logged with the Municipal Grievance Redressal Cell and dispatched to the ward administration.
          </p>
        </div>

        {/* Complaint Details Card */}
        <div className="p-6 space-y-5">
          {/* Highlighted Complaint ID */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Official Reference ID
              </span>
              <span className="text-xl font-mono font-extrabold text-blue-900">
                {complaint.id}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs py-1.5 px-3 rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-2xs transition"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-0.5">Category</span>
              <span className="font-bold text-slate-800">{complaint.category}</span>
              {complaint.issueType && (
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  ({complaint.issueType})
                </span>
              )}
            </div>

            <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-0.5">Current Status</span>
              <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800 uppercase">
                {complaint.status}
              </span>
            </div>

            <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 col-span-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1 mb-0.5">
                <MapPin className="w-3 h-3 text-blue-600" /> Location & Ward
              </span>
              <span className="font-semibold text-slate-800 block">
                {complaint.locality}, {complaint.wardName}
              </span>
              {complaint.landmark && (
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Landmark: {complaint.landmark}
                </span>
              )}
            </div>

            <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 col-span-2 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Submission Date</span>
                <span className="font-medium text-slate-700">
                  {new Date(complaint.createdAt).toLocaleDateString([], {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-semibold block mb-0.5">Priority</span>
                <span className="font-bold text-blue-700">{complaint.priority}</span>
              </div>
            </div>
          </div>

          {/* Citizen Advisory */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              An automated notification has been logged in your dashboard. You will receive in-app updates as municipal officers inspect and resolve this problem.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onTrackComplaint(complaint.id)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 group"
            >
              <span>Track Complaint Live Timeline</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Acknowledgement
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
