import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  constructor() {
    // Connect to backend server
    this.socket = io('http://localhost:3000');
    
    // Listen for new incidents
    this.socket.on('new-incident', (incident: any) => {
      this.showNotification(
        `New ${incident.severity} Incident: ${incident.title}`, 
        incident.severity === 'Critical' || incident.severity === 'High' ? 'error' : 'warning'
      );
    });
    
    // We could add more socket events here
  }
  
  showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const notification: AppNotification = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
      timestamp: new Date()
    };
    
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }
  
  removeNotification(id: string) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(current.filter(n => n.id !== id));
  }
}
