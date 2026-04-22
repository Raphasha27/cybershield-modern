import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-speakers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-wrap">
      <h1>Speakers & Annotations</h1>
      <p>Manage speakers online, annotation time, and snooze settings.</p>
      <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: linear-gradient(165deg, #0a0e1a 0%, #0d1321 100%); color: #fff; }
    .page-wrap { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .back-link { color: #00d4ff; margin-top: 1rem; display: inline-block; }
  `],
})
export class SpeakersComponent {}
