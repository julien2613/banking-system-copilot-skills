import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { MainLayout } from '../components/layouts/MainLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { transferMoney } from '../services/api';
import { transferSchema } from '../utils/validation';
import { TransferRequest } from '../types';

type TransferFormValues = {
  recipientEmail: string;
  amount: string;
  description: string;
  submit?: string;
};

const Transfer: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Define the mutation with proper types
  const { mutate: transfer, isPending: isTransferring } = useMutation({
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

  const initialValues: TransferFormValues = {
    recipientEmail: '',
    amount: '',
    description: '',
  };

  const handleSubmit = async (
    values: TransferFormValues,
    { setSubmitting }: FormikHelpers<TransferFormValues>
  ) => {
    // In a real app, you would first look up the user by email to get their ID
    // For now, we'll use a placeholder ID and handle the error
    const receiverId = 1; // This should be replaced with actual user lookup
    
    const transferData: TransferRequest = {
      receiverId,
      amount: parseFloat(values.amount),
      description: values.description || undefined,
    };

    // Call the mutation function
    transfer(transferData, {
      onSettled: () => {
        setSubmitting(false);
      }
    });
    
    // Reset form after successful submission is handled in onSuccess
  };

  const formik = useFormik<TransferFormValues>({
    initialValues,
    validationSchema: transferSchema,
    onSubmit: handleSubmit,
  });

  // Helper to check if field has an error
  const hasError = (field: keyof TransferFormValues): boolean => {
    return !!(formik.touched[field] && formik.errors[field]);
  };

  // Helper to get error message
  const getErrorMessage = (field: keyof TransferFormValues): string => {
    return formik.touched[field] && formik.errors[field] ? String(formik.errors[field]) : '';
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Transfer Money</h1>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Input
            label="Recipient Email"
            id="recipientEmail"
            name="recipientEmail"
            type="email"
            placeholder="Enter recipient's email"
            value={formik.values.recipientEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={hasError('recipientEmail')}
            helperText={getErrorMessage('recipientEmail')}
            required
          />
          
          <div>
            <Input
              label="Amount"
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError('amount')}
              helperText={getErrorMessage('amount')}
              leftIcon={
                <span className="text-gray-500 sm:text-sm">$</span>
              }
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Minimum amount: $0.01
            </p>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className={`block w-full border ${
                hasError('description') ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
              placeholder="Add a note about this transfer"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {hasError('description') && (
              <p className="text-sm text-red-600">{getErrorMessage('description')}</p>
            )}
          </div>
          
          {formik.errors.submit && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {formik.errors.submit}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isTransferring}
              disabled={!formik.isValid || isTransferring}
            >
              Transfer Money
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default Transfer;
