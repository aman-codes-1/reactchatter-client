import { createTheme } from '@mui/material/styles';

export const Theme = createTheme({
  palette: {
    primary: {
      main: '#0196DA',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    error: {
      main: '#a94442',
      contrastText: '#f2dede',
      light: '#FEE2E2',
      dark: '#DC2626',
      900: '#bd2020',
    },
    warning: {
      main: '#F17602',
      contrastText: '#fff',
    },
    info: {
      main: '#0288d1',
      contrastText: '#fff',
    },
    success: {
      main: '#57AF47',
      contrastText: '#f5fff5',
      light: '#CCE8CD',
      dark: '#388e3c',
      900: '#2b702e',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eee',
      300: '#e0e0e0',
      400: '#C8C8C8',
      500: '#8E949D',
      600: '#9B9BA3',
      // 9CA3AF
      800: '#71717A',
      900: '#374151',
    },
    text: {
      primary: '#111827',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0,0,0, 0.38)',
    },
    background: {
      default: '#F8FAFB',
    },
    action: {
      active: '#0F172B',
      hover: '#1E293B',
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Roboto, Arial',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1200,
      lg: 1366,
      xl: 1536,
    },
  },
});
