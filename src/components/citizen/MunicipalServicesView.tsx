import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { Service } from '../../types';
import {
  FileText,
  Search,
  Filter,
  ExternalLink,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Clock,
  Edit,
  Save,
  X,
  Plus,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface MunicipalServicesViewProps {
  onNavigate: (view: string, detailId?: string) => void;
  selectedServiceId?: string;
}

export const MunicipalServicesView: React.FC<MunicipalServicesViewProps> = ({
  onNavigate,
  selectedServiceId,
}) => {
  const { services, activeRole, updateService } = useCivic();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalService, setActiveModalService] = useState<Service | null>(() => {
    if (selectedServiceId) {
      return services.find((s) => s.id === selectedServiceId) || null;
    }
    return null;
  });

  // Admin edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Service | null>(null);

  const categories = ['ALL', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || srv.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenDetail = (srv: Service) => {
    setActiveModalService(srv);
    setEditFormData(srv);
    setIsEditing(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      updateService(editFormData);
      setActiveModalService(editFormData);
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <span>Municipal Services Catalog</span>
          <span>&bull;</span>
          <span>Civic Rights & Transparency</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Municipal Services & Citizen Guides
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Access official guidelines, required documentation checklists, and application steps for property taxation, utilities, civil registries, licenses, and grievance reporting.
            </p>
          </div>
          {activeRole === 'ADMIN' && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4 text-blue-600" />
              <span>Admin Mode: You can edit service specifications</span>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services (e.g. Birth certificate, Water bill, Road complaint)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-semibold shrink-0 pr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid (All 15 Services) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                  {srv.category}
                </span>
                {srv.isOnlineAvailable && (
                  <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online Portal
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition leading-snug mb-2">
                {srv.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                {srv.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Department:</span> {srv.departmentName}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenDetail(srv)}
                  className="flex-1 bg-slate-900 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>View Details & Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {activeRole === 'ADMIN' && (
                  <button
                    onClick={() => {
                      handleOpenDetail(srv);
                      setIsEditing(true);
                    }}
                    className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-600"
                    title="Edit Service"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Detail / Admin Edit Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 block mb-1">
                  {activeModalService.category}
                </span>
                <h3 className="font-bold text-lg leading-tight font-serif">
                  {activeModalService.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="text-blue-200 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {isEditing && activeRole === 'ADMIN' ? (
                /* Admin Edit Form */
                <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Service Title</label>
                    <input
                      type="text"
                      value={editFormData?.name || ''}
                      onChange={(e) =>
                        setEditFormData((prev) => (prev ? { ...prev, name: e.target.value } : null))
                      }
                      className="w-full p-2 border rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editFormData?.description || ''}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      className="w-full p-2 border rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Department Name & Official
                    </label>
                    <input
                      type="text"
                      value={editFormData?.departmentName || ''}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev ? { ...prev, departmentName: e.target.value } : null
                        )
                      }
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={editFormData?.contactPhone || ''}
                        onChange={(e) =>
                          setEditFormData((prev) =>
                            prev ? { ...prev, contactPhone: e.target.value } : null
                          )
                        }
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={editFormData?.contactEmail || ''}
                        onChange={(e) =>
                          setEditFormData((prev) =>
                            prev ? { ...prev, contactEmail: e.target.value } : null
                          )
                        }
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Processing Time SLA</label>
                    <input
                      type="text"
                      value={editFormData?.processingTime || ''}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev ? { ...prev, processingTime: e.target.value } : null
                        )
                      }
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-slate-50 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                /* Regular Citizen View */
                <>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Overview
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {activeModalService.description}
                    </p>
                  </div>

                  {/* Required Documents Checklist */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Required Documents Checklist
                    </h4>
                    <ul className="space-y-1.5">
                      {activeModalService.requiredDocuments.map((doc, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Application Steps */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                      Application Steps & Procedure
                    </h4>
                    <div className="space-y-2">
                      {activeModalService.applicationSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Department & Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold block mb-0.5">
                        Responsible Department
                      </span>
                      <strong className="text-slate-800 block">
                        {activeModalService.departmentName}
                      </strong>
                      <span className="text-slate-500 mt-1 block">
                        Processing SLA: <strong>{activeModalService.processingTime}</strong>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 font-semibold block mb-0.5">
                        Official Contact
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>{activeModalService.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>{activeModalService.contactEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guardrail Disclaimer */}
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Notice:</strong> Specific government statutory fees, tax rates, and legal challans are prescribed by municipal council resolutions. Please verify statutory payments with the treasury counter or official portal.
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
                    {activeRole === 'ADMIN' && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-500" /> Edit Service Specs
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalService(null);
                        onNavigate('report');
                      }}
                      className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 ml-auto"
                    >
                      <span>Report Issue Regarding This Service</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
