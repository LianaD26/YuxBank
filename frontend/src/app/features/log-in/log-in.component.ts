import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LogInUserService } from '../../services/log-in-user.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink, FooterComponent, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  // Signals para data binding
  email = signal('');
  password = signal('');

  constructor(
    private logInUserService: LogInUserService, 
    private router: Router,
    private storageService: StorageService
  ) {}

  // Actualizar email y password
  updateEmail(value: string): void {
    this.email.set(value);
  }

  updatePassword(value: string): void {
    this.password.set(value);
  }

  // Manejar el login
  onSubmit(): void {
    const users = this.storageService.getAllUsers();

    // Buscar usuario con email y password coincidentes
    const foundUser = users.find(user => 
      user.email === this.email().trim() && 
      user.password === this.password().trim()
    );

    if (foundUser) {
      // Guardar usuario logueado
      this.storageService.saveLoggedUser(foundUser);
      
      // Guardar token de autenticación
      localStorage.setItem('token', 'true');

      // Redirigir al área protegida
      this.router.navigate(['/products']);
    } else {
      alert('Email o contraseña incorrectos. Intenta nuevamente.');
    }
  }
}
