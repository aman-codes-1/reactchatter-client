import { useContext, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const { openSnackbar } = useContext(SnackbarContext);

  // const handleGoogleLogin = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = await authentication.loginUser({});
  //     setAuth({ isLoggedIn: true });
  //     navigate('/dashboard');
  //   } catch (err) {
  //     openSnackbar({ message: JSON.stringify(err), type: 'error' });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <LoginStyled>
      <Typography component="div" className="sign-in-wrapper">
        <Typography className="sign-in-heading" fontWeight="bolder">
          Sign in to your account
        </Typography>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              console.log(credentialResponse);
              const data = await authentication.loginUser({});
              // localStorage.setItem('auth', JSON.stringify(data));
              setAuth(data);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            text="continue_with"
            ux_mode="redirect"
            useOneTap
          />
        </GoogleOAuthProvider>
      </Typography>
    </LoginStyled>
  );
};

export default Login;
