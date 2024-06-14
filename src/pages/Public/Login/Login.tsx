import { useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { CircularProgress, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LoginStyled } from './Login.styled';
import { useAuth, useSnackbar } from '../../../hooks';
import { BaseSvg } from '../../../components';

const Login = () => {
  const location = useLocation();
  const from: string =
    (location?.state?.from?.pathname === '/login'
      ? '/'
      : location?.state?.from?.pathname) || '/';
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const { openSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    const googleLogin = async () => {
      setIsLoading(true);
      const decoded = jwtDecode(token || '');
      localStorage.setItem('isAuthenticated', 'true');
      setAuth({
        isLoggedIn: true,
        ...decoded,
      });
      navigate('/', { replace: true });
      setIsLoading(false);
    };
    if (token) {
      googleLogin();
    }
  }, [token, navigate]);

  const serverUri =
    process.env.NODE_ENV === 'development'
      ? `http://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}`
      : `${process.env.REACT_APP_URI}`;

  const handleLogin = async () => {
    try {
      window.open(
        `${serverUri}/api/auth/google/login/${from.replaceAll('/', '@')}`,
        '_self',
      );
    } catch (err) {
      openSnackbar({
        message: JSON.stringify(err || ''),
        type: 'error',
      });
    }
  };

  return (
    <LoginStyled>
      <Typography
        component="h1"
        className="sign-in-heading"
        fontWeight={700}
        fontFamily="unset"
      >
        Sign in to your account
      </Typography>
      {!isLoading ? (
        <GoogleLogin
          // useOneTap
          ux_mode="redirect"
          shape="pill"
          click_listener={handleLogin}
          onSuccess={() => {}}
        />
      ) : (
        <LoadingButton
          className={`google-login-btn ${
            isLoading ? 'btn-disabled' : 'btn-active'
          }`}
          loading={isLoading}
          variant="contained"
          startIcon={
            isLoading ? (
              <CircularProgress className="loading-indicator" size={18} />
            ) : (
              <BaseSvg id="google-logo" width="18" height="18" />
            )
          }
        >
          Signing in with Google
        </LoadingButton>
      )}
    </LoginStyled>
  );
};

export default Login;
