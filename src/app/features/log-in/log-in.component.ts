import { Component,signal } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LogInUserService } from '../../services/log-in-user.service';

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
  constructor(private logInUserService: LogInUserService, private router: Router) { }

  //merodos para acatualizar los valores de los signals
  updateEmail(value: string): void {
    this.email.set(value);
  }
  updatePassword(value: string): void {
    this.password.set(value);
  }
  onSubmit(): void {
    //iniciar sesión
    const permiso = this.logInUserService.validateEmailAndPassword(this.email(), this.password());
    if (permiso) {
      this.router.navigate(['/products']);
    } else {
      alert('Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
  }
}