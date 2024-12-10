import { useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Link as MuiLink, Typography } from '@mui/material';
import { decrypt, getCurrentYear, login } from '../../../helpers';
import { HomeStyled } from './Home.styled';
import { useAuth, useSnackbar } from '../../../hooks';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath =
    `${location?.state?.redirectedFrom?.pathname || ''}${location?.state?.redirectedFrom?.search || ''}` ||
    '/';
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const from = searchParams.get('from');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const { openSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    const googleLogin = async (Code: string) => {
      try {
        const secretKey = `${process.env.REACT_APP_ENCRYPTION_SECRET}`;
        const token = await decrypt(Code, secretKey);
        if (token) {
          localStorage.setItem('token', token);
          login(token, setAuth);
        }
        navigate(from || '/');
      } catch (err) {
        console.error('Failed to login', err);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      setLoading(true);
      googleLogin(code);
    } else {
      setLoading(false);
    }
  }, [code, from]);

  const handleLogin = async () => {
    try {
      const serverUri = `${process.env.REACT_APP_PROXY_URI}`;
      const url = `${serverUri}/api/auth/google/login/${encodeURIComponent(fromPath)}`;
      window.open(url, '_self');
    } catch (err) {
      openSnackbar({
        message: JSON.stringify(err || ''),
        type: 'error',
      });
    }
  };

  // const handleLoginOneTap = async (response: any) => {
  //   const serverUri = `${process.env.REACT_APP_PROXY_URI}`;
  //   try {
  //     window.open(`?code=${response?.credential}`, '_self');
  //   } catch (err) {
  //     openSnackbar({
  //       message: JSON.stringify(err || ''),
  //       type: 'error',
  //     });
  //   }
  // };

  if (loading) {
    return null;
  }

  return (
    <HomeStyled>
      <div className="home-header">
        <Typography className="home-heading" fontWeight={700}>
          ReactChatter
        </Typography>
        <Typography className="home-sub-heading" fontWeight={700}>
          A simple real-time chat application built using
          <br />
          React.js v18, Material UI, Typescript, Nest.js, and GraphQL
          Subscriptions.
        </Typography>
        {/* <Button
          component={Link}
          to="/"
          size="large"
          variant="contained"
          className="home-login-btn"
        >
          Login
        </Button> */}
        <div className="home-login-btn-wrapper">
          <GoogleLogin
            ux_mode="redirect"
            shape="pill"
            // useOneTap
            click_listener={handleLogin}
            onSuccess={handleLogin}
            // onSuccess={handleLoginOneTap}
          />
        </div>
      </div>
      <div className="home-footer">
        <Typography className="home-footer-sub-heading" fontWeight={400}>
          Made with ❤️ by{' '}
          <MuiLink
            href="https://www.linkedin.com/in/aman-jain-4b24b8111/"
            target="_blank"
            rel="noreferrer"
            underline="none"
            color="black"
          >
            <strong>Aman Jain</strong>
          </MuiLink>
          {' | '}
          <MuiLink
            href="https://github.com/aman-codes-1/ReactChatter"
            target="_blank"
            rel="noreferrer"
            underline="none"
            color="black"
          >
            <strong>Source Code</strong>
          </MuiLink>
        </Typography>
        <Typography className="home-footer-sub-heading" fontWeight={400}>
          &copy; {getCurrentYear()} by{' '}
          <MuiLink
            href="https://bold.pro/my/aman-codes"
            target="_blank"
            rel="noreferrer"
            underline="none"
            color="black"
          >
            <strong>Aman.codes</strong>
          </MuiLink>{' '}
          All rights reserved.
        </Typography>
      </div>
    </HomeStyled>
  );
};

export default Home;
