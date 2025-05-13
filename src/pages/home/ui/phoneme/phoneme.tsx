import classes from 'src/pages/home/ui/phoneme/phoneme.module.scss';
import React, { MouseEvent } from 'react';
import cn from 'classnames';
import { ResizerType } from 'src/pages/home/model/types';
import Resizer from 'src/pages/home/ui/resizer/resizer';
import {
  PHONEME_LEFT_RESIZER_COLOR,
  PHONEME_RESIZER_Z_INDEX,
  PHONEME_RIGHT_RESIZER_COLOR,
} from 'src/pages/home/ui/phoneme/phoneme.consts';

type Props = {
  id: string;
  phoneme: string;
  leftPercent: number;
  widthPercent: number;
  withoutLeftBorder?: boolean;
  withoutRightBorder?: boolean;
  onResizeStart: (event: MouseEvent, phonemeId: string, resizerType: ResizerType) => void;
};

const Phoneme: React.FC<Props> = ({
  id,
  phoneme,
  leftPercent,
  widthPercent,
  withoutLeftBorder,
  withoutRightBorder,
  onResizeStart,
}) => {
  return (
    <div
      className={cn(classes.Phoneme, {
        [classes.Phoneme_withoutLeftBorder]: withoutLeftBorder,
        [classes.Phoneme_withoutRightBorder]: withoutRightBorder,
      })}
      style={{ width: `${widthPercent}%`, left: `${leftPercent}%` }}
    >
      <Resizer
        type="left"
        onMouseDown={e => onResizeStart(e, id, 'left')}
        color={PHONEME_LEFT_RESIZER_COLOR}
        zIndex={PHONEME_RESIZER_Z_INDEX}
      />
      <div className={classes.Phoneme__Title}>{phoneme}</div>
      <Resizer
        type="right"
        onMouseDown={e => onResizeStart(e, id, 'right')}
        color={PHONEME_RIGHT_RESIZER_COLOR}
        zIndex={PHONEME_RESIZER_Z_INDEX}
      />
    </div>
  );
};

export default Phoneme;
