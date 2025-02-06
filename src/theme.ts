import { createTheme } from '@mui/material/styles';

// Common components styles
const commonComponents = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 600,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '24px',
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color: '#999',
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.3,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          opacity: 1,
          transition: 'background-color 0.3s ease-in-out',
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    expense: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    income: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
  },
  components: commonComponents,
});

// Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#f48fb1',
      light: '#fce4ec',
      dark: '#f06292',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    expense: {
      main: '#ef5350',
      light: '#e57373',
      dark: '#c62828',
    },
    income: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#2e7d32',
    },
  },
  components: commonComponents,
});

// Add custom palette options
declare module '@mui/material/styles' {
  interface Palette {
    expense: Palette['primary'];
    income: Palette['primary'];
  }
  interface PaletteOptions {
    expense?: PaletteOptions['primary'];
    income?: PaletteOptions['primary'];
  }
} 