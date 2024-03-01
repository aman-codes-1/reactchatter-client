import { Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { SuccessErrorMessageStyled } from './SuccessErrorMessage.styled';
import { SuccessErrorMessageProps } from './ISuccessErrorMessage';

const SuccessErrorMessage = ({ message, type }: SuccessErrorMessageProps) => (
  <SuccessErrorMessageStyled message={message}>
    <div className="success-error-message-wrapper">
      {type === 'error' ? (
        <CancelIcon className="error-dark" />
      ) : (
        <CheckCircleIcon className="success-dark'" />
      )}
      <Typography
        className={`success-error-message ${
          type === 'error' ? 'error-dark' : 'success-dark'
        }`}
        fontFamily="unset"
        fontWeight={600}
      >
        {message}
      </Typography>
    </div>
  </SuccessErrorMessageStyled>
);

export default SuccessErrorMessage;
