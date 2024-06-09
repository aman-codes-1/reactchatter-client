import { styled } from '@mui/system';

export const SideBarFooterStyled = styled('div')(({ theme }) => ({
  marginTop: 'auto',
  '.logout-btn': {
    borderRadius: '7px',
  },
  '.logout-btn:hover': {
    backgroundColor: theme.palette.primary.light,
    outline: `1px solid ${theme.palette.primary.dark}`,
  },
  '.logout-icon': {
    fontSize: '1.1rem',
    color: theme.palette.common.black,
  },
}));
