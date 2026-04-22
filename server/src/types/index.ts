export type Role = 'Admin' | 'Analyst' | 'Viewer';
export type IncidentStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export type ThreatStatus = 'Active' | 'Investigated' | 'Resolved';
export type AlertType = 'Incident' | 'Threat' | 'System';

export interface User {
  _id?: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  status: 'Active' | 'Disabled' | 'Deleted';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  deletedAt?: Date;
}

export interface Incident {
  _id?: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  tags: string[];
}

export interface Threat {
  _id?: string;
  classification: string;
  description: string;
  severity: IncidentSeverity;
  status: ThreatStatus;
  detectedAt: Date;
  detectionSource: string;
  investigatedAt?: Date;
  investigatedBy?: string;
  investigationNotes?: string;
  relatedIncidents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  _id?: string;
  type: AlertType;
  title: string;
  message: string;
  severity: IncidentSeverity;
  recipientId: string;
  relatedResourceId: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  readAt?: Date;
  archivedAt?: Date;
}

export interface AuditLog {
  _id?: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  status: 'Success' | 'Failure';
  errorMessage?: string;
  createdAt: Date;
}

export interface DashboardMetrics {
  totalIncidents: number;
  incidentsByStatus: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  incidentsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  activeThreats: number;
  recentIncidents: Incident[];
  recentAlerts: Alert[];
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
}
