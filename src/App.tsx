import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
  AuthProvider,
  ConnectionProvider,
  SnackbarProvider,
  WebSocketProvider,
} from './contexts';
import { Theme } from './style';

const AppRoutes = lazy(() =>
  import('./routes').then((module) => ({ default: module.AppRoutes })),
);

const App = () => (
  <ThemeProvider theme={Theme}>
    <BrowserRouter>
      <ConnectionProvider>
        <Suspense fallback={null}>
          <SnackbarProvider>
            <AuthProvider>
              <WebSocketProvider>
                <AppRoutes />
              </WebSocketProvider>
            </AuthProvider>
          </SnackbarProvider>
        </Suspense>
      </ConnectionProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
