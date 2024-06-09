import { styled } from '@mui/system';

export const MainLayoutStyled = styled('div')(({ theme }) => ({
  height: '100%',
  maxHeight: 'calc(100% - 8.6rem)',
  margin: '4.5rem 4rem',
  [theme.breakpoints.down('md')]: {
    margin: '4.5rem 2rem',
  },
  '@media(min-width: 600px) and (max-width: 655px)': {
    margin: '4.5rem 1rem',
  },
  [theme.breakpoints.down('sm')]: {
    margin: '2.5rem 2rem',
  },
  '.main-layout-heading': {
    fontSize: '3rem',
    lineHeight: 1,
    marginBottom: '2rem',
    color: theme.palette.text.primary,
    [theme.breakpoints.down('xs')]: {
      fontSize: '2.75rem',
    },
  },
  '.main-layout-default-text': {
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: theme.palette.grey[800],
    marginBottom: '2.75rem',
  },
}));

export const MainLayoutLoaderStyled = styled('div')(() => ({
  margin: '1.3rem 1.5rem 3rem 1.5rem',
  '.skeleton-default-text': {
    marginBottom: '2.75rem',
  },
}));
