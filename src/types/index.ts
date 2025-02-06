export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  notes?: string;
  currency: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profilePhoto?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    defaultCurrency: string;
    notifications: {
      billReminders: boolean;
      budgetAlerts: boolean;
      goalProgress: boolean;
    };
  };
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  currency: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Relative to base currency
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Report {
  startDate: string;
  endDate: string;
  categories: { [categoryId: string]: number };
  totalExpenses: number;
  currency: string;
} 