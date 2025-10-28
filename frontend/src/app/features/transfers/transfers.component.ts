import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SerchBarComponent } from '../../shared/serch-bar/serch-bar.component';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [RouterOutlet, SerchBarComponent],
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent {
  selectedPage: 'transfer' | 'history' = 'transfer';

  // Rutas que se pasarán al sidebar (puedes modificarlas o moverlas a un servicio)
  sidebarRoutes = [
    { path: '/transfers/transfer', key: 'transfer', label: 'Make transfer' },
    { path: '/transfers/history', key: 'history', label: 'Transaction history' }
  ];

  constructor(private router: Router) {}

  selectPage(page: 'transfer' | 'history') {
    this.router.navigate(['/transfers', page], { replaceUrl: true }).then(() => {
      this.selectedPage = page;
    });
  }
}
