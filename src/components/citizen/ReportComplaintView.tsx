import React, { useState, useEffect } from 'react';
import { useCivic } from '../../context/CivicContext';
import { ComplaintCategory, ComplaintPriority, Complaint } from '../../types';
import { categorizeComplaintWithAI, CategorySuggestion } from '../../services/aiClassifier';
import { CivicMap } from '../common/CivicMap';
import {
  AlertTriangle,
  Sparkles,
  Camera,
  MapPin,
  CheckCircle2,
  Upload,
  Video,
  Info,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface ReportComplaintViewProps {
  onSuccessSubmit: (complaint: Complaint) => void;
  onNavigate: (view: string) => void;
}

const CATEGORY_OPTIONS: { id: ComplaintCategory; label: string; icon: string }[] = [
  { id: 'GARBAGE', label: 'Garbage & Waste', icon: '🗑️' },
  { id: 'STREETLIGHT', label: 'Streetlight & Electrical', icon: '💡' },
  { id: 'ROADS_POTHOLES', label: 'Roads & Potholes', icon: '🚧' },
  { id: 'WATER', label: 'Water Supply', icon: '🚰' },
  { id: 'DRAINAGE', label: 'Drainage & Stormwater', icon: '🌊' },
  { id: 'SANITATION', label: 'Sanitation & Public Restrooms', icon: '🧼' },
  { id: 'TREES', label: 'Trees & Horticulture', icon: '🌳' },
  { id: 'PUBLIC_INFRASTRUCTURE', label: 'Public Infrastructure', icon: '🏛️' },
  { id: 'OTHER', label: 'Other Civic Grievance', icon: '📋' },
];

const SAMPLE_PHOTOS = [
  { label: 'Pothole Defect', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' },
  { label: 'Garbage Overflow', url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80' },
  { label: 'Broken Streetlight', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80' },
  { label: 'Water Main Leak', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=600&auto=format&fit=crop&q=80' },
  { label: 'Fallen Tree Branch', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80' },
];

export const ReportComplaintView: React.FC<ReportComplaintViewProps> = ({
  onSuccessSubmit,
  onNavigate,
}) => {
  const { wards, currentUser, createComplaint } = useCivic();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('ROADS_POTHOLES');
  const [issueType, setIssueType] = useState('Pothole');
  const [wardId, setWardId] = useState(wards[0]?.id || 'w-1');
  const [locality, setLocality] = useState(wards[0]?.localities[0] || 'Civic Centre Sector A');
  const [landmark, setLandmark] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('NORMAL');

  // Map Location
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string }>({
    lat: wards[0]?.lat || 40.7128,
    lng: wards[0]?.lng || -74.006,
    address: 'Downtown Civic Center, Sector 1',
  });

  // Media
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // AI Suggestion State
  const [suggestion, setSuggestion] = useState<CategorySuggestion | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [acceptedSuggestion, setAcceptedSuggestion] = useState(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger Automatic Categorization debounced
  useEffect(() => {
    if (!title && !description) {
      setSuggestion(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsClassifying(true);
      const res = await categorizeComplaintWithAI(title, description);
      setSuggestion(res);
      setIsClassifying(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [title, description]);

  // Handle Ward Change
  const handleWardChange = (newWardId: string) => {
    setWardId(newWardId);
    const selectedWard = wards.find((w) => w.id === newWardId);
    if (selectedWard) {
      if (selectedWard.localities[0]) {
        setLocality(selectedWard.localities[0]);
      }
      setLocation({
        lat: selectedWard.lat,
        lng: selectedWard.lng,
        address: `${selectedWard.localities[0] || 'Ward Area'}, ${selectedWard.name}`,
      });
    }
  };

  const handleApplySuggestion = () => {
    if (suggestion) {
      setCategory(suggestion.category);
      if (suggestion.issueType) setIssueType(suggestion.issueType);
      setAcceptedSuggestion(true);
    }
  };

  const handleAddSamplePhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos([...photos, url]);
    }
  };

  const handleAddCustomPhoto = () => {
    if (customPhotoInput.trim() && !photos.includes(customPhotoInput.trim())) {
      setPhotos([...photos, customPhotoInput.trim()]);
      setCustomPhotoInput('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Please enter a complaint title';
    if (!description.trim()) newErrors.description = 'Please describe the problem in detail';
    if (!wardId) newErrors.wardId = 'Please select a ward';
    if (!locality) newErrors.locality = 'Please select a locality';
    if (!location.lat || !location.lng) newErrors.location = 'Please select a pin on the map';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const created = createComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        issueType,
        wardId,
        locality,
        landmark: landmark.trim(),
        location,
        photos,
        priority,
      });

      onSuccessSubmit(created);
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Your complaint could not be submitted. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentWardObj = wards.find((w) => w.id === wardId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <span>Official Grievance Redressal</span>
          <span>&bull;</span>
          <span>Public Redressal SLA Enforced</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
          Report a Civic Problem
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Lodge an official civic complaint with your municipal corporation. Submissions are assigned to designated field departments and tracked live with photographic verification.
        </p>
      </div>

      {errors.form && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Problem Description */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
              1
            </span>
            Describe the Civic Problem
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="e.g., Large pothole near City Middle School on Federal Ave"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                errors.title
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-slate-300 focus:ring-blue-600 focus:border-transparent'
              }`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Provide exact details: When did it occur? Is there pedestrian or vehicle risk? How long has the issue persisted? (e.g., Garbage has not been collected for three days...)"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                errors.description
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-slate-300 focus:ring-blue-600 focus:border-transparent'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Intelligent Automatic Complaint Categorization Banner */}
          {(suggestion || isClassifying) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-indigo-950 flex items-center gap-2">
                    <span>Intelligent Municipal Categorization</span>
                    {isClassifying && (
                      <span className="text-[10px] text-indigo-600 font-normal animate-pulse">
                        Analyzing...
                      </span>
                    )}
                  </div>
                  {suggestion && (
                    <div className="text-xs text-slate-700 mt-0.5">
                      Suggested: <strong className="text-blue-900">{suggestion.category}</strong>{' '}
                      {suggestion.issueType && (
                        <span>&bull; Issue: <strong>{suggestion.issueType}</strong></span>
                      )}
                      <span className="text-[11px] text-slate-500 block">{suggestion.reason}</span>
                    </div>
                  )}
                </div>
              </div>

              {suggestion && (
                <button
                  type="button"
                  onClick={handleApplySuggestion}
                  disabled={acceptedSuggestion && category === suggestion.category}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 text-white font-semibold text-xs py-2 px-3.5 rounded-lg shadow-2xs transition shrink-0 flex items-center justify-center gap-1.5"
                >
                  {category === suggestion.category ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      Category Applied
                    </>
                  ) : (
                    <>Apply Suggestion</>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Category Selector Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Complaint Category <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">You can customize the suggested category</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      setAcceptedSuggestion(false);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Specific Issue Type (Optional)
              </label>
              <input
                type="text"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                placeholder="e.g. Deep Pothole, Broken Cable, Missed Bin"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Urgency / Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="LOW">Low (Minor inconvenience)</option>
                <option value="NORMAL">Normal (Standard civic defect)</option>
                <option value="HIGH">High (Active hazard / Traffic risk)</option>
                <option value="URGENT">Urgent (Safety emergency / Flooding)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Ward & Location with OpenStreetMap */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
              2
            </span>
            Pinpoint Location on Map
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Select Ward <span className="text-red-500">*</span>
              </label>
              <select
                value={wardId}
                onChange={(e) => handleWardChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Locality / Neighborhood <span className="text-red-500">*</span>
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {currentWardObj?.localities.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Nearest Street Landmark
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g., Opposite Metro High School gate, near lamp pole #44"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Interactive Map */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Select Exact Location Pin <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500">
                Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
              </span>
            </div>

            <CivicMap
              mode="picker"
              height="340px"
              initialCenter={[location.lat, location.lng]}
              initialZoom={15}
              selectedLocation={location}
              onSelectLocation={(loc) => {
                setLocation(loc);
                if (errors.location) setErrors({ ...errors, location: '' });
              }}
            />
            {errors.location && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Section 3: Photo & Video Upload */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                3
              </span>
              Photographic / Video Evidence
            </h2>
            <span className="text-xs text-slate-400">Optional but recommended</span>
          </div>

          <p className="text-xs text-slate-600">
            Field workers prioritize complaints with attached photographs. You can select one of our pre-configured demo civic images below or paste an image URL.
          </p>

          {/* Sample quick photo chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Quick Select Demo Evidence Photo:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SAMPLE_PHOTOS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSamplePhoto(sample.url)}
                  className="group relative rounded-lg overflow-hidden border border-slate-200 hover:border-blue-500 transition text-left"
                >
                  <img
                    src={sample.url}
                    alt={sample.label}
                    className="w-full h-16 object-cover group-hover:scale-105 transition"
                  />
                  <div className="p-1 bg-white text-[10px] font-semibold text-slate-700 truncate">
                    + {sample.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom image URL input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={customPhotoInput}
              onChange={(e) => setCustomPhotoInput(e.target.value)}
              placeholder="Or paste an image URL (e.g., https://...)"
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomPhoto}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              Add URL
            </button>
          </div>

          {/* Attached photos list */}
          {photos.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Attached Images ({photos.length}):
              </label>
              <div className="flex flex-wrap gap-3">
                {photos.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm group"
                  >
                    <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow"
                    >
                      <span className="text-[10px] font-bold block leading-none">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video link field */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-slate-500" /> Video Recording Link (Optional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="e.g. cloud storage or video clip link showing running water or night lighting"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 4: Citizen Verification Details */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="font-bold text-slate-800">
                Reporting As: {currentUser?.name || 'Registered Citizen'}
              </div>
              <div className="text-slate-500">
                Email: {currentUser?.email || 'citizen@civicconnect.gov'} &bull; Contact: {currentUser?.phone || '+1 (555) 234-5678'}
              </div>
            </div>
          </div>
          <div className="text-slate-400 text-[11px]">
            Protected by Civic Data Privacy Standards
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-bold py-3 px-8 rounded-xl shadow-md transition flex items-center justify-center gap-2 group active:scale-98"
          >
            <span>{isSubmitting ? 'Registering with Municipality...' : 'Submit Civic Complaint'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </form>
    </div>
  );
};
