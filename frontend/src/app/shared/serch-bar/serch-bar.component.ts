import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

// Constante inmutable con el diccionario de rutas. Exportada para que pueda
// reutilizarse desde otros módulos si es necesario.
export const ROUTES_DICCCIONARY: ReadonlyArray<{ path: string; key: string; label?: string }> = [
  { path: '/settings/email', key: 'email', label: 'email' },
  { path: '/settings/password', key: 'password', label: 'password' }
];

@Component({
  selector: 'app-serch-bar',
  standalone: true,
  imports: [CommonModule, NgForOf, TitleCasePipe],
  templateUrl: './serch-bar.component.html',
  styleUrls: ['./serch-bar.component.css'],
})
export class SerchBarComponent {
  // Permitir recibir el diccionario desde el padre; usar la constante como fallback
  @Input() routes: ReadonlyArray<{ path: string; key: string; label?: string }> = ROUTES_DICCCIONARY;

  selectedOption: string | null = this.routes.length ? this.routes[0].key : null;

  constructor(private router: Router) {}

  selectOption(item: { path: string; key: string }) {
    this.selectedOption = item.key;
    // Navegación programática hacia la ruta indicada
    this.router.navigate([item.path]);
  }
}
