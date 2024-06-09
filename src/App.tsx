import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
  AuthProvider,
  ConnectionProvider,
  SnackbarProvider,
  WebSocketProvider,
} from './contexts';
import { theme } from './style';

const AppRoutes = lazy(() =>
  import('./routes').then((module) => ({ default: module.AppRoutes })),
);

const App = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <SnackbarProvider>
        <ConnectionProvider>
          <AuthProvider>
            <WebSocketProvider>
              <Suspense fallback={null}>
                <AppRoutes />
              </Suspense>
            </WebSocketProvider>
          </AuthProvider>
        </ConnectionProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
