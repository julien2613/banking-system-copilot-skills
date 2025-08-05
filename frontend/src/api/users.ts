import { useQuery } from '@tanstack/react-query';
import { User, PaginatedResponse } from '../types';
import api from '../lib/axios';

export const useGetUsers = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<User>>({
    queryKey: ['users', { page, limit }],
    queryFn: async () => {
      const response = await api.get(`/users?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

export const useGetUser = (userId: number) => {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
  });
};

export const useGetUserBalance = () => {
  return useQuery<number>({
    queryKey: ['userBalance'],
    queryFn: async () => {
      const response = await api.get('/users/balance');
      return response.data;
    },
  });
};
