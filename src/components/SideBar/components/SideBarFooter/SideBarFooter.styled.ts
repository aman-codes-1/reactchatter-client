import { styled } from '@mui/system';

export const SideBarFooterStyled = styled('div')(({ theme }) => ({
  width: '100%',
  borderTop: '1px solid #E4E4E7',
  '.logout-btn': {
    borderRadius: '7px',
    padding: '1.3rem 0.8rem',
    backgroundColor: 'rgba(1, 150, 218, 0.08)',
  },
  '.logout-btn:hover': {
    backgroundColor: 'rgba(1, 150, 218, 0.14)',
    outline: '1px solid rgba(1, 150, 218, 0.28)',
  },
  '.logout-icon': {
    fontSize: '1.1rem',
    color: theme.palette.common.black,
  },
}));
