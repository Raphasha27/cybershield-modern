import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <div class="logo">🛡️</div>
        <h1>CyberShield</h1>
        <p class="subtitle">Incident Management Platform</p>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="admin@cybershield.com" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="password123" required />
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <div class="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: admin@cybershield.com</p>
            <p>Password: password123</p>
          </div>
        </form>

        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="success" class="success-message">{{ success }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      }

      .login-box {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 400px;
      }

      .logo {
        text-align: center;
        font-size: 48px;
        margin-bottom: 15px;
      }

      h1 {
        text-align: center;
        color: #059669;
        margin-bottom: 5px;
        font-size: 28px;
      }

      .subtitle {
        text-align: center;
        color: #666;
        margin-bottom: 30px;
        font-size: 14px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 12px;
        border: 2px solid #e5e7eb;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.3s;
      }

      input:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
      }

      .btn-primary {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
      }

      .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .demo-credentials {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 6px;
        padding: 15px;
        margin-top: 20px;
        font-size: 13px;
        color: #065f46;
      }

      .demo-credentials p {
        margin: 5px 0;
      }

      .demo-credentials strong {
        color: #059669;
      }

      .error-message {
        color: #dc2626;
        margin-top: 15px;
        padding: 12px;
        background: #fee2e2;
        border: 1px solid #fecaca;
        border-radius: 6px;
        font-size: 14px;
      }

      .success-message {
        color: #059669;
        margin-top: 15px;
        padding: 12px;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 6px;
        font-size: 14px;
      }
    `,
  ],
})
export class LoginComponent {
  email = 'admin@cybershield.com';
  password = 'password123';
  loading = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    // Mock login - simulate successful authentication
    setTimeout(() => {
      this.authService.mockLogin(this.email, 'Admin');
      this.success = 'Login successful! Redirecting...';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 500);
    }, 1000);
  }
}
