import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: any = null;
  notificationsOpen = false;
  refreshIntervalOptions = [
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '5m', value: 300 },
    { label: 'Paused', value: 0 },
  ];
  refreshInterval = 60; // seconds
  refreshTimer: ReturnType<typeof setInterval> | null = null;
  searchQuery = '';
  themeService: ThemeService;

  /** Cascading binary for background (Enterprise Suite aesthetic) */
  binaryStream = Array(80).fill(0).map(() =>
    Array(40).fill(0).map(() => (Math.random() > 0.5 ? '1' : '0')).join('')
  ).join(' ');

  // Security Score (0-100) - common in enterprise SOCs
  securityScore = 78;
  securityScoreTrend: 'up' | 'down' | 'neutral' = 'up';

  // Compliance - PCI-DSS, SOC 2, ISO 27001
  compliance = [
    { name: 'PCI-DSS', score: 92, status: 'Compliant' },
    { name: 'SOC 2', score: 88, status: 'In review' },
    { name: 'ISO 27001', score: 95, status: 'Certified' },
  ];

  // KPI Data
  kpis = {
    totalIncidents: 42,
    activeThreats: 23,
    serversOnline: 14,
    networkActivity: 92,
  };

  // Activity / event timeline (recent events)
  activityLog = [
    { time: '14:32', event: 'Firewall rule updated', level: 'info' },
    { time: '14:28', event: 'New threat signature deployed', level: 'info' },
    { time: '14:15', event: 'Incident #1232 resolved', level: 'success' },
    { time: '14:02', event: 'Backup completed', level: 'info' },
    { time: '13:58', event: 'Failed login attempt blocked', level: 'warn' },
  ];

  // Chart Data - Threat Activity Trend (blue/cyan line, dark grid)
  threatTrendData: ChartConfiguration<'line'>['data'] = {
    labels: ['100', '200', '300', '400', '500'],
    datasets: [
      {
        label: 'Threat Activity',
        data: [5, 12, 8, 18, 14],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.08)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#0a0e1a',
      },
    ],
  };

  threatTrendOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 20,
        ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.06)' },
        border: { display: false },
      },
      x: {
        ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.06)' },
        border: { display: false },
      },
    },
  };

  // Incident Severity Distribution - High (red), Medium (orange), Low (teal)
  severityData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [18, 14, 10],
        backgroundColor: ['#ef4444', '#f97316', '#14b8a6'],
        borderWidth: 0,
      },
    ],
  };

  severityOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: 'rgba(255,255,255,0.9)',
          font: { size: 12 },
          padding: 12,
          usePointStyle: true,
        },
      },
    },
  };

  // Recent Incidents (ID, Type, Severity, Status, Time, Threats) - full list for filtering/export
  allIncidents = [
    { id: 1223, type: 'Malware', severity: 'High', status: 'Active', time: '1hr ago', threats: 'Botnet' },
    { id: 1232, type: 'Phishing', severity: 'Medium', status: 'Resolved', time: '1 day ago', threats: 'Trojan' },
    { id: 1231, type: 'DDoS', severity: 'Low', status: 'Active', time: '10 min ago', threats: '+10 other' },
    { id: 1230, type: 'Brute Force', severity: 'High', status: 'Investigating', time: '2 hours ago', threats: 'Credential' },
    { id: 1229, type: 'Policy Violation', severity: 'Low', status: 'Resolved', time: '3 hours ago', threats: '—' },
  ];

  get recentIncidents() {
    if (!this.searchQuery.trim()) return this.allIncidents;
    const q = this.searchQuery.toLowerCase();
    return this.allIncidents.filter(
      (i) =>
        String(i.id).includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.severity.toLowerCase().includes(q) ||
        i.status.toLowerCase().includes(q) ||
        (i.threats && i.threats.toLowerCase().includes(q))
    );
  }

  // Live Alerts
  liveAlerts = [
    { type: 'Critical', message: 'Unauthorized login attempt detected', time: 'now', icon: '🔴' },
    { type: 'High', message: 'Suspicious outbound traffic detected', time: '5 min ago', icon: '🟠' },
    { type: 'Medium', message: 'Disk usage at 85% capacity', time: '15 min ago', icon: '🟡' },
    { type: 'Info', message: 'Backup completed successfully', time: '1 hour ago', icon: '🟢' },
  ];

  // System Health with enhanced metrics
  systemHealth = [
    { name: 'Firewall', status: 95, trend: 'up', lastCheck: '2 min ago' },
    { name: 'Database', status: 88, trend: 'down', lastCheck: '1 min ago' },
    { name: 'API Services', status: 91, trend: 'up', lastCheck: '30 sec ago' },
    { name: 'Network', status: 97, trend: 'stable', lastCheck: '1 min ago' },
    { name: 'Intrusion Detection', status: 93, trend: 'up', lastCheck: '45 sec ago' },
    { name: 'Endpoint Protection', status: 89, trend: 'stable', lastCheck: '2 min ago' },
  ];

  // Enhanced threat intelligence
  threatIntelligence = {
    totalThreatsBlocked: 1247,
    malwareDetected: 89,
    phishingAttempts: 156,
    suspiciousIPs: 23,
    vulnerabilitiesPatched: 45,
    securityAlertsToday: 67
  };

  // Geographic threat data
  geographicThreats = [
    { country: 'Russia', threats: 45, severity: 'high' },
    { country: 'China', threats: 38, severity: 'high' },
    { country: 'North Korea', threats: 23, severity: 'medium' },
    { country: 'Iran', threats: 19, severity: 'medium' },
    { country: 'Unknown', threats: 31, severity: 'low' }
  ];

  // Network traffic data for enhanced visualization
  networkTrafficData: ChartConfiguration<'bar'>['data'] = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Inbound Traffic (GB)',
        data: [12, 8, 25, 45, 38, 22],
        backgroundColor: 'rgba(0, 212, 255, 0.6)',
        borderColor: '#00d4ff',
        borderWidth: 1,
      },
      {
        label: 'Outbound Traffic (GB)',
        data: [8, 6, 18, 32, 28, 16],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: '#22c55e',
        borderWidth: 1,
      }
    ],
  };

  networkTrafficOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        display: true,
        labels: { color: 'rgba(255,255,255,0.9)' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'rgba(255,255,255,0.6)' },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      x: {
        ticks: { color: 'rgba(255,255,255,0.6)' },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  };

  // Interactive map properties
  isScanning = false;
  selectedRegion: any = null;
  tooltipX = 0;
  tooltipY = 0;
  threatFeedActive = true;

  // Live threat feed
  liveThreatFeed = [
    { time: '14:32', location: 'Asia-Pacific', description: 'DDoS attack detected', severity: 'high' },
    { time: '14:28', location: 'Europe', description: 'Malware signature updated', severity: 'medium' },
    { time: '14:15', location: 'North America', description: 'Phishing attempt blocked', severity: 'high' },
    { time: '14:02', location: 'Global', description: 'Security scan completed', severity: 'low' },
  ];

  // AI Assistant properties
  aiAssistant = {
    isActive: true,
    predictions: [
      {
        id: 1,
        icon: '⚠️',
        title: 'Critical System Update Required',
        description: 'Firewall rules need updating within 2 hours to prevent potential breach.',
        confidence: 94,
        priority: 'high',
        action: 'Update Now',
        recommendedBy: 'Today 16:00'
      },
      {
        id: 2,
        icon: '🔍',
        title: 'Anomalous Network Activity',
        description: 'Unusual traffic patterns detected from Asia-Pacific region.',
        confidence: 87,
        priority: 'medium',
        action: 'Investigate',
        recommendedBy: 'Today 17:30'
      },
      {
        id: 3,
        icon: '🛡️',
        title: 'Endpoint Protection Optimization',
        description: 'System performance can be improved by optimizing endpoint configurations.',
        confidence: 76,
        priority: 'low',
        action: 'Optimize',
        recommendedBy: 'Tomorrow 09:00'
      }
    ],
    chatMessages: [
      {
        sender: 'ai',
        content: 'Hello! I\'m monitoring your security infrastructure. Current threat level is moderate with 23 active threats detected.',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        sender: 'ai',
        content: 'I recommend updating firewall rules in the next 2 hours based on recent threat intelligence.',
        timestamp: new Date(Date.now() - 120000)
      }
    ]
  };

  aiChatInput = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    themeService: ThemeService
  ) {
    this.themeService = themeService;
  }

  /** Displayed in footer */
  lastUpdated = new Date().toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' });

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.startRefreshTimer();
    
    // Start real-time simulation
    setInterval(() => {
      this.simulateRealTimeUpdate();
    }, 10000); // Update every 10 seconds
  }

  ngOnDestroy(): void {
    this.stopRefreshTimer();
  }

  startRefreshTimer(): void {
    this.stopRefreshTimer();
    if (this.refreshInterval <= 0) return;
    this.refreshTimer = setInterval(() => {
      this.lastUpdated = new Date().toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' });
    }, this.refreshInterval * 1000);
  }

  stopRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  setRefreshInterval(seconds: number): void {
    this.refreshInterval = seconds;
    this.startRefreshTimer();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
  }

  exportCsv(): void {
    const headers = ['ID', 'Type', 'Severity', 'Status', 'Time', 'Threats'];
    const rows = this.recentIncidents.map((i) =>
      [i.id, i.type, i.severity, i.status, i.time, i.threats].map((c) => `"${c}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybershield-incidents-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  goToScan(tab: string): void {
    this.router.navigate(['/scan', tab]);
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

  // Enhanced methods for better functionality
  simulateRealTimeUpdate(): void {
    // Simulate real-time data updates
    this.kpis.activeThreats = Math.floor(Math.random() * 50) + 10;
    this.kpis.networkActivity = Math.floor(Math.random() * 20) + 80;
    this.securityScore = Math.floor(Math.random() * 10) + 75;
    
    // Update threat trend data
    const newValue = Math.floor(Math.random() * 15) + 5;
    this.threatTrendData.datasets[0].data.shift();
    this.threatTrendData.datasets[0].data.push(newValue);
    
    // Update activity log
    const activities = [
      'New threat signature deployed',
      'Firewall rule updated',
      'Backup completed',
      'Security scan initiated',
      'Incident resolved',
      'User access granted',
      'System health check completed'
    ];
    const levels = ['info', 'success', 'warn'];
    const newActivity = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      event: activities[Math.floor(Math.random() * activities.length)],
      level: levels[Math.floor(Math.random() * levels.length)]
    };
    this.activityLog.unshift(newActivity);
    if (this.activityLog.length > 10) {
      this.activityLog.pop();
    }
  }

  getThreatSeverityColor(severity: string): string {
    const colors: { [key: string]: string } = {
      high: '#ef4444',
      medium: '#f97316',
      low: '#22c55e'
    };
    return colors[severity] || '#6b7280';
  }

  getSystemHealthColor(status: number): string {
    if (status >= 95) return '#22c55e';
    if (status >= 85) return '#eab308';
    return '#ef4444';
  }

  getTrendIcon(trend: string): string {
    const icons: { [key: string]: string } = {
      up: '↗️',
      down: '↘️',
      stable: '➡️'
    };
    return icons[trend] || '➡️';
  }

  refreshDashboard(): void {
    this.simulateRealTimeUpdate();
    this.lastUpdated = new Date().toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' });
  }

  // Interactive map methods
  showRegionDetails(regionName: string): void {
    const regionData = {
      'North America': { name: 'North America', threats: 45, severity: 'high', lastScan: '2 min ago' },
      'South America': { name: 'South America', threats: 12, severity: 'low', lastScan: '5 min ago' },
      'Europe': { name: 'Europe', threats: 38, severity: 'high', lastScan: '1 min ago' },
      'Africa': { name: 'Africa', threats: 23, severity: 'medium', lastScan: '3 min ago' },
      'Asia': { name: 'Asia', threats: 67, severity: 'high', lastScan: '30 sec ago' },
      'Australia': { name: 'Australia', threats: 8, severity: 'low', lastScan: '4 min ago' }
    };
    
    this.selectedRegion = regionData[regionName as keyof typeof regionData];
    
    // Hide tooltip after 3 seconds
    setTimeout(() => {
      this.selectedRegion = null;
    }, 3000);
  }

  toggleScanMode(): void {
    this.isScanning = !this.isScanning;
    if (this.isScanning) {
      // Simulate scan completion after 10 seconds
      setTimeout(() => {
        this.isScanning = false;
        this.addActivityLog('Global security scan completed', 'success');
      }, 10000);
    }
  }

  addActivityLog(event: string, level: string): void {
    const newActivity = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      event: event,
      level: level
    };
    this.activityLog.unshift(newActivity);
    if (this.activityLog.length > 10) {
      this.activityLog.pop();
    }
  }

  // AI Assistant methods
  toggleAI(): void {
    this.aiAssistant.isActive = !this.aiAssistant.isActive;
    const message = this.aiAssistant.isActive ? 
      'AI Assistant activated. Monitoring resumed.' : 
      'AI Assistant paused. Manual monitoring required.';
    
    this.aiAssistant.chatMessages.push({
      sender: 'ai',
      content: message,
      timestamp: new Date()
    });
  }

  executePrediction(prediction: any): void {
    this.addActivityLog(`AI Recommendation: ${prediction.title} - Action taken`, 'success');
    
    // Remove the prediction after execution
    this.aiAssistant.predictions = this.aiAssistant.predictions.filter(p => p.id !== prediction.id);
    
    // Add AI response
    this.aiAssistant.chatMessages.push({
      sender: 'ai',
      content: `Executing "${prediction.title}". I'll monitor the results and update you shortly.`,
      timestamp: new Date()
    });
  }

  dismissPrediction(prediction: any): void {
    this.aiAssistant.predictions = this.aiAssistant.predictions.filter(p => p.id !== prediction.id);
    
    this.aiAssistant.chatMessages.push({
      sender: 'ai',
      content: `Prediction "${prediction.title}" dismissed. I'll continue monitoring for similar patterns.`,
      timestamp: new Date()
    });
  }

  sendAIMessage(): void {
    if (!this.aiChatInput.trim()) return;
    
    // Add user message
    this.aiAssistant.chatMessages.push({
      sender: 'user',
      content: this.aiChatInput,
      timestamp: new Date()
    });
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Based on current threat intelligence, I recommend increasing monitoring on the affected systems.',
        'I\'ve analyzed the security logs and found no immediate concerns. System status is stable.',
        'Current threat level is moderate. I suggest reviewing the firewall configurations.',
        'All systems are operating within normal parameters. No immediate action required.',
        'I\'ve detected some unusual patterns. Initiating deeper analysis now.',
        'Security posture is strong. Consider scheduling routine maintenance during low-traffic hours.'
      ];
      
      this.aiAssistant.chatMessages.push({
        sender: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      });
    }, 1000);
    
    this.aiChatInput = '';
  }
}
