import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, RouterModule, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  onLogout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/log-in']);
  }

  
  goHome(){ this.router.navigate(['/']); }
}
