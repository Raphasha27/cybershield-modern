import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AdminComponent } from './components/admin/admin.component';
import { IncidentsComponent } from './components/incidents/incidents.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { ScanComponent } from './components/scan/scan.component';
import { SpeakersComponent } from './components/speakers/speakers.component';
import { IncidentCreateComponent } from './components/incident-create/incident-create';
import { ThreatsComponent } from './components/threats/threats';
import { AuditLogsComponent } from './components/audit-logs/audit-logs';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'incidents', component: IncidentsComponent, canActivate: [AuthGuard] },
  { path: 'incidents/create', component: IncidentCreateComponent, canActivate: [AuthGuard] },
  { path: 'threats', component: ThreatsComponent, canActivate: [AuthGuard] },
  { path: 'audit-logs', component: AuditLogsComponent, canActivate: [AuthGuard] },
  { path: 'upgrade', component: UpgradeComponent, canActivate: [AuthGuard] },
  { path: 'speakers', component: SpeakersComponent, canActivate: [AuthGuard] },
  { path: 'scan/:tab', component: ScanComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' },
];
