import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Link as MuiLink, Typography } from '@mui/material';
import { decrypt, getCurrentYear, login, updateHeight } from '../../../helpers';
import { HomeStyled } from './Home.styled';
import { useAuth, useSnackbar } from '../../../hooks';

const Home = ({ loadingHome }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath =
    `${location?.state?.from?.pathname || ''}${location?.state?.from?.search || ''}` ||
    '/';
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const from = searchParams.get('from');
  const [loading, setLoading] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const { setAuth } = useAuth();
  const { openSnackbar } = useSnackbar();
  const footerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    updateHeight(footerRef, setFooterHeight);
    window.addEventListener('resize', () =>
      updateHeight(footerRef, setFooterHeight),
    );

    return () => {
      window.removeEventListener('resize', () =>
        updateHeight(footerRef, setFooterHeight),
      );
    };
  }, []);

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
      if (loadingHome) return;
      googleLogin(code);
    } else {
      setLoading(false);
    }
  }, [code, from, loadingHome]);

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

  if (loading) return null;

  return (
    <HomeStyled footerHeight={footerHeight}>
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
        <div className="home-login-btn-wrapper">
          <GoogleLogin
            ux_mode="redirect"
            shape="pill"
            // useOneTap
            click_listener={handleLogin}
            onSuccess={handleLogin}
          />
        </div>
      </div>
      <div className="home-footer" ref={footerRef}>
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
