import {
  createContext,
  useState,
  ReactNode,
  SyntheticEvent,
} from 'react';
import {
  Snackbar, AlertColor, Paper, Typography, IconButton, Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { content } from './content';
import './snackbar.scss';

type Props = {
  children: ReactNode;
};

export type State = {
  message: string;
  type: AlertColor | undefined;
  title?: string | undefined;
};

type Context = {
  openSnackbar: (args: State) => void;
};

export const SnackbarContext = createContext<Context>({
  openSnackbar: (f) => f,
});

const SnackbarProvider = ({ children }: Props) => {
  const { defaultSuccessMsg, errorOccurred, GoBack } = content;

  const initialState: State = {
    message: defaultSuccessMsg,
    type: 'error',
    title: errorOccurred,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [contextState, setContextState] = useState<State>(initialState);
  const { message, title } = contextState;

  const openSnackbar = (args: State) => {
    if (args.type !== 'success') {
      setContextState({
        title: errorOccurred,
        ...args,
      });
      setIsOpen(true);
    }
  };

  const handleClose = (_?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isOpen}
        onClose={handleClose}
      >
        <Paper className="snackbar-wrapper">
          <Typography component="div" className="upper-container">
            <Typography component="div" className="middle-container">
              <Typography
                id="snackbar-title"
                className="title-error"
              >
                {title}
              </Typography>
              <Typography className="message-content">
                <Typography id="snackbar-message">
                  {message}
                </Typography>
              </Typography>
            </Typography>
            <Typography component="div" className="right-container">
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Typography>
          </Typography>
          <Typography className="lower-container">
            <Button
              className="cancel-btn"
              variant="contained"
              onClick={handleClose}
            >
              {GoBack}
            </Button>
          </Typography>
        </Paper>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
