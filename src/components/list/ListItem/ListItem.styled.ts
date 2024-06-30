import { styled } from '@mui/system';

export const ListItemStyled = styled('div')<{
  width: string;
  disableHover: boolean;
  primaryTextFontSize: string;
  primaryTextFontWeight: number;
  primaryEllipsesLineClamp: number;
  secondaryTextFontSize: string;
  secondaryTextFontWeight: number;
  secondaryEllipsesLineClamp: number;
  btnHeight: string;
}>(
  ({
    theme,
    width,
    disableHover,
    primaryTextFontSize,
    primaryTextFontWeight,
    primaryEllipsesLineClamp,
    secondaryTextFontSize,
    secondaryTextFontWeight,
    secondaryEllipsesLineClamp,
    btnHeight,
  }) => ({
    width: width || '100%',
    cursor: disableHover ? 'default' : 'pointer',
    '.list-item-btn': {
      height: btnHeight,
      borderRadius: '10px',
      '.MuiListItemText-root': {
        wordBreak: 'break-word',
        '.MuiListItemText-primary': {
          fontSize: primaryTextFontSize || '0.875rem',
          fontWeight: primaryTextFontWeight || 501,
          letterSpacing: '0.0425rem',
          color: theme.palette.grey[900],
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
