import { useLayoutEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Link as MuiLink, Typography } from '@mui/material';
import { getCurrentYear } from '../../../helpers';
import { HomeStyled } from './Home.styled';
import { useAuth, useSnackbar } from '../../../hooks';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath =
    `${location?.state?.from?.pathname || ''}${location?.state?.from?.search || ''}` ||
    '/';
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const from = searchParams.get('from');
  const { setAuth } = useAuth();
  const { openSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    const googleLogin = async () => {
      const decoded = jwtDecode(token || '');
      localStorage.setItem('token', token || '');
      setAuth({
        isLoggedIn: true,
        ...decoded,
      });
      navigate(from || '/');
    };

    if (token) {
      googleLogin();
    }
  }, [token, from, navigate]);

  const handleLogin = async () => {
    try {
      const serverUri = `${process.env.REACT_APP_PROXY_URI}`;
      const url = `${serverUri}/api/auth/google/login/${encodeURIComponent(fromPath)}`;
      localStorage.setItem('url', url);
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
  //     window.open(`?token=${response?.credential}`, '_self');
  //   } catch (err) {
  //     openSnackbar({
  //       message: JSON.stringify(err || ''),
  //       type: 'error',
  //     });
  //   }
  // };

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
        <GoogleLogin
          ux_mode="redirect"
          shape="pill"
          // useOneTap
          click_listener={handleLogin}
          onSuccess={handleLogin}
          // onSuccess={handleLoginOneTap}
        />
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
