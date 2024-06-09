import { styled } from '@mui/system';

export const MainLayoutStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '4.5rem 4rem 2rem 4rem',
  height: 'calc(100% - 6.5rem)',
  '@media(min-width: 600px) and (max-width: 800px)': {
    margin: '4.5rem 2rem 2rem 2rem',
  },
  [theme.breakpoints.down('sm')]: {
    margin: '2.5rem 3rem 2rem 3rem',
    height: 'calc(100% - 4.5rem)',
  },
  [theme.breakpoints.down('xs')]: {
    margin: '2.5rem 2rem 2rem 2rem',
    height: 'calc(100% - 4.5rem)',
  },
  '.main-layout-heading': {
    fontSize: '3rem',
    lineHeight: 1,
    marginBottom: '2rem',
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.7rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '2.5rem',
    },
  },
  '.main-layout-default-text': {
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: theme.palette.grey[800],
    marginBottom: '2.75rem',
  },
  '.overflow-wrapper': {
    width: '100%',
    overflow: 'auto',
  },
}));

export const MainLayoutLoaderStyled = styled('div')(() => ({
  margin: '1.3rem 1.5rem 3rem 1.5rem',
  '.skeleton-default-text': {
    marginBottom: '2.75rem',
  },
}));
