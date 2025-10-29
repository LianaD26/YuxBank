import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

// No se necesita Router porque ya no haremos navegación por rutas
@Component({
  selector: 'app-serch-bar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './serch-bar.component.html',
  styleUrls: ['./serch-bar.component.css'],
})
export class SerchBarComponent {
  // Recibe las opciones desde el padre
  @Input() routes: ReadonlyArray<{ key: string; label?: string }> = [];

  // Emite la opción seleccionada al componente padre
  @Output() optionSelected = new EventEmitter<string>();
  
  // Guarda la opción activa (para resaltar visualmente)
  selectedOption: string | null = this.routes.length ? this.routes[0].key : null;

  // Selecciona una opción del sidebar
  selectOption(item: { key: string }) {
    this.selectedOption = item.key;
    this.optionSelected.emit(item.key); // Notifica al padre la opción elegida
  }
}