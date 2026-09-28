import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
  Service,
  Announcement,
  Ward,
  Department,
  MunicipalProject,
  MunicipalOffice,
  GarbageSchedule,
  WasteRoute,
  BulkPickupRequest,
  IllegalDumpingReport,
  AppNotification,
  AuditLog,
  FAQ,
  LocationCoordinates,
} from '../types';
import {
  SEED_USERS,
  SEED_WARDS,
  SEED_DEPARTMENTS,
  SEED_SERVICES,
  SEED_COMPLAINTS,
  SEED_ANNOUNCEMENTS,
  SEED_PROJECTS,
  SEED_OFFICES,
  SEED_GARBAGE_SCHEDULES,
  SEED_WASTE_ROUTES,
  SEED_NOTIFICATIONS,
  SEED_FAQS,
  SEED_AUDIT_LOGS,
} from '../data/seedData';

interface CivicContextType {
  // Auth
  currentUser: User | null;
  activeRole: UserRole;
  login: (email: string, role?: UserRole) => boolean;
  register: (name: string, email: string, phone: string, wardId: string, locality: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<User>) => void;

  // Domain data
  wards: Ward[];
  departments: Department[];
  services: Service[];
  complaints: Complaint[];
  announcements: Announcement[];
  projects: MunicipalProject[];
  offices: MunicipalOffice[];
  garbageSchedules: GarbageSchedule[];
  wasteRoutes: WasteRoute[];
  bulkPickupRequests: BulkPickupRequest[];
  illegalDumpingReports: IllegalDumpingReport[];
  notifications: AppNotification[];
  faqs: FAQ[];
  auditLogs: AuditLog[];
  unreadNotifsCount: number;

