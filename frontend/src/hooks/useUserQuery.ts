import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateUser, getUserById } from '../services/api';
import { User } from '../types';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<User>) => updateUser(data),
    onSuccess: (data: User) => {
      // Update the user data in the cache
      queryClient.setQueryData(['user'], data);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};

export const useUser = (userId?: number) => {
  const query = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => userId ? getUserById(userId) : Promise.reject('User ID is required'),
    enabled: !!userId,
  });

  React.useEffect(() => {
    if (query.isError) {
      const error = query.error as any;
      toast.error(error.response?.data?.message || 'Failed to fetch user');
    }
  }, [query.isError, query.error]);

  return query;
};

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: () => ({} as User),
    enabled: false, // We'll populate this from the auth context
  });
};
