import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { Announcement, AnnouncementCategory, AnnouncementPriority } from '../../types';
import {
  Bell,
  Calendar,
  AlertTriangle,
  FileText,
  Paperclip,
  Download,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Filter,
  Search,
} from 'lucide-react';

interface MunicipalAnnouncementsViewProps {
  onNavigate: (view: string) => void;
  selectedAnnouncementId?: string;
}

export const MunicipalAnnouncementsView: React.FC<MunicipalAnnouncementsViewProps> = ({
  onNavigate,
  selectedAnnouncementId,
}) => {
  const {
    announcements,
    activeRole,
    currentUser,
    wards,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    togglePublishAnnouncement,
  } = useCivic();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Admin Create/Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<AnnouncementCategory>('NOTICE');
  const [formPriority, setFormPriority] = useState<AnnouncementPriority>('NORMAL');
  const [formWardId, setFormWardId] = useState<string>('');
  const [formExpiryDate, setFormExpiryDate] = useState('2026-10-31');
  const [formAttachment, setFormAttachment] = useState('');

  const filteredAnnouncements = announcements.filter((a) => {
    // Only published for citizens; admins see both
    if (activeRole !== 'ADMIN' && !a.isPublished) return false;

    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingAnn(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory('NOTICE');
    setFormPriority('NORMAL');
    setFormWardId('');
    setFormExpiryDate('2026-10-31');
    setFormAttachment('');
    setModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnn(ann);
    setFormTitle(ann.title);
    setFormDesc(ann.description);
    setFormCategory(ann.category);
    setFormPriority(ann.priority);
    setFormWardId(ann.wardId || '');
    setFormExpiryDate(ann.expiryDate);
    setFormAttachment(ann.attachmentName || '');
    setModalOpen(true);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim()) return;

    const selectedWard = wards.find((w) => w.id === formWardId);

    if (editingAnn) {
      updateAnnouncement({
        ...editingAnn,
        title: formTitle.trim(),
        description: formDesc.trim(),
        category: formCategory,
        priority: formPriority,
        wardId: formWardId || undefined,
        wardName: selectedWard ? selectedWard.name : undefined,
        expiryDate: formExpiryDate,
        attachmentName: formAttachment.trim() || undefined,
      });
    } else {
      createAnnouncement({
        title: formTitle.trim(),
        description: formDesc.trim(),
        category: formCategory,
        priority: formPriority,
        wardId: formWardId || undefined,
        wardName: selectedWard ? selectedWard.name : undefined,
        expiryDate: formExpiryDate,
        attachmentName: formAttachment.trim() || undefined,
        isPublished: true,
        authorName: currentUser?.name || 'Municipal Information Officer',
      });
    }

    setModalOpen(false);
  };

  const getPriorityBadge = (priority: AnnouncementPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-600 text-white';
      case 'HIGH':
        return 'bg-amber-500 text-white';
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <span>Official Gazettes & Bulletins</span>
            <span>&bull;</span>
            <span>Civic Notifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            Municipal Announcements & Advisories
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Stay informed on scheduled water shutoffs, temporary road closures, tax rebate deadlines, public council town halls, and disease vector control drives.
          </p>
        </div>

        {activeRole === 'ADMIN' && (
          <button
            onClick={handleOpenCreate}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Publish Announcement
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search announcements (e.g. water, federal ave, e-waste, master plan)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {['ALL', 'WATER', 'ROADS', 'GARBAGE', 'NOTICE', 'EVENT', 'HEALTH'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl transition shrink-0 ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl p-6 border transition shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-start justify-between gap-6 ${
              ann.priority === 'CRITICAL' || ann.priority === 'HIGH'
                ? 'border-l-4 border-l-amber-500 border-slate-200'
                : 'border-slate-200'
            } ${!ann.isPublished ? 'opacity-60 bg-slate-50' : ''}`}
          >
            <div className="space-y-3 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs ${getPriorityBadge(
                    ann.priority
                  )}`}
                >
                  {ann.priority} Priority
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {ann.category}
                </span>

                {ann.wardName && (
                  <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                    📍 {ann.wardName}
                  </span>
                )}

                {!ann.isPublished && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                    UNPUBLISHED DRAFT
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                {ann.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {ann.description}
              </p>

              {/* Attachment Download Pill */}
              {ann.attachmentName && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-700 font-medium hover:bg-slate-100 transition cursor-pointer">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Download Attachment: <strong>{ann.attachmentName}</strong></span>
                  <Download className="w-3.5 h-3.5 ml-1 text-slate-400" />
                </div>
              )}
            </div>

            {/* Right Meta & Admin Controls */}
            <div className="shrink-0 flex flex-col items-start md:items-end justify-between self-stretch text-xs text-slate-400 space-y-3">
              <div className="text-left md:text-right space-y-0.5">
                <div>
                  Published:{' '}
                  <strong className="text-slate-700">{ann.publicationDate}</strong>
                </div>
                <div>
                  Active Through:{' '}
                  <strong className="text-slate-700">{ann.expiryDate}</strong>
                </div>
                <div className="text-[11px] text-slate-400">By {ann.authorName}</div>
              </div>

              {/* Admin Actions */}
              {activeRole === 'ADMIN' && (
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 w-full md:w-auto justify-end">
                  <button
                    onClick={() => togglePublishAnnouncement(ann.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                    title={ann.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {ann.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(ann)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-blue-600"
                    title="Edit announcement"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-slate-200 overflow-hidden my-auto">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingAnn ? 'Edit Municipal Notice' : 'Draft New Municipal Announcement'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-blue-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Scheduled Water Supply Interruption for Valve Retrofit"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Description</label>
                <textarea
                  rows={4}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Full text with dates, affected streets, and citizen advisories..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as AnnouncementCategory)}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="WATER">Water Supply</option>
                    <option value="ROADS">Roads & Traffic</option>
                    <option value="GARBAGE">Garbage & Waste</option>
                    <option value="NOTICE">Public Notice</option>
                    <option value="EVENT">Municipal Town Hall</option>
                    <option value="HEALTH">Public Health</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as AnnouncementPriority)}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="CRITICAL">Critical Emergency Alert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Affected Ward</label>
                  <select
                    value={formWardId}
                    onChange={(e) => setFormWardId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="">All City Wards (General)</option>
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formExpiryDate}
                    onChange={(e) => setFormExpiryDate(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Attachment Name (e.g. Map_Detour_PDF.pdf)
                </label>
                <input
                  type="text"
                  value={formAttachment}
                  onChange={(e) => setFormAttachment(e.target.value)}
                  placeholder="Detour_Plan_Oct2026.pdf"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md"
                >
                  {editingAnn ? 'Save Changes' : 'Publish to Citizens'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
