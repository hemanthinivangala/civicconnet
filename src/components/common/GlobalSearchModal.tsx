import React, { useState, useEffect } from 'react';
import { useCivic } from '../../context/CivicContext';
import { Service, Announcement, MunicipalProject, MunicipalOffice, Complaint, FAQ } from '../../types';
import { Search, X, FileText, Bell, Hammer, Building2, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, detailId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { services, announcements, projects, offices, complaints, faqs } = useCivic();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent, or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search across 6 categories
  const matchedServices: Service[] = cleanQuery
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(cleanQuery) ||
          s.description.toLowerCase().includes(cleanQuery) ||
          s.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedAnnouncements: Announcement[] = cleanQuery
    ? announcements.filter(
        (a) =>
          a.title.toLowerCase().includes(cleanQuery) ||
          a.description.toLowerCase().includes(cleanQuery) ||
          a.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedProjects: MunicipalProject[] = cleanQuery
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery) ||
          p.departmentName.toLowerCase().includes(cleanQuery) ||
          p.wardName.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedOffices: MunicipalOffice[] = cleanQuery
    ? offices.filter(
        (o) =>
          o.name.toLowerCase().includes(cleanQuery) ||
          o.address.toLowerCase().includes(cleanQuery) ||
          o.servicesAvailable.some((s) => s.toLowerCase().includes(cleanQuery))
      )
    : [];

  const matchedComplaints: Complaint[] = cleanQuery
    ? complaints.filter(
        (c) =>
          c.id.toLowerCase().includes(cleanQuery) ||
          c.title.toLowerCase().includes(cleanQuery) ||
          c.description.toLowerCase().includes(cleanQuery) ||
          c.locality.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedFaqs: FAQ[] = cleanQuery
    ? faqs.filter(
        (f) =>
          f.question.toLowerCase().includes(cleanQuery) ||
          f.answer.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults =
    matchedServices.length +
    matchedAnnouncements.length +
    matchedProjects.length +
    matchedOffices.length +
    matchedComplaints.length +
    matchedFaqs.length;

  const handleSelect = (view: string, detailId?: string) => {
    onNavigate(view, detailId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-200 p-4 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            placeholder="Search municipal services, complaints, projects, announcements, offices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded font-medium ml-2"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!cleanQuery ? (
            <div className="text-center py-8 text-slate-500">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-700">Type to search the municipal portal</p>
              <p className="text-xs text-slate-400 mt-1">
                Try "pothole", "birth certificate", "water bill", "ward 1", or a complaint ID like "CC-2026-000001"
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <AlertCircle className="w-10 h-10 mx-auto text-amber-400 mb-2" />
              <p className="font-semibold text-slate-800">No municipal results found</p>
              <p className="text-xs text-slate-500 mt-1">
                No matching services, complaints, or announcements for "{query}".
              </p>
            </div>
          ) : (
            <>
              {/* Group 1: Services */}
              {matchedServices.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Municipal Services ({matchedServices.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedServices.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => handleSelect('services', srv.id)}
                        className="p-2.5 rounded-lg hover:bg-blue-50 transition cursor-pointer flex items-center justify-between group border border-transparent hover:border-blue-100"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                            {srv.name}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">
                            {srv.departmentName} &bull; {srv.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 2: Complaints */}
              {matchedComplaints.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Civic Complaints ({matchedComplaints.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedComplaints.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelect('track', c.id)}
                        className="p-2.5 rounded-lg hover:bg-amber-50 transition cursor-pointer flex items-center justify-between group border border-transparent hover:border-amber-100"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-amber-800 flex items-center gap-2">
                            <span>{c.id}</span>
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                              {c.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 line-clamp-1">{c.title}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 3: Municipal Announcements */}
              {matchedAnnouncements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-indigo-600" />
                    Announcements & Notices ({matchedAnnouncements.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedAnnouncements.map((ann) => (
                      <div
                        key={ann.id}
                        onClick={() => handleSelect('announcements', ann.id)}
                        className="p-2.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer flex items-center justify-between group border border-transparent hover:border-indigo-100"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
                            {ann.title}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">
                            {ann.publicationDate} &bull; {ann.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 4: Municipal Projects */}
              {matchedProjects.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-teal-600" />
                    Municipal Projects ({matchedProjects.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedProjects.map((prj) => (
                      <div
                        key={prj.id}
                        onClick={() => handleSelect('projects', prj.id)}
                        className="p-2.5 rounded-lg hover:bg-teal-50 transition cursor-pointer flex items-center justify-between group border border-transparent hover:border-teal-100"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">
                            {prj.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Status: {prj.status} &bull; Progress: {prj.progressPercentage}%
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 5: Municipal Offices */}
              {matchedOffices.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    Offices & Civic Centers ({matchedOffices.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedOffices.map((off) => (
                      <div
                        key={off.id}
                        onClick={() => handleSelect('offices', off.id)}
                        className="p-2.5 rounded-lg hover:bg-slate-100 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{off.name}</div>
                          <div className="text-xs text-slate-500">{off.address} &bull; {off.phone}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 6: FAQs */}
              {matchedFaqs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                    Civic FAQs ({matchedFaqs.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedFaqs.map((f) => (
                      <div
                        key={f.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <div className="text-sm font-semibold text-slate-900">{f.question}</div>
                        <div className="text-xs text-slate-600 mt-1">{f.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 flex justify-between items-center">
          <span>Search municipal records, services & public works</span>
          <span className="font-mono text-[11px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">
            CivicConnect Global Index
          </span>
        </div>
      </div>
    </div>
  );
};
