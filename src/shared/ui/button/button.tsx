import cn from 'classnames';
import React, { ReactNode } from 'react';

import { variantStyles } from 'src/shared/ui/button/button.consts';
import { IconPosition, Variant } from 'src/shared/ui/button/button.types';

type Props = {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  widthFull?: boolean;
  variant?: Variant;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  additionalClasses?: string;
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
