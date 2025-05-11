import React, { CSSProperties, MouseEvent } from 'react';
import classes from 'src/pages/home/ui/resizer/resizer.module.scss';
import { ResizerSide } from 'src/pages/home/model/types';
import cn from 'classnames';

type Props = {
  side: ResizerSide;
  onMouseDown: (_: MouseEvent) => void;
  color: string;
  zIndex: number;
};

const Resizer: React.FC<Props> = ({ onMouseDown, color, side, zIndex }) => {
  return (
    <div
      style={{ ['--hover-color']: color, ['--z-index']: zIndex } as CSSProperties}
      className={cn(classes.Resizer, {
        [classes.Resizer_left]: side === 'left',
        [classes.Resizer_right]: side === 'right',
      })}
      onMouseDown={onMouseDown}
    ></div>
  );
};

export default Resizer;
