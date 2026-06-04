import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-threats',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-wrap">
      <div class="header-actions">
        <h1>Threat Intelligence</h1>
        <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
      </div>
      
      <p>Monitor and investigate active security threats.</p>

      <div class="threats-grid">
        <div class="threats-list">
          <h3>Active Threats</h3>
          <div *ngIf="loading" class="loading">Loading threats...</div>
          <div *ngIf="!loading && threats.length === 0" class="empty-state">No threats detected.</div>
          
          <div class="threat-card" *ngFor="let threat of threats" 
               [class.selected]="selectedThreat?._id === threat._id"
               (click)="selectThreat(threat)">
            <div class="threat-header">
              <span class="severity-badge" [class]="threat.severity.toLowerCase()">{{ threat.severity }}</span>
              <span class="status-badge" [class]="threat.status.toLowerCase().replace(' ', '-')">{{ threat.status }}</span>
            </div>
            <h4>{{ threat.classification }}</h4>
            <p class="detected-time">Detected: {{ threat.detectedAt | date:'medium' }}</p>
          </div>
        </div>

        <div class="threat-details" *ngIf="selectedThreat">
          <h3>Investigation: {{ selectedThreat.classification }}</h3>
          <div class="detail-box">
            <p><strong>Description:</strong> {{ selectedThreat.description }}</p>
            <p><strong>Source:</strong> {{ selectedThreat.detectionSource }}</p>
            <p><strong>Detected:</strong> {{ selectedThreat.detectedAt | date:'medium' }}</p>
            <p><strong>Status:</strong> {{ selectedThreat.status }}</p>
          </div>

          <div class="investigation-form" *ngIf="selectedThreat.status !== 'Resolved'">
            <h4>Update Investigation</h4>
            <textarea [(ngModel)]="investigationNotes" rows="4" placeholder="Enter investigation notes here..."></textarea>
            
            <div class="action-buttons">
              <button class="btn-primary" (click)="updateThreatStatus('Investigated')" [disabled]="saving">Mark as Investigated</button>
              <button class="btn-success" (click)="updateThreatStatus('Resolved')" [disabled]="saving">Mark as Resolved</button>
            </div>
            <div *ngIf="error" class="error-msg">{{ error }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: linear-gradient(165deg, #0a0e1a 0%, #0d1321 100%); color: #fff; }
    .page-wrap { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .back-link { color: #00d4ff; text-decoration: none; }
    
    .threats-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; margin-top: 20px; }
    .threats-list { background: rgba(15, 23, 42, 0.5); padding: 20px; border-radius: 10px; border: 1px solid #1e293b; max-height: 80vh; overflow-y: auto; }
    .threat-details { background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 10px; border: 1px solid rgba(16, 185, 129, 0.2); }
    
    .threat-card { background: #1e293b; padding: 15px; border-radius: 8px; margin-bottom: 10px; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
    .threat-card:hover { border-color: #3b82f6; }
    .threat-card.selected { border-color: #10b981; background: rgba(16, 185, 129, 0.1); }
    
    .threat-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    h4 { margin: 0 0 5px 0; color: #f8fafc; }
    .detected-time { margin: 0; font-size: 12px; color: #94a3b8; }
    
    .severity-badge { padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
    .severity-badge.critical { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .severity-badge.high { background: rgba(249, 115, 22, 0.2); color: #fb923c; }
    .severity-badge.medium { background: rgba(234, 179, 8, 0.2); color: #facc15; }
    .severity-badge.low { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    
    .status-badge { padding: 3px 8px; border-radius: 12px; font-size: 11px; background: rgba(148, 163, 184, 0.2); color: #cbd5e1; }
    
    .detail-box { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .detail-box p { margin: 5px 0; font-size: 14px; }
    
    .investigation-form textarea { width: 100%; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 10px; border-radius: 6px; box-sizing: border-box; }
    .action-buttons { display: flex; gap: 10px; margin-top: 15px; }
    
    button { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-success { background: #10b981; color: white; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .error-msg { color: #ef4444; font-size: 13px; margin-top: 10px; }
  `]
})
export class ThreatsComponent implements OnInit {
  threats: any[] = [];
  selectedThreat: any = null;
  loading = true;
  saving = false;
  investigationNotes = '';
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadThreats();
  }

  loadThreats() {
    this.loading = true;
    this.apiService.getThreats().subscribe({
      next: (res: any) => {
        // Backend returns `{ success: true, count: X, data: [...] }` usually based on express patterns
        this.threats = res.data || res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading threats', err);
        this.loading = false;
      }
    });
  }

  selectThreat(threat: any) {
    this.selectedThreat = threat;
    this.investigationNotes = threat.investigationNotes || '';
    this.error = '';
  }

  updateThreatStatus(status: string) {
    if (!this.selectedThreat) return;
    this.saving = true;
    this.error = '';

    // The API signature requires passing investigate/status
    // Assuming /threats/:id/investigate sets status and notes
    // Looking at api.service.ts: investigateThreat(id: string, notes: string)
    // Wait, let's just use what's in api.service
    this.apiService.investigateThreat(this.selectedThreat._id, this.investigationNotes).subscribe({
      next: (res: any) => {
        this.saving = false;
        // Optionally update the local threat object with the returned data
        if(res.data) {
          const index = this.threats.findIndex(t => t._id === this.selectedThreat._id);
          if(index !== -1) this.threats[index] = res.data;
          this.selectedThreat = res.data;
        } else {
          // just reload all to be safe
          this.loadThreats();
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update threat';
        this.saving = false;
      }
    });
  }
}
