import { styled } from '@mui/system';

export const ListItemButtonStyled = styled('div')<{
  width: string;
  btnHeight: string;
  variant: string;
  disableHover: boolean;
  primaryTextMarginTop: string;
  primaryTextFontSize: string;
  primaryTextFontWeight: number;
  primaryEllipsesLineClamp: number;
  secondaryTextMarginTop: string;
  secondaryTextFontSize: string;
  secondaryTextFontWeight: number;
  secondaryEllipsesLineClamp: number;
}>(
  ({
    theme,
    width,
    btnHeight,
    variant,
    disableHover,
    primaryTextMarginTop,
    primaryTextFontSize,
    primaryTextFontWeight,
    primaryEllipsesLineClamp,
    secondaryTextMarginTop,
    secondaryTextFontSize,
    secondaryTextFontWeight,
    secondaryEllipsesLineClamp,
  }) => ({
    width: width || '100%',
    cursor: disableHover ? 'default' : 'pointer',
    '.list-item-btn': {
      minHeight: btnHeight,
      border:
        variant === 'outlined'
          ? `1px solid ${theme.palette.secondary.main}`
          : 'none',
      color: variant === 'outlined' ? theme.palette.secondary.main : '',
      borderRadius: variant === 'outlined' ? '5px' : '10px',
      background:
        variant === 'filled' ? theme.palette.grey[200] : 'transparent',
      '.MuiListItemText-root': {
        wordBreak: 'break-word',
        '.MuiListItemText-primary': {
          marginTop: primaryTextMarginTop,
          fontSize: primaryTextFontSize || '0.875rem',
          fontWeight: primaryTextFontWeight || 501,
          color:
            variant === 'outlined'
              ? theme.palette.secondary.main
              : theme.palette.grey[900],
          wordBreak: 'break-word',
          ...(primaryEllipsesLineClamp
            ? {
                display: '-webkit-box',
                '-webkitLineClamp': primaryEllipsesLineClamp,
                '-webkitBoxOrient': 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }
            : {}),
        },
        '.MuiListItemText-secondary': {
          marginTop: secondaryTextMarginTop,
          fontSize: secondaryTextFontSize || '0.75rem',
          fontWeight: secondaryTextFontWeight || 500,
          color: theme.palette.grey[500],
          wordBreak: 'break-word',
          ...(secondaryEllipsesLineClamp
            ? {
                display: '-webkit-box',
                '-webkitLineClamp': secondaryEllipsesLineClamp,
                '-webkitBoxOrient': 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }
            : {}),
        },
      },
    },
    '.list-item-btn:hover': {
      background: disableHover ? 'transparent' : theme.palette.grey[50],
      cursor: disableHover ? 'default' : 'pointer',
      color: disableHover ? '' : theme.palette.secondary.main,
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
