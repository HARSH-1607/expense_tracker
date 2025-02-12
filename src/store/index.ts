import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesSlice';
import expensesReducer from '../features/expenses/expensesSlice';
import savingsReducer from '../features/savings/savingsSlice';
import themeReducer from '../features/theme/themeSlice';
import userReducer from '../features/user/userSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    expenses: expensesReducer,
    savings: savingsReducer,
    theme: themeReducer,
    user: userReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 