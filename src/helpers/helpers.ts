import { RefObject } from 'react';
import moment from 'moment';
import 'moment/min/locales';
import { jwtDecode } from 'jwt-decode';
import { CACHED_MESSAGES_QUERY, MessageData, OtherMember } from '../contexts';

moment.locale(navigator.language);

export const login = async (token: string, setAuth: any) => {
  const decoded = jwtDecode(token);
  if (Object.keys(decoded || {})?.length) {
    setAuth({
      isLoggedIn: true,
      ...decoded,
    });
  }
};

export const getMember = (members: any[], _id: string) => {
  let currentMember;
  let otherMember;

  for (const member of members) {
    if (member?._id) {
      if (member?._id === _id) {
        currentMember = member;
      } else if (member?._id !== _id) {
        otherMember = member;
      }
    }
  }

  return { currentMember, otherMember };
};

export const clickChat = async (
  item: any,
  details: any,
  getChatMessagesWithQueue: any,
  setIsListItemClicked: any,
  setSelectedItem: any,
  setSelectedDetails: any,
  navigate: any,
  prevPathname: string,
  fetchAll: any,
  toggleDrawer: any,
) => {
  setIsListItemClicked((prev: boolean) => !prev);
  let skipFinally = false;
  let route = '';

  try {
    const id = item?._id;
    const type =
      item?.type === 'private' || item?.type === 'group' ? 'chat' : item?.type;
    const userId = details?._id;
    if (type === 'chat') {
      await getChatMessagesWithQueue(id, type);
      route = `/chat?id=${id}&type=${type}`;
    }
    if (type === 'friend') {
      if (item?.hasChats) {
        toggleDrawer();
        navigate('/');
        await fetchAll();
        skipFinally = true;
        return;
      }
      const fullFriendId = `${id}-${userId}`;
      await getChatMessagesWithQueue(fullFriendId, 'friend');
      route = `/chat?id=${fullFriendId}&type=${type}`;
    }
  } catch (error: any) {
    console.error('Error fetching messages:', error);
  } finally {
    if (!skipFinally) {
      setSelectedItem(item);
      setSelectedDetails(details);
      toggleDrawer();
      if (prevPathname !== route) {
        navigate(route);
      }
    }
  }
};

export const getFriendId = (str: string | null) => {
  const ids = str?.split?.('-');
  const friendId = ids?.[0] || '';
  const friendUserId = ids?.[1] || '';
  return { friendId, friendUserId };
};

export const setFocus = (ref: RefObject<HTMLInputElement>) => {
  const inputElement = ref?.current;
  if (inputElement) {
    setTimeout(() => {
      inputElement?.focus();
    }, 0);
  }
};

export const updateHeight = (ref: RefObject<HTMLElement>, setHeight: any) => {
  const listElement = ref?.current;
  if (listElement) {
    setHeight(listElement?.clientHeight);
  }
};

export const updateWidth = (ref: any, setHeight: any) => {
  const listElement = ref?.current;
  if (listElement) {
    setHeight(listElement?.clientWidth);
  }
};

export const scrollToSelected = (
  ref: any,
  itemsRef: any,
  listItems: any[],
  selectedListItem: any,
) => {
  const selectedItemIndex = listItems?.findIndex(
    (item) =>
      item?._id && selectedListItem?._id && item?._id === selectedListItem?._id,
  );
  const listElement = ref?.current;
  const itemElement = itemsRef?.current?.[selectedItemIndex];
  if (selectedItemIndex !== -1 && listElement && itemElement) {
    const itemRect = itemElement?.getBoundingClientRect();
    const listRect = listElement?.getBoundingClientRect();
    const { scrollTop } = listElement || {};
    const topPos = itemRect.top - listRect.top + scrollTop;
    const itemHeight = itemRect.height;
    const listHeight = listRect.height;
    const scrollPos = topPos - listHeight / 2 + itemHeight / 2;
    listElement?.scrollTo({ top: scrollPos, behavior: 'smooth' });
  }
};

