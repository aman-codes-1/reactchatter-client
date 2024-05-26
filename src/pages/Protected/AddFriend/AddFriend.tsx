import { ChangeEvent, useContext, useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SuccessErrorMessage } from '../../../components';
import { MainLayout } from '..';
import { handleKeyPress, regex } from '../../../helpers';
import { useAuth, useTimeout } from '../../../hooks';
import { ChatsAndFriendsContext } from '../../../contexts';
import { AddFriendStyled } from './AddFriend.styled';

const AddFriend = () => {
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [validation, setValidation] = useState({
    isRequired: false,
    isNotValid: false,
  });
  const [state, setState] = useState({
    message: '',
    type: '',
  });
  const { auth: { _id = '', email: Email = '' } = {} } = useAuth();
  const [isTimeoutRunning, setIsTimeoutRunning] = useTimeout(() => {
    setIsTimeoutRunning(false);
  }, 4000);
  const { createRequest, createRequestLoading: loading } = useContext(
    ChatsAndFriendsContext,
  );

  const resetStates = () => {
    setState({
      message: '',
      type: '',
    });
    setValidation({
      isRequired: false,
      isNotValid: false,
    });
  };

  const handleChangeEmail = (e: ChangeEvent) => {
    resetStates();
    setState({
      message: '',
      type: '',
    });
    const val = (e.target as HTMLInputElement)?.value;
    setEmail(val);
    if (val === Email) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const handleCheckEmail = () => {
    resetStates();
    const { validateEmail } = regex;
    let validationCheck = {
      isRequired: false,
      isNotValid: false,
    };
    if (!email) {
      validationCheck = {
        isRequired: true,
        isNotValid: false,
      };
    } else if (email && !validateEmail.test(email)) {
      validationCheck = {
        isRequired: false,
        isNotValid: true,
      };
    } else {
      validationCheck = {
        isRequired: false,
        isNotValid: false,
      };
    }
    setValidation(validationCheck);
    setIsTimeoutRunning(true);
    return validationCheck;
  };

  const handleClickAdd = async () => {
    if (disabled || loading) return;
    resetStates();
    const validationCheck = handleCheckEmail();
    if (Object.values(validationCheck).some((x) => x === true)) {
      return;
    }
    try {
      const { data } = await createRequest({
        variables: {
          userId: _id,
          sendToEmail: email,
        },
      });
      if (data?.createRequest?._id) {
        setState({
          message: 'Friend Request Sent.',
          type: 'success',
        });
        setEmail('');
        setIsTimeoutRunning(true);
      }
    } catch (err: any) {
      setState({
        message:
          err?.graphQLErrors?.[0]?.message ||
          'Something went wrong. Please try again.',
        type: 'error',
      });
      setIsTimeoutRunning(true);
    }
  };

  const { isRequired, isNotValid } = validation;
  const { message, type } = state;

  return (
    <MainLayout heading="Add Friend">
      <AddFriendStyled>
        <Typography
          className="add-friend-heading"
          fontFamily="unset"
          fontWeight={600}
        >
          Add friend by email
        </Typography>
        <div className="add-friend-email-wrapper">
          <TextField
            inputProps={{ className: 'add-friend-email-input-props' }}
            className="add-friend-email-input"
            size="small"
            placeholder="you@example.com"
            value={email}
            onKeyUp={(_: any) => handleKeyPress(_, handleClickAdd)}
            onChange={handleChangeEmail}
            onBlur={handleCheckEmail}
          />
          <LoadingButton
            loading={loading}
            variant="contained"
            className={`add-friend-email-btn ${
              loading || disabled ? '' : 'add-btn-active'
            }`}
            onClick={handleClickAdd}
            disabled={disabled}
          >
            Add
          </LoadingButton>
        </div>
        {isRequired && isTimeoutRunning ? (
          <SuccessErrorMessage message="Email is required" type="error" />
        ) : null}
        {isNotValid && isTimeoutRunning ? (
          <SuccessErrorMessage
            message="Please enter a valid email"
            type="error"
          />
        ) : null}
        {message && isTimeoutRunning ? (
          <SuccessErrorMessage message={message} type={type} />
        ) : null}
      </AddFriendStyled>
    </MainLayout>
  );
};

export default AddFriend;
