import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyLetters]',
  standalone: true,
})
export class OnlyLettersDirective {
  // Escucha el evento 'keydown' antes de que el texto se escriba
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Teclas permitidas para permitir edición
    const allowedKeys = ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Space', ' '];

    if (allowedKeys.includes(event.key)) {
      return; // Permite la acción
    }

    // Bloquea cualquier tecla que sea un número (0-9)
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Previene que se pegue texto con números vía Ctrl+V
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData?.getData('text');
    if (clipboardData && /\d/.test(clipboardData)) {
      event.preventDefault(); // Si la cadena pegada contiene números, cancela la acción
    }
  }
}
