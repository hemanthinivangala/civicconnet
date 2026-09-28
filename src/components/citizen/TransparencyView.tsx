import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { CivicMap } from '../common/CivicMap';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  MapPin,
  Trash2,
  Hammer,
  ShieldCheck,
} from 'lucide-react';

export const TransparencyView: React.FC = () => {
  const { complaints, projects, wards, garbageSchedules, wasteRoutes } = useCivic();

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const pending = complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'ACKNOWLEDGED').length;
  const escalated = complaints.filter((c) => c.status === 'ESCALATED').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Complaints by category breakdown
  const categoryCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  // Complaints by ward breakdown
  const wardCounts = wards.map((w) => {
    const count = complaints.filter((c) => c.wardId === w.id).length;
    const resolvedCount = complaints.filter((c) => c.wardId === w.id && (c.status === 'RESOLVED' || c.status === 'CLOSED')).length;
    return {
      ward: w,
      total: count,
      resolved: resolvedCount,
      rate: count > 0 ? Math.round((resolvedCount / count) * 100) : 0,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Explicit DEMO DATA Notification Banner */}
      <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong className="uppercase font-bold tracking-wider">DEMO DATA NOTICE:</strong> All resolution statistics, charts, tonnages, and civic indices presented below are sample demonstrative metrics illustrating the CivicConnect transparency analytics engine.
        </div>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <span>Public Transparency & Open Governance</span>
          <span>&bull;</span>
          <span>Real-time Civic Performance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
          Municipal Transparency Dashboard
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Open citizen metrics tracking service delivery performance, ward complaint resolution velocity, solid waste collection efficiency, and municipal capital outlays.
        </p>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Grievances</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{total}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Citywide 2026 YTD</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resolved Cases</span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">{resolved}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {resolutionRate}% Resolution Rate
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Active In-Ground</span>
          <div className="text-3xl font-extrabold text-blue-700 mt-1">{inProgress}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Work orders issued</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Triage</span>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{pending}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">&lt; 24h average SLA</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Escalated</span>
          <div className="text-3xl font-extrabold text-red-600 mt-1">{escalated}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Executive oversight</span>
        </div>
      </div>

      {/* Visual Charts Grid: Complaints by Category & Ward Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Complaints by Category (Horizontal Bar Chart) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Complaints by Department Category
              </h3>
              <p className="text-xs text-slate-500">Distribution of civic defects logged</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Bar Distribution
            </span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate pr-2">{cat.replace('_', ' ')}</span>
                    <span className="shrink-0 font-mono">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complaints by Ward (Resolution Performance) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Ward Resolution Rate Performance
              </h3>
              <p className="text-xs text-slate-500">Redressal velocity across all 5 wards</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
              SLA Ranking
            </span>
          </div>

          <div className="space-y-4">
            {wardCounts.map(({ ward, total: wTotal, resolved: wResolved, rate }) => (
              <div key={ward.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">{ward.name}</span>
                  <span className="font-bold text-emerald-700 font-mono">{rate}% Resolved</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${rate}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>{wTotal} total complaints</span>
                  <span>{wResolved} cleared</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solid Waste Efficiency & Capital Projects Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Waste Management Statistics */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-teal-600" />
              Waste Management Efficiency (Demo)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-100">
              <span className="text-teal-800 font-semibold block text-[11px]">Daily Wet Waste Processed</span>
              <strong className="text-teal-950 text-xl block mt-0.5">142 Tons</strong>
              <span className="text-[10px] text-teal-700">100% bio-composted</span>
            </div>
            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
              <span className="text-blue-800 font-semibold block text-[11px]">Recycled Dry Plastics</span>
              <strong className="text-blue-950 text-xl block mt-0.5">86 Tons</strong>
              <span className="text-[10px] text-blue-700">Circular economy recovery</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-semibold block text-[11px]">Active Fleet Vehicles</span>
              <strong className="text-slate-800 text-xl block mt-0.5">{wasteRoutes.length} Tippers</strong>
              <span className="text-[10px] text-slate-500">100% GPS tracked</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-semibold block text-[11px]">Curbside Route Coverage</span>
              <strong className="text-slate-800 text-xl block mt-0.5">98.4%</strong>
              <span className="text-[10px] text-emerald-600 font-semibold">On-time SLA</span>
            </div>
          </div>
        </div>

        {/* Capital Projects Delivery Snapshot */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Hammer className="w-5 h-5 text-indigo-600" />
              Capital Works Completion Status
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <strong className="text-slate-900 block">Total Active Projects</strong>
                <span className="text-[11px] text-slate-500">Public works & transit upgrades</span>
              </div>
              <strong className="text-lg text-blue-700 font-mono">{projects.length}</strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <strong className="text-slate-900 block">Average Physical Completion</strong>
                <span className="text-[11px] text-slate-500">Weighted against milestone targets</span>
              </div>
              <strong className="text-lg text-emerald-700 font-mono">
                {Math.round(projects.reduce((acc, p) => acc + p.progressPercentage, 0) / (projects.length || 1))}%
              </strong>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900">
              All infrastructure contracts undergo bi-monthly independent engineering audit inspections.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Public Map */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          Live Geographic Redressal Map
        </h3>
        <CivicMap mode="complaints" height="360px" complaints={complaints} />
      </div>
    </div>
  );
};
