import { Nullable } from '@alexevs/ts-guards';
import { Dispatch, MouseEvent, SetStateAction, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';

import { recalculatePhonemesStartEnd } from 'src/pages/home/api/converters';
import { Word } from 'src/pages/home/model/types';

const useWordMoveStart = (
  words: Word[],
  wordsMap: Record<string, Word>,
  setWords: Dispatch<SetStateAction<Word[]>>,
  wavesurfer: Nullable<WaveSurfer>,
  timelineWidth: number,
) =>
  useCallback(
    (e: MouseEvent, wordId: string) => {
      e.stopPropagation();
      if (!wavesurfer) {
        return;
      }
      const word = wordsMap[wordId];
      if (word === undefined) {
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
      const startLeftPx = word.leftPx;

      let animationFrameId: number;

      const onMouseMove: EventListener = (moveEvent: Event) => {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          if (!wavesurfer) {
            return;
          }
          word.movingInProgress = true;
          const duration = wavesurfer.getDuration();
          const clientX = (moveEvent as unknown as MouseEvent).clientX;
          const diffPx = clientX - startX;
          const newLeftPx = startLeftPx + diffPx;
          const prevWordRightPx = prevWord.leftPx + prevWord.widthPx;
          const newWordRightPx = newLeftPx + word.widthPx;
          if (prevWord && newLeftPx < prevWordRightPx) {
            const newWordStart = prevWord.end;
            word.leftPx = prevWordRightPx;
            const width = word.end - word.start;
            word.start = newWordStart;
            word.end = newWordStart + width;
          } else if (nextWord && newWordRightPx > nextWord.leftPx) {
            const newWordEnd = nextWord.start;
            word.leftPx = nextWord.leftPx - word.widthPx;
            const width = word.end - word.start;
            word.end = newWordEnd;
            word.start = newWordEnd - width;
          } else {
            word.leftPx = newLeftPx;
            const width = word.end - word.start;
            const newWordStart = (newLeftPx / timelineWidth) * duration;
            word.start = newWordStart;
            word.end = newWordStart + width;
          }

          word.phonemes = recalculatePhonemesStartEnd(word);

          words.splice(wordIndex, 1, word);
          setWords([...words]);
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        word.movingInProgress = false;
        words.splice(wordIndex, 1, word);
        setWords([...words]);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [words.length, Object.keys(wordsMap).length, wavesurfer, timelineWidth],
  );

export default useWordMoveStart;
