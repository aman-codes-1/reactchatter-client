import { styled } from '@mui/system';

export const ListItemStyled = styled('div')<{
  padding: string;
  disableHover: boolean;
  primaryTextFontSize: string;
  primaryTextFontWeight: number;
  secondaryTextFontSize: string;
  secondaryTextFontWeight: number;
}>(
  ({
    theme,
    padding,
    disableHover,
    primaryTextFontSize,
    primaryTextFontWeight,
    secondaryTextFontSize,
    secondaryTextFontWeight,
  }) => ({
    width: '100%',
    padding,
    '.list-item-btn': {
      borderRadius: '10px',
      gap: '17px',
      '.MuiListItemText-root': {
        wordWrap: 'break-word',
        '.MuiListItemText-primary': {
          fontSize: primaryTextFontSize || '0.9rem',
          fontWeight: primaryTextFontWeight || 600,
          fontFamily: 'unset',
          color: theme.palette.grey[900],
        },
        '.MuiListItemText-secondary': {
          fontSize: secondaryTextFontSize || '0.75rem',
          fontWeight: secondaryTextFontWeight || 600,
          color: theme.palette.grey[500],
          letterSpacing: '0.03rem',
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
        outline: disableHover
          ? ''
          : `1px solid ${theme.palette.secondary.main}`,
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
  }),
);
