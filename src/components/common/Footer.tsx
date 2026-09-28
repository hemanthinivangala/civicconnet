import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Emergency Contacts Banner */}
      <div className="bg-blue-950/80 border-b border-blue-900/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-white font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span>24x7 MUNICIPAL EMERGENCY DIRECTORY</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 font-medium">
            <div>
              <span className="text-slate-400">Civic Control Room: </span>
              <strong className="text-white">311</strong>
            </div>
            <div>
              <span className="text-slate-400">Water Pipeline Leak Emergency: </span>
              <strong className="text-blue-300">+1 (555) 300-WATER</strong>
            </div>
            <div>
              <span className="text-slate-400">Electrical Hazard Desk: </span>
              <strong className="text-amber-300">+1 (555) 300-VOLTS</strong>
            </div>
            <div>
              <span className="text-slate-400">Police / Fire / Medical: </span>
              <strong className="text-red-300">911</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-serif">
                CIVIC<span className="text-blue-400">CONNECT</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              CivicConnect is your modern digital municipal gateway. Report civic issues, track complaint resolution in real-time, view ward-level municipal projects, and access essential city services with full transparency.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 w-fit px-3 py-1.5 rounded-lg border border-emerald-800/60">
              <ShieldCheck className="w-4 h-4" />
              WCAG 2.1 AA Accessible & Secure Citizen Portal
            </div>
          </div>

          {/* Col 2: Citizen Quick Services */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Quick Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-white transition"
                >
                  Report a Problem
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition"
                >
                  Track Complaint Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition"
                >
                  Municipal Services Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('garbage')}
                  className="hover:text-white transition"
                >
                  Garbage Collection Schedules
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ward')}
                  className="hover:text-white transition"
                >
                  My Ward & Councillor
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Public Transparency */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              City Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-white transition"
                >
                  Municipal Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('announcements')}
                  className="hover:text-white transition"
                >
                  Public Notices & Alerts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offices')}
                  className="hover:text-white transition"
                >
                  Ward Offices & Centers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('transparency')}
                  className="hover:text-white transition"
                >
                  Transparency Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: City Hall Office */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Municipal Headquarters
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>100 Municipal Plaza, City Center, Sector 1</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (555) 200-1000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@civicconnect.gov</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                Mon - Fri: 8:30 AM - 5:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; 2026 CivicConnect Municipal Corporation. All rights reserved.
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 text-center md:text-right max-w-xl">
            <strong>DEMO DATA DISCLAIMER:</strong> All municipal statistics, names, and projects shown are demonstrative sample data. Official statutory regulations, challans, or court filings must be verified directly at City Hall.
          </div>
        </div>
      </div>
    </footer>
  );
};
