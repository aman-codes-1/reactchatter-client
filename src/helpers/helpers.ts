import moment from 'moment';
import 'moment/min/locales';
import { jwtDecode } from 'jwt-decode';
import { MessageData, OtherMember } from '../contexts';

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

export const renderMember = (members: any[], _id: string) => {
  let currentMember;
  let otherMember;

  for (const member of members) {
    if (member?._id === _id) {
      currentMember = member;
    } else if (member?._id !== _id) {
      otherMember = member;
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
  fetchAll: any,
  toggleDrawer?: any,
) => {
  setIsListItemClicked((prev: boolean) => !prev);

  let id;
  let type;
  let skipFinally = false;

  try {
    id = item?._id;
    type =
      item?.type === 'private' || item?.type === 'group' ? 'chat' : item?.type;
    if (id && type) {
      if (type === 'chat') {
        await getChatMessagesWithQueue(id, 'chatId');
      }
      if (type === 'friend') {
        if (item?.hasChats) {
          toggleDrawer?.();
          navigate('/');
          await fetchAll();
          skipFinally = true;
          return;
        }
        await getChatMessagesWithQueue(id, 'friendId');
      }
    } else {
      skipFinally = true;
    }
  } catch (error: any) {
    console.error('Error fetching messages:', error);
  } finally {
    if (!skipFinally) {
      setSelectedItem(item);
      setSelectedDetails(details);
      toggleDrawer?.();
      navigate(`/chat?id=${id}&type=${type}`);
    }
  }
};

export const checkScrollbar = (ref: any, setHasScrollbar: any) => {
  const listElement = ref?.current;
  if (listElement) {
    const { scrollHeight, clientHeight } = listElement;
    setHasScrollbar(scrollHeight > clientHeight);
  }
};

export const setFocus = (ref: any) => {
  const listElement = ref?.current;
  if (listElement) {
    listElement?.focus();
  }
};

export const updateHeight = (ref: any, setHeight: any) => {
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

export const scrollIntoView = (ref: any) => {
  const listElement = ref?.current;
  if (listElement) {
    listElement?.scrollIntoView?.({ block: 'end', inline: 'nearest' });
  }
};

export const scrollToSelected = (
  ref: any,
  itemsRef: any,
  listItems: any[],
  selectedListItem: any,
) => {
  const selectedItemIndex = listItems?.findIndex(
    (item) => item?._id === selectedListItem?._id,
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
  return data?.filter((el: any) => el?._id !== targetId);
};

export const addRequest = (OnRequestAddedRequest: any, existingData: any) => {
  let data = existingData?.data;
  let totalCount = existingData?.totalCount;
  if (OnRequestAddedRequest && data?.length && totalCount) {
    data = [OnRequestAddedRequest, ...data];
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

export const addObject = (dataToAdd: any, existingData: any) => {
  let data = existingData;
  if (dataToAdd && data?.length) {
    data = [dataToAdd, ...data];
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
    index = data?.findIndex((el: any) => el?.[key] === id);
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
    const index = data?.findIndex((el: any) => el?.[key] === id);
    if (index >= 0) {
      const dataCopy = [...data];
      const [foundElement] = dataCopy.splice(index, 1);
      dataCopy.unshift(foundElement);
      data = dataCopy;
    }
    return data;
  }
};

export const groupMessages = (messages: any[] = [], _id: string) => {
  if (!messages?.length) return messages;

  const groupedByDay = messages.reduce((acc: any, message: any) => {
    const timestamp = message?.timestamp;

    if (timestamp) {
      const dateLabel = getDateLabel(timestamp);

      if (!acc[dateLabel]) {
        acc[dateLabel] = [];
      }

      acc[dateLabel].push(message);
    }

    return acc;
  }, {});

  const flattenedMessages = Object.entries(groupedByDay).map(
    ([dateLabel, messages]: any) => ({
      dateLabel,
      groups: messages
        ?.reduce((acc: any, message: any) => {
          const lastGroup = acc && acc?.length ? acc?.[acc?.length - 1] : null;
          const isSameSender = lastGroup
            ? lastGroup?.[0]?.sender?._id === message?.sender?._id
            : false;
          if (isSameSender) {
            lastGroup.push(message);
          } else {
            acc.push([message]);
          }
          return acc;
        }, [])
        .map((msgGroups: any) => ({
          side: msgGroups?.[0]?.sender?._id === _id ? 'right' : 'left',
          data: msgGroups,
          groupDetails: msgGroups?.[0]?.sender,
        })),
    }),
  );

  return flattenedMessages;
};

export const unGroupMessages = (messageGroups: any[]) => {
  const unGroupedMessages = messageGroups.flatMap((day) =>
    day?.groups?.flatMap((group: any) => group?.data),
  );

  return unGroupedMessages;
};

export const groupMessage = (
  messageGroups: any[] = [],
  message: any,
  _id: string,
) => {
  const timestamp = message?.timestamp;
  const dateLabel = getDateLabel(timestamp);
  const side = message.sender?._id === _id ? 'right' : 'left';
  const newGroup = {
    side,
    data: [message],
    groupDetails: message?.sender,
  };

  const messageGroupsCopy = [...messageGroups];
  const messageGroupIndex = messageGroupsCopy?.findIndex(
    (messageGroup) => messageGroup?.dateLabel === dateLabel,
  );

  if (messageGroupIndex < 0) {
    const newGroupData = {
      dateLabel,
      groups: [newGroup],
    };

    messageGroupsCopy?.push(newGroupData);
  } else {
    const messageGroup = messageGroupsCopy[messageGroupIndex];
    const groupsCopy = [...messageGroup.groups];

    const lastGroupIndex = groupsCopy.length - 1;
    const lastGroup = groupsCopy[lastGroupIndex];

    if (lastGroup && lastGroup?.side === side) {
      groupsCopy[lastGroupIndex] = {
        ...lastGroup,
        data: [...lastGroup.data, message],
      };
    } else {
      groupsCopy.push(newGroup);
    }

    const updatedGroup = { ...messageGroup, groups: groupsCopy };
    messageGroupsCopy[messageGroupIndex] = updatedGroup;
  }

  return messageGroupsCopy;
};

export const updateGroupedQueuedMessage = (
  messageGroups: any[] = [],
  queueId: string,
  newMessage: any,
  _id: string,
) => {
  let messageFound = false;
  let updatedMessageGroups = [];

  updatedMessageGroups = messageGroups?.map((messageGroup) => ({
    ...messageGroup,
    groups: messageGroup?.groups?.map((group: any) => ({
      ...group,
      data: group?.data?.map((message: any) => {
        if (message?.queueId === queueId) {
          messageFound = true;
          return newMessage;
        }
        return message;
      }),
    })),
  }));

  if (!messageFound) {
    updatedMessageGroups = groupMessage(updatedMessageGroups, newMessage, _id);
  }

  return updatedMessageGroups;
};

export const mergeAllByDateLabel = (prevArray: any[], newArray: any[]) => {
  const map = new Map();

  newArray?.forEach((item) => {
    map.set(item?.dateLabel, structuredClone(item));
  });

  prevArray?.forEach((item) => {
    if (map.has(item?.dateLabel)) {
      const existingItem = map.get(item?.dateLabel);
      existingItem.groups = [...item.groups, ...existingItem.groups];
    } else {
      map.set(item?.dateLabel, structuredClone(item));
    }
  });

  const mergedArray = Array.from(map.values()).map((item) => {
    const mergedGroups: any[] = [];
    item?.groups?.forEach((group: any) => {
      const lastGroupIndex = mergedGroups?.length - 1;
      const lastGroup = mergedGroups[lastGroupIndex];
      if (lastGroup && lastGroup?.side === group?.side) {
        lastGroup.data = [...lastGroup.data, ...group.data];
      } else {
        mergedGroups?.push(structuredClone(group));
      }
    });

    return {
      ...item,
      groups: mergedGroups,
    };
  });

  return mergedArray;
};

export const mergeLastByDateLabel = (prevArray: any[], newArray: any[]) => {
  const prevArrayFirstGroup = prevArray[0];
  const newArrayLastIndex = newArray?.length - 1;
  const newArrayLastGroup = newArray[newArrayLastIndex];

  if (prevArrayFirstGroup?.dateLabel === newArrayLastGroup?.dateLabel) {
    const combinedGroups = [
      ...newArrayLastGroup.groups,
      ...prevArrayFirstGroup.groups,
    ];
    const mergedGroups: any[] = [];

    combinedGroups?.forEach((group) => {
      const lastGroupIndex = mergedGroups?.length - 1;
      const lastGroup = mergedGroups[lastGroupIndex];
      if (lastGroup && lastGroup?.side === group?.side) {
        lastGroup.data = [...lastGroup.data, ...group.data];
      } else {
        mergedGroups?.push(structuredClone(group));
      }
    });

    const mergedFirstGroup = {
      ...prevArrayFirstGroup,
      groups: mergedGroups,
    };

    return [
      ...newArray.slice(0, newArrayLastIndex),
      mergedFirstGroup,
      ...prevArray.slice(1),
    ];
  }

  return [...newArray, ...prevArray];
};

export const getLastMessage = (edges: any[]) => {
  const lastEdgeIndex = edges?.length - 1;
  const lastEdge = edges[lastEdgeIndex];
  const lastGroup = lastEdge?.groups?.[lastEdge?.groups?.length - 1];
  const lastMessage = lastGroup?.data?.[lastGroup?.data?.length - 1] || null;
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
    const sender = members?.find((member: any) => member?._id === _id);
    if (sender) {
      const { hasAdded, ...rest } = sender || {};
      return {
        ...rest,
        retryStatus: null,
        queuedStatus: {
          isQueued: true,
          timestamp,
        },
        sentStatus: null,
      };
    }
    return {};
  }
  return {};
};

export const checkIsMemberExists = (
  members: any[],
  key: string,
  _id: string,
) => {
  let isCurrentMember = false;
  let isOtherMember = false;

  for (const member of members) {
    if (member?._id === _id) {
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

export const uniqueQueuedMessages = (arr: any[], arrayToFilter: any[]) => {
  const uniqueMessages = arrayToFilter?.filter((queuedMessage: any) => {
    const isUnique = !arr?.some((cachedMessageGroup: any) =>
      cachedMessageGroup?.groups?.some((group: any) =>
        group?.data?.some(
          (msg: any) =>
            msg?.queueId === queuedMessage?.queueId &&
            msg?.sender?.queuedStatus?.isQueued &&
            !msg?.sender?.sentStatus,
        ),
      ),
    );
    return isUnique;
  });
  return uniqueMessages;
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
        !expectedTypeParams.some((typeParam) => typeParam === value)
      ) {
        return false;
      }
      return true;
    });
    return isValid;
  }
  return false;
};

export const sortByTimestamp = (data: any[]) => {
  const sortedData = [...data].sort((a, b) => {
    const timestampA = a?.lastMessage?.timestamp || a?.createdAt || 0;
    const timestampB = b?.lastMessage?.timestamp || b?.createdAt || 0;
    return timestampB - timestampA;
  });
  return sortedData;
};

export const getOnlineStatus = (isOnline: boolean) => {
  return {
    isOnline,
    lastSeen: Date.now(),
  };
};

export const handleKeyPress = (event: KeyboardEvent, handler: any) => {
  if (event.key === 'Enter') {
    handler();
  }
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
  if (first === second) return true;
  if (first === null || second === null) return false;
  if (typeof first !== 'object' || typeof second !== 'object') return false;
  const first_keys = Object.getOwnPropertyNames(first);
  const second_keys = Object.getOwnPropertyNames(second);
  if (first_keys.length !== second_keys.length) return false;
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

export const debounce = (func: any, delay: number) => {
  let timeoutId: any;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
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
