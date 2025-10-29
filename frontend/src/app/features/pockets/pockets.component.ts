import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PocketManagerComponent } from '../../shared/pocket-manager/pocket-manager.component';
import { StorageService } from '../../services/storage.service';
import { PocketService } from '../../services/pocket.service';
import { PocketViewComponent, PocketViewModel } from '../../shared/pocket-view/pocket-view.component';

@Component({
  selector: 'app-pockets',
  standalone: true,
  imports: [CommonModule, PocketManagerComponent, PocketViewComponent],
  templateUrl: './pockets.component.html',
  styleUrls: ['./pockets.component.css']
})

export class PocketsComponent {
  showPocketManager = false;
  pockets: PocketViewModel[] = [];
  constructor(private router: Router, private storageService: StorageService, private pocketService: PocketService) {}

  ngOnInit(): void {
    this.loadPockets();
  }

  private loadPockets(): void {
    const logged = this.storageService.getLoggedUser();
    if (!logged) {
      this.pockets = [];
      return;
    }
    this.pockets = this.pocketService.getPocketsForUser(logged.email);
  }

  openPocketManager() {
    this.showPocketManager = true;
  }

  closePocketManager() {
    this.showPocketManager = false;
  }

  onPocketCreated(pocket: any) {
    // Cerrar modal y navegar a la lista de pockets
    this.closePocketManager();
    // Guardar pocket en localStorage usando StorageService
    const logged = this.storageService.getLoggedUser();
    if (logged) {
      const newPocket = {
        id: Date.now().toString(),
        name: pocket.name,
        description: pocket.description || '',
        value: Number(pocket.value),
        createdAt: new Date().toISOString(),
        fromAccount: pocket.fromAccount || null
      };
      this.pocketService.addPocket(logged.email, newPocket);
      // refresh local list so UI updates
      this.loadPockets();
    }

    // navegar a /pockets — si ya estás en la misma ruta esto forzará una navegación
    this.router.navigate(['/pockets']);
  }

}
