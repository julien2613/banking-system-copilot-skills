import { useMutation, useQuery } from '@tanstack/react-query';
import { LoginRequest, RegisterRequest, User } from '../types';
import api from '../lib/axios';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: Omit<RegisterRequest, 'confirmPassword'>) => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data;
    },
  });
};
