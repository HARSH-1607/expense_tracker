import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface ExpensesState {
  items: Expense[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  filters: {
    startDate: string | null;
    endDate: string | null;
    categoryId: string | null;
    minAmount: number | null;
    maxAmount: number | null;
  };
}

const initialState: ExpensesState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    categoryId: null,
    minAmount: null,
    maxAmount: null,
  },
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Omit<Expense, 'id'>>) => {
      const newExpense: Expense = {
        ...action.payload,
        id: uuidv4(),
      };
      state.items.push(newExpense);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.items.findIndex((exp) => exp.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((exp) => exp.id !== action.payload);
    },
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.items = action.payload;
    },
    setExpensesStatus: (state, action: PayloadAction<'idle' | 'loading' | 'failed'>) => {
      state.status = action.payload;
    },
    setExpensesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setExpensesFilters: (state, action: PayloadAction<Partial<ExpensesState['filters']>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearExpensesFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  addExpense,
  updateExpense,
  deleteExpense,
  setExpenses,
  setExpensesStatus,
  setExpensesError,
  setExpensesFilters,
  clearExpensesFilters,
} = expensesSlice.actions;

export default expensesSlice.reducer; 