export const filterDataById = (data: any[], targetId: string) => {
  return data?.filter((el: any) => el?._id && targetId && el?._id !== targetId);
};

export const addRequest = (OnRequestAddedRequest: any, existingData: any) => {
  let data = existingData?.data;
  let totalCount = existingData?.totalCount;
  if (OnRequestAddedRequest && data?.length && totalCount) {
    data = addObject(OnRequestAddedRequest, data, true);
    totalCount = totalCount + 1;
  } else if (OnRequestAddedRequest) {
    data = [OnRequestAddedRequest];
    totalCount = 1;
  }
  return {
    data,
    totalCount,
  };
};

export const deleteRequest = (
  OnRequestUpdatedRequest: any,
  existingData: any,
) => {
  let data = existingData?.data;
  let totalCount = existingData?.totalCount;
  if (OnRequestUpdatedRequest && data?.length && totalCount) {
    data = filterDataById(data, OnRequestUpdatedRequest?._id);
    totalCount = totalCount - 1;
  }
  return {
    data,
    totalCount,
  };
};

export const addObject = (
  dataToAdd: any,
  existingData: any,
  addToTop?: boolean,
) => {
  let data = existingData;
  if (dataToAdd && data?.length) {
    if (addToTop) {
      data = [dataToAdd, ...data];
    } else {
      data = [...data, dataToAdd];
    }
  } else if (dataToAdd) {
    data = [dataToAdd];
  }
  return data;
};

export const addArray = (arrToAdd: any, existingData: any) => {
  let data = existingData;
  if (arrToAdd?.length && data?.length) {
    data = [...data, ...arrToAdd];
  } else if (arrToAdd?.length) {
    data = [...arrToAdd];
  }
  return data;
};

export const deleteObject = (id: string, existingData: any) => {
  let data = existingData;
  if (id && data?.length) {
    data = filterDataById(data, id);
  }
  return data;
};

export const findAndUpdate = (
  id: string,
  key: string,
  existingData: any,
  dataToUpdate: any,
  updateKey?: string,
) => {
  let isFoundAndUpdated = false;
  let data = existingData;
  let index = -1;
  if (data?.length) {
    index = data?.findIndex((el: any) => el?.[key] && id && el?.[key] === id);
    if (index >= 0) {
      const dataCopy = [...data];
      if (updateKey) {
        const updatedElement = {
          ...dataCopy[index],
          [updateKey]: dataToUpdate,
        };
        dataCopy[index] = updatedElement;
      } else {
        dataCopy[index] = dataToUpdate;
      }
      data = dataCopy;
      isFoundAndUpdated = true;
    }
  }
  return {
    isFoundAndUpdated,
    data,
    index,
  };
};

export const findAndMoveToTop = (
  id: string,
  key: string,
  existingData: any,
) => {
  let data = existingData;
  if (data?.length) {
    const index = data?.findIndex(
      (el: any) => el?.[key] && id && el?.[key] === id,
    );
    if (index >= 0) {
      const dataCopy = [...data];
      const [foundElement] = dataCopy.splice(index, 1);
      dataCopy.unshift(foundElement);
      data = dataCopy;
    }
    return data;
  }
};

export const getLastMessage = (edges: any[]) => {
  const lastEdgeIndex = edges?.length - 1;
  const lastMessage = edges?.[lastEdgeIndex] || null;
  return lastMessage;
};

export const getOtherMembers = (members: any[], _id: string) => {
  if (members?.length) {
    const filteredMembers = filterDataById(members, _id);
    if (filteredMembers?.length) {
      const otherMembers = filteredMembers?.map((member: any) => {
        const { hasAdded, ...rest } = member || {};
        return {
          ...rest,
          deliveredStatus: null,
          readStatus: null,
        };
      });
      return otherMembers;
    }
    return [];
  }
  return [];
};

