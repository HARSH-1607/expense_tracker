import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SavingsGoal } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface SavingsState {
  goals: SavingsGoal[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: SavingsState = {
  goals: [],
  status: 'idle',
  error: null,
};

const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {
    addSavingsGoal: (state, action: PayloadAction<Omit<SavingsGoal, 'id' | 'currentAmount'>>) => {
      const newGoal: SavingsGoal = {
        ...action.payload,
        id: uuidv4(),
        currentAmount: 0,
      };
      state.goals.push(newGoal);
    },
    updateSavingsGoal: (state, action: PayloadAction<SavingsGoal>) => {
      const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    deleteSavingsGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload);
    },
    updateGoalProgress: (
      state,
      action: PayloadAction<{ goalId: string; amount: number; isAddition?: boolean }>
    ) => {
      const goal = state.goals.find((g) => g.id === action.payload.goalId);
      if (goal) {
        if (action.payload.isAddition) {
          goal.currentAmount += action.payload.amount;
        } else {
          goal.currentAmount = action.payload.amount;
        }
      }
    },
    setSavingsStatus: (state, action: PayloadAction<'idle' | 'loading' | 'failed'>) => {
      state.status = action.payload;
    },
    setSavingsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  updateGoalProgress,
  setSavingsStatus,
  setSavingsError,
} = savingsSlice.actions;

export default savingsSlice.reducer; 