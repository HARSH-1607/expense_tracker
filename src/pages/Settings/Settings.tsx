import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { RootState } from '../../store';
import { toggleTheme } from '../../features/theme/themeSlice';
import { updateSettings, updateNotifications } from '../../features/settings/settingsSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.darkMode);
  const settings = useSelector((state: RootState) => state.settings);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [backupEmail, setBackupEmail] = useState('');

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    dispatch(updateSettings({ currency: event.target.value }));
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    dispatch(updateSettings({ language: event.target.value }));
  };

  const handleNotificationChange = (type: keyof typeof settings.notifications) => {
    dispatch(updateNotifications({
      [type]: !settings.notifications[type],
    }));
  };

  const handleBackupDialogOpen = () => {
    setIsBackupDialogOpen(true);
  };

  const handleBackupDialogClose = () => {
    setIsBackupDialogOpen(false);
  };

  const handleBackupRequest = () => {
    // Here you would typically make an API call to request the backup
    dispatch(updateSettings({ backupEmail }));
    setIsBackupDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <List>
        <ListItem>
          <ListItemText
            primary="Dark Mode"
            secondary="Toggle between light and dark theme"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={isDarkMode}
              onChange={handleThemeToggle}
            />
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Currency"
            secondary="Select your preferred currency"
          />
          <ListItemSecondaryAction>
            <Select
              value={settings.currency}
              onChange={handleCurrencyChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
              <MenuItem value="JPY">JPY (¥)</MenuItem>
            </Select>
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Language"
            secondary="Select your preferred language"
          />
          <ListItemSecondaryAction>
            <Select
              value={settings.language}
              onChange={handleLanguageChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
            </Select>
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Email Notifications"
            secondary="Receive updates via email"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={settings.notifications.email}
              onChange={() => handleNotificationChange('email')}
            />
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Push Notifications"
            secondary="Receive push notifications"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={settings.notifications.push}
              onChange={() => handleNotificationChange('push')}
            />
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Bill Reminders"
            secondary="Get reminders for upcoming bills"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={settings.notifications.billReminders}
              onChange={() => handleNotificationChange('billReminders')}
            />
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Data Backup"
            secondary="Request a backup of your data"
          />
          <ListItemSecondaryAction>
            <Button
              variant="outlined"
              size="small"
              onClick={handleBackupDialogOpen}
            >
              Request Backup
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <Dialog open={isBackupDialogOpen} onClose={handleBackupDialogClose}>
        <DialogTitle>Request Data Backup</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter your email address to receive a backup of your data.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={backupEmail}
            onChange={(e) => setBackupEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBackupDialogClose}>Cancel</Button>
          <Button onClick={handleBackupRequest} variant="contained">
            Request Backup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 