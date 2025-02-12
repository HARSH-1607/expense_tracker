import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '../../types';

interface ExpensesFilters {
  searchTerm: string;
  category: string | null;
  startDate: string | null;
  endDate: string | null;
  minAmount: number | null;
  maxAmount: number | null;
}

interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  filters: ExpensesFilters;
}

const initialState: ExpensesState = {
  expenses: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    category: null,
    startDate: null,
    endDate: null,
    minAmount: null,
    maxAmount: null,
  },
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex((expense) => expense.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
    },
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
    },
    setExpensesFilters: (state, action: PayloadAction<Partial<ExpensesFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearExpensesFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addExpense,
  updateExpense,
  deleteExpense,
  setExpenses,
  setExpensesFilters,
  clearExpensesFilters,
  setLoading,
  setError,
} = expensesSlice.actions;

export default expensesSlice.reducer; 