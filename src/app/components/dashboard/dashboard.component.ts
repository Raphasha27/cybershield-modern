import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <div class="header-left">
          <h1>🛡️ CyberShield Dashboard</h1>
        </div>
        <div class="user-info">
          <span class="user-name">{{ user?.name }}</span>
          <span class="user-role">{{ user?.role }}</span>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </div>
      </header>

      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Total Incidents</h3>
          <p class="metric-value">{{ metrics.totalIncidents }}</p>
          <p class="metric-label">All incidents</p>
        </div>

        <div class="metric-card critical">
          <h3>🔴 Critical</h3>
          <p class="metric-value">{{ metrics.incidentsBySeverity.critical }}</p>
          <p class="metric-label">Requires immediate action</p>
        </div>

        <div class="metric-card high">
          <h3>🟠 High</h3>
          <p class="metric-value">{{ metrics.incidentsBySeverity.high }}</p>
          <p class="metric-label">High priority</p>
        </div>

        <div class="metric-card medium">
          <h3>🟡 Medium</h3>
          <p class="metric-value">{{ metrics.incidentsBySeverity.medium }}</p>
          <p class="metric-label">Monitor closely</p>
        </div>

        <div class="metric-card low">
          <h3>🟢 Low</h3>
          <p class="metric-value">{{ metrics.incidentsBySeverity.low }}</p>
          <p class="metric-label">Low priority</p>
        </div>

        <div class="metric-card threats">
          <h3>⚠️ Active Threats</h3>
          <p class="metric-value">{{ metrics.activeThreats }}</p>
          <p class="metric-label">Detected threats</p>
        </div>
      </div>

      <div class="status-grid">
        <div class="status-card">
          <h4>Incident Status</h4>
          <div class="status-item">
            <span>Open</span>
            <span class="badge open">{{ metrics.incidentsByStatus.open }}</span>
          </div>
          <div class="status-item">
            <span>In Progress</span>
            <span class="badge progress">{{ metrics.incidentsByStatus.inProgress }}</span>
          </div>
          <div class="status-item">
            <span>Resolved</span>
            <span class="badge resolved">{{ metrics.incidentsByStatus.resolved }}</span>
          </div>
          <div class="status-item">
            <span>Closed</span>
            <span class="badge closed">{{ metrics.incidentsByStatus.closed }}</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="section">
          <h2>📋 Recent Incidents</h2>
          <div class="incidents-list">
            <div *ngFor="let incident of metrics.recentIncidents" class="incident-item" [ngClass]="incident.severity.toLowerCase()">
              <div class="incident-header">
                <h4>{{ incident.title }}</h4>
                <span class="severity-badge" [ngClass]="incident.severity.toLowerCase()">{{ incident.severity }}</span>
              </div>
              <p class="incident-description">{{ incident.description }}</p>
              <div class="incident-meta">
                <span class="status">{{ incident.status }}</span>
                <span class="date">{{ incident.createdAt | date: 'short' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>🔔 Recent Alerts</h2>
          <div class="alerts-list">
            <div *ngFor="let alert of metrics.recentAlerts" class="alert-item" [ngClass]="alert.severity.toLowerCase()">
              <div class="alert-header">
                <h4>{{ alert.title }}</h4>
                <span class="alert-type">{{ alert.type }}</span>
              </div>
              <p class="alert-message">{{ alert.message }}</p>
              <span class="date">{{ alert.createdAt | date: 'short' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 20px;
        background: #f0fdf4;
        min-height: 100vh;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
        border-left: 4px solid #10b981;
      }

      .header-left h1 {
        margin: 0;
        color: #059669;
        font-size: 24px;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .user-name {
        font-weight: 600;
        color: #059669;
      }

      .user-role {
        background: #d1fae5;
        color: #065f46;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
      }

      .btn-logout {
        padding: 8px 16px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s;
      }

      .btn-logout:hover {
        background: #dc2626;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .metric-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
        border-left: 4px solid #10b981;
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .metric-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(16, 185, 129, 0.2);
      }

      .metric-card.critical {
        border-left-color: #dc2626;
      }

      .metric-card.high {
        border-left-color: #f97316;
      }

      .metric-card.medium {
        border-left-color: #eab308;
      }

      .metric-card.low {
        border-left-color: #22c55e;
      }

      .metric-card.threats {
        border-left-color: #f59e0b;
      }

      .metric-card h3 {
        margin: 0 0 10px 0;
        color: #059669;
        font-size: 14px;
        font-weight: 600;
      }

      .metric-value {
        margin: 0;
        font-size: 36px;
        font-weight: bold;
        color: #10b981;
      }

      .metric-label {
        margin: 5px 0 0 0;
        font-size: 12px;
        color: #6b7280;
      }

      .status-grid {
        margin-bottom: 30px;
      }

      .status-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
        border-left: 4px solid #10b981;
      }

      .status-card h4 {
        margin-top: 0;
        color: #059669;
      }

      .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .status-item:last-child {
        border-bottom: none;
      }

      .badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        color: white;
      }

      .badge.open {
        background: #ef4444;
      }

      .badge.progress {
        background: #f97316;
      }

      .badge.resolved {
        background: #10b981;
      }

      .badge.closed {
        background: #6b7280;
      }

      .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
      }

      .section {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
        border-left: 4px solid #10b981;
      }

      .section h2 {
        margin-top: 0;
        color: #059669;
        font-size: 18px;
      }

      .incidents-list,
      .alerts-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .incident-item,
      .alert-item {
        padding: 15px;
        border-left: 4px solid #10b981;
        background: #f0fdf4;
        border-radius: 6px;
        transition: background 0.3s;
      }

      .incident-item:hover,
      .alert-item:hover {
        background: #dcfce7;
      }

      .incident-item.critical,
      .alert-item.critical {
        border-left-color: #dc2626;
        background: #fef2f2;
      }

      .incident-item.critical:hover,
      .alert-item.critical:hover {
        background: #fee2e2;
      }

      .incident-item.high,
      .alert-item.high {
        border-left-color: #f97316;
        background: #fff7ed;
      }

      .incident-item.high:hover,
      .alert-item.high:hover {
        background: #ffedd5;
      }

      .incident-item.medium,
      .alert-item.medium {
        border-left-color: #eab308;
        background: #fefce8;
      }

      .incident-item.medium:hover,
      .alert-item.medium:hover {
        background: #fef3c7;
      }

      .incident-header,
      .alert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .incident-header h4,
      .alert-header h4 {
        margin: 0;
        color: #059669;
        font-size: 14px;
      }

      .severity-badge,
      .alert-type {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        color: white;
      }

      .severity-badge.critical,
      .alert-type {
        background: #dc2626;
      }

      .severity-badge.high {
        background: #f97316;
      }

      .severity-badge.medium {
        background: #eab308;
        color: #333;
      }

      .severity-badge.low {
        background: #22c55e;
      }

      .incident-description,
      .alert-message {
        margin: 10px 0;
        color: #4b5563;
        font-size: 13px;
        line-height: 1.5;
      }

      .incident-meta,
      .date {
        display: flex;
        gap: 15px;
        font-size: 12px;
        color: #6b7280;
      }

      .status {
        padding: 2px 8px;
        background: #e5e7eb;
        border-radius: 3px;
        color: #374151;
      }

      @media (max-width: 768px) {
        .content-grid {
          grid-template-columns: 1fr;
        }

        .metrics-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .header {
          flex-direction: column;
          gap: 15px;
          align-items: flex-start;
        }

        .user-info {
          width: 100%;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  user: any = null;
  metrics: any = {
    totalIncidents: 42,
    incidentsByStatus: {
      open: 15,
      inProgress: 12,
      resolved: 10,
      closed: 5,
    },
    incidentsBySeverity: {
      critical: 8,
      high: 15,
      medium: 12,
      low: 7,
      info: 0,
    },
    activeThreats: 23,
    recentIncidents: [
      {
        _id: '1',
        title: 'Unauthorized Access Detected',
        description: 'Multiple failed login attempts from unknown IP address 192.168.1.100',
        severity: 'Critical',
        status: 'Open',
        type: 'Breach',
        createdAt: new Date(Date.now() - 30 * 60000),
      },
      {
        _id: '2',
        title: 'SQL Injection Attempt',
        description: 'Potential SQL injection detected in login form',
        severity: 'High',
        status: 'In Progress',
        type: 'Attack',
        createdAt: new Date(Date.now() - 45 * 60000),
      },
      {
        _id: '3',
        title: 'Suspicious File Upload',
        description: 'Executable file uploaded to documents folder',
        severity: 'High',
        status: 'Open',
        type: 'Malware',
        createdAt: new Date(Date.now() - 60 * 60000),
      },
      {
        _id: '4',
        title: 'Policy Violation',
        description: 'User accessed restricted data without authorization',
        severity: 'Medium',
        status: 'Resolved',
        type: 'Compliance',
        createdAt: new Date(Date.now() - 120 * 60000),
      },
      {
        _id: '5',
        title: 'Failed Backup',
        description: 'Daily backup job failed to complete',
        severity: 'Low',
        status: 'Open',
        type: 'System',
        createdAt: new Date(Date.now() - 180 * 60000),
      },
    ],
    recentAlerts: [
      {
        _id: '1',
        type: 'Incident',
        title: 'Critical: Unauthorized Access',
        message: 'Multiple failed login attempts detected from IP 192.168.1.100',
        severity: 'Critical',
        isRead: false,
        createdAt: new Date(Date.now() - 15 * 60000),
      },
      {
        _id: '2',
        type: 'Threat',
        title: 'High: Malware Detected',
        message: 'Suspicious executable detected in system memory',
        severity: 'High',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60000),
      },
      {
        _id: '3',
        type: 'System',
        title: 'Medium: Disk Space Low',
        message: 'Disk usage at 85% capacity',
        severity: 'Medium',
        isRead: true,
        createdAt: new Date(Date.now() - 60 * 60000),
      },
      {
        _id: '4',
        type: 'Incident',
        title: 'High: Intrusion Attempt',
        message: 'Port scanning detected from external network',
        severity: 'High',
        isRead: true,
        createdAt: new Date(Date.now() - 90 * 60000),
      },
      {
        _id: '5',
        type: 'System',
        title: 'Low: Update Available',
        message: 'Security patches available for system software',
        severity: 'Low',
        isRead: true,
        createdAt: new Date(Date.now() - 120 * 60000),
      },
    ],
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
