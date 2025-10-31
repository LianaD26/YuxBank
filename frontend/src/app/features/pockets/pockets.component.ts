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

export class PocketsComponent implements OnInit {
  showPocketManager = false;
  pockets: PocketViewModel[] = [];
  
  constructor(
    private router: Router, 
    private storageService: StorageService, 
    private pocketService: PocketService
  ) {}

  ngOnInit(): void {
    this.loadPockets();
  }

  private loadPockets(): void {
    const token = localStorage.getItem('yuxbank_token');
    if (!token) {
      this.pockets = [];
      return;
    }

    this.pocketService.getPockets().subscribe({
      next: (bolsillos) => {
        this.pockets = bolsillos.map(b => ({
          id: b.id_bolsillo.toString(),
          name: b.nombre,
          description: '',
          value: Number(b.saldo),
          createdAt: new Date().toISOString(),
          fromAccount: null
        }));
      },
      error: (err) => {
        console.error('Error loading pockets:', err);
        this.pockets = [];
      }
    });
  }

  openPocketManager() {
    this.showPocketManager = true;
  }

  closePocketManager() {
    this.showPocketManager = false;
  }

  onPocketCreated(pocket: any) {
    const token = localStorage.getItem('yuxbank_token');
    if (!token) {
      alert('You must be logged in to create a pocket');
      return;
    }

    // Crear el pocket a través de la API
    this.pocketService.createPocket(
      pocket.name,
      Number(pocket.value),
      pocket.fromAccount
    ).subscribe({
      next: () => {
        this.closePocketManager();
        this.loadPockets();
        this.router.navigate(['/pockets']);
      },
      error: (err) => {
        console.error('Error creating pocket:', err);
        if (err.error?.message) {
          alert(err.error.message);
        } else {
          alert('Error creating pocket. Please try again.');
        }
      }
    });
  }

  onPocketDeleted(pocket: PocketViewModel) {
    const token = localStorage.getItem('yuxbank_token');
    if (!token) {
      alert('You must be logged in to delete a pocket');
      return;
    }

    // Eliminar el pocket a través de la API
    // El saldo se devolverá a la cuenta de origen si existe
    this.pocketService.deletePocket(
      Number(pocket.id),
      pocket.fromAccount || ''
    ).subscribe({
      next: () => {
        alert('Pocket deleted successfully. Balance returned to your account.');
        this.loadPockets();
      },
      error: (err) => {
        console.error('Error deleting pocket:', err);
        if (err.error?.message) {
          alert(err.error.message);
        } else {
          alert('Error deleting pocket. Please try again.');
        }
      }
    });
  }

}
