import { Component, computed, inject, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthValidators } from '../../../core/utils/auth-validators';

@Component({
  selector: 'login-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['../../auth.css'],
})
export class LoginComponent {
  // Inyeccion del AuthService
  private authService = inject(AuthService);

  // Signal de los inputs del Formulario
  email = signal<string>('');
  password = signal<string>('');

  // Iniciar Sesion - Users Registrados
  onLoginSubmit() {
    // Alerta modal de carga
    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Validando tus credenciales',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    // Tiempo de carga 1.2 segundos
    setTimeout(() => {
      const success = this.authService.login({
        email: this.email(),
        password: this.password(),
      });

      if (success) {
        Swal.close();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Correo o contraseña incorrectos',
          confirmButtonColor: '#6366f1',
        });
      }
    }, 1200);
  }

  // Iniciar Sesion - Usuario demo
  onLoginDemo() {
    this.email.set('user@demo.com');
    this.password.set('123');

    // Alerta modal de carga
    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Validando tus credenciales',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    // Tiempo de carga 1.2 segundos
    setTimeout(() => {
      const success = this.authService.login({
        email: this.email(),
        password: this.password(),
      });

      if (success) {
        Swal.close();
      }
    }, 1200);
  }

  // Control visual del password
  showLoginPassword = signal<boolean>(false);
  togglePassword() {
    this.showLoginPassword.update((show) => !show);
  }

  // Validaciones individuales
  isEmailValid = computed(() => AuthValidators.isValidEmail(this.email()));
  isPasswordValid = computed(() => this.password().trim().length > 0);

  // El formulario es válido solo si ambos campos cumplen la condición
  isFormValid = computed(() => this.isEmailValid() && this.isPasswordValid());
}
