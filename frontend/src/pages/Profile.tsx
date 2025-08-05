import { useState } from 'react';
import { MainLayout } from '../components/layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { User } from '../types';

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  currentPassword: Yup.string(),
  newPassword: Yup.string()
    .when('currentPassword', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
    }),
  confirmPassword: Yup.string()
    .when('newPassword', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your new password'),
    }),
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user) {
    return null; // or redirect to login
  }

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);
        
        // Prepare update data
        const updateData: Partial<User> & { currentPassword?: string; newPassword?: string } = {
          name: values.name,
          email: values.email,
        };
        
        // Add password fields if current password is provided
        if (values.currentPassword) {
          updateData.currentPassword = values.currentPassword;
          updateData.newPassword = values.newPassword;
        }
        
        // Call update profile
        if (updateProfile) {
          await updateProfile(updateData);
        }
        
        // Reset password fields on success
        if (values.currentPassword) {
          resetForm({
            values: {
              ...values,
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            },
          });
        }
        
        toast.success('Profile updated successfully!');
      } catch (error) {
        console.error('Update failed:', error);
        toast.error('Failed to update profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Profile Settings
            </h2>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information and email address.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border ${
                        formik.touched.name && formik.errors.name
                          ? 'border-red-300'
                          : 'border-gray-300'
                      } rounded-md`}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border ${
                        formik.touched.email && formik.errors.email
                          ? 'border-red-300'
                          : 'border-gray-300'
                      } rounded-md`}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Leave these fields blank if you don't want to change your password.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formik.values.currentPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border ${
                          formik.touched.currentPassword && formik.errors.currentPassword
                            ? 'border-red-300'
                            : 'border-gray-300'
                        } rounded-md`}
                      />
                      {formik.touched.currentPassword && formik.errors.currentPassword && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.currentPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border ${
                          formik.touched.newPassword && formik.errors.newPassword
                            ? 'border-red-300'
                            : 'border-gray-300'
                        } rounded-md`}
                      />
                      {formik.touched.newPassword && formik.errors.newPassword && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.newPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm new password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border ${
                          formik.touched.confirmPassword && formik.errors.confirmPassword
                            ? 'border-red-300'
                            : 'border-gray-300'
                        } rounded-md`}
                      />
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => formik.resetForm()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formik.dirty}
                    className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                      isLoading || !formik.dirty
                        ? 'bg-primary-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
