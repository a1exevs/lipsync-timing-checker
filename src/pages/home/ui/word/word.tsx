import React, { MouseEvent } from 'react';
import classes from 'src/pages/home/ui/word/word.module.scss';
import cn from 'classnames';
import { AudioTrackTextItemDTO, Phoneme, ResizerSide } from 'src/pages/home/model/types';
import PhonemeComponent from 'src/pages/home/ui/phoneme/phoneme';

type Props = {
  id: string;
  widthPx: number;
  leftPx: number;
  word: string;
  start: number;
  end: number;
  phonemes: Phoneme[];
  selected: boolean;
  hideLeftResizer?: boolean;
  hideRightResizer?: boolean;
  onResizeStart: (event: MouseEvent, wordId: string, resizerSide: ResizerSide) => void;
};

const Word: React.FC<Props> = React.memo(
  ({ word, widthPx, leftPx, onResizeStart, id, phonemes, selected, start, end, hideLeftResizer, hideRightResizer }) => {
    return (
      <div
        className={cn(classes.Word, {
          [classes.Word_selected]: selected,
        })}
        style={{ left: leftPx, width: widthPx }}
      >
        {!hideLeftResizer && (
          <div className={classes.LeftResizer} onMouseDown={e => onResizeStart(e, id, 'left')}></div>
        )}
        <div className={classes.Word__WordTitle}>
          <span>{word}</span>
        </div>
        <div className={classes.Word__PhonemesContainer}>
          {phonemes.map((phoneme: Phoneme, index, arr) => {
            return (
              <PhonemeComponent
                key={phoneme.id}
                phoneme={phoneme.phoneme}
                widthPercent={phoneme.widthPercent}
                withoutLeftBorder={index === 0}
                withoutRightBorder={index === arr.length - 1}
              />
            );
          })}
        </div>
        {!hideRightResizer && (
          <div className={classes.RightResizer} onMouseDown={e => onResizeStart(e, id, 'right')}></div>
        )}
      </div>
    );
  },
);

export default Word;
