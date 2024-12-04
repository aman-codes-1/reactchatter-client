import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, ConnectionProvider, SnackbarProvider } from './contexts';
import { theme } from './style';

const AppRoutes = lazy(() =>
  import('./routes').then((module) => ({ default: module.AppRoutes })),
);

const App = () => (
  <Suspense fallback={null}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SnackbarProvider>
          <ConnectionProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ConnectionProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </Suspense>
);

export default App;
