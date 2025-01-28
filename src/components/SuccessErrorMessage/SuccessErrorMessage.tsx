import { useLayoutEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { updateHeight } from '../../helpers';
import { SuccessErrorMessageProps } from './ISuccessErrorMessage';
import { SuccessErrorMessageStyled } from './SuccessErrorMessage.styled';

const SuccessErrorMessage = ({ message, type }: SuccessErrorMessageProps) => {
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    updateHeight(wrapperRef, setWrapperHeight);
    window.addEventListener('resize', () =>
      updateHeight(wrapperRef, setWrapperHeight),
    );

    return () => {
      window.removeEventListener('resize', () =>
        updateHeight(wrapperRef, setWrapperHeight),
      );
    };
  }, []);

  return (
    <SuccessErrorMessageStyled wrapperHeight={wrapperHeight}>
      <div className="success-error-message-wrapper" ref={wrapperRef}>
        {type === 'error' ? (
          <CancelIcon className="error-dark" />
        ) : (
          <CheckCircleIcon className="success-dark'" />
        )}
        <Typography
          className={`success-error-message ${
            type === 'error' ? 'error-dark' : 'success-dark'
          }`}
          fontWeight={600}
        >
          {message}
        </Typography>
      </div>
    </SuccessErrorMessageStyled>
  );
};

export default SuccessErrorMessage;
