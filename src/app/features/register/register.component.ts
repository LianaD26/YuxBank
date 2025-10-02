import { Component,signal} from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RegisterUserService } from '../../services/register-user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterOutlet, FooterComponent, FormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name=signal('');
  last_name= signal('');
  email= signal('');
  password= signal('');
  confirm_password= signal('');

  constructor(private registerUserService: RegisterUserService, private router: Router) {}
  updateName(value: string): void {
    this.name.set(value);
  } 
  updateLastName(value: string): void {
    this.last_name.set(value);
  }

  updateEmail(value: string): void {
    this.email.set(value);
  }

  updatePassword(value: string): void {
    this.password.set(value);
  }

  updateConfirmPassword(value: string): void {
    this.confirm_password.set(value);
  }

  onSubmit(): void {
    if (this.registerUserService.emailExists(this.email())) {
      alert('El correo electrónico ya está en uso. Por favor, elige otro.');
      return;
    }
    if (!this.registerUserService.passwordsMatch(this.password(), this.confirm_password())) {
      alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
      return;
    }
    this.registerUserService.registerUser({
      name: this.name(),
      last_name: this.last_name(),
      email: this.email(),
      password: this.password(),
      confirm_password: this.confirm_password()
    });
    this.router.navigate(['/log-in']);
  }  
}
