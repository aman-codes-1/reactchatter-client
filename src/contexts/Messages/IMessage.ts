type RetryStatus = {
  isRetry: boolean;
  timestamp: number;
} | null;

type QueuedStatus = {
  isQueued: boolean;
  timestamp: number;
};

type SentStatus = {
  isSent: boolean;
  timestamp: number;
} | null;

type DeliveredStatus = {
  isDelivered: boolean;
  timestamp: number;
} | null;

type ReadStatus = {
  isRead: boolean;
  timestamp: number;
} | null;

type Sender = {
  _id: string;
  retryStatus: RetryStatus;
  queuedStatus: QueuedStatus;
  sentStatus: SentStatus;
};

type OtherMember = {
  _id: string;
  deliveredStatus: DeliveredStatus;
  readStatus: ReadStatus;
};

export type MessageData = {
  _id: string;
  queueId?: string;
  chatId?: string;
  friendId?: string;
  friendUserId?: string;
  message: string;
  sender: Sender;
  otherMembers?: OtherMember[];
  timestamp: number;
};
