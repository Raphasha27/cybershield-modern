import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-wrap">
      <div class="header-actions">
        <h1>Audit Logs</h1>
        <a routerLink="/admin" class="back-link">← Back to Admin</a>
      </div>
      
      <p>System-wide audit trail for compliance and tracking.</p>

      <div class="logs-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Status</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="6" class="text-center">Loading audit logs...</td>
            </tr>
            <tr *ngFor="let log of logs">
              <td class="date-col">{{ log.createdAt | date:'short' }}</td>
              <td>{{ log.userId?.name || 'System' }}</td>
              <td><strong>{{ log.action }}</strong></td>
              <td>{{ log.resourceType }}</td>
              <td><span class="status-badge" [class]="log.status.toLowerCase()">{{ log.status }}</span></td>
              <td class="ip-col">{{ log.ipAddress || 'N/A' }}</td>
            </tr>
            <tr *ngIf="!loading && logs.length === 0">
              <td colspan="6" class="text-center">No audit logs found.</td>
            </tr>
          </tbody>
        </table>
        
        <div class="pagination" *ngIf="pagination.pages > 1">
          <button (click)="loadLogs(pagination.page - 1)" [disabled]="pagination.page === 1">Previous</button>
          <span>Page {{ pagination.page }} of {{ pagination.pages }}</span>
          <button (click)="loadLogs(pagination.page + 1)" [disabled]="pagination.page === pagination.pages">Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: linear-gradient(165deg, #0a0e1a 0%, #0d1321 100%); color: #fff; }
    .page-wrap { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .back-link { color: #00d4ff; text-decoration: none; }
    
    .logs-container { background: rgba(15, 23, 42, 0.5); padding: 20px; border-radius: 10px; border: 1px solid #1e293b; margin-top: 20px; overflow-x: auto; }
    
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #334155; }
    .data-table th { color: #94a3b8; font-weight: 500; font-size: 14px; }
    .data-table tr:hover { background: rgba(255,255,255,0.02); }
    
    .date-col, .ip-col { color: #94a3b8; font-size: 13px; }
    
    .status-badge { padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
    .status-badge.success { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .status-badge.failure { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    
    .pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; }
    .pagination button { padding: 6px 12px; background: #1e293b; color: white; border: 1px solid #334155; border-radius: 6px; cursor: pointer; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .text-center { text-align: center; }
  `]
})
export class AuditLogsComponent implements OnInit {
  logs: any[] = [];
  pagination = { page: 1, total: 0, pages: 1 };
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadLogs(1);
  }

  loadLogs(page: number) {
    this.loading = true;
    this.apiService.getAuditLogs(page).subscribe({
      next: (res: any) => {
        this.logs = res.data || [];
        this.pagination = res.pagination || { page: 1, total: 0, pages: 1 };
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
