import { TextField } from '@mui/material';
import { SearchBarStyled } from './SearchBar.styled';

const SearchBar = ({ className }: any) => (
  <SearchBarStyled className={className}>
    <TextField
      id="outlined-search"
      label="Search or start a new conversation"
      type="search"
      size="small"
      fullWidth
      className="search-input"
      InputLabelProps={{ className: 'search-input-props' }}
      inputProps={{ className: 'search-input-props' }}
    />
  </SearchBarStyled>
);

export default SearchBar;
