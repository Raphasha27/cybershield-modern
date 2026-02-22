import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: [],
})
export class AppComponent {
  title = 'cybershield';

  constructor(private themeService: ThemeService) {
    this.themeService.init();
  }
}
