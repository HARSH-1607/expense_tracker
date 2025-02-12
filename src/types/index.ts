export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  description: string;
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
  targetDate: string;
  description?: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Relative to base currency
}

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

export interface SavingsState {
  goals: SavingsGoal[];
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  darkMode: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Report {
  startDate: string;
  endDate: string;
  categories: { [categoryId: string]: number };
  totalExpenses: number;
  currency: string;
} 