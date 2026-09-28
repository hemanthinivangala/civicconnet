import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { GarbageSchedule, WasteRoute, BulkPickupRequest, IllegalDumpingReport } from '../../types';
import {
  Trash2,
  Calendar,
  AlertTriangle,
  Truck,
  PlusCircle,
  Clock,
  CheckCircle2,
  FileText,
  MapPin,
  Layers,
  BarChart2,
  Edit,
  Save,
  ShieldAlert,
} from 'lucide-react';

interface GarbageManagementViewProps {
  onNavigate: (view: string, detailId?: string) => void;
}

export const GarbageManagementView: React.FC<GarbageManagementViewProps> = ({ onNavigate }) => {
  const {
    wards,
    activeRole,
    currentUser,
    garbageSchedules,
    wasteRoutes,
    bulkPickupRequests,
    illegalDumpingReports,
    reportMissedGarbage,
    reportIllegalDumping,
    requestBulkPickup,
    updateGarbageSchedule,
  } = useCivic();

  const [activeTab, setActiveTab] = useState<'schedule' | 'missed' | 'dumping' | 'bulk' | 'guide' | 'admin_routes'>('schedule');

  // Filter state for schedule
  const [selectedWardId, setSelectedWardId] = useState<string>('ALL');

  // Form: Report Missed
  const [missedWardId, setMissedWardId] = useState(wards[0]?.id || 'w-1');
  const [missedLocality, setMissedLocality] = useState(wards[0]?.localities[0] || 'Civic Centre Sector A');
  const [missedAddress, setMissedAddress] = useState('');
  const [missedNotes, setMissedNotes] = useState('');
  const [missedSuccess, setMissedSuccess] = useState(false);

  // Form: Illegal Dumping
  const [dumpWardId, setDumpWardId] = useState(wards[0]?.id || 'w-1');
  const [dumpLocality, setDumpLocality] = useState(wards[0]?.localities[0] || 'Civic Centre Sector A');
  const [dumpLandmark, setDumpLandmark] = useState('');
  const [dumpDesc, setDumpDesc] = useState('');
  const [dumpPhotoUrl, setDumpPhotoUrl] = useState('');
  const [dumpSuccess, setDumpSuccess] = useState(false);

  // Form: Bulk Pickup
  const [bulkWardId, setBulkWardId] = useState(wards[0]?.id || 'w-1');
  const [bulkLocality, setBulkLocality] = useState(wards[0]?.localities[0] || 'Civic Centre Sector A');
  const [bulkAddress, setBulkAddress] = useState('');
  const [bulkItems, setBulkItems] = useState('');
  const [bulkDate, setBulkDate] = useState('2026-10-03');
  const [bulkSuccess, setBulkSuccess] = useState(false);

  // Admin Editing Schedule
  const [editingSchedule, setEditingSchedule] = useState<GarbageSchedule | null>(null);

  const filteredSchedules =
    selectedWardId === 'ALL'
      ? garbageSchedules
      : garbageSchedules.filter((s) => s.wardId === selectedWardId);

  // Handlers
  const handleMissedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missedAddress.trim()) return;

    reportMissedGarbage(missedWardId, missedLocality, missedAddress.trim(), missedNotes.trim());
    setMissedSuccess(true);
    setMissedAddress('');
    setMissedNotes('');
    setTimeout(() => setMissedSuccess(false), 3500);
  };

  const handleDumpingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dumpDesc.trim()) return;

    const ward = wards.find((w) => w.id === dumpWardId) || wards[0];
    reportIllegalDumping({
      citizenId: currentUser?.id || 'usr-citizen-1',
      citizenName: currentUser?.name || 'Citizen Reporter',
      citizenPhone: currentUser?.phone || '+1 (555) 234-5678',
      wardId: ward.id,
      wardName: ward.name,
      locality: dumpLocality,
      landmark: dumpLandmark,
      description: dumpDesc,
      photoUrl: dumpPhotoUrl || undefined,
    });

    setDumpSuccess(true);
    setDumpDesc('');
    setDumpLandmark('');
    setDumpPhotoUrl('');
    setTimeout(() => setDumpSuccess(false), 3500);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkItems.trim() || !bulkAddress.trim()) return;

    const ward = wards.find((w) => w.id === bulkWardId) || wards[0];
    requestBulkPickup({
      citizenId: currentUser?.id || 'usr-citizen-1',
      citizenName: currentUser?.name || 'Citizen Requester',
      citizenPhone: currentUser?.phone || '+1 (555) 234-5678',
      wardId: ward.id,
      wardName: ward.name,
      locality: bulkLocality,
      address: bulkAddress,
      itemsDescription: bulkItems,
      preferredDate: bulkDate,
    });

    setBulkSuccess(true);
    setBulkItems('');
    setBulkAddress('');
    setTimeout(() => setBulkSuccess(false), 3500);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchedule) {
      updateGarbageSchedule(editingSchedule);
      setEditingSchedule(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
          <span>Solid Waste Management Bureau</span>
          <span>&bull;</span>
          <span>Curbside & Recycling Services</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
          Garbage & Waste Management
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          View street-level garbage collection schedules, report missed morning pickups, lodge illegal dumping notices, and request bulk appliance or furniture collection.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'schedule'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Collection Schedules
        </button>

        <button
          onClick={() => setActiveTab('missed')}
          className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'missed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Report Missed Collection
        </button>

        <button
          onClick={() => setActiveTab('dumping')}
          className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'dumping'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-500" /> Report Illegal Dumping
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'bulk'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4 text-indigo-500" /> Bulk Waste Pickup Request
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'guide'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-500" /> Waste Segregation Guide
        </button>

        {activeRole === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('admin_routes')}
            className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 ml-auto ${
              activeTab === 'admin_routes'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-600" /> Admin Routes & Fleet
          </button>
        )}
      </div>

      {/* Tab 1: Collection Schedules */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Filter by Ward:
              </label>
              <select
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="ALL">All City Wards (5 Wards)</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    Ward {w.number}: {w.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-500">
              Showing {filteredSchedules.length} active collection routes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      {sch.wardName}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Vehicle: {sch.vehicleNumber}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-1">{sch.localityName}</h3>
                  <div className="text-xs font-medium text-teal-700 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{sch.timeSlot}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">
                        Collection Days:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sch.collectionDays.map((d, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded text-[11px]"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-slate-400 font-semibold block text-[11px]">
                        Segregation Stream:
                      </span>
                      <span className="text-slate-700">{sch.wasteTypes.join(' & ')}</span>
                    </div>

                    {sch.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">{sch.notes}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Driver Contact: {sch.driverContact}</span>
                  {activeRole === 'ADMIN' && (
                    <button
                      onClick={() => setEditingSchedule(sch)}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Report Missed Collection */}
      {activeTab === 'missed' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Report Missed Garbage Pickup
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              If the scheduled morning waste collection truck missed your street or residential complex, lodge an urgent dispatch request.
            </p>
          </div>

          {missedSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Missed collection complaint registered. A relief compacting tipper has been queued for your street.
            </div>
          )}

          <form onSubmit={handleMissedSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ward</label>
                <select
                  value={missedWardId}
                  onChange={(e) => {
                    setMissedWardId(e.target.value);
                    const w = wards.find((ward) => ward.id === e.target.value);
                    if (w && w.localities[0]) setMissedLocality(w.localities[0]);
                  }}
                  className="w-full p-2.5 border rounded-xl"
                >
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Locality</label>
                <select
                  value={missedLocality}
                  onChange={(e) => setMissedLocality(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                >
                  {wards
                    .find((w) => w.id === missedWardId)
                    ?.localities.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Street Address / Building Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={missedAddress}
                onChange={(e) => setMissedAddress(e.target.value)}
                placeholder="e.g. 42 Greenway Blvd, Apartment Complex B"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={missedNotes}
                onChange={(e) => setMissedNotes(e.target.value)}
                placeholder="e.g. Bin has been left outside since 7 AM, overflowing with organic waste"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-md transition"
            >
              Submit Missed Collection Report
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Report Illegal Dumping */}
      {activeTab === 'dumping' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Report Unauthorized Illegal Dumping
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Report unauthorized dumping of construction debris, demolition rubble, commercial refuse, or hazardous chemicals onto public plots or roads.
            </p>
          </div>

          {dumpSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Illegal dumping report logged. Environmental sanitation squad assigned for clearance and penalty investigation.
            </div>
          )}

          <form onSubmit={handleDumpingSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ward</label>
                <select
                  value={dumpWardId}
                  onChange={(e) => {
                    setDumpWardId(e.target.value);
                    const w = wards.find((ward) => ward.id === e.target.value);
                    if (w && w.localities[0]) setDumpLocality(w.localities[0]);
                  }}
                  className="w-full p-2.5 border rounded-xl"
                >
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Locality</label>
                <select
                  value={dumpLocality}
                  onChange={(e) => setDumpLocality(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                >
                  {wards
                    .find((w) => w.id === dumpWardId)
                    ?.localities.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Landmark / Open Plot Location</label>
              <input
                type="text"
                value={dumpLandmark}
                onChange={(e) => setDumpLandmark(e.target.value)}
                placeholder="e.g. Empty plot behind Clock Tower Fountain"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Description of Dumped Material <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={dumpDesc}
                onChange={(e) => setDumpDesc(e.target.value)}
                placeholder="Describe material type (e.g. broken concrete, commercial chemical buckets, asbestos roofing)..."
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Evidence Photo URL (Optional)</label>
              <input
                type="url"
                value={dumpPhotoUrl}
                onChange={(e) => setDumpPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl shadow-md transition"
            >
              Report Illegal Dumping
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Request Bulk Pickup */}
      {activeTab === 'bulk' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Request Bulk Waste Pickup
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Schedule curbside collection for oversized items including worn mattresses, wooden furniture, large discarded home appliances, or tree branches.
            </p>
          </div>

          {bulkSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Bulk waste pickup slot confirmed! A hydraulic flatbed tipper will arrive on {bulkDate}.
            </div>
          )}

          <form onSubmit={handleBulkSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ward</label>
                <select
                  value={bulkWardId}
                  onChange={(e) => {
                    setBulkWardId(e.target.value);
                    const w = wards.find((ward) => ward.id === e.target.value);
                    if (w && w.localities[0]) setBulkLocality(w.localities[0]);
                  }}
                  className="w-full p-2.5 border rounded-xl"
                >
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Locality</label>
                <select
                  value={bulkLocality}
                  onChange={(e) => setBulkLocality(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                >
                  {wards
                    .find((w) => w.id === bulkWardId)
                    ?.localities.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Pickup Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={bulkAddress}
                onChange={(e) => setBulkAddress(e.target.value)}
                placeholder="e.g. 15 Cobblestone Row, Front Porch"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Item Description & Quantity <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={bulkItems}
                onChange={(e) => setBulkItems(e.target.value)}
                placeholder="e.g. 1 Queen wooden bed frame, 2 sofa armchairs, 1 non-working microwave oven"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Pickup Date</label>
              <input
                type="date"
                value={bulkDate}
                onChange={(e) => setBulkDate(e.target.value)}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl shadow-md transition"
            >
              Book Bulk Waste Pickup
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Waste Segregation Guide */}
      {activeTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
              🌱
            </div>
            <h3 className="font-bold text-base text-emerald-950">Green Bin: Wet / Organic</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Processed into municipal compost and compressed biomethane fuel at our eco-digestors.
            </p>
            <ul className="text-xs text-emerald-900 space-y-1 pt-2 list-disc list-inside">
              <li>Vegetable & fruit peels</li>
              <li>Cooked leftover food scrap</li>
              <li>Coffee grounds & tea leaves</li>
              <li>Garden fallen leaves & twigs</li>
              <li>Eggshells & bread crumbs</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              📦
            </div>
            <h3 className="font-bold text-base text-blue-950">Blue Bin: Dry / Recyclable</h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              Sorted at city material recovery facilities to support local circular economy industries.
            </p>
            <ul className="text-xs text-blue-900 space-y-1 pt-2 list-disc list-inside">
              <li>Flattened cardboard boxes</li>
              <li>Newspaper & office paper</li>
              <li>Plastic beverage bottles (rinsed)</li>
              <li>Aluminum beverage cans</li>
              <li>Glass jars & bottles</li>
            </ul>
          </div>

          <div className="bg-red-50 rounded-2xl p-6 border border-red-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg">
              ☣️
            </div>
            <h3 className="font-bold text-base text-red-950">Red / Hazardous: Safe Drop-off</h3>
            <p className="text-xs text-red-800 leading-relaxed">
              Must never enter regular curbside flow. Drop off at any Ward Office or during Saturday E-waste drives.
            </p>
            <ul className="text-xs text-red-900 space-y-1 pt-2 list-disc list-inside">
              <li>Lithium & alkaline batteries</li>
              <li>Fluorescent tubes & CFL bulbs</li>
              <li>Expired medicines & syrups</li>
              <li>Paint cans & chemical thinners</li>
              <li>Electronic appliances & chargers</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 6: Admin Fleet & Routes */}
      {activeTab === 'admin_routes' && activeRole === 'ADMIN' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Active Municipal Waste Fleet & Routing
            </h2>
            <span className="text-xs text-slate-500">{wasteRoutes.length} vehicles deployed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    {route.vehicleNumber}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      route.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : route.status === 'ON_DUTY'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {route.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{route.routeName}</h3>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    <strong>Driver Lead:</strong> {route.driverName}
                  </div>
                  <div>
                    <strong>Current / Next Stop:</strong> {route.nextStop}
                  </div>
                  <div>
                    <strong>Scheduled Stops:</strong> {route.stopsCount} bins
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Route Completion</span>
                    <span>{route.completionPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full transition-all"
                      style={{ width: `${route.completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Edit Schedule: {editingSchedule.localityName}
            </h3>

            <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Time Slot Window</label>
                <input
                  type="text"
                  value={editingSchedule.timeSlot}
                  onChange={(e) =>
                    setEditingSchedule({ ...editingSchedule, timeSlot: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Vehicle</label>
                <input
                  type="text"
                  value={editingSchedule.vehicleNumber}
                  onChange={(e) =>
                    setEditingSchedule({ ...editingSchedule, vehicleNumber: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver Contact</label>
                <input
                  type="text"
                  value={editingSchedule.driverContact}
                  onChange={(e) =>
                    setEditingSchedule({ ...editingSchedule, driverContact: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
