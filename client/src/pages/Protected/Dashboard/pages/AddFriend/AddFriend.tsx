import { ChangeEvent, useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SuccessErrorMessage } from '../../../../../components';
import { MainLayout } from '../../components';
import { FriendRequest } from '../../../../../libs';
import { regex } from '../../../../../helpers';
import { useAuth } from '../../../../../hooks';
import { AddFriendStyled } from './AddFriend.styled';

const AddFriend = () => {
  const sendFriendRequest = new FriendRequest();
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState({
    isRequired: false,
    isNotValid: false,
  });
  const [state, setState] = useState({
    loading: false,
    message: '',
    type: '',
  });
  const { auth: { _id = '' } = {} } = useAuth();

  const resetStates = () => {
    setState({
      loading: false,
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
      loading: false,
      message: '',
      type: '',
    });
    const val = (e.target as HTMLInputElement)?.value;
    setEmail(val);
  };

  const handleCheckEmail = () => {
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
    return validationCheck;
  };

  const handleClickAdd = async () => {
    resetStates();
    const validationCheck = handleCheckEmail();
    if (Object.values(validationCheck).some((x) => x === true)) {
      return;
    }
    setState({
      loading: true,
      message: '',
      type: '',
    });
    try {
      await sendFriendRequest.sendFriendRequest({
        sendToEmail: email,
        sentByUserId: _id,
      });
      setState({
        loading: false,
        message: 'Friend Request Sent.',
        type: 'success',
      });
    } catch (err: any) {
      setState({
        loading: false,
        message: err?.response?.data?.message,
        type: 'error',
      });
    }
  };

  const { isRequired, isNotValid } = validation;
  const { loading, message, type } = state;

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
            onChange={handleChangeEmail}
            onBlur={handleCheckEmail}
          />
          <LoadingButton
            loading={loading}
            variant="contained"
            className={`add-friend-email-btn ${
              loading ? '' : 'add-btn-active'
            }`}
            onClick={handleClickAdd}
          >
            Add
          </LoadingButton>
        </div>
        {isRequired ? (
          <SuccessErrorMessage message="Email is required" type="error" />
        ) : null}
        {isNotValid ? (
          <SuccessErrorMessage
            message="Please enter a valid email"
            type="error"
          />
        ) : null}
        {message ? <SuccessErrorMessage message={message} type={type} /> : null}
      </AddFriendStyled>
    </MainLayout>
  );
};

export default AddFriend;
