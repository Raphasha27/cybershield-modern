import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private apiService: ApiService) {
    const token = localStorage.getItem('token');
    if (token) {
      this.userSubject.next(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }

  mockLogin(email: string, name: string): void {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email,
      name,
      role: 'Admin',
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    this.apiService.setToken(mockToken);
    this.userSubject.next(mockUser);
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.login(email, password).pipe(
      tap((response) => {
        this.apiService.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.userSubject.next(response.user);
      })
    );
  }

  register(email: string, name: string, password: string): Observable<any> {
    return this.apiService.register(email, name, password).pipe(
      tap((response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.userSubject.next(response);
      })
    );
  }

  logout(): void {
    this.apiService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any {
    return this.userSubject.value;
  }
}
