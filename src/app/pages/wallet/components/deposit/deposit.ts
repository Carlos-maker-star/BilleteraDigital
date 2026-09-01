import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deposit-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit.html',
  styleUrls: ['./deposit.css'],
})
export class DepositFormComponent {
  isProcessing = input<boolean>(false);
  onSubmitDeposit = output<number>();

  amountInput = signal<number | null>(null);

  onAmountChange(value: number | null) {
    this.amountInput.set(value);
  }

  setQuickAmount(amount: number) {
    this.amountInput.set(amount);
  }

  isSubmitDisabled(): boolean {
    const val = this.amountInput();
    return this.isProcessing() || val === null || val <= 0;
  }

  submitDeposit() {
    const val = this.amountInput();
    if (val && val > 0) {
      this.onSubmitDeposit.emit(val);
      this.amountInput.set(null);
    }
  }
}
