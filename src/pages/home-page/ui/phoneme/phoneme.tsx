import cn from 'classnames';
import React, { MouseEvent } from 'react';

import {
  PHONEME_CHAIN_RESIZER_COLOR,
  PHONEME_LEFT_RESIZER_COLOR,
  PHONEME_RESIZER_WIDTH_PX,
  PHONEME_RESIZER_Z_INDEX,
  PHONEME_RIGHT_RESIZER_COLOR,
} from 'src/pages/home-page/ui/phoneme/phoneme.consts';
import Resizer from 'src/pages/home-page/ui/resizer/resizer';
import { ResizerType } from 'src/pages/home-page/ui/resizer/resizer.types';

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
      className={cn(
        'absolute text-black text-center border border-black rounded cursor-grab whitespace-nowrap bg-[#ffff99] hover:bg-[#ffff99aa] transition-colors duration-200 ease-in-out',
        {
          'border-l-0': withoutLeftBorder,
          'border-r-0': withoutRightBorder,
          'shadow-[0_4px_8px_0_white] u-translate-y-[5px] cursor-grabbing transition-transform transition-shadow duration-200 ease-in-out':
            movingInProgress,
        },
      )}
      style={{ width: `${widthPercent}%`, left: `${leftPercent}%` }}
      onMouseDown={e => onMoveStart(e, id)}
    >
      <Resizer
        type="left"
        onMouseDown={e => onResizeStart(e, id, 'left')}
        color={PHONEME_LEFT_RESIZER_COLOR}
        zIndex={PHONEME_RESIZER_Z_INDEX}
        widthPx={PHONEME_RESIZER_WIDTH_PX}
      />
      <div className="select-none">{phoneme}</div>
      <Resizer
        type="right"
        onMouseDown={e => onResizeStart(e, id, 'right')}
        color={PHONEME_RIGHT_RESIZER_COLOR}
        zIndex={PHONEME_RESIZER_Z_INDEX}
        widthPx={PHONEME_RESIZER_WIDTH_PX}
      />
      {!hideChainResizer && (
        <Resizer
          type="chain"
          onMouseDown={e => onChainResizeStart(e, id)}
          color={PHONEME_CHAIN_RESIZER_COLOR}
          zIndex={PHONEME_RESIZER_Z_INDEX}
          widthPx={PHONEME_RESIZER_WIDTH_PX}
        />
      )}
    </div>
  );
};

export default Phoneme;
