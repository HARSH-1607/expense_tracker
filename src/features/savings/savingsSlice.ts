import { createSlice } from '@reduxjs/toolkit';
import { SavingsState, SavingsGoal } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const initialState: SavingsState = {
  goals: [],
  loading: false,
  error: null,
};

const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {
    addGoal: (state, action: { payload: SavingsGoal }) => {
      state.goals.push(action.payload);
    },
    updateGoal: (state, action: { payload: SavingsGoal }) => {
      const index = state.goals.findIndex(
        (goal) => goal.id === action.payload.id
      );
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    deleteGoal: (state, action: { payload: string }) => {
      state.goals = state.goals.filter(
        (goal) => goal.id !== action.payload
      );
    },
    updateGoalProgress: (state, action: { payload: { id: string; amount: number } }) => {
      const index = state.goals.findIndex(
        (goal) => goal.id === action.payload.id
      );
      if (index !== -1) {
        state.goals[index].currentAmount = action.payload.amount;
      }
    },
    addSavingsGoal: (state, action: { payload: Omit<SavingsGoal, 'id' | 'currentAmount'> }) => {
      const newGoal: SavingsGoal = {
        ...action.payload,
        id: uuidv4(),
        currentAmount: 0,
      };
      state.goals.push(newGoal);
    },
    setSavingsStatus: (state, action: { payload: 'idle' | 'loading' | 'failed' }) => {
      state.loading = action.payload === 'loading';
    },
    setSavingsError: (state, action: { payload: string | null }) => {
      state.error = action.payload;
    },
  },
});

export const { addGoal, updateGoal, deleteGoal, updateGoalProgress, addSavingsGoal, setSavingsStatus, setSavingsError } = savingsSlice.actions;
export default savingsSlice.reducer; 