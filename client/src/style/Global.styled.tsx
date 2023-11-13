import { GlobalStyles } from '@mui/system';

export const GlobalStyle = () => (
  <GlobalStyles
    styles={() => ({
      '.ellipses': {
        width: '100%',
        display: '-webkit-box',
        lineHeight: '1',
        '-webkitLineClamp': '2',
        '-webkitBoxOrient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    })}
  />
);
