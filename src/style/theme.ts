import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0196DA',
      light: '#ECF7FC',
      dark: 'rgba(1, 150, 218, 0.28)',
    },
    secondary: {
      main: '#4F46E5',
    },
    info: {
      main: '#0288d1',
      contrastText: '#fff',
    },
    warning: {
      main: '#F17602',
      contrastText: '#fff',
    },
    success: {
      main: '#57AF47',
      contrastText: '#f5fff5',
      light: '#CCE8CD',
      dark: '#388e3c',
      900: '#2b702e',
    },
    error: {
      main: '#a94442',
      contrastText: '#f2dede',
      light: '#FEE2E2',
      dark: '#DC2626',
      900: '#bd2020',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    grey: {
      50: '#F9FAFB',
      100: '#f5f5f5',
      200: '#e8eaf6',
      300: '#e0e0e0',
      400: '#C8C8C8',
      500: '#667781',
      600: '#9B9BA3',
      // 9CA3AF
      700: 'rgba(255, 255, 255, 0.4)',
      800: '#71717A',
      900: '#111B21',
    },
    text: {
      primary: '#111827',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0,0,0, 0.38)',
    },
    background: {
      default: '#FFFFFF',
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
    allVariants: { letterSpacing: '0.02rem' },
    fontSize: 14,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
  },
  breakpoints: {
    values: {
      xs: 390,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
