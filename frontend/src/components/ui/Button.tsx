import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { Loader } from './Loader';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline:
    'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-primary-500',
  link: 'bg-transparent hover:underline text-primary-600 hover:text-primary-800 p-0 h-auto',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      type = 'button',
      disabled = false,
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const buttonClasses = clsx(
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'transition-colors duration-200',
      variant !== 'link' && 'border border-transparent',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      isDisabled && 'opacity-50 cursor-not-allowed',
      className
    );

    return (
      <button
        ref={ref}
        type={type as 'button' | 'submit' | 'reset' | undefined}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <span className="mr-2">
            <Loader size="xs" color="border-white" />
          </span>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const IconButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'leftIcon' | 'rightIcon'>>(
  ({ children, className = '', size = 'md', ...props }, ref) => {
    const iconButtonClasses = clsx(
      'inline-flex items-center justify-center',
      'rounded-full',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'transition-colors duration-200',
      'text-gray-500 hover:bg-gray-100',
      'dark:text-gray-400 dark:hover:bg-gray-700',
      size === 'xs' && 'p-1',
      size === 'sm' && 'p-1.5',
      size === 'md' && 'p-2',
      size === 'lg' && 'p-3',
      size === 'xl' && 'p-4',
      className
    );

    return (
      <button
        ref={ref}
        type="button"
        className={iconButtonClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
