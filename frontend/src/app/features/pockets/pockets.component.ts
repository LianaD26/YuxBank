import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PocketManagerComponent } from '../../shared/pocket-manager/pocket-manager.component';

@Component({
  selector: 'app-pockets',
  standalone: true,
  imports: [CommonModule, PocketManagerComponent],
  templateUrl: './pockets.component.html',
  styleUrls: ['./pockets.component.css']
})

export class PocketsComponent {
  showPocketManager = false;
  constructor(private router: Router) {}

  openPocketManager() {
    this.showPocketManager = true;
  }

  closePocketManager() {
    this.showPocketManager = false;
  }

  onPocketCreated(pocket: any) {
    // Cerrar modal y navegar a la lista de pockets
    this.closePocketManager();
    // navegar a /pockets — si ya estás en la misma ruta esto forzará una navegación
    this.router.navigate(['/pockets']);
  }

}
