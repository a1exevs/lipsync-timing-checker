import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import classes from 'src/pages/home/ui/word/word.module.scss';
import cn from 'classnames';
import { AudioTrackTextItemDTO, Phoneme, ResizerSide } from 'src/pages/home/model/types';
import PhonemeComponent from 'src/pages/home/ui/phoneme/phoneme';
import Resizer from 'src/pages/home/ui/resizer/resizer';
import {
  WORD_LEFT_RESIZER_COLOR,
  WORD_RESIZER_Z_INDEX,
  WORD_RIGHT_RESIZER_COLOR,
} from 'src/pages/home/ui/word/word.consts';
import { arrayToObject } from 'src/shared/helpers/arrays';

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
  onWordResizeStart: (event: MouseEvent, wordId: string, resizerSide: ResizerSide) => void;
  onPhonemeResizeStart: (
    e: MouseEvent,
    wordId: string,
    phonemeId: string,
    resizerSide: ResizerSide,
    phonemesMap: Record<string, Phoneme>,
  ) => void;
};

const Word: React.FC<Props> = React.memo(
  ({
    word,
    widthPx,
    leftPx,
    onWordResizeStart,
    id,
    phonemes,
    selected,
    start,
    end,
    hideLeftResizer,
    hideRightResizer,
    onPhonemeResizeStart,
  }) => {
    const [phonemesMap, setPhonemesMap] = useState<Record<string, Phoneme>>({});
    useEffect(() => {
      setPhonemesMap(arrayToObject(phonemes, 'id'));
    }, [phonemes]);

    return (
      <div
        className={cn(classes.Word, {
          [classes.Word_selected]: selected,
        })}
        style={{ left: leftPx, width: widthPx }}
      >
        {!hideLeftResizer && (
          <Resizer
            side="left"
            onMouseDown={e => onWordResizeStart(e, id, 'left')}
            color={WORD_LEFT_RESIZER_COLOR}
            zIndex={WORD_RESIZER_Z_INDEX}
          />
        )}
        <div className={classes.Word__WordTitle}>
          <span>{word}</span>
        </div>
        <div className={classes.Word__PhonemesContainer}>
          {phonemes.map((phoneme: Phoneme, index, arr) => {
            return (
              <PhonemeComponent
                key={phoneme.id}
                id={phoneme.id}
                phoneme={phoneme.phoneme}
                leftPercent={phoneme.leftPercent}
                widthPercent={phoneme.widthPercent}
                withoutLeftBorder={index === 0}
                withoutRightBorder={index === arr.length - 1}
                onResizeStart={(event, phonemeId, resizerSide) =>
                  onPhonemeResizeStart(event, id, phonemeId, resizerSide, phonemesMap)
                }
              />
            );
          })}
        </div>
        {!hideRightResizer && (
          <Resizer
            side="right"
            onMouseDown={e => onWordResizeStart(e, id, 'right')}
            color={WORD_RIGHT_RESIZER_COLOR}
            zIndex={WORD_RESIZER_Z_INDEX}
          />
        )}
      </div>
    );
  },
);

export default Word;
