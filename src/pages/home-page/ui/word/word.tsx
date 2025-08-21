import cn from 'classnames';
import React, { MouseEvent, useEffect, useState } from 'react';

import { Phoneme } from 'src/pages/home-page/model/types';
import PhonemeComponent from 'src/pages/home-page/ui/phoneme/phoneme';
import Resizer from 'src/pages/home-page/ui/resizer/resizer';
import { ResizerType } from 'src/pages/home-page/ui/resizer/resizer.types';
import {
  WORD_CHAIN_RESIZER_COLOR,
  WORD_CHAIN_RESIZER_TEST_ID,
  WORD_LEFT_RESIZER_COLOR,
  WORD_LEFT_RESIZER_TEST_ID,
  WORD_RESIZER_WIDTH_PX,
  WORD_RESIZER_Z_INDEX,
  WORD_RIGHT_RESIZER_COLOR,
  WORD_RIGHT_RESIZER_TEST_ID,
} from 'src/pages/home-page/ui/word/word.consts';
import { arrayToObject } from 'src/shared';

type Props = {
  id: string;
  widthPx: number;
  leftPx: number;
  word: string;
  movingInProgress: boolean;
  phonemes: Phoneme[];
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
        className={cn(
          'absolute flex flex-col text-black box-border border border-black rounded cursor-grab whitespace-nowrap bg-[#add8e6] hover:bg-[#add8e6aa] transition-colors duration-200',
          {
            'shadow-[0_4px_8px_0_white] u-translate-y-[5px] cursor-grabbing transition-shadow transition-transform duration-200':
              movingInProgress,
          },
        )}
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
            dataTestId={WORD_LEFT_RESIZER_TEST_ID}
          />
        )}
        <div className="relative select-none">
          <span>{word}</span>
        </div>
        <div className="relative flex h-[30px]">
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
            dataTestId={WORD_RIGHT_RESIZER_TEST_ID}
          />
        )}
        {!hideChainResizer && (
          <Resizer
            type="chain"
            onMouseDown={e => onWordChainResizeStart(e, id)}
            color={WORD_CHAIN_RESIZER_COLOR}
            zIndex={WORD_RESIZER_Z_INDEX}
            widthPx={WORD_RESIZER_WIDTH_PX}
            dataTestId={WORD_CHAIN_RESIZER_TEST_ID}
          />
        )}
      </div>
    );
  },
);

export default Word;
