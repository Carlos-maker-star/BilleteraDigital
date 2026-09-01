import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-withdraw-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './withdraw.html',
  styleUrls: ['./withdraw.css'],
})
export class WithdrawFormComponent {
  balance = input.required<number>();
  isProcessing = input<boolean>(false);
  onSubmitWithdrawal = output<number>();

  amountInput = signal<number | null>(null);

  onAmountChange(value: number | null) {
    this.amountInput.set(value);
  }

  setQuickAmount(amount: number) {
    this.amountInput.set(amount);
  }

  isSubmitDisabled(): boolean {
    const val = this.amountInput();
    return this.isProcessing() || val === null || val <= 0 || val > this.balance();
  }

  submitWithdrawal() {
    const val = this.amountInput();
    if (val && val > 0 && val <= this.balance()) {
      this.onSubmitWithdrawal.emit(val);
      this.amountInput.set(null);
    }
  }
}
