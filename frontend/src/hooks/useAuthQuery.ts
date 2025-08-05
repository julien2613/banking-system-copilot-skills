import * as React from 'react';
import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, register, getCurrentUser } from '../services/api';
import { User } from '../types';

interface LoginResponse {
  user: User;
  accessToken: string;
}

interface RegisterResponse {
  user: User;
  accessToken: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useLogin = (options?: UseMutationOptions<LoginResponse, Error, LoginCredentials>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: ({ email, password }) => login(email, password),
    ...options,
    onSuccess: (data, variables, context) => {
      // Update the auth state
      queryClient.setQueryData(['user'], data.user);
      // Store the token
      localStorage.setItem('token', data.accessToken);
      // Redirect to dashboard
      navigate('/dashboard');
      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options?.onError,
    onMutate: options?.onMutate,
    onSettled: options?.onSettled
  });
};

export const useRegister = (options?: UseMutationOptions<RegisterResponse, Error, RegisterData>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: (data) => register(data.name, data.email, data.password),
    ...options,
    onSuccess: (data, variables, context) => {
      // Update the auth state
      queryClient.setQueryData(['user'], data.user);
      // Store the token
      localStorage.setItem('token', data.accessToken);
      // Redirect to dashboard
      navigate('/dashboard');
      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options?.onError,
    onMutate: options?.onMutate,
    onSettled: options?.onSettled
  });
};

type UserQueryOptions = Omit<UseQueryOptions<User, Error, User, readonly unknown[]>, 'queryKey' | 'queryFn' | 'onError'> & {
  onError?: (error: Error) => void;
};

export const useUser = (options?: UserQueryOptions) => {
  const { onError, ...restOptions } = options || {};
  
  const queryOptions: UseQueryOptions<User, Error, User, readonly unknown[]> = {
    ...restOptions,
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
  };
  
  const query = useQuery<User, Error>(queryOptions);
  
  // Handle error side effect
  React.useEffect(() => {
    if (query.isError) {
      // If there's an error fetching the user, clear any existing token
      localStorage.removeItem('token');
      
      // Call the original onError if it exists
      if (onError) {
        onError(query.error);
      }
    }
  }, [query.isError, query.error, onError]);
  
  return query;
};

export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      // Clear the token
      localStorage.removeItem('token');
      // Clear the user data from the cache
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      // Redirect to login
      navigate('/login');
    },
    ...options,
    onSettled: (...args: [any, any, any, any]) => {
      // Ensure the query cache is cleared
      queryClient.clear();
      
      // Call the original onSettled if it exists
      if (options?.onSettled) {
        options.onSettled(...args);
      }
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
    onMutate: options?.onMutate
  });
};
