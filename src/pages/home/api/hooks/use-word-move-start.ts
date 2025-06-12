import { Nullable } from '@alexevs/ts-guards';
import { useCallback, Dispatch, SetStateAction } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Word } from 'src/pages/home/model/types';
import { WORD_MOVING_SENSITIVITY } from 'src/pages/home/ui/word/word.consts';
import {
  calculateWordLeftPositionPx,
  calculateWordWidthPx,
  recalculatePhonemesStartEnd,
} from 'src/pages/home/api/converters';

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
      const startWidthPx = word.widthPx;
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (!wavesurfer) {
          return;
        }
        const duration = wavesurfer.getDuration();
        const clientX = (moveEvent as unknown as MouseEvent).clientX;
        const diffPx = clientX - startX;
        const diff = (diffPx / timelineWidth) * duration * WORD_MOVING_SENSITIVITY;
        const newWordStart = word.start + diff;
        const newWordEnd = word.end + diff;
        const width = (startWidthPx / timelineWidth) * duration;
        if (prevWord && newWordStart < prevWord.end) {
          word.start = prevWord.end;
          word.end = prevWord.end + width;
        } else if (nextWord && newWordEnd > nextWord.start) {
          word.start = nextWord.start - width;
          word.end = nextWord.start;
        } else {
          word.start = word.start + diff;
          word.end = word.end + diff;
        }
        word.movingInProgress = true;
        word.widthPx = calculateWordWidthPx({ wordDTO: word, timelineWidth, audioDuration: duration });
        word.leftPx = calculateWordLeftPositionPx({ wordDTO: word, timelineWidth, audioDuration: duration });

        word.phonemes = recalculatePhonemesStartEnd(word);
        words.splice(wordIndex, 1, word);
        setWords([...words]);
      };

      const onMouseUp = () => {
        console.log('onMouseUp');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        word.movingInProgress = false;
        words.splice(wordIndex, 1, word);
        setWords([...words]);
      };
      console.log('onMouseDown');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [words.length, Object.keys(wordsMap).length, wavesurfer, timelineWidth],
  );

export default useWordMoveStart;
