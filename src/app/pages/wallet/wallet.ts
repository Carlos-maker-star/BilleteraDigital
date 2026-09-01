import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from './service/wallet.service';
import { DepositFormComponent } from './components/deposit/deposit';
import { WithdrawFormComponent } from './components/withdraw/withdraw';

type TransactionType = 'deposit' | 'withdraw';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, DepositFormComponent, WithdrawFormComponent],
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.css'],
})
export default class WalletComponent {
  walletService = inject(WalletService);

  // --- SIGNALS CONECTADOS AL SERVICIO ---
  balance = computed(() => this.walletService.currentUser()?.balance ?? 0);

  // Asignación directa del computed ya filtrado por userId
  transactions = this.walletService.userTransactions;

  // --- SIGNALS DE ESTADO LOCAL ---
  activeTab = signal<TransactionType>('deposit');
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  isProcessing = signal<boolean>(false);

  selectTab(tab: TransactionType): void {
    this.activeTab.set(tab);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  handleDeposit(amount: number): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isProcessing.set(true);

    setTimeout(() => {
      const success = this.walletService.deposit(amount, 'Depósito de fondos');

      if (success) {
        this.successMessage.set('Depósito realizado con éxito.');
      } else {
        this.errorMessage.set('Ocurrió un error al procesar el depósito.');
      }

      this.isProcessing.set(false);
    }, 800);
  }

  handleWithdrawal(amount: number): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isProcessing.set(true);

    setTimeout(() => {
      const success = this.walletService.withdraw(amount, 'Retiro de fondos');

      if (success) {
        this.successMessage.set('Retiro realizado con éxito.');
      } else {
        this.errorMessage.set('Ocurrió un error al procesar el retiro.');
      }

      this.isProcessing.set(false);
    }, 800);
  }
}
