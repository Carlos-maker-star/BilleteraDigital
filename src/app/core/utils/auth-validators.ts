export class AuthValidators {
  // Valida formato de correo básico
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  // Valida longitud mínima de 8 caracteres
  static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }
}
