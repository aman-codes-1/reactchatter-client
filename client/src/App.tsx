import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider, SnackbarProvider } from './contexts';
import { Theme } from './style';

const AppRoutes = lazy(() => import('./routes').then((module) => ({ default: module.AppRoutes })));

const App = () => (
  <ThemeProvider theme={Theme}>
    <BrowserRouter>
      <Suspense fallback={null}>
        <AuthProvider>
          <SnackbarProvider>
            <AppRoutes />
          </SnackbarProvider>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
