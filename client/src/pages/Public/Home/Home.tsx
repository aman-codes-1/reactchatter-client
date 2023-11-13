import {
  Box, Button, Link as MuiLink, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getCurrentYear } from '../../../helpers';
import { HomeStyled } from './Home.styled';

const Home = () => (
  <HomeStyled>
    <Box className="container">
      <Typography component="div" className="wrapper">
        <Typography component="div" className="header">
          <Typography className="main-heading" fontWeight="bolder">
            ReactChatter
          </Typography>
          <Typography className="main-sub-heading" fontWeight="bold">
            A simple real-time chat application built using
            <br />
            React.js v18, Material UI, Typescript, Nest.js and Pusher.
          </Typography>
          <Link to="/login">
            <Button
              size="large"
              variant="contained"
              className="login-button"
            >
              Login
            </Button>
          </Link>
        </Typography>
        <Typography
          component="div"
          className="footer"
        >
          <Typography component="p" className="footer-sub-heading" fontWeight="normal">
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
          <Typography component="p" className="footer-sub-heading" fontWeight="normal">
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
        </Typography>
      </Typography>
    </Box>
  </HomeStyled>
);

export default Home;
