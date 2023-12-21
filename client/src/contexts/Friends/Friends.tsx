import { createContext, useEffect, useState } from 'react';
import { Friend } from '../../libs';
import { useAuth } from '../../hooks';

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

  useEffect(() => {
    fetchFriends();
  }, [refetch]);

  const refetchFriends = () => {
    setRefetch((prev) => !prev);
  };

  return (
    <FriendsContext.Provider value={{ state, setState, refetchFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};
