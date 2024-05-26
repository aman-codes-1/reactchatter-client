import { styled } from '@mui/system';

export const ListItemStyled = styled('div')<{
  padding: string;
  disableHover: boolean;
}>(({ theme, padding, disableHover }) => ({
  width: '100%',
  padding,
  '.list-item-btn': {
    borderRadius: '10px',
    gap: '17px',
    '.MuiListItemText-root': {
      wordWrap: 'break-word',
      // marginRight: secondaryAction ? '18px' : '',
      '.MuiListItemText-primary': {
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: '1.5rem',
        color: theme.palette.grey[900],
      },
      '.MuiListItemText-secondary': {
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: '1rem',
        color: theme.palette.grey[600],
      },
    },
  },
  '.list-item-btn:hover': {
    background: disableHover ? 'transparent' : theme.palette.grey[50],
    cursor: disableHover ? 'default' : 'pointer',
    color: theme.palette.secondary.main,
    '.MuiTypography-root, .Mui-selected': {
      color: disableHover ? '' : theme.palette.secondary.main,
    },
    '.list-item-icon': {
      color: disableHover ? '' : theme.palette.secondary.main,
      outline: disableHover ? '' : `1px solid ${theme.palette.secondary.main}`,
      background: disableHover ? '' : theme.palette.common.white,
    },
  },
  '.MuiButtonBase-root.MuiListItemButton-root.Mui-selected': {
    '.MuiTypography-root': {
      color: theme.palette.secondary.main,
    },
    '.list-item-icon': {
      color: theme.palette.secondary.main,
      outline: `1px solid ${theme.palette.secondary.main}`,
      background: theme.palette.common.white,
    },
  },
}));
