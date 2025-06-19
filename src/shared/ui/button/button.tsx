import React, { MouseEventHandler, ReactNode } from 'react';
import cn from 'classnames';

type Variant = 'primary' | 'secondary' | 'danger';
type IconPosition = 'left' | 'right';

type Props = {
  text: string;
  onClick: MouseEventHandler;
  disabled?: boolean;
  widthFull?: boolean;
  variant?: Variant;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  additionalClasses?: string;
};

const variantStyles: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

const Button: React.FC<Props> = ({
  text,
  onClick,
  disabled = false,
  widthFull = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  additionalClasses = '',
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        {
          'w-full': widthFull,
          'flex-row-reverse': icon && iconPosition === 'right',
        },
        additionalClasses,
      )}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default Button;
