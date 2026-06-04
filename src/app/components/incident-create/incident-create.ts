import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-incident-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="incident-create-container">
      <div class="form-box">
        <h2>Create New Incident</h2>
        <p class="subtitle">Report a new security incident</p>

        <form [formGroup]="incidentForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Title</label>
            <input type="text" formControlName="title" placeholder="e.g. Unauthorized Login Attempt" />
            <div class="error" *ngIf="incidentForm.get('title')?.touched && incidentForm.get('title')?.invalid">
              Title is required.
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea formControlName="description" rows="4" placeholder="Detailed description of the incident..."></textarea>
            <div class="error" *ngIf="incidentForm.get('description')?.touched && incidentForm.get('description')?.invalid">
              Description is required.
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Severity</label>
              <select formControlName="severity">
                <option value="Info">Info</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div class="form-group half">
              <label>Type</label>
              <select formControlName="type">
                <option value="Malware">Malware</option>
                <option value="Phishing">Phishing</option>
                <option value="DDoS">DDoS</option>
                <option value="Insider Threat">Insider Threat</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="cancel()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="incidentForm.invalid || loading">
              {{ loading ? 'Creating...' : 'Create Incident' }}
            </button>
          </div>
        </form>

        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="success" class="success-message">{{ success }}</div>
      </div>
    </div>
  `,
  styles: [`
    .incident-create-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
      color: #fff;
    }
    .form-box {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 30px;
      border-radius: 10px;
      width: 100%;
      max-width: 600px;
      backdrop-filter: blur(10px);
    }
    h2 { color: #10b981; margin-bottom: 5px; }
    .subtitle { color: #94a3b8; margin-bottom: 25px; font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    .form-row { display: flex; gap: 20px; }
    .half { flex: 1; }
    label { display: block; margin-bottom: 8px; color: #cbd5e1; font-weight: 500; font-size: 14px; }
    input, textarea, select {
      width: 100%;
      padding: 12px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid #334155;
      border-radius: 6px;
      color: #fff;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #10b981;
    }
    .error { color: #ef4444; font-size: 12px; margin-top: 5px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }
    .btn-primary {
      padding: 10px 20px; background: #10b981; color: white; border: none;
      border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s;
    }
    .btn-primary:hover:not(:disabled) { background: #059669; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary {
      padding: 10px 20px; background: transparent; color: #cbd5e1;
      border: 1px solid #475569; border-radius: 6px; cursor: pointer; transition: 0.2s;
    }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.05); }
    .error-message { color: #fca5a5; margin-top: 15px; padding: 10px; background: rgba(220, 38, 38, 0.1); border-radius: 6px; }
    .success-message { color: #6ee7b7; margin-top: 15px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; }
  `]
})
export class IncidentCreateComponent {
  incidentForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.incidentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      severity: ['Medium', Validators.required],
      type: ['Other', Validators.required],
      status: ['Open']
    });
  }

  onSubmit() {
    if (this.incidentForm.invalid) return;
    
    this.loading = true;
    this.error = '';
    
    this.apiService.createIncident(this.incidentForm.value).subscribe({
      next: (res) => {
        this.success = 'Incident created successfully!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/incidents']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create incident.';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/incidents']);
  }
}
