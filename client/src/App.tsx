import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Loader } from './components';
import { AuthProvider, SnackbarProvider } from './contexts';
import { Theme } from './style';

const AppRoutes = lazy(() => import('./routes').then((module) => ({ default: module.AppRoutes })));

const App = () => (
  <ThemeProvider theme={Theme}>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loader center />}>
          <SnackbarProvider>
            <AppRoutes />
          </SnackbarProvider>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
