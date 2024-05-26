import { styled } from '@mui/system';

export const SideBarFooterStyled = styled('div')(({ theme }) => ({
  width: '100%',
  '.logout-btn': {
    borderRadius: '7px',
    padding: '1.1rem',
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
