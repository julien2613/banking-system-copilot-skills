export type User = {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  balance: number;
  createdAt: string;
};

export type Transaction = {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'FLAGGED';
  isFlagged: boolean;
  createdAt: string;
};

export type TransferRequest = {
  receiverId: number;
  amount: number;
  description?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
