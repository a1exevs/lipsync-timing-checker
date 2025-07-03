import cn from 'classnames';
import React, { CSSProperties, MouseEvent } from 'react';

import { ResizerType } from 'src/pages/home/model/types';

type Props = {
  type: ResizerType;
  onMouseDown: (_: MouseEvent) => void;
  color: string;
  zIndex: number;
  widthPx: number;
};

const Resizer: React.FC<Props> = ({ onMouseDown, color, type, zIndex, widthPx }) => {
  const baseStyle: CSSProperties = {
    zIndex,
    width: `${widthPx}px`,
  };
  if (type === 'chain') {
    baseStyle.right = `-${widthPx / 2}px`;
  }
  return (
    <div
      onMouseDown={onMouseDown}
      style={baseStyle}
      className={cn('absolute top-0 h-full cursor-col-resize', {
        'left-0': type === 'left',
        'right-0': type === 'right',
      })}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = color;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
      }}
    />
  );
};

export default Resizer;
