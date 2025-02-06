import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface CategoriesState {
  items: Category[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: CategoriesState = {
  items: [
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
  status: 'idle',
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, 'id'>>) => {
      const newCategory: Category = {
        ...action.payload,
        id: uuidv4(),
      };
      state.items.push(newCategory);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex((cat) => cat.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((cat) => cat.id !== action.payload);
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
    },
    setCategoriesStatus: (state, action: PayloadAction<'idle' | 'loading' | 'failed'>) => {
      state.status = action.payload;
    },
    setCategoriesError: (state, action: PayloadAction<string | null>) => {
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