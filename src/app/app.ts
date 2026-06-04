import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of notifications" class="toast" [ngClass]="toast.type">
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" (click)="removeToast(toast.id)">&times;</button>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      min-width: 300px;
      padding: 15px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
      color: white;
    }
    .toast.info { background: rgba(59, 130, 246, 0.9); border-left: 4px solid #2563eb; }
    .toast.success { background: rgba(16, 185, 129, 0.9); border-left: 4px solid #059669; }
    .toast.warning { background: rgba(245, 158, 11, 0.9); border-left: 4px solid #d97706; }
    .toast.error { background: rgba(239, 68, 68, 0.9); border-left: 4px solid #dc2626; }
    
    .toast-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.7;
    }
    .toast-close:hover { opacity: 1; }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `],
})
export class AppComponent {
  title = 'cybershield';
  notifications: any[] = [];

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {
    this.themeService.init();
    this.notificationService.notifications$.subscribe(n => {
      this.notifications = n;
    });
  }

  removeToast(id: string) {
    this.notificationService.removeNotification(id);
  }
}
