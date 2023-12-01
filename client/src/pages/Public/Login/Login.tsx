import { useContext, useLayoutEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { CircularProgress, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LoginStyled } from './Login.styled';
import { Authentication } from '../../../libs';
import { SnackbarContext } from '../../../contexts';
import { useAuth } from '../../../hooks';
import { BaseSvg } from '../../../components';

const Login = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();
  const authentication = new Authentication();
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const { openSnackbar } = useContext(SnackbarContext);

  useLayoutEffect(() => {
    const googleLogin = async () => {
      setIsLoading(true);
      try {
        const { data }: any = (await authentication.googleLogin({
          code: code || '',
        })) || {};
        localStorage.setItem('isGoogle', 'true');
        setAuth({
          isLoggedIn: true,
          ...data?.data,
        });
        navigate('/dashboard', { replace: true });
        setIsLoading(false);
      } catch (err: any) {
        openSnackbar({
          message: err?.response?.data?.message,
          type: 'error',
        });
        setIsLoading(false);
      }
    };
    if (code) {
      googleLogin();
    }
  }, [code]);

  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: process.env.REACT_APP_GOOGLE_CLIENT_REDIRECT_URI || '',
    include_granted_scopes: true,
    select_account: isLoading,
  });

  const handleLogin = async () => {
    try {
      login();
    } catch (err) {
      openSnackbar({
        message: '',
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
      <LoadingButton
        className={`google-login-btn ${
          isLoading ? 'btn-disabled' : 'btn-active'
        }`}
        loading={isLoading}
        variant="contained"
        onClick={handleLogin}
        startIcon={
          isLoading ? (
            <CircularProgress className="loading-indicator" size={18} />
          ) : (
            <BaseSvg id="google-logo" width="18" height="18" />
          )
        }
      >
        {isLoading ? 'Signing in with Google' : 'Continue with Google'}
      </LoadingButton>
    </LoginStyled>
  );
};

export default Login;
