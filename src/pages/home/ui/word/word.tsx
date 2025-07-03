import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import classes from 'src/pages/home/ui/word/word.module.scss';
import cn from 'classnames';
import { Phoneme, ResizerType } from 'src/pages/home/model/types';
import PhonemeComponent from 'src/pages/home/ui/phoneme/phoneme';
import Resizer from 'src/pages/home/ui/resizer/resizer';
import {
  WORD_CHAIN_RESIZER_COLOR,
  WORD_LEFT_RESIZER_COLOR,
  WORD_RESIZER_WIDTH_PX,
  WORD_RESIZER_Z_INDEX,
  WORD_RIGHT_RESIZER_COLOR,
} from 'src/pages/home/ui/word/word.consts';
import { arrayToObject } from 'src/shared';

type Props = {
  id: string;
  widthPx: number;
  leftPx: number;
  word: string;
  movingInProgress: boolean;
  phonemes: Phoneme[];
  selected: boolean;
  hideLeftResizer?: boolean;
  hideRightResizer?: boolean;
  hideChainResizer?: boolean;
  onWordResizeStart: (event: MouseEvent, wordId: string, resizerType: ResizerType) => void;
  onWordChainResizeStart: (event: MouseEvent, wordId: string) => void;
  onPhonemeResizeStart: (
    e: MouseEvent,
    wordId: string,
    phonemeId: string,
    resizerType: ResizerType,
    phonemesMap: Record<string, Phoneme>,
  ) => void;
  onPhonemeChainResizeStart: (
    e: MouseEvent,
    wordId: string,
    phonemeId: string,
    phonemesMap: Record<string, Phoneme>,
  ) => void;
  onWordMoveStart: (event: MouseEvent, wordId: string) => void;
  onPhonemeMoveStart: (e: MouseEvent, wordId: string, phonemeId: string, phonemesMap: Record<string, Phoneme>) => void;
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
    hideLeftResizer,
    hideRightResizer,
    hideChainResizer,
    onPhonemeResizeStart,
    onWordChainResizeStart,
    onPhonemeChainResizeStart,
    onWordMoveStart,
    movingInProgress,
    onPhonemeMoveStart,
  }) => {
    const [phonemesMap, setPhonemesMap] = useState<Record<string, Phoneme>>({});
    useEffect(() => {
      setPhonemesMap(arrayToObject(phonemes, 'id'));
    }, [phonemes]);

    return (
      <div
        className={cn(classes.Word, {
          [classes.Word_selected]: selected,
          [classes.Word_draggable]: movingInProgress,
        })}
        style={{ left: leftPx, width: widthPx }}
        onMouseDown={e => onWordMoveStart(e, id)}
      >
        {!hideLeftResizer && (
          <Resizer
            type="left"
            onMouseDown={e => onWordResizeStart(e, id, 'left')}
            color={WORD_LEFT_RESIZER_COLOR}
            zIndex={WORD_RESIZER_Z_INDEX}
            widthPx={WORD_RESIZER_WIDTH_PX}
          />
        )}
        <div className={classes.Word__WordTitle}>
          <span>{word}</span>
        </div>
        <div className={classes.Word__PhonemesContainer}>
          {phonemes.map((phoneme: Phoneme, index, array) => {
            return (
              <PhonemeComponent
                key={phoneme.id}
                id={phoneme.id}
                phoneme={phoneme.phoneme}
                leftPercent={phoneme.leftPercent}
                widthPercent={phoneme.widthPercent}
                withoutLeftBorder={index === 0}
                withoutRightBorder={index === array.length - 1}
                onResizeStart={(event, phonemeId, resizerType) =>
                  onPhonemeResizeStart(event, id, phonemeId, resizerType, phonemesMap)
                }
                hideChainResizer={index === array.length - 1 || phoneme.end !== array[index + 1]?.start}
                onChainResizeStart={(event, phonemeId) => onPhonemeChainResizeStart(event, id, phonemeId, phonemesMap)}
                onMoveStart={(event, phonemeId) => onPhonemeMoveStart(event, id, phonemeId, phonemesMap)}
                movingInProgress={!!phoneme.movingInProgress}
              />
            );
          })}
        </div>
        {!hideRightResizer && (
          <Resizer
            type="right"
            onMouseDown={e => onWordResizeStart(e, id, 'right')}
            color={WORD_RIGHT_RESIZER_COLOR}
            zIndex={WORD_RESIZER_Z_INDEX}
            widthPx={WORD_RESIZER_WIDTH_PX}
          />
        )}
        {!hideChainResizer && (
          <Resizer
            type="chain"
            onMouseDown={e => onWordChainResizeStart(e, id)}
            color={WORD_CHAIN_RESIZER_COLOR}
            zIndex={WORD_RESIZER_Z_INDEX}
            widthPx={WORD_RESIZER_WIDTH_PX}
          />
        )}
      </div>
    );
  },
);

export default Word;
