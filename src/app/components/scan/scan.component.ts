import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-wrap">
      <h1>Vulnerability Scan{{ tabTitle }}</h1>
      <p>{{ tabDescription }}</p>
      <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: linear-gradient(165deg, #0a0e1a 0%, #0d1321 100%); color: #fff; }
    .page-wrap { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .back-link { color: #00d4ff; margin-top: 1rem; display: inline-block; }
  `],
})
export class ScanComponent {
  tabTitle = '';
  tabDescription = '';

  constructor(private route: ActivatedRoute) {
    this.setTabFromRoute(this.route.snapshot.params['tab']);
    this.route.params.subscribe((p) => this.setTabFromRoute(p['tab']));
  }

  private setTabFromRoute(tab: string | undefined): void {
    const t = (tab || '').toLowerCase();
    if (t === 'documents') {
      this.tabTitle = ' – Documents';
      this.tabDescription = 'Scan documents and files for vulnerabilities.';
    } else if (t === 'databases') {
      this.tabTitle = ' – Databases';
      this.tabDescription = 'Database vulnerability assessment and hardening.';
    } else if (t === 'mode') {
      this.tabTitle = ' – Mode';
      this.tabDescription = 'Configure scan mode and scheduling.';
    } else {
      this.tabTitle = '';
      this.tabDescription = 'Enterprise vulnerability scanning.';
    }
  }
}
