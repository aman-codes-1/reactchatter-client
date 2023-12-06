import { styled } from '@mui/system';

export const MainLayoutStyled = styled('div')(({ theme }) => ({
  padding: '3rem 1.5rem',
  '.main-layout-heading': {
    fontSize: '3rem',
    lineHeight: 1,
    marginBottom: '2rem',
    color: theme.palette.text.primary,
  },
  '.main-layout-default-text': {
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: theme.palette.grey[800],
  },
}));

export const MainLayoutLoaderStyled = styled('div')(({ theme }) => ({
  '.skeleton': {
    marginTop: '-1.5rem',
    marginBottom: '2rem',
  },
}));
