import React, { CSSProperties, MouseEvent } from 'react';
import classes from 'src/pages/home/ui/resizer/resizer.module.scss';
import { ResizerType } from 'src/pages/home/model/types';
import cn from 'classnames';

type Props = {
  type: ResizerType;
  onMouseDown: (_: MouseEvent) => void;
  color: string;
  zIndex: number;
  width: string | number;
};

const Resizer: React.FC<Props> = ({ onMouseDown, color, type, zIndex, width }) => {
  return (
    <div
      style={{ ['--hover-color']: color, ['--z-index']: zIndex, ['--width']: width } as CSSProperties}
      className={cn(classes.Resizer, {
        [classes.Resizer_left]: type === 'left',
        [classes.Resizer_right]: type === 'right',
        [classes.Resizer_chain]: type === 'chain',
      })}
      onMouseDown={onMouseDown}
    ></div>
  );
};

export default Resizer;
