import { styled } from '@mui/system';

export const SideBarStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '22%',
  height: '100vh',
  borderRight: `2px solid ${theme.palette.grey[200]}`,
  gap: '1rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '30%',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '38%',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '45%',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  '.flex-item:nth-child(2)': {
    marginTop: '-0.6rem',
  },
  '.sidebar-navbar': {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  '.sidebar-search': {
    margin: '0rem 1.5rem',
  },
  '.sidebar-footer': {
    marginTop: 'auto',
  },
}));
