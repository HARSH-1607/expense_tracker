import React from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Category } from '../../types';
import * as Icons from '@mui/icons-material';

// List of available icons for categories
const availableIcons = [
  'ShoppingCart',
  'Restaurant',
  'DirectionsCar',
  'Home',
  'LocalHospital',
  'School',
  'LocalMovies',
  'FlightTakeoff',
  'Pets',
  'SportsEsports',
  'AccountBalance',
  'Receipt',
] as const;

type IconName = typeof availableIcons[number];

// List of predefined colors
const availableColors = [
  '#f44336', // Red
  '#e91e63', // Pink
  '#9c27b0', // Purple
  '#673ab7', // Deep Purple
  '#3f51b5', // Indigo
  '#2196f3', // Blue
  '#03a9f4', // Light Blue
  '#00bcd4', // Cyan
  '#009688', // Teal
  '#4caf50', // Green
  '#8bc34a', // Light Green
  '#cddc39', // Lime
  '#ffeb3b', // Yellow
  '#ffc107', // Amber
  '#ff9800', // Orange
  '#ff5722', // Deep Orange
];

interface CategoryFormProps {
  onSubmit: (category: Omit<Category, 'id'>) => void;
  initialValues?: Category;
  submitButtonText?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  initialValues,
  submitButtonText = 'Add Category',
}) => {
  const [name, setName] = React.useState(initialValues?.name || '');
  const [icon, setIcon] = React.useState<IconName>(
    (initialValues?.icon as IconName) || 'ShoppingCart'
  );
  const [color, setColor] = React.useState(initialValues?.color || '#f44336');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      icon,
      color,
    });
  };

  const handleIconChange = (event: SelectChangeEvent) => {
    setIcon(event.target.value as IconName);
  };

  const handleColorChange = (event: SelectChangeEvent) => {
    setColor(event.target.value);
  };

  // Dynamically get the icon component
  const IconComponent = Icons[icon as keyof typeof Icons];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="start" disabled>
                    {IconComponent && <IconComponent sx={{ color }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Icon</InputLabel>
            <Select value={icon} onChange={handleIconChange} label="Icon">
              {availableIcons.map((iconName) => {
                const Icon = Icons[iconName as keyof typeof Icons];
                return (
                  <MenuItem key={iconName} value={iconName}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon />
                      {iconName}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Color</InputLabel>
            <Select value={color} onChange={handleColorChange} label="Color">
              {availableColors.map((colorValue) => (
                <MenuItem key={colorValue} value={colorValue}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: colorValue,
                      }}
                    />
                    {colorValue}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            {submitButtonText}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}; 