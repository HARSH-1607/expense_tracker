import { createTheme, ThemeOptions } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';

// Common components styles
const commonComponents: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: 'background-color 0.2s ease',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        transition: 'background-color 0.2s ease',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
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
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
      },
      switchBase: {
        padding: 1,
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: '#fff',
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 13,
        border: '1px solid #e0e0e0',
        opacity: 1,
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
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
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
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
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