export const getSender = (members: any[], timestamp: number, _id: string) => {
  if (members?.length) {
    const sender = members?.find(
      (member: any) => member?._id && member?._id === _id,
    );
    if (sender) {
      const { hasAdded, ...rest } = sender || {};
      return {
        ...rest,
        queuedStatus: {
          isQueued: true,
          timestamp,
        },
        sentStatus: null,
        retryStatus: null,
      };
    }
    return {};
  }
  return {};
};

export const addUpdateChat = (
  chatsClient: any,
  _id: string,
  id: string,
  key: string,
  dataToUpdate: any,
  updateKey?: string,
  isMoveToTop?: boolean,
) => {
  let isChatAdded = false;
  let isChatUpdated = false;

  chatsClient.cache.modify({
    fields: {
      [`chats({"input":{"userId":"${_id}"}})`](existingData: any) {
        const { isFoundAndUpdated, data } = findAndUpdate(
          id,
          key,
          existingData,
          dataToUpdate,
          updateKey,
        );
        if (isFoundAndUpdated && data?.length) {
          isChatUpdated = true;
          if (isMoveToTop) {
            const updatedData = findAndMoveToTop(id, key, data);
            return updatedData;
          }
          return data;
        }
        if (!isFoundAndUpdated) {
          const newData = addObject(dataToUpdate, existingData, true);
          isChatAdded = true;
          return newData;
        }
        return existingData;
      },
    },
  });

  return {
    isChatAdded,
    isChatUpdated,
  };
};

export const renderMessage = async (
  cachedMessagesClient: any,
  queuedMessage: any,
  id: string,
  setScrollToBottom?: any,
) => {
  let edges: any[] = [];
  let pageInfo = {
    endCursor: '',
    hasPreviousPage: false,
    hasNextPage: false,
  };
  let scrollPosition = 0;
  let isFetched = false;
  let isRendered = false;

  const cachedMessagesQuery = await cachedMessagesClient.readQuery({
    query: CACHED_MESSAGES_QUERY,
    variables: { chatId: id },
  });

  if (cachedMessagesQuery) {
    const cachedData = cachedMessagesQuery?.cachedMessages;
    edges = addObject(queuedMessage, cachedData?.edges) || [];
    pageInfo = cachedData?.pageInfo?.endCursor
      ? cachedData?.pageInfo
      : pageInfo;
    scrollPosition = cachedData?.scrollPosition;
    isFetched = cachedData?.isFetched;
  } else {
    edges = [queuedMessage];
  }

  cachedMessagesClient.writeQuery({
    query: CACHED_MESSAGES_QUERY,
    data: {
      cachedMessages: {
        edges,
        pageInfo,
        scrollPosition,
        isFetched,
      },
    },
    variables: { chatId: id },
  });

  setScrollToBottom?.((prev: boolean) => !prev);

  isRendered = true;

  return { isRendered };
};

export const deleteFriendsCachedMessages = (
  cachedMessagesClient: any,
  id: string,
) => {
  cachedMessagesClient.cache.evict({
    fieldName: 'cachedMessages',
    args: { input: { chatId: id } },
  });
  cachedMessagesClient.cache.gc();
};

export const deleteFriend = (
  otherFriendsClient: any,
  _id: string,
  id: string,
) => {
  otherFriendsClient.cache.modify({
    fields: {
      [`otherFriends({"input":{"userId":"${_id}"}})`](existingData: any) {
        const data = deleteObject(id, existingData);
        return data;
      },
    },
  });
};

export const checkIsMemberExists = (
  members: any[],
  key: string,
  _id: string,
) => {
  let isCurrentMember = false;
  let isOtherMember = false;

  for (const member of members) {
    if (member?._id && member?._id === _id) {
      if (member[key]) {
        isCurrentMember = true;
      } else if (member[key] === false) {
        isOtherMember = true;
      }
    }
    if (isCurrentMember && isOtherMember) break;
  }

  return { isCurrentMember, isOtherMember };
};

