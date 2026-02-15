import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: any = null;
  
  // KPI Data
  kpis = {
    totalIncidents: 42,
    activeThreats: 23,
    serversOnline: 14,
    networkActivity: 92,
  };

  // Chart Data
  threatTrendData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Threats Detected',
        data: [4, 7, 3, 9, 6, 5, 8],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  threatTrendOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, labels: { color: '#9ca3af' } },
    },
    scales: {
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
    },
  };

  severityData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [8, 15, 12, 7],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
      },
    ],
  };

  severityOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, labels: { color: '#9ca3af' } },
    },
  };

  // Recent Incidents
  recentIncidents = [
    { id: 'INC-401', type: 'Brute Force', severity: 'Critical', status: 'Investigating', time: '2 min ago' },
    { id: 'INC-402', type: 'Malware', severity: 'High', status: 'Resolved', time: '15 min ago' },
    { id: 'INC-403', type: 'SQL Injection', severity: 'High', status: 'Open', time: '1 hour ago' },
    { id: 'INC-404', type: 'Policy Violation', severity: 'Medium', status: 'Investigating', time: '2 hours ago' },
    { id: 'INC-405', type: 'Failed Backup', severity: 'Low', status: 'Resolved', time: '3 hours ago' },
  ];

  // Live Alerts
  liveAlerts = [
    { type: 'Critical', message: 'Unauthorized login attempt detected', time: 'now', icon: '🔴' },
    { type: 'High', message: 'Suspicious outbound traffic detected', time: '5 min ago', icon: '🟠' },
    { type: 'Medium', message: 'Disk usage at 85% capacity', time: '15 min ago', icon: '🟡' },
    { type: 'Info', message: 'Backup completed successfully', time: '1 hour ago', icon: '🟢' },
  ];

  // System Health
  systemHealth = [
    { name: 'Firewall', status: 95 },
    { name: 'Database', status: 88 },
    { name: 'API Services', status: 91 },
    { name: 'Network', status: 97 },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  getSeverityColor(severity: string): string {
    const colors: { [key: string]: string } = {
      Critical: '#dc2626',
      High: '#f97316',
      Medium: '#eab308',
      Low: '#22c55e',
    };
    return colors[severity] || '#6b7280';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      Investigating: '#f97316',
      Resolved: '#22c55e',
      Open: '#ef4444',
    };
    return colors[status] || '#6b7280';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
