import { get, post, put } from '../utils/api';
import { User, Transaction, TransferRequest } from '../types';

// Auth API
export const login = (email: string, password: string) =>
  post<{ user: User; accessToken: string }>('/auth/login', { email, password });

export const register = (name: string, email: string, password: string) =>
  post<{ user: User; accessToken: string }>('/auth/register', { name, email, password });

// User API
export const getCurrentUser = () => get<User>('/users/me');

export const updateUser = (data: Partial<User>) =>
  put<User>('/users/me', data);

export const getUserTransactions = (userId: number, page = 1, limit = 10) =>
  get<{ transactions: Transaction[]; total: number }>(
    `/users/${userId}/transactions?page=${page}&limit=${limit}`
  );

// Transactions API
export const getTransactions = (page = 1, limit = 10) =>
  get<{ transactions: Transaction[]; total: number }>(
    `/transactions?page=${page}&limit=${limit}`
  );

export const getTransactionById = (id: number) =>
  get<Transaction>(`/transactions/${id}`);

export const createTransaction = (data: TransferRequest) =>
  post<Transaction>('/transactions', data);

// Transfer API
export const transferMoney = (data: TransferRequest) =>
  post<Transaction>('/transactions/transfer', data);

// Admin API
export const getUsers = (page = 1, limit = 10) =>
  get<{ users: User[]; total: number }>(`/admin/users?page=${page}&limit=${limit}`);

export const getUserById = (id: number) => get<User>(`/admin/users/${id}`);

export const updateUserStatus = (id: number, isActive: boolean) =>
  put<User>(`/admin/users/${id}/status`, { isActive });

export const getFlaggedTransactions = (page = 1, limit = 10) =>
  get<{ transactions: Transaction[]; total: number }>(
    `/admin/transactions/flagged?page=${page}&limit=${limit}`
  );

export const updateTransactionStatus = (id: number, status: string) =>
  put<Transaction>(`/admin/transactions/${id}/status`, { status });
