import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSession } from '../interfaces/auth-session.interface';
import { User } from '../../pages/users/interface/user.interface';

// Usuario de prueba
const DEFAULT_USER: User = {
  id: '1',
  name: 'Usuario Demo',
  email: 'user@demo.com',
  password: '123',
  balance: 1500,
  createdAt: new Date().toISOString(),
};

// **************************************************************************************
// Leer y validar los Usuarios registrados en el LocalStorage
const loadUsersFromLocalStorage = (): User[] => {
  const data = localStorage.getItem('wallet_users');

  // Si no hay datos, se crea el usuario de prueba
  if (!data) {
    const defaultList = [DEFAULT_USER];
    localStorage.setItem('wallet_users', JSON.stringify(defaultList));
    return defaultList;
  }

  try {
    const parsed = JSON.parse(data);

    // Validación elemento por elemento
    if (Array.isArray(parsed)) {
      const validUsers = parsed.filter(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.email === 'string' &&
          typeof item.password === 'string',
      );

      // Si la lista filtrada tiene elementos, la retornamos
      if (validUsers.length > 0) {
        localStorage.setItem('wallet_users', JSON.stringify(validUsers));
        return validUsers;
      }
    }

    // Si el arreglo estaba vacío o ningún elemento era válido, restauramos el DEFAULT_USER
    localStorage.setItem('wallet_users', JSON.stringify([DEFAULT_USER]));
    return [DEFAULT_USER];
  } catch (error) {
    console.error('El localStorage estaba corrupto. Restaurando usuario demo...', error);
    localStorage.setItem('wallet_users', JSON.stringify([DEFAULT_USER]));
    return [DEFAULT_USER];
  }
};

// **************************************************************************************
// Lee y valida la sesión activa (AuthSession) desde LocalStorage
const loadSessionFromLocalStorage = (): AuthSession | null => {
  const data = localStorage.getItem('wallet_session');
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.email === 'string' &&
      typeof parsed.token === 'string'
    ) {
      return parsed as AuthSession;
    }

    return null;
  } catch (error) {
    console.error('Error al leer user_session del LocalStorage', error);
    localStorage.removeItem('wallet_session');
    return null;
  }
};

// *****************************************************************************************************
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Inyeccion del Router
  private router = inject(Router);

  // Signals
  userSession = signal<AuthSession | null>(loadSessionFromLocalStorage());
  users = signal<User[]>(loadUsersFromLocalStorage());

  // Autenticacion de User
  isAuthenticated(): boolean {
    return this.userSession() !== null;
  }

  // Effect que reacciona a los cambios de userSession
  saveToLocalStorage = effect(() => {
    if (this.userSession()) {
      localStorage.setItem('wallet_session', JSON.stringify(this.userSession()));
    } else {
      localStorage.removeItem('wallet_session');
    }
  });

  // Effect que reacciona a los cambios de users
  saveUserToLocalStorage = effect(() => {
    localStorage.setItem('wallet_users', JSON.stringify(this.users()));
  });

  // Metodo Iniciar Sesion (Login)
  login(credentials: { email: string; password: string }): boolean | void {
    // Buscar credenciales registradas
    const userFound = this.users().find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    );

    // Mapeo
    if (userFound) {
      const sessionData: AuthSession = {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
        balance: userFound.balance,
        token: 'fake-jwt-token-' + Date.now(),
      };

      // Asignamos al user logueado
      this.userSession.set(sessionData);
      this.router.navigate(['/dashboard/users']);
      return true;
    } else {
      return false;
    }
  }

  // Metodo Registrar Usuario (Register)
  register(form: { name: string; email: string; password: string }): boolean | void {
    // Validar si el email existe
    const emailExists = this.users().some(
      (u) => u.email.toLowerCase() === form.email.toLowerCase(),
    );
    if (emailExists) return false;

    // Construimos el newUser
    const newUser: User = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    // Agregamos el newUser
    this.users.update((data) => [...data, newUser]);
    return true;
  }

  // Metodo Cerrar Sesion (Logout)
  logout() {
    this.userSession.set(null);
    this.router.navigate(['/auth']);
  }
}
