import { createSlice } from '@reduxjs/toolkit';
import { CategoriesState, Category } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const initialState: CategoriesState = {
  categories: [
    {
      id: uuidv4(),
      name: 'Food & Dining',
      icon: 'restaurant',
      color: '#FF5722',
    },
    {
      id: uuidv4(),
      name: 'Transportation',
      icon: 'directions_car',
      color: '#2196F3',
    },
    {
      id: uuidv4(),
      name: 'Shopping',
      icon: 'shopping_bag',
      color: '#9C27B0',
    },
    {
      id: uuidv4(),
      name: 'Bills & Utilities',
      icon: 'receipt',
      color: '#F44336',
    },
  ],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: { payload: Category }) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: { payload: { id: string; name: string } }) => {
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = {
          ...state.categories[index],
          name: action.payload.name,
        };
      }
    },
    deleteCategory: (state, action: { payload: string }) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
    },
    setCategories: (state, action: { payload: Category[] }) => {
      state.categories = action.payload;
    },
    setCategoriesStatus: (state, action: { payload: 'idle' | 'loading' | 'failed' }) => {
      state.loading = action.payload === 'loading';
    },
    setCategoriesError: (state, action: { payload: string | null }) => {
      state.error = action.payload;
    },
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  setCategories,
  setCategoriesStatus,
  setCategoriesError,
} = categoriesSlice.actions;

export default categoriesSlice.reducer; 