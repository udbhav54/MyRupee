import { create } from "zustand";

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  tag: string;
  userId: string;
  createdAt: string;
}

interface TransactionState {
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  calculateBalances: (transactions: Transaction[]) => void;
  resetBalances: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  totalIncome: 0,
  totalExpenses: 0,
  currentBalance: 0,

  setTransactions: (transactions) => {
    set({ transactions });
    get().calculateBalances(transactions);
  },

  addTransaction: (transaction) => {
    const transactions = [...get().transactions, transaction];
    set({ transactions });
    get().calculateBalances(transactions);
  },

  calculateBalances: (transactions) => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    });

    set({
      totalIncome: income,
      totalExpenses: expenses,
      currentBalance: income - expenses,
    });
  },

  resetBalances: () => {
    console.log("Resetting balance...");
    // Note: This logs as per original functionality
    // Actual reset would require deleting transactions from Firestore
  },
}));
