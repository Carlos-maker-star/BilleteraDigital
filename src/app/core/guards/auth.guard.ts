import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export class AuthGuard {
  static canActivate: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificamos si hay una sesión activa en el servicio/localStorage
    if (authService.isAuthenticated()) {
      return true;
    }

    // Si no está autenticado, lo mandamos al login
    router.navigate(['/auth']);
    return false;
  };
}
