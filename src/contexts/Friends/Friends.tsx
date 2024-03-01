import { createContext, useLayoutEffect, useState } from 'react';
import { Friend } from '../../libs';
import { useAuth } from '../../hooks';
import { Loader } from '../../components';

export const FriendsContext = createContext<any>({
  auth: {},
  setAuth: () => null,
});

export const FriendsProvider = ({ children }: any) => {
  const friend = new Friend();
  const [state, setState] = useState({
    loading: false,
    data: [],
    error: '',
  });
  const [refetch, setRefetch] = useState(false);
  const { auth: { _id = '' } = {} } = useAuth();

  const fetchFriends = async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const { data }: any = await friend.getAllFriends({ userId: _id });
      setState({
        loading: false,
        data: data?.data,
        error: '',
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: [],
        error: err?.response?.data?.message,
      });
    }
  };

  useLayoutEffect(() => {
    fetchFriends();
  }, [refetch]);

  const refetchFriends = () => {
    setRefetch((prev) => !prev);
  };

  if (state?.loading) {
    return <Loader center />;
  }

  return (
    <FriendsContext.Provider value={{ state, setState, refetchFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};
