import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  TextField,
  useTheme,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../features/store';
import { updateUser, updateUserPreferences } from '../../features/user/userSlice';
import { setThemeMode } from '../../features/theme/themeSlice';
import {
  PhotoCamera,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';

const Profile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveChanges();
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    try {
      // Validate email format
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setMessage({ type: 'error', text: 'Please enter a valid email address' });
        return;
      }

      dispatch(updateUser(formData));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        // Convert image to base64 for storage
        const reader = new FileReader();
        reader.onloadend = () => {
          dispatch(updateUser({ profilePhoto: reader.result as string }));
          setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
          setLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to update profile photo. Please try again.' });
        setLoading(false);
      }
    }
  };

  const handleRemovePhoto = () => {
    dispatch(updateUser({ profilePhoto: undefined }));
    setMessage({ type: 'success', text: 'Profile photo removed successfully!' });
  };

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    dispatch(setThemeMode(newTheme));
    dispatch(updateUserPreferences({ theme: newTheme }));
    setMessage({ type: 'success', text: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated` });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 3, transition: 'all 0.3s ease-in-out' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user?.profilePhoto}
              sx={{
                width: 120,
                height: 120,
                bgcolor: theme.palette.primary.main,
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {!user?.profilePhoto && user?.name?.charAt(0)}
            </Avatar>
            {loading && (
              <CircularProgress
                size={30}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-15px',
                  marginLeft: '-15px',
                }}
              />
            )}
          </Box>
          <Box sx={{ ml: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {user?.name}
            </Typography>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                size="small"
              >
                Change Photo
              </Button>
              {user?.profilePhoto && (
                <Tooltip title="Remove photo">
                  <IconButton
                    onClick={handleRemovePhoto}
                    disabled={loading}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              error={isEditing && !formData.name}
              helperText={isEditing && !formData.name ? 'Name is required' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              error={isEditing && (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))}
              helperText={
                isEditing && (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
                  ? 'Please enter a valid email address'
                  : ''
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              inputProps={{ maxLength: 500 }}
              helperText={`${formData.bio.length}/500 characters`}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditToggle}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Preferences
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PaletteIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          <FormControlLabel
            control={
              <Switch
                checked={currentTheme === 'dark'}
                onChange={handleThemeToggle}
                color="primary"
              />
            }
            label={`${currentTheme === 'dark' ? 'Dark' : 'Light'} Mode`}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Account Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Member Since
            </Typography>
            <Typography variant="h6">
              {new Date().toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Transactions
            </Typography>
            <Typography variant="h6">0</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Active Goals
            </Typography>
            <Typography variant="h6">0</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.type}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile; 