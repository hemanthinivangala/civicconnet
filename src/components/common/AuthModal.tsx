import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { UserRole } from '../../types';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, ShieldCheck, HardHat, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'CITIZEN' }) => {
  const { login, register, switchRole, wards } = useCivic();

  const [activeTab, setActiveTab] = useState<UserRole>(defaultRole);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wardId, setWardId] = useState(wards[0]?.id || 'w-1');
  const [locality, setLocality] = useState(wards[0]?.localities[0] || 'Civic Centre Sector A');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isForgotPassword) {
      if (!email) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      setResetSuccess(true);
      setTimeout(() => {
        setIsForgotPassword(false);
        setResetSuccess(false);
      }, 2500);
      return;
    }

    if (isRegisterMode && activeTab === 'CITIZEN') {
      if (!name || !email || !phone) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      register(name, email, phone, wardId, locality);
      onClose();
      return;
    }

    // Login
    if (!email) {
      setErrorMsg('Please provide an email address.');
      return;
    }

    login(email, activeTab);
    onClose();
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-blue-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              CC
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">CivicConnect Secure Portal</h3>
              <p className="text-xs text-blue-200">Municipal Services Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white transition p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        {!isForgotPassword && (
          <div className="grid grid-cols-3 bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('CITIZEN');
                setIsRegisterMode(false);
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'CITIZEN'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" /> Citizen
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ADMIN');
                setIsRegisterMode(false);
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'ADMIN'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('FIELD_WORKER');
                setIsRegisterMode(false);
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'FIELD_WORKER'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5 text-amber-600" /> Field Worker
            </button>
          </div>
        )}

        {/* Quick Demo Shortcut Buttons */}
        <div className="p-4 bg-blue-50/70 border-b border-blue-100 flex flex-col gap-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
            Quick 1-Click Demo Logins:
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('CITIZEN')}
              className="flex-1 bg-white hover:bg-blue-100 text-blue-900 text-xs font-semibold py-1.5 px-2 rounded border border-blue-200 shadow-2xs transition"
            >
              Citizen (Ananya)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="flex-1 bg-white hover:bg-blue-100 text-blue-900 text-xs font-semibold py-1.5 px-2 rounded border border-blue-200 shadow-2xs transition"
            >
              Admin (Robert)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('FIELD_WORKER')}
              className="flex-1 bg-white hover:bg-blue-100 text-blue-900 text-xs font-semibold py-1.5 px-2 rounded border border-blue-200 shadow-2xs transition"
            >
              Worker (Carlos)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-medium">
              {errorMsg}
            </div>
          )}

          {resetSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Password reset link sent to {email}. Check your inbox.
            </div>
          )}

          {isForgotPassword ? (
            <>
              <h4 className="font-bold text-slate-800 text-sm">Reset Your Password</h4>
              <p className="text-xs text-slate-500">
                Enter your registered municipal email to receive instructions to reset your password.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@civicconnect.gov"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-sm transition"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : isRegisterMode && activeTab === 'CITIZEN' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Ward</label>
                  <select
                    value={wardId}
                    onChange={(e) => {
                      setWardId(e.target.value);
                      const w = wards.find((ward) => ward.id === e.target.value);
                      if (w && w.localities[0]) setLocality(w.localities[0]);
                    }}
                    className="w-full py-2 px-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        Ward {w.number} - {w.zone}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Locality</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full py-2 px-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    {wards
                      .find((w) => w.id === wardId)
                      ?.localities.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-sm shadow-md transition"
              >
                Register Citizen Account
              </button>

              <div className="text-center text-xs text-slate-600 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {activeTab === 'ADMIN'
                    ? 'Admin Municipal Email'
                    : activeTab === 'FIELD_WORKER'
                    ? 'Worker ID / Email'
                    : 'Citizen Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeTab === 'ADMIN'
                        ? 'admin@civicconnect.gov'
                        : activeTab === 'FIELD_WORKER'
                        ? 'worker@civicconnect.gov'
                        : 'citizen@civicconnect.gov'
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  {activeTab === 'CITIZEN' && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-sm shadow-md transition"
              >
                Sign In as {activeTab === 'ADMIN' ? 'Municipal Admin' : activeTab === 'FIELD_WORKER' ? 'Field Worker' : 'Citizen'}
              </button>

              {activeTab === 'CITIZEN' && (
                <div className="text-center text-xs text-slate-600 pt-2">
                  New citizen to CivicConnect?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(true)}
                    className="text-blue-700 font-semibold hover:underline"
                  >
                    Create an account
                  </button>
                </div>
              )}
            </>
          )}
        </form>

        {/* Security badge */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Protected with Role-Based Access Control</span>
          <span className="text-slate-400">Gov. Public Key Auth</span>
        </div>
      </div>
    </div>
  );
};
