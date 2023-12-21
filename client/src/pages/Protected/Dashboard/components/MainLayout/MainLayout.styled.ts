import { styled } from '@mui/system';

export const MainLayoutStyled = styled('div')(({ theme }) => ({
  margin: '3rem 1.5rem',
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
    marginBottom: '2.75rem',
  },
}));

export const MainLayoutLoaderStyled = styled('div')(({ theme }) => ({
  margin: '1.3rem 1.5rem 3rem 1.5rem',
  '.skeleton-heading': {},
  '.skeleton-default-text': {
    marginBottom: '2.75rem',
  },
}));
