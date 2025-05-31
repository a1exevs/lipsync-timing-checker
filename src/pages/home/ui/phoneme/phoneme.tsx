import classes from 'src/pages/home/ui/phoneme/phoneme.module.scss';
import React, { MouseEvent } from 'react';
import cn from 'classnames';
import { ResizerType } from 'src/pages/home/model/types';
import Resizer from 'src/pages/home/ui/resizer/resizer';
import {
  PHONEME_CHAIN_RESIZER_COLOR,
  PHONEME_LEFT_RESIZER_COLOR,
  PHONEME_RESIZER_WIDTH,
  PHONEME_RESIZER_WIDTH_PX,
  PHONEME_RESIZER_Z_INDEX,
  PHONEME_RIGHT_RESIZER_COLOR,
} from 'src/pages/home/ui/phoneme/phoneme.consts';
import { WORD_CHAIN_RESIZER_COLOR, WORD_RESIZER_Z_INDEX } from 'src/pages/home/ui/word/word.consts';

type Props = {
  id: string;
  phoneme: string;
  leftPercent: number;
  widthPercent: number;
  withoutLeftBorder?: boolean;
  withoutRightBorder?: boolean;
  onResizeStart: (event: MouseEvent, phonemeId: string, resizerType: ResizerType) => void;
  hideChainResizer?: boolean;
  onChainResizeStart: (event: MouseEvent, phonemeId: string) => void;
  onMoveStart: (event: MouseEvent, phonemeId: string) => void;
  movingInProgress: boolean;
};

const Phoneme: React.FC<Props> = ({
  id,
  phoneme,
  leftPercent,
  widthPercent,
  withoutLeftBorder,
  withoutRightBorder,
  onResizeStart,
  hideChainResizer,
  onChainResizeStart,
  onMoveStart,
  movingInProgress,
}) => {
  return (
    <div
      className={cn(classes.Phoneme, {
        [classes.Phoneme_withoutLeftBorder]: withoutLeftBorder,
        [classes.Phoneme_withoutRightBorder]: withoutRightBorder,
        [classes.Phoneme_draggable]: movingInProgress,
      })}
      style={{ width: `${widthPercent}%`, left: `${leftPercent}%` }}
      onMouseDown={e => onMoveStart(e, id)}
    >
      <Resizer
        type="left"
        onMouseDown={e => onResizeStart(e, id, 'left')}
        color={PHONEME_LEFT_RESIZER_COLOR}
        zIndex={PHONEME_RESIZER_Z_INDEX}
        width={PHONEME_RESIZER_WIDTH}
      />
      <div className={classes.Phoneme__Title}>{phoneme}</div>
      <Resizer
        type="right"
        onMouseDown={e => onResizeStart(e, id, 'right')}
        color={PHONEME_RIGHT_RESIZER_COLOR}
        zIndex={PHONEME_RESIZER_Z_INDEX}
        width={PHONEME_RESIZER_WIDTH}
      />
      {!hideChainResizer && (
        <Resizer
          type="chain"
          onMouseDown={e => onChainResizeStart(e, id)}
          color={PHONEME_CHAIN_RESIZER_COLOR}
          zIndex={PHONEME_RESIZER_Z_INDEX}
          width={PHONEME_RESIZER_WIDTH}
        />
      )}
    </div>
  );
};

export default Phoneme;
