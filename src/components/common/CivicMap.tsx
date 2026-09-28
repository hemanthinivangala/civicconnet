import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Complaint, MunicipalOffice, MunicipalProject, Facility, WasteRoute } from '../../types';

interface CivicMapProps {
  mode: 'picker' | 'complaints' | 'offices' | 'ward' | 'projects' | 'routes';
  initialCenter?: [number, number];
  initialZoom?: number;
  height?: string;
  selectedLocation?: { lat: number; lng: number; address?: string };
  onSelectLocation?: (loc: { lat: number; lng: number; address?: string }) => void;
  complaints?: Complaint[];
  offices?: MunicipalOffice[];
  projects?: MunicipalProject[];
  facilities?: Facility[];
  routes?: WasteRoute[];
  onSelectComplaint?: (complaint: Complaint) => void;
  onSelectOffice?: (office: MunicipalOffice) => void;
  onSelectProject?: (project: MunicipalProject) => void;
}

export const CivicMap: React.FC<CivicMapProps> = ({
  mode,
  initialCenter = [40.7128, -74.006],
  initialZoom = 13,
  height = '420px',
  selectedLocation,
  onSelectLocation,
  complaints = [],
  offices = [],
  projects = [],
  facilities = [],
  onSelectComplaint,
  onSelectOffice,
  onSelectProject,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Handle picker mode click
    if (mode === 'picker') {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
          markerRef.current.on('dragend', (dragEvent) => {
            const pos = dragEvent.target.getLatLng();
            onSelectLocation?.({
              lat: Number(pos.lat.toFixed(5)),
              lng: Number(pos.lng.toFixed(5)),
              address: `GPS Pin: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`,
            });
          });
        }

        onSelectLocation?.({
          lat: Number(lat.toFixed(5)),
          lng: Number(lng.toFixed(5)),
          address: `GPS Pin: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
      });
    }

    // Leaflet resize trigger
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update center if props change
  useEffect(() => {
    if (mapInstanceRef.current && initialCenter) {
      mapInstanceRef.current.setView(initialCenter, initialZoom);
    }
  }, [initialCenter[0], initialCenter[1], initialZoom]);

  // Handle selected location in picker mode
  useEffect(() => {
    if (mode !== 'picker' || !mapInstanceRef.current) return;

    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      const pos: [number, number] = [selectedLocation.lat, selectedLocation.lng];
      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
      } else {
        markerRef.current = L.marker(pos, { draggable: true }).addTo(mapInstanceRef.current);
        markerRef.current.on('dragend', (dragEvent) => {
          const newPos = dragEvent.target.getLatLng();
          onSelectLocation?.({
            lat: Number(newPos.lat.toFixed(5)),
            lng: Number(newPos.lng.toFixed(5)),
            address: selectedLocation.address || `GPS: ${newPos.lat.toFixed(4)}, ${newPos.lng.toFixed(4)}`,
          });
        });
      }
      mapInstanceRef.current.setView(pos, 15);
    }
  }, [selectedLocation?.lat, selectedLocation?.lng, mode]);

  // Render markers for modes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer || mode === 'picker') return;

    layer.clearLayers();

    // 1. Complaint Markers
    if (mode === 'complaints' || mode === 'ward') {
      complaints.forEach((c) => {
        if (!c.location?.lat || !c.location?.lng) return;

        let pinColor = '#3b82f6'; // blue (in progress)
        if (c.status === 'RESOLVED' || c.status === 'CLOSED') pinColor = '#10b981'; // green
        if (c.status === 'ESCALATED' || c.priority === 'URGENT') pinColor = '#ef4444'; // red
        if (c.status === 'SUBMITTED' || c.status === 'ACKNOWLEDGED') pinColor = '#f59e0b'; // amber

        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `<div style="background-color: ${pinColor}; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">!</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([c.location.lat, c.location.lng], { icon: customIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 text-sm font-sans';
        popupContent.innerHTML = `
          <div class="font-bold text-slate-900 mb-1 leading-tight">${c.id}: ${c.title}</div>
          <div class="text-xs text-slate-500 mb-1">${c.category} &bull; ${c.locality}</div>
          <div class="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white mb-2" style="background-color:${pinColor}">
            ${c.status}
          </div>
          <p class="text-xs text-slate-700 mb-2 line-clamp-2">${c.description}</p>
          <button id="btn-view-${c.id}" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-1.5 px-3 rounded shadow-sm transition">
            View Details
          </button>
        `;

        popupContent.querySelector(`#btn-view-${c.id}`)?.addEventListener('click', () => {
          onSelectComplaint?.(c);
        });

        marker.bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }

    // 2. Municipal Offices Markers
    if (mode === 'offices' || mode === 'ward') {
      offices.forEach((off) => {
        const officeIcon = L.divIcon({
          className: 'custom-office-pin',
          html: `<div style="background-color: #1e3a8a; width: 32px; height: 32px; border-radius: 8px; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">🏛️</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([off.lat, off.lng], { icon: officeIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 text-sm font-sans max-w-xs';
        popupContent.innerHTML = `
          <div class="font-bold text-blue-900 mb-1">${off.name}</div>
          <div class="text-xs text-slate-600 mb-1">${off.address}</div>
          <div class="text-xs font-medium text-slate-700 mb-1">📞 ${off.phone}</div>
          <div class="text-xs text-slate-500 mb-2">🕒 ${off.workingHours}</div>
          <button id="btn-office-${off.id}" class="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs py-1.5 px-3 rounded shadow-sm">
            View Office Services
          </button>
        `;

        popupContent.querySelector(`#btn-office-${off.id}`)?.addEventListener('click', () => {
          onSelectOffice?.(off);
        });

        marker.bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }

    // 3. Municipal Projects
    if (mode === 'projects' || mode === 'ward') {
      projects.forEach((p) => {
        const projectIcon = L.divIcon({
          className: 'custom-proj-pin',
          html: `<div style="background-color: #0d9488; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">🏗️</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([p.lat, p.lng], { icon: projectIcon });
        const popup = `
          <div class="p-1 text-sm font-sans">
            <span class="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
              ${p.status} (${p.progressPercentage}%)
            </span>
            <div class="font-bold text-slate-900 mt-1 mb-1">${p.name}</div>
            <div class="text-xs text-slate-600 mb-2">${p.departmentName} &bull; ${p.wardName}</div>
            <p class="text-xs text-slate-700 line-clamp-2">${p.description}</p>
          </div>
        `;
        marker.bindPopup(popup);
        layer.addLayer(marker);
      });
    }

    // 4. Facilities (in Ward mode)
    if (mode === 'ward' && facilities.length > 0) {
      facilities.forEach((f) => {
        let emoji = '📍';
        if (f.type === 'HOSPITAL') emoji = '🏥';
        if (f.type === 'SCHOOL') emoji = '🏫';
        if (f.type === 'PARK') emoji = '🌳';
        if (f.type === 'FIRE_STATION') emoji = '🚒';
        if (f.type === 'HEALTH_CENTER') emoji = '⚕️';

        const facilityIcon = L.divIcon({
          className: 'custom-facility-pin',
          html: `<div style="background-color: #475569; width: 26px; height: 26px; border-radius: 6px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-size: 13px;">${emoji}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([f.lat, f.lng], { icon: facilityIcon });
        marker.bindPopup(`
          <div class="p-1 text-sm font-sans">
            <div class="font-bold text-slate-800">${f.name}</div>
            <div class="text-xs text-slate-500">${f.type}</div>
            <div class="text-xs text-slate-600 mt-1">${f.address}</div>
            ${f.contact ? `<div class="text-xs text-blue-600 mt-1">📞 ${f.contact}</div>` : ''}
          </div>
        `);
        layer.addLayer(marker);
      });
    }
  }, [mode, complaints, offices, projects, facilities]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
          if (mode === 'picker') {
            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lng]);
            } else {
              markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
                mapInstanceRef.current
              );
            }
            onSelectLocation?.({
              lat,
              lng,
              address: `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            });
          }
        }
      },
      (err) => {
        console.warn('Geolocation failed:', err.message);
        // Default to city center
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(initialCenter, 15);
        }
      }
    );
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Floating controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleLocateMe}
          title="Detect Current Location"
          className="bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-md border border-slate-200 flex items-center gap-1.5 transition active:scale-95"
        >
          <span>🎯</span> Locate Me
        </button>
      </div>

      {mode === 'picker' && (
        <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-slate-200 text-xs text-slate-700 pointer-events-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span>
                {selectedLocation?.lat
                  ? `Selected Pin: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
                  : 'Click anywhere on the map or drag the pin to set the problem location.'}
              </span>
            </div>
            {selectedLocation?.lat && (
              <span className="text-emerald-700 font-medium text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                Pinned ✓
              </span>
            )}
          </div>
        </div>
      )}

      {/* Map Legend */}
      {(mode === 'complaints' || mode === 'ward') && (
        <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow border border-slate-200 text-[11px] flex gap-3 text-slate-700">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> New / Acknowledged
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> In Progress
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Resolved
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Escalated
          </div>
        </div>
      )}
    </div>
  );
};
