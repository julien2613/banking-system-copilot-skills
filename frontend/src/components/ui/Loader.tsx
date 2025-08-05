import { FC } from 'react';
import clsx from 'clsx';

type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoaderProps {
  size?: LoaderSize;
  className?: string;
  color?: string;
}

const sizeMap: Record<LoaderSize, string> = {
  xs: 'h-4 w-4 border-2',
  sm: 'h-6 w-6 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
  xl: 'h-16 w-16 border-4',
};

export const Loader: FC<LoaderProps> = ({
  size = 'md',
  className = '',
  color = 'border-primary-500',
}) => {
  const sizeClass = sizeMap[size] || sizeMap.md;
  
  return (
    <div className={clsx('relative', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full',
          'border-solid border-t-transparent',
          sizeClass,
          color,
          'border-opacity-20',
          'ease-linear'
        )}
        style={{
          borderWidth: '0.2em',
          borderTopColor: 'currentColor',
          borderRightColor: 'currentColor',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
        }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export const PageLoader: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={clsx('min-h-screen flex items-center justify-center', className)}>
    <Loader size="xl" />
  </div>
);

export const ButtonLoader: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={clsx('inline-block', className)}>
    <Loader size="sm" className="mx-auto" color="border-white" />
  </div>
);

export const InlineLoader: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={clsx('inline-block', className)}>
    <Loader size="xs" className="inline-block mr-2 -mt-1" />
  </div>
);
