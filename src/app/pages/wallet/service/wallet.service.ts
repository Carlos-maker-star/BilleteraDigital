import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../../users/interface/user.interface';
import { Transaction } from '../interface/wallet.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private authService = inject(AuthService);
  private readonly TRANSACTIONS_KEY = 'wallet_transactions';

  // Usamos la sesión activa del AuthService directamente
  currentUser = computed(() => this.authService.userSession());

  users = signal<User[]>([]);

  // Transacciones globales guardadas
  private allTransactions = signal<Transaction[]>([]);

  // COMPUTED: Filtra y retorna ÚNICAMENTE las transacciones del usuario logueado
  userTransactions = computed<Transaction[]>(() => {
    const user = this.currentUser();
    if (!user) return [];
    return this.allTransactions().filter((tx) => tx.userId === user.id);
  });

  constructor() {
    this.loadInitialData();
  }

  deposit(amount: number, description: string): boolean {
    const user = this.currentUser();
    if (!user || amount <= 0) return false;

    const newBalance = user.balance + amount;
    this.updateUserBalance(user.id, newBalance);
    this.addTransaction(user.id, 'DEPOSIT', amount, description);
    return true;
  }

  withdraw(amount: number, description: string = 'Retiro de fondos'): boolean {
    const user = this.currentUser();
    if (!user || amount <= 0 || user.balance < amount) return false;

    const newBalance = user.balance - amount;
    this.updateUserBalance(user.id, newBalance);
    this.addTransaction(user.id, 'WITHDRAWAL', amount, description);
    return true;
  }

  private updateUserBalance(userId: string, newBalance: number) {
    const currentSesion = this.authService.userSession();
    if (!currentSesion) return;

    // 1. Actualizar objeto de sesión activa en AuthService
    const updatedSession = { ...currentSesion, balance: newBalance };
    this.authService.userSession.set(updatedSession);

    // 2. Actualizar lista de usuarios en AuthService y LocalStorage
    this.authService.users.update((users) =>
      users.map((u) => (u.id === userId ? { ...u, balance: newBalance } : u)),
    );
  }

  private addTransaction(
    userId: string,
    type: 'DEPOSIT' | 'WITHDRAWAL',
    amount: number,
    description: string,
  ) {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      userId,
      type,
      amount,
      date: new Date(),
      description,
    };

    const updatedList = [newTx, ...this.allTransactions()];
    this.allTransactions.set(updatedList);
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(updatedList));
  }

  private loadInitialData() {
    const txList = localStorage.getItem(this.TRANSACTIONS_KEY);
    if (txList) {
      try {
        this.allTransactions.set(JSON.parse(txList));
      } catch (e) {
        console.error('Error al parsear wallet_transactions', e);
      }
    }
  }
}
