import { styled } from '@mui/system';

export const SuccessErrorMessageStyled = styled('div')<{ message: string }>(({ theme, message }) => ({
  '.success-error-message-wrapper': {
    marginTop: '0.5rem',
    width: '17.5rem',
    display: 'flex',
    alignItems: message?.length > 38 ? 'flex-start' : 'center',
    gap: '0.5rem',
    '.success-error-message': {
      fontSize: '0.75rem',
      wordBreak: 'break-word',
      '@media(min-width: 0px) and (max-width: 416px)': {
        width: '100%',
      },
    },
    '.error-dark': {
      color: theme.palette.error.dark,
    },
    '.success-dark': {
      color: theme.palette.success.dark,
    },
  },
}));
