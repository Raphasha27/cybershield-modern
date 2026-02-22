import { Injectable } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'cybershield-theme';

  get theme(): Theme {
    if (typeof document === 'undefined') return 'dark';
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    return 'dark';
  }

  set theme(value: Theme) {
    localStorage.setItem(this.STORAGE_KEY, value);
    this.apply(value);
  }

  toggle(): Theme {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    return this.theme;
  }

  apply(t?: Theme): void {
    const next = t ?? this.theme;
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add('theme-' + next);
  }

  init(): void {
    this.apply();
  }
}
