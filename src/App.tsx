import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
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
    <CssBaseline />
    <BrowserRouter>
      <Suspense fallback={null}>
        <SnackbarProvider>
          <ConnectionProvider>
            <AuthProvider>
              <WebSocketProvider>
                <AppRoutes />
              </WebSocketProvider>
            </AuthProvider>
          </ConnectionProvider>
        </SnackbarProvider>
      </Suspense>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
