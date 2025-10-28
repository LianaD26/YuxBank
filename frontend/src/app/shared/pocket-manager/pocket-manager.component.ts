import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-pocket-manager',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pocket-manager.component.html',
  styleUrls: ['./pocket-manager.component.css']
})
export class PocketManagerComponent {
  @Output() created = new EventEmitter<any>();
  name = '';
  description = '';
  value: number | null = null;
  createPocket(form: NgForm) {
    if (!form || form.invalid) return;

    const data = form.value;

    this.created.emit(data);

    form.resetForm();
  }
}