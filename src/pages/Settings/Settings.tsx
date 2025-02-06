import React from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../features/store';
import {
  updateUserPreferences,
  updateNotificationPreferences,
} from '../../features/user/userSlice';
import { setThemeMode } from '../../features/theme/themeSlice';
import { ThemeMode } from '../../types';

const Settings = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const handleThemeChange = (event: SelectChangeEvent) => {
    const newTheme = event.target.value as ThemeMode;
    dispatch(updateUserPreferences({ theme: newTheme }));
    dispatch(setThemeMode(newTheme));
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    dispatch(updateUserPreferences({ defaultCurrency: event.target.value }));
  };

  const handleNotificationChange = (setting: keyof typeof user.preferences.notifications) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateNotificationPreferences({
          [setting]: event.target.checked,
        })
      );
    };
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Appearance
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Theme</InputLabel>
          <Select
            value={user?.preferences.theme || 'system'}
            onChange={handleThemeChange}
            label="Theme"
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="system">System</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Default Currency</InputLabel>
          <Select
            value={user?.preferences.defaultCurrency || 'USD'}
            onChange={handleCurrencyChange}
            label="Default Currency"
          >
            <MenuItem value="USD">USD ($)</MenuItem>
            <MenuItem value="EUR">EUR (€)</MenuItem>
            <MenuItem value="GBP">GBP (£)</MenuItem>
            <MenuItem value="INR">INR (₹)</MenuItem>
            <MenuItem value="JPY">JPY (¥)</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Notifications
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={user?.preferences.notifications.billReminders}
                  onChange={handleNotificationChange('billReminders')}
                />
              }
              label="Bill Reminders"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={user?.preferences.notifications.budgetAlerts}
                  onChange={handleNotificationChange('budgetAlerts')}
                />
              }
              label="Budget Alerts"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={user?.preferences.notifications.goalProgress}
                  onChange={handleNotificationChange('goalProgress')}
                />
              }
              label="Goal Progress Updates"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Settings; 