export const checkMessageStatus = (msg: MessageData, selectedItem: any) => {
  let isQueued;
  let isSent;
  let isDelivered;
  let isRead;

  const sender = msg?.sender;
  const queuedStatus = sender?.queuedStatus;
  isQueued = queuedStatus?.isQueued;
  const sentStatus = sender?.sentStatus;
  isSent = sentStatus?.isSent;

  if (selectedItem?.type === 'private') {
    const receiver = msg?.otherMembers?.[0];
    const deliveredStatus = receiver?.deliveredStatus;
    isDelivered = deliveredStatus?.isDelivered;
    const readStatus = receiver?.readStatus;
    isRead = readStatus?.isRead;
  }

  if (selectedItem?.type === 'group') {
    isDelivered = msg?.otherMembers?.every(
      (el: OtherMember) => el?.deliveredStatus?.isDelivered,
    );
    isRead = msg?.otherMembers?.every(
      (el: OtherMember) => el?.readStatus?.isRead,
    );
  }

  isDelivered = isDelivered && !isRead;
  isSent = isSent && !isDelivered && !isRead;
  isQueued = isQueued && !isSent && !isDelivered && !isRead;

  return {
    isQueued,
    isSent,
    isDelivered,
    isRead,
  };
};

export const uniqueQueuedMessages = (edges: any[], queuedMessages: any[]) => {
  return queuedMessages?.filter((queuedMessage: any) => {
    return !edges?.some(
      (msg: any) =>
        msg?.queueId &&
        queuedMessage?.queueId &&
        msg?.queueId === queuedMessage?.queueId,
    );
  });
};

export const validateSearchParams = (search: string) => {
  if (search) {
    const searchParams = new URLSearchParams(search);
    const expectedParams = ['id', 'type'];
    const isValid = expectedParams.every((param) => {
      const value = searchParams.get(param);
      if (!value || value.trim() === '') {
        return false;
      }
      const expectedTypeParams = ['chat', 'friend'];
      if (
        param === 'type' &&
        !expectedTypeParams.some(
          (typeParam) => typeParam && value && typeParam === value,
        )
      ) {
        return false;
      }
      return true;
    });
    return isValid;
  }
  return false;
};

export const sortByLastMessageTimestamp = (data: any[]) => {
  const sortedData = [...data].sort((a, b) => {
    const timestampA = a?.lastMessage?.timestamp || a?.createdAt || 0;
    const timestampB = b?.lastMessage?.timestamp || b?.createdAt || 0;
    return timestampB - timestampA;
  });
  return sortedData;
};

export const sortByTimestamp = (data: any[]) => {
  const sortedData = [...data].sort((a, b) => {
    const timestampA = a?.timestamp || 0;
    const timestampB = b?.timestamp || 0;
    return timestampA - timestampB;
  });
  return sortedData;
};

export const calculateSide = (message: any, _id: string) =>
  message?.sender?._id && message?.sender?._id === _id ? 'right' : 'left';

export const getOnlineStatus = (isOnline: boolean) => {
  return {
    isOnline,
    lastSeen: Date.now(),
  };
};

export const getDateLabel = (timestamp: number) => {
  const messageDate = moment(timestamp);
  let dateLabel: string;

  if (messageDate.isSame(moment(), 'day')) {
    dateLabel = 'Today';
  } else if (messageDate.isSame(moment().subtract(1, 'days'), 'day')) {
    dateLabel = 'Yesterday';
  } else if (messageDate.isAfter(moment().subtract(1, 'week'))) {
    dateLabel = messageDate.format('dddd');
  } else if (messageDate.isAfter(moment().subtract(6, 'months'))) {
    dateLabel = messageDate.format('ddd, D MMM');
  } else {
    dateLabel = messageDate.format('D MMM YYYY');
  }

  return dateLabel;
};

