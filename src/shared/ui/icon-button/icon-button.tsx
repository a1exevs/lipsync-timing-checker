import React from 'react';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizes = {
  sm: 'p-1 w-8 h-8',
  md: 'p-2 w-10 h-10',
  lg: 'p-3 w-12 h-12',
};

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

const IconButton: React.FC<Props> = ({
  children,
  onClick,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`rounded-full transition ${sizes[size]} ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
};

export default IconButton;
