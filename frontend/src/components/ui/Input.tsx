import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type InputSize = 'xs' | 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'error' | 'success' | 'warning';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  id?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  warning?: boolean;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const sizeClasses: Record<InputSize, string> = {
  xs: 'px-2 py-1 text-xs rounded',
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-md',
  lg: 'px-6 py-3 text-lg rounded-md',
};

const variantClasses: Record<InputVariant, string> = {
  default: 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
  error: 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500',
  success: 'border-green-300 text-green-900 placeholder-green-300 focus:ring-green-500 focus:border-green-500',
  warning: 'border-yellow-300 text-yellow-900 placeholder-yellow-300 focus:ring-yellow-500 focus:border-yellow-500',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      helperText,
      error = false,
      success = false,
      warning = false,
      size = 'md',
      variant = 'default',
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const inputVariant: InputVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
    const inputSize = sizeClasses[size] || sizeClasses.md;
    const inputVariantClass = variantClasses[inputVariant];
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    const inputClasses = clsx(
      'block w-full border shadow-sm',
      'focus:outline-none focus:ring-1',
      'transition-colors duration-200',
      'disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-500',
      inputSize,
      inputVariantClass,
      hasLeftIcon && 'pl-10',
      hasRightIcon && 'pr-10',
      className
    );

    const containerClasses = clsx(
      'space-y-1',
      fullWidth ? 'w-full' : 'max-w-md',
      containerClassName
    );

    const helperTextClasses = clsx('text-sm', {
      'text-gray-500': !error && !success && !warning,
      'text-red-600': error,
      'text-green-600': success,
      'text-yellow-600': warning,
    });

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={inputClasses}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
        {helperText && <p className={helperTextClasses}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
