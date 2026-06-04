import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-wrap">
      <div class="header-actions">
        <h1>User Management</h1>
        <div>
          <a routerLink="/audit-logs" class="btn-secondary" style="margin-right: 10px;">View Audit Logs</a>
          <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
        </div>
      </div>
      
      <p>Manage system access and roles.</p>

      <div class="admin-grid">
        <div class="users-list">
          <h3>System Users</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><span class="role-badge" [class]="user.role.toLowerCase()">{{ user.role }}</span></td>
                <td>{{ user.status }}</td>
                <td>
                  <button class="btn-danger-sm" (click)="deleteUser(user._id)" [disabled]="user.email === 'admin@cybershield.com'">Delete</button>
                </td>
              </tr>
              <tr *ngIf="users.length === 0">
                <td colspan="5" class="text-center">No users found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="add-user-form">
          <h3>Add New User</h3>
          <form (ngSubmit)="createUser()">
            <div class="form-group">
              <label>Name</label>
              <input type="text" name="name" [(ngModel)]="newUser.name" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" [(ngModel)]="newUser.email" required />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" name="password" [(ngModel)]="newUser.password" required />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select name="role" [(ngModel)]="newUser.role">
                <option value="Admin">Admin</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <button type="submit" class="btn-primary" [disabled]="saving">
              {{ saving ? 'Creating...' : 'Create User' }}
            </button>
            <div *ngIf="error" class="error-msg">{{ error }}</div>
            <div *ngIf="success" class="success-msg">{{ success }}</div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: linear-gradient(165deg, #0a0e1a 0%, #0d1321 100%); color: #fff; }
    .page-wrap { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .back-link { color: #00d4ff; text-decoration: none; }
    
    .admin-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 20px; }
    .users-list { background: rgba(15, 23, 42, 0.5); padding: 20px; border-radius: 10px; border: 1px solid #1e293b; overflow-x: auto; }
    .add-user-form { background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 10px; border: 1px solid rgba(16, 185, 129, 0.2); }
    
    .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .data-table th, .data-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #334155; }
    .data-table th { color: #94a3b8; font-weight: 500; font-size: 14px; }
    .data-table tr:hover { background: rgba(255,255,255,0.02); }
    
    .role-badge { padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
    .role-badge.admin { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .role-badge.analyst { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .role-badge.viewer { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; color: #cbd5e1; font-size: 13px; }
    input, select { width: 100%; padding: 10px; background: #0f172a; border: 1px solid #334155; color: #fff; border-radius: 6px; box-sizing: border-box; }
    
    button { padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .btn-primary { background: #10b981; color: white; width: 100%; }
    .btn-secondary { padding: 6px 12px; background: transparent; color: #cbd5e1; border: 1px solid #475569; border-radius: 6px; cursor: pointer; text-decoration: none; }
    .btn-danger-sm { background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 5px 10px; font-size: 12px; border: 1px solid rgba(239, 68, 68, 0.5); }
    .btn-danger-sm:disabled { opacity: 0.3; cursor: not-allowed; }
    
    .error-msg { color: #ef4444; font-size: 13px; margin-top: 10px; }
    .success-msg { color: #10b981; font-size: 13px; margin-top: 10px; }
    .text-center { text-align: center; }
  `]
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  newUser = { name: '', email: '', password: '', role: 'Analyst' };
  loading = true;
  saving = false;
  error = '';
  success = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || res || [];
        this.loading = false;
      },
      error: (err) => console.error(err)
    });
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.error = 'Please fill all fields';
      return;
    }
    
    this.saving = true;
    this.error = '';
    this.success = '';
    
    this.apiService.createUser(this.newUser).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.success = 'User created successfully';
        this.newUser = { name: '', email: '', password: '', role: 'Analyst' };
        this.loadUsers();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'Failed to create user';
      }
    });
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    this.apiService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => alert(err.error?.message || 'Failed to delete user')
    });
  }
}
