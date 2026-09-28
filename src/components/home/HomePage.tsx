import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { CivicMap } from '../common/CivicMap';
import {
  Building2,
  AlertTriangle,
  FileText,
  Search,
  MapPin,
  Trash2,
  Bell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Hammer,
  Droplets,
  Phone,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, detailId?: string) => void;
  onOpenReport: () => void;
  onOpenAssist: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenReport,
  onOpenAssist,
}) => {
  const { complaints, services, announcements, projects, wards } = useCivic();

  const [trackInput, setTrackInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      onNavigate('track', trackInput.trim());
    } else {
      onNavigate('track');
    }
  };

  const featuredServices = services.slice(0, 6);
  const featuredAnnouncements = announcements.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(
    (c) => c.status === 'RESOLVED' || c.status === 'CLOSED'
  ).length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

  return (
    <div className="space-y-16 animate-in fade-in duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle geometric civic background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/60 border border-blue-400/30 text-xs font-semibold text-blue-200 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Official Digital Citizen Service Platform &bull; 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif leading-[1.15]">
              CIVIC<span className="text-blue-400">CONNECT</span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-blue-100 font-serif">
              "Your Digital Gateway to Municipal Services"
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Report problems, access services, track requests, and stay connected with your municipality. Designed for transparent governance, rapid grievance redressal, and connected neighborhood welfare.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenReport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <AlertTriangle className="w-5 h-5 text-emerald-200" />
                <span>REPORT A PROBLEM</span>
              </button>

              <button
                onClick={() => onNavigate('services')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base py-3.5 px-8 rounded-xl border border-white/20 shadow-md backdrop-blur-xs transition flex items-center gap-2"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-4 h-4 text-blue-300" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="mt-14 pt-8 border-t border-blue-800/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div>
              <span className="text-blue-300 block text-[11px] font-semibold">Citywide Resolution</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                {resolutionRate}%
              </strong>
              <span className="text-emerald-400 font-medium">Verified by field photos</span>
            </div>

            <div>
              <span className="text-blue-300 block text-[11px] font-semibold">Average Response</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                24 - 48h
              </strong>
              <span className="text-slate-300">Enforced by service charter</span>
            </div>

            <div>
              <span className="text-blue-300 block text-[11px] font-semibold">Digital Services</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                15 Services
              </strong>
              <span className="text-slate-300">Taxes, bills, licensing, civil</span>
            </div>

            <div>
              <span className="text-blue-300 block text-[11px] font-semibold">City Coverage</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                5 Wards
              </strong>
              <span className="text-slate-300">100% Geographic integration</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <span>Instant Citizen Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Popular Municipal Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Apply online for civil documentation, submit utility bill clearances, and view regulatory guidance.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All 15 Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((srv) => (
            <div
              key={srv.id}
              onClick={() => onNavigate('services', srv.id)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                  {srv.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition mt-2 mb-1.5">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                  {srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                <span>View Checklist & Steps</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. REPORT A PROBLEM CALLOUT & TRACK COMPLAINT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card A: Report a Problem Banner */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold font-serif">Report a Civic Problem</h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Spot a dangerous pothole, flickering streetlight, broken water main, or missed garbage collection? Pin the location on our interactive map and attach photos. Our automated engine assigns it immediately to the field department.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-blue-200 pt-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AI Categorization
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> GPS Pinpoint
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SLA Guaranteed
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Photo Verification
                </div>
              </div>
            </div>

            <button
              onClick={onOpenReport}
              className="mt-8 bg-white hover:bg-blue-50 text-blue-950 font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 group"
            >
              <span>Lodge Grievance Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          {/* Card B: Track Complaint Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Track Existing Complaint</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Have an official tracking ID (e.g. <code>CC-2026-000001</code>)? Enter it below to inspect the step-by-step progress timeline, field officer updates, and resolution proof.
              </p>

              <form onSubmit={handleTrackSubmit} className="space-y-3 pt-2">
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder="Enter Complaint ID (e.g. CC-2026-000001)"
                    className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-sm transition"
                >
                  Track Live Status Timeline
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center mt-6">
              <span>Standard Redressal Workflow:</span>
              <span className="font-semibold text-slate-800">
                Submitted → Assigned → In Progress → Resolved
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MY WARD & ANNOUNCEMENTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Ward Card */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Neighborhood Governance
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-serif">My Ward Center</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with your elected councillor, view public healthcare facilities, local schools, and discover ongoing works in your neighborhood.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                {wards.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    onClick={() => onNavigate('ward')}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition"
                  >
                    <div>
                      <strong className="text-slate-800 block">{w.name}</strong>
                      <span className="text-slate-500 text-[11px]">{w.zone}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('ward')}
              className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition"
            >
              Explore Ward Directory →
            </button>
          </div>

          {/* Announcements Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Municipal Public Notices & Advisories
                </h3>
                <p className="text-xs text-slate-500">
                  Critical water maintenance, traffic detours, and citizen deadlines
                </p>
              </div>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs text-blue-700 font-bold hover:underline"
              >
                All Notices →
              </button>
            </div>

            <div className="space-y-3">
              {featuredAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => onNavigate('announcements', ann.id)}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {ann.category}
                      </span>
                      {ann.wardName && (
                        <span className="text-[10px] text-slate-500">📍 {ann.wardName}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1">{ann.description}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">
                    {ann.publicationDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. GARBAGE & PROJECTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Garbage Management Promo */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                <span>Solid Waste Operations</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-teal-600" />
                Garbage Collection & Bulk Pickup
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                Verify morning segregation timings for green (wet) and blue (dry) bins. Did the truck miss your street? Report it directly or schedule a bulk furniture pickup slot.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs pt-4">
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
                  <strong className="text-teal-900 block font-bold">Curbside Pickup</strong>
                  <span className="text-slate-600 text-[11px]">Daily 6:30 AM - 9:30 AM</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <strong className="text-blue-900 block font-bold">Bulk Furniture & E-Waste</strong>
                  <span className="text-slate-600 text-[11px]">Weekly scheduled booking</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onNavigate('garbage')}
                className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition"
              >
                View Collection Schedule
              </button>
              <button
                onClick={() => onNavigate('garbage')}
                className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs py-3 px-4 rounded-xl transition"
              >
                Report Missed Collection
              </button>
            </div>
          </div>

          {/* Municipal Capital Projects Promo */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                  <span>Capital Works Tracking</span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  DEMO DATA
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
                <Hammer className="w-6 h-6 text-blue-600" />
                Municipal Infrastructure Projects
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                Transparency into public works: explore ongoing road resurfacing, bicycle skyways, stormwater flood mitigation culverts, and heritage restoration.
              </p>

              <div className="space-y-2.5 pt-3">
                {featuredProjects.map((p) => (
                  <div key={p.id} className="text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span className="truncate pr-2">{p.name}</span>
                      <span className="font-mono text-teal-700">{p.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full"
                        style={{ width: `${p.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('projects')}
              className="w-full bg-slate-900 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition"
            >
              Explore City Projects & Budgets →
            </button>
          </div>
        </div>
      </section>

      {/* 6. AI ASSISTANT CIVICASSIST BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-700/60 border border-indigo-400/40 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Grounded Municipal AI Assistant</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Meet CivicAssist: Your Municipal Digital Guide
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Have questions about document requirements for birth certificates? Not sure which ward office handles trade licensing? CivicAssist answers queries 24/7 without inventing fees or legal claims.
            </p>
          </div>

          <button
            onClick={onOpenAssist}
            className="bg-white hover:bg-indigo-50 text-indigo-950 font-extrabold text-sm py-4 px-8 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Chat with CivicAssist</span>
          </button>
        </div>
      </section>
    </div>
  );
};
