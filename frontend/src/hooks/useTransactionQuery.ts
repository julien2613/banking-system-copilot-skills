import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  getTransactions, 
  getTransactionById, 
  createTransaction, 
  transferMoney,
  getUserTransactions,
  getFlaggedTransactions,
  updateTransactionStatus
} from '../services/api';
import { TransferRequest } from '../types';

export const useTransactions = (page = 1, limit = 10) => {
  const query = useQuery({
    queryKey: ['transactions', { page, limit }],
    queryFn: () => getTransactions(page, limit),
    placeholderData: (previousData) => previousData,
  });

  React.useEffect(() => {
    if (query.isError) {
      const error = query.error as any;
      toast.error(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }, [query.isError, query.error]);

  return query;
};

export const useTransaction = (id: number) => {
  const query = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => getTransactionById(id),
    enabled: !!id,
  });

  React.useEffect(() => {
    if (query.isError) {
      const error = query.error as any;
      toast.error(error.response?.data?.message || 'Failed to fetch transaction');
    }
  }, [query.isError, query.error]);

  return query;
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (data: TransferRequest) => createTransaction(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast.success('Transaction created successfully');
      navigate('/transactions');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create transaction');
    },
  });
};

export const useTransferMoney = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (data: TransferRequest) => transferMoney(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast.success('Money transferred successfully');
      navigate('/transactions');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to transfer money');
    },
  });
};

export const useUserTransactions = (userId: number, page = 1, limit = 10) => {
  const query = useQuery({
    queryKey: ['user-transactions', userId, { page, limit }],
    queryFn: () => getUserTransactions(userId, page, limit),
    enabled: !!userId,
    placeholderData: (previousData) => previousData,
  });

  React.useEffect(() => {
    if (query.isError) {
      const error = query.error as any;
      toast.error(error.response?.data?.message || 'Failed to fetch user transactions');
    }
  }, [query.isError, query.error]);

  return query;
};

export const useFlaggedTransactions = (page = 1, limit = 10) => {
  const query = useQuery({
    queryKey: ['flagged-transactions', { page, limit }],
    queryFn: () => getFlaggedTransactions(page, limit),
    placeholderData: (previousData) => previousData,
  });

  React.useEffect(() => {
    if (query.isError) {
      const error = query.error as any;
      toast.error(error.response?.data?.message || 'Failed to fetch flagged transactions');
    }
  }, [query.isError, query.error]);

  return query;
};

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateTransactionStatus(id, status),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['flagged-transactions'] });
      
      toast.success('Transaction status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update transaction status');
    },
  });
};
