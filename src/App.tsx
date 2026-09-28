import React, { useState } from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import { Complaint, UserRole } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { AuthModal } from './components/common/AuthModal';
import { CivicAssistWidget } from './components/common/CivicAssistWidget';
import { ComplaintConfirmationModal } from './components/citizen/ComplaintConfirmationModal';

// Views
import { HomePage } from './components/home/HomePage';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { ReportComplaintView } from './components/citizen/ReportComplaintView';
import { TrackComplaintView } from './components/citizen/TrackComplaintView';
import { MyWardView } from './components/citizen/MyWardView';
import { MunicipalServicesView } from './components/citizen/MunicipalServicesView';
import { GarbageManagementView } from './components/citizen/GarbageManagementView';
import { MunicipalProjectsView } from './components/citizen/MunicipalProjectsView';
import { MunicipalAnnouncementsView } from './components/citizen/MunicipalAnnouncementsView';
import { MunicipalOfficesView } from './components/citizen/MunicipalOfficesView';
import { TransparencyView } from './components/citizen/TransparencyView';
import { NotificationsView } from './components/citizen/NotificationsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FieldWorkerDashboard } from './components/worker/FieldWorkerDashboard';
import { AIAgentView } from './components/citizen/AIAgentView';
import { N8nChatWidget } from './components/common/N8nChatWidget';

function MainApp() {
  const { activeRole, currentUser } = useCivic();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewDetailId, setViewDetailId] = useState<string | undefined>(undefined);

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('CITIZEN');
  const [assistDirectOpen, setAssistDirectOpen] = useState(false);

  // Complaint submission confirmation modal
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleNavigate = (view: string, detailId?: string) => {
    setCurrentView(view);
    setViewDetailId(detailId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (role: UserRole = 'CITIZEN') => {
    setAuthDefaultRole(role);
    setAuthOpen(true);
  };

  const handleComplaintSubmitted = (complaint: Complaint) => {
    setSubmittedComplaint(complaint);
    setConfirmationOpen(true);
  };

  const handleTrackFromConfirmation = (complaintId: string) => {
    setConfirmationOpen(false);
    handleNavigate('track', complaintId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenAssist={() => setAssistDirectOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenReport={() => handleNavigate('report')}
            onOpenAssist={() => setAssistDirectOpen(true)}
          />
        )}

        {currentView === 'citizen-dashboard' && (
          <CitizenDashboard
            onNavigate={handleNavigate}
            onOpenReport={() => handleNavigate('report')}
            onOpenAssist={() => setAssistDirectOpen(true)}
          />
        )}

        {currentView === 'report' && (
          <ReportComplaintView
            onSuccessSubmit={handleComplaintSubmitted}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'track' && (
          <TrackComplaintView
            initialComplaintId={viewDetailId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'services' && (
          <MunicipalServicesView
            onNavigate={handleNavigate}
            selectedServiceId={viewDetailId}
          />
        )}

        {currentView === 'ward' && <MyWardView onNavigate={handleNavigate} />}

        {currentView === 'garbage' && <GarbageManagementView onNavigate={handleNavigate} />}

        {currentView === 'projects' && (
          <MunicipalProjectsView
            onNavigate={handleNavigate}
            selectedProjectId={viewDetailId}
          />
        )}

        {currentView === 'announcements' && (
          <MunicipalAnnouncementsView
            onNavigate={handleNavigate}
            selectedAnnouncementId={viewDetailId}
          />
        )}

        {currentView === 'offices' && (
          <MunicipalOfficesView
            onNavigate={handleNavigate}
            selectedOfficeId={viewDetailId}
          />
        )}

        {currentView === 'transparency' && <TransparencyView />}

        {currentView === 'notifications' && (
          <NotificationsView onNavigate={handleNavigate} />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}

        {currentView === 'worker' && (
          <FieldWorkerDashboard onNavigate={handleNavigate} />
        )}

        {currentView === 'ai-agent' && (
          <AIAgentView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Official n8n Chat Agent Widget */}
      <N8nChatWidget />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating AI CivicAssist Widget */}
      <CivicAssistWidget
        onNavigate={handleNavigate}
        isOpenDirect={assistDirectOpen}
        onCloseDirect={() => setAssistDirectOpen(false)}
      />

      {/* Global Search Dialog (Cmd+K) */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultRole={authDefaultRole}
      />

      {/* Complaint Confirmation Slip Modal */}
      <ComplaintConfirmationModal
        complaint={submittedComplaint}
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onTrackComplaint={handleTrackFromConfirmation}
      />
    </div>
  );
}

export default function App() {
  return (
    <CivicProvider>
      <MainApp />
    </CivicProvider>
  );
}
