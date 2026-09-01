import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthValidators } from '../../../core/utils/auth-validators';
import { OnlyLettersDirective } from '../../../core/directives/only-letters.directive';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'register-panel',
  standalone: true,
  imports: [FormsModule, OnlyLettersDirective],
  templateUrl: 'register.html',
  styleUrls: ['../../auth.css'],
})
export class RegisterComponent {
  // Inyeccion del AuthService
  private authService = inject(AuthService);

  // Inyeccion del Router
  private router = inject(Router);

  // Signal de los inputs del Formulario
  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');

  // Registro de User
  onRegisterSubmit() {
    // Validar campos
    if (!this.isFormValid()) return;

    Swal.fire({
      title: 'Creando cuenta...',
      text: 'Guardando tus datos',
      allowOutsideClick: false,
      background: '#000102',
      color: '#ffffff',
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    const success = this.authService.register({
      name: this.name(),
      email: this.email(),
      password: this.password(),
    });

    setTimeout(() => {
      Swal.close();

      if (success) {
        Swal.fire({
          icon: 'success',
          title: '¡Cuenta creada!',
          text: 'Tu usuario ha sido registrado correctamente.',
          background: '#000102',
          color: '#ffffff',
          confirmButtonColor: '#4f46e5',
        }).then(() => {
          this.router.navigate(['/auth']);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'El correo electrónico ya se encuentra registrado.',
          background: '#000102',
          color: '#ffffff',
          confirmButtonColor: '#4f46e5',
        });
      }
    }, 1200);
  }

  // Control visual del password
  showRegPassword = signal<boolean>(false);
  togglePassword() {
    this.showRegPassword.update((show) => !show);
  }

  // Evaluaciones individuales
  isNameValid = computed(() => this.name().trim().length > 0);
  isEmailValid = computed(() => AuthValidators.isValidEmail(this.email()));
  isPasswordValid = computed(() => AuthValidators.isValidPassword(this.password()));

  // Estado global del formulario (habilita o inhabilita el botón)
  isFormValid = computed(() => this.isEmailValid() && this.isPasswordValid() && this.isNameValid());

  // Calcula el porcentaje de la barra (0%, 50% o 100%)
  strengthPercent = computed(() => {
    const len = this.password().length;
    if (len === 0) return 0;
    if (len < 8) return 50; // Incompleto (Debil/Progreso)
    return 100; // Válido (Segura)
  });
}
