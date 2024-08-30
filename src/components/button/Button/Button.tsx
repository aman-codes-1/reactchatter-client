import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material';
import { ButtonStyled } from './Button.styled';

interface ButtonProps extends MuiButtonProps {
  wrapperClassName?: string;
}

const Button = (props: ButtonProps) => {
  const { wrapperClassName, className, ...rest } = props;

  return (
    <ButtonStyled className={wrapperClassName}>
      <MuiButton className={`btn ${className}`} {...rest} />
    </ButtonStyled>
  );
};

export default Button;
