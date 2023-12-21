import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ConnectionTester } from './components';
import { AuthProvider, SnackbarProvider } from './contexts';
import { Theme } from './style';

const AppRoutes = lazy(() => import('./routes').then((module) => ({ default: module.AppRoutes })));

const App = () => (
  <ThemeProvider theme={Theme}>
    <BrowserRouter>
      <ConnectionTester>
        <Suspense fallback={null}>
          <SnackbarProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </SnackbarProvider>
        </Suspense>
      </ConnectionTester>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
