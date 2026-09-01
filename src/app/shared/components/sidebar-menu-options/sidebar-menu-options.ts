import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { MENU_OPTIONS, MenuOption } from '../../../core/constants/menu-data';

@Component({
  selector: 'sidebar-menu-options',
  templateUrl: 'sidebar-menu-options.html',
  styleUrls: ['./sidebar-menu-options.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class SidebarMenuOptionsComponent {
  // Inyectar authService
  authService = inject(AuthService);

  // Menu de Opciones
  menuOptions = signal<MenuOption[]>(MENU_OPTIONS);

  // Metodo cerrar sesion (logout)
  logout() {
    // Alerta Interrogatoria
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que ingresar tus credenciales nuevamente para acceder.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }
}
