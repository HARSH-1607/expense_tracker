import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './categories/categoriesSlice';
import expensesReducer from './expenses/expensesSlice';
import savingsReducer from './savings/savingsSlice';
import themeReducer from './theme/themeSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    expenses: expensesReducer,
    savings: savingsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 