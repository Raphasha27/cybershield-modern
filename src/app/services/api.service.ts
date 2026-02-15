import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  // Auth
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(email: string, name: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { email, name, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  // Incidents
  getIncidents(page = 1, limit = 20, filters: any = {}): Observable<any> {
    let url = `${this.apiUrl}/incidents?page=${page}&limit=${limit}`;
    if (filters.status) url += `&status=${filters.status}`;
    if (filters.severity) url += `&severity=${filters.severity}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getIncident(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/incidents/${id}`, { headers: this.getHeaders() });
  }

  createIncident(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidents`, data, { headers: this.getHeaders() });
  }

  updateIncident(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/incidents/${id}`, data, { headers: this.getHeaders() });
  }

  deleteIncident(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/incidents/${id}`, { headers: this.getHeaders() });
  }

  // Threats
  getThreats(filters: any = {}): Observable<any> {
    let url = `${this.apiUrl}/threats`;
    if (filters.status) url += `?status=${filters.status}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getThreat(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/threats/${id}`, { headers: this.getHeaders() });
  }

  investigateThreat(id: string, notes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/threats/${id}/investigate`, { notes }, { headers: this.getHeaders() });
  }

  // Dashboard
  getDashboardMetrics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/metrics`, { headers: this.getHeaders() });
  }
}
