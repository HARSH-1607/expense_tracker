import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  billReminders: boolean;
}

interface SettingsState {
  currency: string;
  language: string;
  notifications: NotificationSettings;
  backupEmail?: string;
}

const initialState: SettingsState = {
  currency: 'USD',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    billReminders: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
    updateNotifications: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    resetSettings: () => initialState,
  },
});

export const { updateSettings, updateNotifications, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer; 