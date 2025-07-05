import React from 'react';

import { sizes, variants } from 'src/shared/ui/icon-button/icon-button.consts';
import { Size, Variant } from 'src/shared/ui/icon-button/icon-button.types';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
};

const IconButton: React.FC<Props> = ({
  children,
  onClick,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.();
    if (e.detail !== 0) {
      e.currentTarget.blur();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      disabled={disabled}
      className={`rounded-full transition ${sizes[size]} ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
};

export default IconButton;
