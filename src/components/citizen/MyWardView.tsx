import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { CivicMap } from '../common/CivicMap';
import {
  MapPin,
  User,
  Phone,
  Mail,
  Building,
  AlertTriangle,
  Droplets,
  Hammer,
  Trash2,
  Bell,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

interface MyWardViewProps {
  onNavigate: (view: string, detailId?: string) => void;
}

export const MyWardView: React.FC<MyWardViewProps> = ({ onNavigate }) => {
  const {
    wards,
    garbageSchedules,
    announcements,
    projects,
    complaints,
    offices,
  } = useCivic();

  const [selectedWardId, setSelectedWardId] = useState<string>(wards[0]?.id || 'w-1');
  const currentWard = wards.find((w) => w.id === selectedWardId) || wards[0];
  const [selectedLocality, setSelectedLocality] = useState<string>(
    currentWard.localities[0] || ''
  );

  const handleWardChange = (id: string) => {
    setSelectedWardId(id);
    const w = wards.find((ward) => ward.id === id);
    if (w && w.localities[0]) {
      setSelectedLocality(w.localities[0]);
    }
  };

  // Filter ward specific data
  const wardSchedules = garbageSchedules.filter((s) => s.wardId === currentWard.id);
  const wardAnnouncements = announcements.filter(
    (a) => !a.wardId || a.wardId === currentWard.id
  );
  const wardProjects = projects.filter((p) => p.wardId === currentWard.id);
  const wardComplaints = complaints.filter((c) => c.wardId === currentWard.id);
  const wardOffice = offices.find((o) => o.address.includes(`Ward ${currentWard.number}`)) || offices[0];

  // Specific work filters
  const waterWorks = wardComplaints.filter(
    (c) => (c.category === 'WATER' || c.category === 'DRAINAGE') && c.status !== 'RESOLVED'
  );
  const roadWorks = wardComplaints.filter(
    (c) => c.category === 'ROADS_POTHOLES' && c.status !== 'RESOLVED'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header & Hierarchy Selector: City → Ward → Locality */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <span>Ward Level Civic Governance</span>
            <span>&bull;</span>
            <span>Local Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            My Ward Explorer
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Select your zone and neighborhood to view elected councillor contacts, public facilities, waste collection days, utility maintenance, and ongoing municipal projects.
          </p>
        </div>

        {/* 3-Tier Hierarchy Selector (City → Ward → Locality) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* City */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. City / Jurisdiction
            </label>
            <div className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
              CivicConnect Municipal Corporation
            </div>
          </div>

          {/* Ward */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Select Ward
            </label>
            <select
              value={selectedWardId}
              onChange={(e) => handleWardChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  Ward {w.number}: {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Locality */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Select Locality / Block
            </label>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {currentWard.localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ward Profile & Councillor Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Councillor Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Elected Representative
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-2">
              {currentWard.councillorName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Municipal Councillor &bull; {currentWard.name}
            </p>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{currentWard.councillorPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{currentWard.councillorEmail}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Constituency Office</span>
            <span className="font-semibold text-slate-700">{currentWard.zone}</span>
          </div>
        </div>

        {/* Zonal Ward Office Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Administrative Headquarters
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-2">
              Ward {currentWard.number} Administrative Office
            </h3>
            <p className="text-xs text-slate-500 mb-4">{currentWard.officeAddress}</p>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{currentWard.officePhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{currentWard.officeEmail}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Public Counter Hours:</span>
            <strong className="text-slate-700">Mon - Fri: 9:00 - 4:30</strong>
          </div>
        </div>

        {/* Ward Demographics & Statistics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Ward Key Metrics
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-2">
              Ward Overview Statistics
            </h3>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Population</span>
                <strong className="text-slate-800 text-sm">
                  {currentWard.population.toLocaleString()}
                </strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Area</span>
                <strong className="text-slate-800 text-sm">{currentWard.areaSqKm} km²</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Active Projects</span>
                <strong className="text-blue-700 text-sm">{wardProjects.length}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Civic Complaints</span>
                <strong className="text-amber-700 text-sm">{wardComplaints.length}</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs flex justify-between items-center">
            <span className="text-slate-500">Public Facilities:</span>
            <strong className="text-slate-800">{currentWard.facilities.length} mapped</strong>
          </div>
        </div>
      </div>

      {/* Interactive Ward Map with Facilities and Active Complaints */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Ward Facilities & Active Complaints Map
            </h3>
            <p className="text-xs text-slate-500">
              Showing public hospitals, schools, parks, fire stations, and current civic grievances in {currentWard.name}
            </p>
          </div>
        </div>

        <CivicMap
          mode="ward"
          height="380px"
          initialCenter={[currentWard.lat, currentWard.lng]}
          initialZoom={14}
          complaints={wardComplaints}
          facilities={currentWard.facilities}
          offices={[wardOffice]}
          onSelectComplaint={(c) => onNavigate('track', c.id)}
        />
      </div>

      {/* Ward Services Grid: Garbage Schedules, Water Interruptions & Active Works */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Garbage Collection Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-teal-600" />
              Garbage Collection Days
            </h3>
            <button
              onClick={() => onNavigate('garbage')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Full Schedule →
            </button>
          </div>

          <div className="space-y-3">
            {wardSchedules.length === 0 ? (
              <p className="text-xs text-slate-500">Regular daily morning curbside route.</p>
            ) : (
              wardSchedules.map((gs) => (
                <div key={gs.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="font-bold text-slate-800">{gs.localityName}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5 font-medium text-teal-700">
                    {gs.collectionDays.join(', ')}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    Timing: <strong>{gs.timeSlot}</strong> &bull; Vehicle: {gs.vehicleNumber}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Col 2: Water Interruptions & Road Works */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              Utility Maintenance & Road Works
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {waterWorks.length > 0 && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <span className="font-bold text-blue-900 block mb-0.5">Water & Drainage Alerts</span>
                {waterWorks.slice(0, 2).map((w) => (
                  <div key={w.id} className="text-slate-700 text-[11px] mt-1">
                    &bull; {w.title} ({w.locality})
                  </div>
                ))}
              </div>
            )}

            {roadWorks.length > 0 ? (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <span className="font-bold text-amber-900 block mb-0.5">Active Road Works</span>
                {roadWorks.slice(0, 2).map((r) => (
                  <div key={r.id} className="text-slate-700 text-[11px] mt-1">
                    &bull; {r.title} ({r.locality})
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No major arterial road closures today.</p>
            )}
          </div>
        </div>

        {/* Col 3: Ward Municipal Projects */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Hammer className="w-4 h-4 text-teal-600" />
              Ward Municipal Projects
            </h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              All Projects →
            </button>
          </div>

          <div className="space-y-3">
            {wardProjects.length === 0 ? (
              <p className="text-xs text-slate-500">No active capital projects in this ward.</p>
            ) : (
              wardProjects.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 line-clamp-1">{p.name}</span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1 rounded">
                      {p.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-teal-600 h-full rounded-full"
                      style={{ width: `${p.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Target: {p.expectedCompletionDate} &bull; Budget: {p.budget}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
