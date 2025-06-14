import { useCallback, Dispatch, SetStateAction, MouseEvent } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { isNull, isUndefined, Nullable } from '@alexevs/ts-guards';
import { Word } from 'src/pages/home/model/types';
import { WORD_MIN_WIDTH_PX } from 'src/pages/home/ui/word/word.consts';
import { recalculatePhonemesStartEnd } from 'src/pages/home/api/converters';

const useWordChainResizeStart = (
  words: Word[],
  wordsMap: Record<string, Word>,
  setWords: Dispatch<SetStateAction<Word[]>>,
  wavesurfer: Nullable<WaveSurfer>,
  timelineWidth: number,
) =>
  useCallback(
    (e: MouseEvent, wordId: string) => {
      e.stopPropagation();
      if (isNull(wavesurfer)) {
        return;
      }
      const leftWord = wordsMap[wordId];
      if (isUndefined(leftWord)) {
        return;
      }
      const leftWordIndex = words.indexOf(leftWord);
      if (leftWordIndex === -1) {
        return;
      }
      const rightWord: Word = words[leftWordIndex + 1];
      if (isUndefined(rightWord)) {
        return;
      }
      const startX = e.clientX;
      const leftWordStartWidthPx = leftWord.widthPx;

      const rightWordStartWidthPx = rightWord.widthPx;
      const rightWordStartLeftPx = rightWord.leftPx;
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (isNull(wavesurfer)) {
          return;
        }
        const duration = wavesurfer.getDuration();
        const clientX = (moveEvent as unknown as MouseEvent).clientX;
        const diffPx = clientX - startX;

        // TODO toFixed(2) for start and end
        // TODO calculate by 'start' and 'end' for calc improvement
        const leftWordNewWidthPx = leftWordStartWidthPx + diffPx;
        const rightWordNewWidthPx = rightWordStartWidthPx - diffPx;
        if (leftWordNewWidthPx <= WORD_MIN_WIDTH_PX || rightWordNewWidthPx <= WORD_MIN_WIDTH_PX) {
          return;
        }

        leftWord.widthPx = leftWordNewWidthPx;
        leftWord.end = leftWord.start + (leftWordNewWidthPx / timelineWidth) * duration;
        leftWord.phonemes = recalculatePhonemesStartEnd(leftWord);

        // TODO toFixed(2) for start and end
        // TODO calculate by 'start' and 'end' for calc improvement
        const rightWordNewLeftPx = rightWordStartLeftPx + diffPx;
        rightWord.leftPx = rightWordNewLeftPx;
        rightWord.start = (rightWordNewLeftPx / timelineWidth) * duration;
        rightWord.widthPx = rightWordNewWidthPx;
        rightWord.phonemes = recalculatePhonemesStartEnd(rightWord);

        words.splice(leftWordIndex, 2, leftWord, rightWord);
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

export default useWordChainResizeStart;
