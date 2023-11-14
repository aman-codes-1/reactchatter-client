import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { LoginStyled } from './Login.styled';
import { Authentication } from '../../../libs';
import { SnackbarContext } from '../../../contexts';
import { useAuth } from '../../../hooks';

const Login = () => {
  const navigate = useNavigate();
  const authentication = new Authentication();
  const { setAuth } = useAuth();
  const { openSnackbar } = useContext(SnackbarContext);

  return (
    <LoginStyled>
      <Typography component="div" className="sign-in-wrapper">
        <Typography className="sign-in-heading" fontWeight="bolder">
          Sign in to your account
        </Typography>
        <GoogleOAuthProvider
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
        >
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const { data }: any = await authentication.loginUser({
                token: credentialResponse?.credential || '',
              }) || {};
              const newData = {
                isLoggedIn: true,
                ...data?.data,
              };
              localStorage.setItem('auth', JSON.stringify(newData));
              setAuth(newData);
              navigate('/dashboard');
            }}
            onError={() => {
              openSnackbar({ message: 'Login Failed', type: 'error' });
            }}
            text="continue_with"
            // ux_mode="redirect"
            useOneTap
          />
        </GoogleOAuthProvider>
      </Typography>
    </LoginStyled>
  );
};

export default Login;
