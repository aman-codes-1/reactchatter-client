import { styled } from '@mui/system';

export const SideBarListStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  height: '100%',
  [theme.breakpoints.down('sm')]: {
    marginTop: '1rem',
  },
  '.default-heading': {
    fontSize: '0.8125rem',
    fontWeight: 700,
    color: theme.palette.grey[800],
  },
  '.heading': {
    fontSize: '1.375rem',
    fontWeight: 800,
  },
  '.flex-list-item': {
    flex: '0 10 auto',
  },
  '.flex-list-item:nth-of-type(1)': {
    flex: '0 1 auto',
  },
  '.flex-list-item:nth-last-of-type(1)': {
    flex: '0 0 auto',
  },
  '.margin-bottom': {
    marginBottom: '1rem',
    cursor: 'default',
  },
  '.list-item-icon': {
    marginRight: '1rem',
    padding: '0.17rem',
    fontSize: '1.25rem',
    color: theme.palette.grey[600],
    outline: `1px solid ${theme.palette.grey[600]}`,
    borderRadius: '6px',
  },
}));
