import { Component,signal } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
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
  //datos del servicio en signals
  email = signal('');
  password = signal('');
  constructor(
    private logInUserService: LogInUserService, 
    private router: Router,
    private storageService: StorageService
  ) { }

  //merodos para acatualizar los valores de los signals
  updateEmail(value: string): void {
    this.email.set(value);
  }
  updatePassword(value: string): void {
    this.password.set(value);
  }
  onSubmit(): void {
    // Obtener todos los usuarios registrados
    const users = this.storageService.getAllUsers();
    
    // Buscar usuario por email y password
    const foundUser = users.find(user => 
      user.email === this.email() && 
      user.password === this.password()
    );
    
    if (foundUser) {
      // Guardar usuario como logueado en localStorage
      this.storageService.saveLoggedUser(foundUser);
      this.router.navigate(['/products']);
    } else {
      alert('email or password is incorrect; try again please');
    }
  }
}