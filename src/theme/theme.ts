import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    expense: {
      main: string;
      light: string;
      dark: string;
    };
    income: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    expense?: {
      main: string;
      light: string;
      dark: string;
    };
    income?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}

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
        textTransform: 'none',
        borderRadius: 8,
        transition: 'all 0.3s ease-in-out',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        padding: 8,
      },
      track: {
        borderRadius: 22 / 2,
        '&:before, &:after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 16,
        },
      },
      thumb: {
        width: 20,
        height: 20,
        '&:before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
    },
    expense: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
    income: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#087f23',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: commonComponents,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#c3fdff',
      dark: '#5d99c6',
    },
    secondary: {
      main: '#f48fb1',
      light: '#ffc1e3',
      dark: '#bf5f82',
    },
    expense: {
      main: '#ef5350',
      light: '#ff867c',
      dark: '#b61827',
    },
    income: {
      main: '#66bb6a',
      light: '#98ee99',
      dark: '#338a3e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)',
    },
  },
  typography: lightTheme.typography,
  components: {
    ...commonComponents,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        },
      },
    },
  },
}); 