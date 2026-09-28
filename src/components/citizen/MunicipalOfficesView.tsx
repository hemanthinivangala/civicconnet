import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { MunicipalOffice } from '../../types';
import { CivicMap } from '../common/CivicMap';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface MunicipalOfficesViewProps {
  onNavigate: (view: string, detailId?: string) => void;
  selectedOfficeId?: string;
}

export const MunicipalOfficesView: React.FC<MunicipalOfficesViewProps> = ({
  onNavigate,
  selectedOfficeId,
}) => {
  const { offices } = useCivic();

  const [activeOffice, setActiveOffice] = useState<MunicipalOffice>(() => {
    if (selectedOfficeId) {
      return offices.find((o) => o.id === selectedOfficeId) || offices[0];
    }
    return offices[0];
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <span>Civic Administration Centers</span>
          <span>&bull;</span>
          <span>Public Service Counters</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
          Municipal Offices & Citizen Service Centers
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Locate city hall headquarters, zonal sub-division offices, counter operating hours, and dedicated ombudsman desks across your municipal territory.
        </p>
      </div>

      {/* Interactive Map with Office Markers */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Municipal Offices Map
          </h3>
          <span className="text-xs text-slate-500">
            Click any building marker on the map to inspect available desk services
          </span>
        </div>

        <CivicMap
          mode="offices"
          height="340px"
          offices={offices}
          initialCenter={[activeOffice.lat, activeOffice.lng]}
          initialZoom={13}
          onSelectOffice={(off) => setActiveOffice(off)}
        />
      </div>

      {/* Offices Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offices.map((off) => {
          const isSelected = activeOffice.id === off.id;
          return (
            <div
              key={off.id}
              onClick={() => setActiveOffice(off)}
              className={`bg-white rounded-2xl p-6 border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                    {off.zone}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Lead: <strong className="text-slate-800">{off.headOfficial}</strong>
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 leading-snug mb-2 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-700 shrink-0" />
                  {off.name}
                </h3>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{off.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{off.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{off.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{off.workingHours}</span>
                  </div>
                </div>

                {/* Services Available Checklist */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Available Counter Facilitation Services:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-700">
                    {off.servicesAvailable.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Public Grievance Helpdesk</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('report');
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-1.5 px-3 rounded-lg border border-blue-200 transition"
                >
                  Report Issue to this Office
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
