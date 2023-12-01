import {
  Box, Button, Link as MuiLink, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getCurrentYear } from '../../../helpers';
import { HomeStyled } from './Home.styled';

const Home = () => (
  <HomeStyled>
    <Box className="home-container">
      <div className="home-wrapper">
        <div className="home-header">
          <Typography
            component="h1"
            className="home-heading"
            fontWeight={700}
            fontFamily="unset"
          >
            ReactChatter
          </Typography>
          <Typography
            component="h5"
            className="home-sub-heading"
            fontWeight={700}
            fontFamily="unset"
          >
            A simple real-time chat application built using
            <br />
            React.js v18, Material UI, Typescript, Nest.js and Pusher.
          </Typography>
          <Link to="/login">
            <Button
              size="large"
              variant="contained"
              className="home-login-btn"
            >
              Login
            </Button>
          </Link>
        </div>
        <div className="home-footer">
          <Typography
            component="p"
            className="home-footer-sub-heading"
            fontWeight={400}
            fontFamily="unset"
          >
            Made with ❤️ by
            {' '}
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
              href="https://github.com/aman-codes-1/nest-react-chat-app"
              target="_blank"
              rel="noreferrer"
              underline="none"
              color="black"
            >
              <strong>Source Code</strong>
            </MuiLink>
          </Typography>
          <Typography
            component="p"
            className="home-footer-sub-heading"
            fontWeight={400}
            fontFamily="unset"
          >
            &copy;
            {' '}
            {getCurrentYear()}
            {' '}
            by
            {' '}
            <MuiLink
              href="https://bold.pro/my/aman-codes"
              target="_blank"
              rel="noreferrer"
              underline="none"
              color="black"
            >
              <strong>Aman.codes</strong>
            </MuiLink>
            {' '}
            All rights reserved.
          </Typography>
        </div>
      </div>
    </Box>
  </HomeStyled>
);

export default Home;
