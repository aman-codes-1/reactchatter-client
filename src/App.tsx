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

console.log('PORT', process.env.PORT);
console.log('NODE_ENV', process.env.NODE_ENV);
console.log('REACT_APP_PROXY_URI', process.env.REACT_APP_PROXY_URI);
console.log(
  'REACT_APP_GOOGLE_CLIENT_ID',
  process.env.REACT_APP_GOOGLE_CLIENT_ID,
);
console.log('REACT_APP_PROXY_DOMAIN', process.env.REACT_APP_PROXY_DOMAIN);
console.log('REACT_APP_SERVER_URI', process.env.REACT_APP_SERVER_URI);

const App = () => (
  <Suspense fallback={null}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SnackbarProvider>
          <ConnectionProvider>
            <AuthProvider>
              <WebSocketProvider>
                <AppRoutes />
              </WebSocketProvider>
            </AuthProvider>
          </ConnectionProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </Suspense>
);

export default App;
