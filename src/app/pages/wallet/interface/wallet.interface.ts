export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL'; // Depósito o Retiro
  amount: number;
  date: Date;
  description: string;
}
