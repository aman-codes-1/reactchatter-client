import { styled } from '@mui/system';

export const MainLayoutStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '3.8rem 4.5rem',
  height: 'calc(100% - 7.6rem)',
  [theme.breakpoints.down('md')]: {
    margin: '2.5rem 3rem',
    height: 'calc(100% - 5rem)',
  },
  [theme.breakpoints.down('xs')]: {
    margin: '2.5rem 2rem',
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
    marginTop: '0.5rem',
    color: theme.palette.grey[800],
  },
  '.overflow-wrapper': {
    width: '100%',
    overflow: 'auto',
  },
}));

export const MainLayoutLoaderStyled = styled('div')(() => ({
  '.primary-skeleton': {
    maxWidth: '130px',
  },
  '.secondary-skeleton': {
    maxWidth: '230px',
  },
  '.skeleton-avatar': {
    marginRight: '1.2rem',
  },
}));