  // Complaint actions
  createComplaint: (complaintData: {
    title: string;
    description: string;
    category: ComplaintCategory;
    issueType?: string;
    wardId: string;
    locality: string;
    landmark?: string;
    location: LocationCoordinates;
    photos: string[];
    priority?: ComplaintPriority;
  }) => Complaint;
  updateComplaintStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    note: string,
    photoUrl?: string
  ) => void;
  assignComplaint: (
    complaintId: string,
    departmentId: string,
    workerId: string,
    note?: string
  ) => void;
  escalateComplaint: (complaintId: string, reason: string) => void;
  addComplaintComment: (
    complaintId: string,
    commentText: string,
    isInternal?: boolean
  ) => void;

  // Service management (Admin)
  updateService: (updatedService: Service) => void;

  // Announcement management (Admin)
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'publicationDate'>) => void;
  updateAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  togglePublishAnnouncement: (id: string) => void;

  // Garbage actions
  reportMissedGarbage: (wardId: string, locality: string, address: string, notes?: string) => void;
  reportIllegalDumping: (report: Omit<IllegalDumpingReport, 'id' | 'status' | 'createdAt'>) => void;
  requestBulkPickup: (request: Omit<BulkPickupRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateGarbageSchedule: (schedule: GarbageSchedule) => void;
  updateWasteRoute: (route: WasteRoute) => void;

  // Project management (Admin)
  updateProject: (project: MunicipalProject) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // System
  resetToDemoData: () => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'civicconnect_user',
  COMPLAINTS: 'civicconnect_complaints',
  SERVICES: 'civicconnect_services',
  ANNOUNCEMENTS: 'civicconnect_announcements',
  PROJECTS: 'civicconnect_projects',
  SCHEDULES: 'civicconnect_schedules',
  ROUTES: 'civicconnect_routes',
  NOTIFICATIONS: 'civicconnect_notifications',
  BULK_PICKUPS: 'civicconnect_bulk_pickups',
  DUMPING_REPORTS: 'civicconnect_dumping_reports',
  AUDIT_LOGS: 'civicconnect_audit_logs',
};

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user & active role
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : SEED_USERS[0]; // Default to Citizen for demo
    } catch {
      return SEED_USERS[0];
    }
  });

  const activeRole: UserRole = currentUser ? currentUser.role : 'CITIZEN';

  // Seeded state
  const [wards] = useState<Ward[]>(SEED_WARDS);
  const [departments] = useState<Department[]>(SEED_DEPARTMENTS);
  const [offices] = useState<MunicipalOffice[]>(SEED_OFFICES);
  const [faqs] = useState<FAQ[]>(SEED_FAQS);

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : SEED_SERVICES;
    } catch {
      return SEED_SERVICES;
    }
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return saved ? JSON.parse(saved) : SEED_COMPLAINTS;
    } catch {
      return SEED_COMPLAINTS;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : SEED_ANNOUNCEMENTS;
    } catch {
      return SEED_ANNOUNCEMENTS;
    }
  });

  const [projects, setProjects] = useState<MunicipalProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : SEED_PROJECTS;
    } catch {
      return SEED_PROJECTS;
    }
  });

  const [garbageSchedules, setGarbageSchedules] = useState<GarbageSchedule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      return saved ? JSON.parse(saved) : SEED_GARBAGE_SCHEDULES;
    } catch {
      return SEED_GARBAGE_SCHEDULES;
    }
  });

  const [wasteRoutes, setWasteRoutes] = useState<WasteRoute[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROUTES);
      return saved ? JSON.parse(saved) : SEED_WASTE_ROUTES;
    } catch {
      return SEED_WASTE_ROUTES;
    }
  });

  const [bulkPickupRequests, setBulkPickupRequests] = useState<BulkPickupRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BULK_PICKUPS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [illegalDumpingReports, setIllegalDumpingReports] = useState<IllegalDumpingReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DUMPING_REPORTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : SEED_AUDIT_LOGS;
    } catch {
      return SEED_AUDIT_LOGS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(garbageSchedules));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [garbageSchedules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(wasteRoutes));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [wasteRoutes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BULK_PICKUPS, JSON.stringify(bulkPickupRequests));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [bulkPickupRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DUMPING_REPORTS, JSON.stringify(illegalDumpingReports));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [illegalDumpingReports]);

  // Auth Methods
  const login = (email: string, preferredRole?: UserRole) => {
    const found = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // Generic user login fallback
    const role = preferredRole || 'CITIZEN';
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      phone: '+1 (555) 000-0000',
      wardId: 'w-1',
      locality: 'Civic Centre Sector A',
    };
    setCurrentUser(newUser);
    return true;
  };

  const register = (
    name: string,
    email: string,
    phone: string,
    wardId: string,
    locality: string
  ) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      wardId,
      locality,
      role: 'CITIZEN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const roleUser = SEED_USERS.find((u) => u.role === role);
    if (roleUser) {
      setCurrentUser(roleUser);
    } else if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updated });
    }
  };

  // Helper for Audit logging
  const logAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      action,
      userId: currentUser?.id || 'system',
      userName: currentUser?.name || 'System Service',
      userRole: currentUser?.role || 'CITIZEN',
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Create complaint
  const createComplaint = (complaintData: {
    title: string;
    description: string;
    category: ComplaintCategory;
    issueType?: string;
    wardId: string;
    locality: string;
    landmark?: string;
    location: LocationCoordinates;
    photos: string[];
    priority?: ComplaintPriority;
  }): Complaint => {
    const nextSeq = complaints.length + 1;
    const formattedId = `CC-2026-${String(nextSeq).padStart(6, '0')}`;
    const ward = wards.find((w) => w.id === complaintData.wardId) || wards[0];
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id: formattedId,
      title: complaintData.title,
      description: complaintData.description,
      category: complaintData.category,
      issueType: complaintData.issueType || 'Civic Issue',
      wardId: ward.id,
      wardName: ward.name,
      locality: complaintData.locality,
      landmark: complaintData.landmark || '',
      location: complaintData.location,
      photos: complaintData.photos,
      citizenId: currentUser?.id || 'usr-guest',
      citizenName: currentUser?.name || 'Citizen Reporter',
      citizenPhone: currentUser?.phone || '+1 (555) 000-0000',
      status: 'SUBMITTED',
      priority: complaintData.priority || 'NORMAL',
      createdAt: now,
      updatedAt: now,
      comments: [],
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          complaintId: formattedId,
          fromStatus: 'SUBMITTED',
          toStatus: 'SUBMITTED',
          changedByUserId: currentUser?.id || 'usr-guest',
          changedByName: currentUser?.name || 'Citizen Reporter',
          note: 'Complaint registered successfully by citizen',
          timestamp: now,
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // In-app notification to Citizen
    const citizenNotif: AppNotification = {
      id: `notif-${Date.now()}-c`,
      targetUserId: newComplaint.citizenId,
      title: `Complaint Submitted: ${newComplaint.id}`,
      message: `Your grievance "${newComplaint.title}" has been registered in ${newComplaint.wardName}. Use ID ${newComplaint.id} to track live updates.`,
      type: 'COMPLAINT',
      complaintId: newComplaint.id,
      isRead: false,
      createdAt: now,
    };

    // In-app notification to Admins
    const adminNotif: AppNotification = {
      id: `notif-${Date.now()}-a`,
      targetRole: 'ADMIN',
      title: `New Grievance: ${newComplaint.id}`,
      message: `${newComplaint.category} reported in ${newComplaint.wardName} - "${newComplaint.title}"`,
      type: 'COMPLAINT',
      complaintId: newComplaint.id,
      isRead: false,
      createdAt: now,
    };

    setNotifications((prev) => [citizenNotif, adminNotif, ...prev]);
    logAudit('COMPLAINT_CREATED', `Complaint ${formattedId} lodged by ${newComplaint.citizenName}`);

    return newComplaint;
  };

  const updateComplaintStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    note: string,
    photoUrl?: string
  ) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const updatedHistory = [
            ...c.statusHistory,
            {
              id: `sh-${Date.now()}`,
              complaintId,
              fromStatus: c.status,
              toStatus: newStatus,
              changedByUserId: currentUser?.id || 'system',
              changedByName: currentUser?.name || 'Civic Officer',
              note: note || `Status changed to ${newStatus}`,
              timestamp: now,
              photoUrl,
            },
          ];
          return {
            ...c,
            status: newStatus,
            updatedAt: now,
            resolvedAt: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? now : c.resolvedAt,
            statusHistory: updatedHistory,
          };
        }
        return c;
      })
    );

    // Notify citizen
    const targetComplaint = complaints.find((c) => c.id === complaintId);
    if (targetComplaint) {
      const updateNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        targetUserId: targetComplaint.citizenId,
        title: `Complaint ${complaintId} Status: ${newStatus}`,
        message: note || `Your complaint status has transitioned to ${newStatus}.`,
        type: 'COMPLAINT',
        complaintId,
        isRead: false,
        createdAt: now,
      };
      setNotifications((prev) => [updateNotif, ...prev]);
    }

    logAudit('STATUS_UPDATED', `Complaint ${complaintId} status transitioned to ${newStatus}`);
  };

  const assignComplaint = (
    complaintId: string,
    departmentId: string,
    workerId: string,
    note?: string
  ) => {
    const dept = departments.find((d) => d.id === departmentId);
    const worker = SEED_USERS.find((u) => u.id === workerId);
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const updatedHistory = [
            ...c.statusHistory,
            {
              id: `sh-${Date.now()}`,
              complaintId,
              fromStatus: c.status,
              toStatus: 'ASSIGNED' as ComplaintStatus,
              changedByUserId: currentUser?.id || 'admin',
              changedByName: currentUser?.name || 'Administrator',
              note: note || `Assigned to ${dept?.name || 'Department'} (${worker?.name || 'Field Worker'})`,
              timestamp: now,
            },
          ];
          return {
            ...c,
            departmentId,
            departmentName: dept?.name,
            assignedWorkerId: workerId,
            assignedWorkerName: worker?.name,
            status: 'ASSIGNED' as ComplaintStatus,
            updatedAt: now,
            statusHistory: updatedHistory,
          };
        }
        return c;
      })
    );

    // Notify assigned worker
    if (workerId) {
      const workerNotif: AppNotification = {
        id: `notif-${Date.now()}-w`,
        targetUserId: workerId,
        title: `New Task Assigned: ${complaintId}`,
        message: `You have been assigned complaint ${complaintId} in ${dept?.name || 'department'}.`,
        type: 'COMPLAINT',
        complaintId,
        isRead: false,
        createdAt: now,
      };
      setNotifications((prev) => [workerNotif, ...prev]);
    }

    logAudit(
      'COMPLAINT_ASSIGNED',
      `Assigned ${complaintId} to ${worker?.name || workerId} (${dept?.name || departmentId})`
    );
  };

  const escalateComplaint = (complaintId: string, reason: string) => {
    updateComplaintStatus(complaintId, 'ESCALATED', `Escalated: ${reason}`);
    logAudit('COMPLAINT_ESCALATED', `Complaint ${complaintId} escalated: ${reason}`);
  };

  const addComplaintComment = (
    complaintId: string,
    commentText: string,
    isInternal: boolean = false
  ) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            comments: [
              ...c.comments,
              {
                id: `comm-${Date.now()}`,
                complaintId,
                userId: currentUser?.id || 'usr-guest',
                userName: currentUser?.name || 'Citizen User',
                userRole: currentUser?.role || 'CITIZEN',
                comment: commentText,
                createdAt: now,
                isInternal,
              },
            ],
            updatedAt: now,
          };
        }
        return c;
      })
    );
  };

  // Service Management
  const updateService = (updatedService: Service) => {
    setServices((prev) => prev.map((s) => (s.id === updatedService.id ? updatedService : s)));
    logAudit('SERVICE_UPDATED', `Updated service metadata for "${updatedService.name}"`);
  };

  // Announcements
  const createAnnouncement = (announcement: Omit<Announcement, 'id' | 'publicationDate'>) => {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      publicationDate: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // Push notification to all citizens
    const annNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: 'ALL',
      title: `Municipal Alert: ${newAnn.title}`,
      message: newAnn.description.slice(0, 140) + '...',
      type: 'ANNOUNCEMENT',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [annNotif, ...prev]);
    logAudit('ANNOUNCEMENT_CREATED', `Created announcement "${newAnn.title}"`);
  };

  const updateAnnouncement = (announcement: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === announcement.id ? announcement : a)));
    logAudit('ANNOUNCEMENT_UPDATED', `Updated announcement "${announcement.title}"`);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    logAudit('ANNOUNCEMENT_DELETED', `Deleted announcement ${id}`);
  };

  const togglePublishAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPublished: !a.isPublished } : a))
    );
  };

  // Garbage actions
  const reportMissedGarbage = (wardId: string, locality: string, address: string, notes?: string) => {
    const ward = wards.find((w) => w.id === wardId) || wards[0];
    createComplaint({
      title: `Missed Garbage Collection on ${address}`,
      description: `Scheduled curbside garbage pickup missed at ${address}, ${locality}. ${notes || ''}`,
      category: 'GARBAGE',
      issueType: 'Missed Collection',
      wardId: ward.id,
      locality,
      landmark: address,
      location: {
        lat: ward.lat + 0.002,
        lng: ward.lng + 0.001,
        address,
      },
      photos: [],
      priority: 'HIGH',
    });
  };

  const reportIllegalDumping = (report: Omit<IllegalDumpingReport, 'id' | 'status' | 'createdAt'>) => {
    const newReport: IllegalDumpingReport = {
      ...report,
      id: `dmp-${Date.now()}`,
      status: 'REPORTED',
      createdAt: new Date().toISOString(),
    };
    setIllegalDumpingReports((prev) => [newReport, ...prev]);

    // Also auto-generate a complaint for enforcement tracking
    createComplaint({
      title: `Illegal Dumping Reported at ${report.locality}`,
      description: `Unauthorized dumping of debris reported: ${report.description}`,
      category: 'GARBAGE',
      issueType: 'Illegal Dumping',
      wardId: report.wardId,
      locality: report.locality,
      landmark: report.landmark,
      location: {
        lat: wards.find((w) => w.id === report.wardId)?.lat || 40.7128,
        lng: wards.find((w) => w.id === report.wardId)?.lng || -74.006,
        address: `${report.locality}, ${report.wardName}`,
      },
      photos: report.photoUrl ? [report.photoUrl] : [],
      priority: 'HIGH',
    });
  };

  const requestBulkPickup = (request: Omit<BulkPickupRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: BulkPickupRequest = {
      ...request,
      id: `blk-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setBulkPickupRequests((prev) => [newRequest, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetUserId: request.citizenId,
      title: 'Bulk Waste Pickup Scheduled',
      message: `Your bulk pickup request for "${request.itemsDescription}" on ${request.preferredDate} has been registered.`,
      type: 'SERVICE',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateGarbageSchedule = (schedule: GarbageSchedule) => {
    setGarbageSchedules((prev) => prev.map((s) => (s.id === schedule.id ? schedule : s)));
    logAudit('SCHEDULE_UPDATED', `Updated garbage schedule for ${schedule.localityName}`);
  };

  const updateWasteRoute = (route: WasteRoute) => {
    setWasteRoutes((prev) => prev.map((r) => (r.id === route.id ? route : r)));
  };

  const updateProject = (project: MunicipalProject) => {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    logAudit('PROJECT_UPDATED', `Updated municipal project "${project.name}"`);
  };

  // Notification methods
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotifsCount = notifications.filter((n) => {
    if (n.isRead) return false;
    if (n.targetRole === 'ALL') return true;
    if (n.targetRole === 'ADMIN' && activeRole === 'ADMIN') return true;
    if (n.targetRole === 'FIELD_WORKER' && activeRole === 'FIELD_WORKER') return true;
    if (currentUser && n.targetUserId === currentUser.id) return true;
    return false;
  }).length;

  const resetToDemoData = () => {
    localStorage.clear();
    setCurrentUser(SEED_USERS[0]);
    setComplaints(SEED_COMPLAINTS);
    setServices(SEED_SERVICES);
    setAnnouncements(SEED_ANNOUNCEMENTS);
    setProjects(SEED_PROJECTS);
    setGarbageSchedules(SEED_GARBAGE_SCHEDULES);
    setWasteRoutes(SEED_WASTE_ROUTES);
    setNotifications(SEED_NOTIFICATIONS);
    setBulkPickupRequests([]);
    setIllegalDumpingReports([]);
    setAuditLogs(SEED_AUDIT_LOGS);
  };

  return (
    <CivicContext.Provider
      value={{
        currentUser,
        activeRole,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        wards,
        departments,
        services,
        complaints,
        announcements,
        projects,
        offices,
        garbageSchedules,
        wasteRoutes,
        bulkPickupRequests,
        illegalDumpingReports,
        notifications,
        faqs,
        auditLogs,
        unreadNotifsCount,
        createComplaint,
        updateComplaintStatus,
        assignComplaint,
        escalateComplaint,
        addComplaintComment,
        updateService,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        togglePublishAnnouncement,
        reportMissedGarbage,
        reportIllegalDumping,
        requestBulkPickup,
        updateGarbageSchedule,
        updateWasteRoute,
        updateProject,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData,
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = (): CivicContextType => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
