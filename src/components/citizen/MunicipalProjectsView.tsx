import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { MunicipalProject, ProjectStatus } from '../../types';
import { CivicMap } from '../common/CivicMap';
import {
  Hammer,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface MunicipalProjectsViewProps {
  onNavigate: (view: string, detailId?: string) => void;
  selectedProjectId?: string;
}

export const MunicipalProjectsView: React.FC<MunicipalProjectsViewProps> = ({
  onNavigate,
  selectedProjectId,
}) => {
  const { projects, wards, departments } = useCivic();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [wardFilter, setWardFilter] = useState<string>('ALL');
  const [activeModalProject, setActiveModalProject] = useState<MunicipalProject | null>(() => {
    if (selectedProjectId) {
      return projects.find((p) => p.id === selectedProjectId) || null;
    }
    return null;
  });

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesWard = wardFilter === 'ALL' || p.wardId === wardFilter;
    return matchesStatus && matchesWard;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ONGOING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELAYED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PLANNED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Explicit DEMO DATA Notification Banner */}
      <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong className="uppercase font-bold tracking-wider">DEMO DATA NOTICE:</strong> All municipal infrastructure projects, budgets, contractor names, and timelines listed on this portal represent simulated municipal demonstrative data. Official municipal procurement orders and capital outlays must be verified through the city council archives.
        </div>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
          <span>Capital Infrastructure Tracker</span>
          <span>&bull;</span>
          <span>Public Works Transparency</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
          Municipal Infrastructure Projects
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Track public investments in roads, stormwater mitigation reservoirs, renewable bio-energy plants, bicycle pathways, and historic preservation across all 5 wards.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Status:
            </label>
            <div className="flex gap-1.5 text-xs font-semibold">
              {['ALL', 'ONGOING', 'COMPLETED', 'PLANNED', 'DELAYED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="pl-0 sm:pl-4 sm:border-l border-slate-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Filter by Ward:
            </label>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="ALL">All City Wards</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  Ward {w.number}: {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredProjects.length}</strong> municipal capital projects
        </div>
      </div>

      {/* Map of Projects */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-600" />
          Geographic Distribution of City Projects
        </h3>
        <CivicMap
          mode="projects"
          height="320px"
          projects={filteredProjects}
          onSelectProject={(p) => setActiveModalProject(p)}
        />
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((prj) => (
          <div
            key={prj.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={prj.images[0]}
                  alt={prj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border shadow-xs ${getStatusBadge(
                      prj.status
                    )}`}
                  >
                    {prj.status}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-black/70 text-amber-300 px-1.5 py-0.5 rounded">
                    DEMO DATA
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-2 py-0.5 rounded">
                  {prj.progressPercentage}% Complete
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{prj.departmentName}</span>
                  <span>&bull;</span>
                  <span>{prj.wardName}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-blue-700 transition">
                  {prj.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {prj.description}
                </p>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Physical Progress</span>
                    <span>{prj.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        prj.status === 'COMPLETED'
                          ? 'bg-emerald-600'
                          : prj.status === 'DELAYED'
                          ? 'bg-red-500'
                          : 'bg-teal-600'
                      }`}
                      style={{ width: `${prj.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom details */}
            <div className="p-5 pt-0 border-t border-slate-100 mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-3">
                <div>
                  <span className="block text-slate-400">Target Date</span>
                  <strong className="text-slate-700">{prj.expectedCompletionDate}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Budget (Est.)</span>
                  <strong className="text-slate-700">{prj.budget}</strong>
                </div>
              </div>

              <button
                onClick={() => setActiveModalProject(prj)}
                className="w-full bg-slate-900 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>View Project Milestones</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="relative h-48 w-full bg-slate-900">
              <img
                src={activeModalProject.images[0]}
                alt={activeModalProject.name}
                className="w-full h-full object-cover opacity-60"
              />
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-black px-2 py-0.5 rounded">
                  DEMO DATA SPECIFICATION
                </span>
                <h3 className="font-bold text-lg mt-1 font-serif">{activeModalProject.name}</h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs">
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeModalProject.description}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Current Physical Execution Progress</span>
                  <span>{activeModalProject.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: `${activeModalProject.progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Ward Location</span>
                  <strong className="text-slate-800">{activeModalProject.wardName}</strong>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    {activeModalProject.location}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">
                    Responsible Department
                  </span>
                  <strong className="text-slate-800">{activeModalProject.departmentName}</strong>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Project Timeline</span>
                  <span className="text-slate-700">
                    Start: {activeModalProject.startDate}
                  </span>
                  <span className="block text-slate-700 font-semibold">
                    Target Completion: {activeModalProject.expectedCompletionDate}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Contractor Partner</span>
                  <strong className="text-slate-800">{activeModalProject.contractor}</strong>
                  <span className="text-slate-500 block text-[11px]">
                    Estimated Outlay: {activeModalProject.budget}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
