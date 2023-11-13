import { createTheme } from '@mui/material/styles';

export const Theme = createTheme({
  palette: {
    primary: {
      main: '#0196DA',
    },
    common: {
      black: '#000',
      white: '#fff',
    },
    error: {
      main: '#a94442',
      contrastText: '#f2dede',
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
      contrastText: '#fff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eee',
      300: '#e0e0e0',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0,0,0, 0.38)',
    },
    background: {
      default: '#F8FAFB',
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
