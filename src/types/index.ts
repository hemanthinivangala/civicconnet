export type UserRole = 'CITIZEN' | 'ADMIN' | 'FIELD_WORKER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  wardId?: string;
  locality?: string;
  avatar?: string;
  departmentId?: string; // For Admin / Field Worker
}

export type ComplaintCategory =
  | 'GARBAGE'
  | 'STREETLIGHT'
  | 'ROADS_POTHOLES'
  | 'WATER'
  | 'DRAINAGE'
  | 'SANITATION'
  | 'TREES'
  | 'PUBLIC_INFRASTRUCTURE'
  | 'OTHER';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'ACKNOWLEDGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED'
  | 'ESCALATED';

export type ComplaintPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address?: string;
}

export interface ComplaintComment {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  comment: string;
  createdAt: string;
  isInternal?: boolean;
}

export interface ComplaintStatusHistory {
  id: string;
  complaintId: string;
  fromStatus: ComplaintStatus;
  toStatus: ComplaintStatus;
  changedByUserId: string;
  changedByName: string;
  note: string;
  timestamp: string;
  photoUrl?: string;
}

export interface Complaint {
  id: string; // e.g. CC-2026-000001
  title: string;
  description: string;
  category: ComplaintCategory;
  issueType?: string;
  wardId: string;
  wardName: string;
  locality: string;
  landmark?: string;
  location: LocationCoordinates;
  photos: string[];
  videos?: string[];
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  departmentId?: string;
  departmentName?: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  comments: ComplaintComment[];
  statusHistory: ComplaintStatusHistory[];
}

export interface Facility {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'SCHOOL' | 'PARK' | 'COMMUNITY_HALL' | 'HEALTH_CENTER' | 'FIRE_STATION';
  address: string;
  lat: number;
  lng: number;
  contact?: string;
}

export interface Ward {
  id: string;
  number: number;
  name: string;
  zone: string;
  councillorName: string;
  councillorPhone: string;
  councillorEmail: string;
  officeAddress: string;
  officePhone: string;
  officeEmail: string;
  areaSqKm: number;
  population: number;
  lat: number;
  lng: number;
  localities: string[];
  facilities: Facility[];
  activeProjectsCount?: number;
  activeComplaintsCount?: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  email: string;
  phone: string;
  description: string;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
  iconName: string;
  category: string;
  description: string;
  requiredDocuments: string[];
  applicationSteps: string[];
  departmentId: string;
  departmentName: string;
  contactPhone: string;
  contactEmail: string;
  officialLink: string;
  processingTime: string;
  isOnlineAvailable: boolean;
}

export type AnnouncementCategory =
  | 'WATER'
  | 'ROADS'
  | 'GARBAGE'
  | 'NOTICE'
  | 'EVENT'
  | 'HEALTH';

export type AnnouncementPriority = 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  wardId?: string; // Optional: all wards if empty
  wardName?: string;
  publicationDate: string;
  expiryDate: string;
  attachmentName?: string;
  isPublished: boolean;
  authorName: string;
}

export interface GarbageSchedule {
  id: string;
  wardId: string;
  wardName: string;
  localityName: string;
  collectionDays: string[];
  timeSlot: string;
  wasteTypes: string[];
  routeName: string;
  vehicleNumber: string;
  driverContact: string;
  notes?: string;
}

export interface WasteRoute {
  id: string;
  routeName: string;
  wardId: string;
  vehicleNumber: string;
  driverName: string;
  status: 'SCHEDULED' | 'ON_DUTY' | 'COMPLETED';
  stopsCount: number;
  completionPercent: number;
  nextStop: string;
}

export interface BulkPickupRequest {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  wardId: string;
  wardName: string;
  locality: string;
  address: string;
  itemsDescription: string;
  preferredDate: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface IllegalDumpingReport {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  wardId: string;
  wardName: string;
  locality: string;
  landmark: string;
  description: string;
  photoUrl?: string;
  status: 'REPORTED' | 'INSPECTED' | 'CLEARED';
  createdAt: string;
}

export type ProjectStatus = 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'DELAYED';

export interface MunicipalProject {
  id: string;
  name: string;
  description: string;
  wardId: string;
  wardName: string;
  departmentId: string;
  departmentName: string;
  location: string;
  lat: number;
  lng: number;
  startDate: string;
  expectedCompletionDate: string;
  status: ProjectStatus;
  progressPercentage: number;
  budget: string;
  contractor: string;
  images: string[];
  isDemo: boolean;
}

export interface MunicipalOffice {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  servicesAvailable: string[];
  lat: number;
  lng: number;
  headOfficial: string;
  zone: string;
}

export interface AppNotification {
  id: string;
  targetRole?: UserRole | 'ALL';
  targetUserId?: string;
  title: string;
  message: string;
  type: 'COMPLAINT' | 'ANNOUNCEMENT' | 'SYSTEM' | 'SERVICE';
  complaintId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  details: string;
  timestamp: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
