import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token'); // o 'user', según cómo se guarde el login

  if (token) {
    return true; // Permite acceso
  } else {
    router.navigate(['/log-in']); // Redirige si no está autenticado
    return false;
  }
};
