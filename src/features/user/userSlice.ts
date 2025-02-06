import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultCurrency: string;
  notifications: {
    billReminders: boolean;
    budgetAlerts: boolean;
    goalProgress: boolean;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profilePhoto?: string;
  preferences: UserPreferences;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.currentUser) {
        state.currentUser.preferences = {
          ...state.currentUser.preferences,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  updateUser,
  setLoading,
  setError,
  logout,
  updateUserPreferences,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.isAuthenticated;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserPreferences = (state: { user: UserState }) =>
  state.user.currentUser?.preferences; 