export const getDateLabel2 = (timestamp: number) => {
  const messageDate = moment(timestamp);
  let dateLabel: string;

  if (messageDate.isSame(moment(), 'day')) {
    dateLabel = 'today';
  } else if (messageDate.isSame(moment().subtract(1, 'days'), 'day')) {
    dateLabel = 'yesterday';
  } else if (messageDate.isAfter(moment().subtract(1, 'week'))) {
    dateLabel = messageDate.format('ddd');
  } else {
    const date = new Date(timestamp);
    const browserLocale = navigator.language || 'en-US';
    dateLabel = date.toLocaleDateString(browserLocale, {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    });
  }

  return dateLabel;
};

export const getCurrentYear = () => new Date().getFullYear();

export const getTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const browserLocale = navigator.language || 'en-US';
  const time = date
    .toLocaleTimeString(browserLocale, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
    .toUpperCase();
  return time;
};

export const compareObjects = (first: any, second: any) => {
  if (first && second && first === second) return true;
  if (first === null || second === null) return false;
  if (typeof first !== 'object' || typeof second !== 'object') return false;
  const first_keys = Object.getOwnPropertyNames(first);
  const second_keys = Object.getOwnPropertyNames(second);
  if (first_keys?.length !== second_keys?.length) return false;
  for (const key of first_keys) {
    if (!Object.hasOwn(second, key)) return false;
    if (compareObjects(first[key], second[key]) === false) return false;
  }
  return true;
};

export const deleteKeyValuePairs = (obj: any, keysToDelete: any[]) => {
  const newObj = { ...obj };
  if (keysToDelete?.length) {
    keysToDelete?.forEach((key) => {
      if (key in newObj) {
        delete newObj[key];
      }
    });
  }
  return newObj;
};

export const checkKeys = (uniqueKeys: any[], item: any) => {
  let value = '';
  if (uniqueKeys?.length) {
    for (const key of uniqueKeys) {
      if (item?.[key]) {
        value = item[key];
        break;
      }
    }
  }
  return value;
};

export const debounce = (func: any, delay: number) => {
  let timeoutId: any;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const handleKeyPress = (event: KeyboardEvent, handler: any) => {
  if (event.key === 'Enter') {
    handler();
  }
};

const getTextEncoding = (text: string) => {
  const enc = new TextEncoder();
  return enc.encode(text);
};

const getCryptoKey = async (key: string) => {
  const encodedKey = new TextEncoder().encode(key);
  const res = await crypto.subtle.importKey(
    'raw',
    encodedKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  );
  return res;
};

const decodeBase64ToUint8Array = (data: string) => {
  try {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid Base64 input');
    }
    const binaryString = atob(data);
    return new Uint8Array(
      Array.from(binaryString).map((char) => char.charCodeAt(0)),
    );
  } catch (error) {
    console.error('Failed to decode Base64 string:', error);
    throw error;
  }
};

export const encrypt = async (data: string, secretKey: string) => {
  const encoded = getTextEncoding(data);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getCryptoKey(secretKey);
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded,
  );
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedData), iv.length);
  const res = btoa(String.fromCharCode(...combined));
  return res;
};

export const decrypt = async (data: string, secretKey: string) => {
  const combined = decodeBase64ToUint8Array(data);
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);
  const key = await getCryptoKey(secretKey);
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedData,
  );
  const res = new TextDecoder().decode(decryptedData);
  return res;
};

export const regex = {
  validateEmail:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  validatePassword:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
  validateURL:
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
  validatePhone:
    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  checkNumber: /^[0-9]+$/,
  checkNumberLengthTen: /^[0-9]{10}$/,
  validatePortNumber:
    /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  validateExtension: /^(\d{4})/,
  positiveNumbersOnly: /^[+]?([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/,
  alphaNumeric: /^[A-Za-z0-9 ]+$/,
  upperCaseLetters: /^[A-Z]{2}$/,
  validateName: /^[^0-9]+[A-Za-z0-9 &,;/()\\#^\\['.-]*$/,
  validateAlphabets: /^[A-Za-z ]+$/,
};

export const apiRoutes = {
  // Authentication
  AuthLogout: '/api/auth/logout',
};
