import moment from 'moment';
import { MessageData, OtherMember } from '../contexts';

export const formatDate = (dateValue: string | number | Date) => {
  const date = new Date(dateValue);
  return date
    .toLocaleString([], {
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: true,
    })
    .replace(/,/g, '')
    .trim();
};

export const getCurrentYear = () => new Date().getFullYear();

export const getTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return time;
};

export const checkIfImageExists = (
  url: string,
  callback: (exists: boolean) => void,
) => {
  const img = new Image();
  img.src = url || 'undefined';

  if (img.complete) {
    callback(true);
  } else {
    img.onload = () => {
      callback(true);
    };
    img.onerror = () => {
      callback(false);
    };
  }
};

export const chatHrefConstructor = (id1: string, id2: string) => {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
};

export const handleKeyPress = (event: KeyboardEvent, handler: any) => {
  if (event.key === 'Enter') {
    handler();
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
    dateLabel = messageDate.format('D MMM, YYYY');
  }

  return dateLabel;
};

export const groupMessages = (messages: any[] = [], _id: string) => {
  if (!messages?.length) return messages;

  const groupedByDay = messages.reduce((acc: any, message: any) => {
    const timestamp = message?.sender?.queuedStatus?.timestamp;

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
  // to do
  // fix wrong grouping of messages
  const timestamp = message?.sender?.queuedStatus?.timestamp;
  const dateLabel = getDateLabel(timestamp);
  const side = message.sender?._id === _id ? 'right' : 'left';
  const newGroup = {
    side,
    data: [message],
    // to do: include group details
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

    const senderGroupIndex = groupsCopy?.findIndex(
      (group: any) => group?.side === side,
    );

    if (senderGroupIndex < 0) {
      groupsCopy?.push(newGroup);
    } else {
      const senderGroup = groupsCopy[senderGroupIndex];
      groupsCopy[senderGroupIndex] = {
        ...senderGroup,
        data: [...senderGroup.data, message],
      };
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

export const checkIsMemberExists = (
  members: any[],
  key: string,
  _id: string,
) => {
  let isCurrentMember = false;
  let isOtherMember = false;

  for (const member of members) {
    if (member?._id === _id) {
      if (member[key] === true) {
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
    isRead = true;
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

export const uniqueArrayElements = (arr: any[], arrayToFilter: any[]) => {
  const uniqueQueuedMessages = arrayToFilter?.filter((queuedMessage: any) => {
    const isUnique = !arr?.some((cachedMessageGroup: any) =>
      cachedMessageGroup?.groups?.some((group: any) =>
        group?.data?.some(
          (msg: any) =>
            msg?.queueId === queuedMessage?.queueId &&
            msg?.sender?.queuedStatus?.isQueued === true &&
            !msg?.sender?.sentStatus,
        ),
      ),
    );
    return isUnique;
  });
  return uniqueQueuedMessages;
};

export const deleteKeyValuePairs = (keysToDelete: any[], obj: any) => {
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

export const debounce = (func: any, delay: number) => {
  let timeoutId: any;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
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
  AuthProfile: '/api/auth/profile',
  AuthLogout: '/api/auth/logout',
};
