import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../wallet/service/wallet.service';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  balance: number;
  createdAt?: string;
}

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export default class UserComponent implements OnInit {
  // Usuario dinámico (se inicializa con valor nulo o por defecto y se llena en ngOnInit)
  user = signal<User>({
    id: '',
    name: '',
    email: '',
    password: '',
    balance: 0,
    createdAt: new Date().toISOString(),
  });

  // Controla si el formulario de cambio de contraseña está visible
  isChangingPassword = signal<boolean>(false);

  // Campos del formulario de cambio de contraseña
  currentPasswordInput = signal<string>('');
  newPasswordInput = signal<string>('');
  confirmPasswordInput = signal<string>('');

  // Mensajes de estado (éxito / error)
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Bandera de carga simulada mientras se "guarda" en el backend
  isSaving = signal<boolean>(false);

  ngOnInit(): void {
    this.loadUserData();
  }

  // Carga los datos buscando el usuario autenticado dentro de wallet_users
  private loadUserData(): void {
    // 1. Obtener la sesión activa
    const sessionData = localStorage.getItem('wallet_session');
    if (!sessionData) {
      this.errorMessage.set('No se encontró una sesión activa.');
      return;
    }

    const sessionUser: User = JSON.parse(sessionData);

    // 2. Obtener la lista completa de usuarios registrados
    const usersData = localStorage.getItem('wallet_users');
    const usersList: User[] = usersData ? JSON.parse(usersData) : [];

    // 3. Buscar la información actualizada del usuario dentro de wallet_users
    const foundUser = usersList.find((u) => u.id === sessionUser.id);

    if (foundUser) {
      this.user.set({
        ...foundUser,
        password: foundUser.password || '',
        createdAt: foundUser.createdAt || new Date().toISOString(),
      });
    } else {
      // Si por alguna razón no está en wallet_users, usar la data de la sesión
      this.user.set({
        ...sessionUser,
        password: sessionUser.password || '',
        createdAt: sessionUser.createdAt || new Date().toISOString(),
      });
    }
  }

  // --- COMPUTED: valores derivados ---

  // Iniciales del usuario para el avatar (ej. "Carlos Ramírez" -> "CR")
  userInitials = computed<string>(() => {
    const name = this.user().name || '';
    const parts = name.trim().split(' ').filter(Boolean);
    const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '');
    return initials.join('') || 'U';
  });

  // Fecha de creación formateada
  memberSince = computed<Date>(() => new Date(this.user().createdAt || Date.now()));

  // Habilita el botón de cambio de contraseña
  canChangePassword = computed<boolean>(() => {
    const current = this.currentPasswordInput();
    const next = this.newPasswordInput();
    const confirm = this.confirmPasswordInput();
    return current.length > 0 && next.length >= 6 && next === confirm && !this.isSaving();
  });

  // --- MÉTODOS ---

  openChangePassword(): void {
    this.currentPasswordInput.set('');
    this.newPasswordInput.set('');
    this.confirmPasswordInput.set('');
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isChangingPassword.set(true);
  }

  closeChangePassword(): void {
    this.isChangingPassword.set(false);
  }

  changePassword(): void {
    if (!this.canChangePassword()) {
      this.errorMessage.set(
        'Verifica que las contraseñas coincidan y tengan al menos 6 caracteres.',
      );
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    setTimeout(() => {
      // Opcional: Actualizar la contraseña en wallet_users en LocalStorage
      const usersData = localStorage.getItem('wallet_users');
      if (usersData) {
        const usersList: User[] = JSON.parse(usersData);
        const updatedUsers = usersList.map((u) =>
          u.id === this.user().id ? { ...u, password: this.newPasswordInput() } : u,
        );
        localStorage.setItem('wallet_users', JSON.stringify(updatedUsers));
      }

      this.successMessage.set('Contraseña actualizada correctamente.');
      this.isChangingPassword.set(false);
      this.isSaving.set(false);
    }, 700);
  }

  // Signal para controlar si la contraseña está visible u oculta
  showPassword = signal<boolean>(false);

  // Método para alternar el estado
  toggleShowPassword(): void {
    this.showPassword.update((visible) => !visible);
  }
}
