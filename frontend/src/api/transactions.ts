import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Transaction, TransferRequest, PaginatedResponse } from '../types';
import api from '../lib/axios';

export const useTransferMoney = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TransferRequest) => {
      const response = await api.post('/transactions/transfer', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useGetTransactions = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: ['transactions', { page, limit }],
    queryFn: async () => {
      const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

export const useGetUserTransactions = (userId: number, page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: ['userTransactions', userId, { page, limit }],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}/transactions?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};
