import { useCallback, Dispatch, SetStateAction, MouseEvent } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { isNull, isUndefined, Nullable } from '@alexevs/ts-guards';
import { ResizerType, Word } from 'src/pages/home/model/types';
import { WORD_MIN_WIDTH_PX } from 'src/pages/home/ui/word/word.consts';
import { recalculatePhonemesStartEnd } from 'src/pages/home/api/converters';

const useWordResizeStart = (
  words: Word[],
  wordsMap: Record<string, Word>,
  setWords: Dispatch<SetStateAction<Word[]>>,
  wavesurfer: Nullable<WaveSurfer>,
  timelineWidth: number,
) =>
  useCallback(
    (e: MouseEvent, wordId: string, resizerType: ResizerType) => {
      e.stopPropagation();
      if (isNull(wavesurfer)) {
        return;
      }
      const word = wordsMap[wordId];
      if (isUndefined(word)) {
        return;
      }
      const wordIndex = words.indexOf(word);
      if (wordIndex === -1) {
        return;
      }
      const duration = wavesurfer.getDuration();
      const prevWord: Word = words[wordIndex - 1] ?? { widthPx: 0, leftPx: 0, start: 0, end: 0 };
      const nextWord: Word = words[wordIndex + 1] ?? {
        widthPx: 0,
        leftPx: timelineWidth,
        start: duration,
        end: duration,
      };
      const startX = e.clientX;
      const startWidthPx = word.widthPx;
      const startLeftPx = word.leftPx;
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (isNull(wavesurfer)) {
          return;
        }
        const duration = wavesurfer.getDuration();
        const clientX = (moveEvent as unknown as MouseEvent).clientX;
        const diffPx = clientX - startX;
        if (resizerType === 'left') {
          const newWidthPx = startWidthPx - diffPx;
          const newLeftPx = startLeftPx + diffPx;
          const prevWordRightPx = prevWord.leftPx + prevWord.widthPx;
          if (prevWord && newLeftPx < prevWordRightPx) {
            // TODO toFixed(2) for start and end
            const leftDiffPx = prevWordRightPx - word.leftPx;
            const newWordStart = prevWord.end;
            // TODO calculate by 'start' and 'end' for calc improvement
            word.leftPx = prevWordRightPx;
            word.start = newWordStart;
            word.widthPx = word.widthPx - leftDiffPx;
          } else {
            // TODO toFixed(2) for start and end
            // TODO calculate by 'start' and 'end' for calc improvement
            if (newWidthPx <= WORD_MIN_WIDTH_PX) {
              return;
            }
            word.leftPx = newLeftPx;
            word.start = (newLeftPx / timelineWidth) * duration;
            word.widthPx = newWidthPx;
          }
        }
        if (resizerType === 'right') {
          const newWidthPx = startWidthPx + diffPx;
          if (nextWord && word.leftPx + newWidthPx > nextWord.leftPx) {
            // TODO toFixed(2) for start and end
            // TODO calculate by 'start' and 'end' for calc improvement
            word.widthPx = nextWord.leftPx - word.leftPx;
            word.end = nextWord.start;
          } else {
            // TODO toFixed(2) for start and end
            // TODO calculate by 'start' and 'end' for calc improvement
            if (newWidthPx <= WORD_MIN_WIDTH_PX) {
              return;
            }
            word.widthPx = newWidthPx;
            word.end = word.start + (newWidthPx / timelineWidth) * duration;
          }
        }
        word.phonemes = recalculatePhonemesStartEnd(word);
        words.splice(wordIndex, 1, word);
        setWords([...words]);
      };

      const onMouseUp = () => {
        console.log('onMouseUp');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      console.log('onMouseDown');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [words.length, Object.keys(wordsMap).length, wavesurfer, timelineWidth],
  );

export default useWordResizeStart;
