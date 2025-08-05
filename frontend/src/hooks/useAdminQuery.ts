import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getUsers, getUserById, updateUserStatus } from '../services/api';
import { User } from '../types';

export const useUsers = (page = 1, limit = 10) => {
  const query = useQuery({
    queryKey: ['users', { page, limit }],
    queryFn: () => getUsers(page, limit),
    placeholderData: (previousData) => previousData,
  });

  React.useEffect(() => {
    if (query.isError) {
      const error = query.error as any;
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    }
  }, [query.isError, query.error]);

  return query;
};

export const useAdminUser = (userId: number) => {
  const query = useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => getUserById(userId),
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

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
      updateUserStatus(userId, isActive),
    onSuccess: (_data: User, { userId, isActive }: { userId: number; isActive: boolean }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', userId] });
      
      // Update the user in the users list cache if it exists
      queryClient.setQueryData(['users', 'list'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          users: old.users.map((user: User) =>
            user.id === userId ? { ...user, isActive } : user
          ),
        };
      });
      
      toast.success('User status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    },
  });
};
