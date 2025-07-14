import { isNull, isUndefined, Nullable } from '@alexevs/ts-guards';
import { Dispatch, MouseEvent, SetStateAction, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';

import { Phoneme, Word } from 'src/pages/home/model/types';
import { PHONEME_MIN_WIDTH_PX } from 'src/pages/home/ui/phoneme/phoneme.consts';
import { ResizerType } from 'src/pages/home/ui/resizer/resizer.types';

const usePhonemeResizeStart = (
  words: Word[],
  wordsMap: Record<string, Word>,
  setWords: Dispatch<SetStateAction<Word[]>>,
  wavesurfer: Nullable<WaveSurfer>,
  timelineWidth: number,
) =>
  useCallback(
    (
      e: MouseEvent,
      wordId: string,
      phonemeId: string,
      resizerType: ResizerType,
      phonemesMap: Record<string, Phoneme>,
    ) => {
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
      const phoneme = phonemesMap[phonemeId];
      if (isUndefined(phoneme)) {
        return;
      }
      const phonemes = word.phonemes;
      const phonemeIndex = phonemes.indexOf(phoneme);
      if (phonemeIndex === -1) {
        return;
      }
      const prevPhoneme: Phoneme = phonemes[phonemeIndex - 1] ?? {
        widthPercent: 0,
        leftPercent: 0,
        start: word.start,
        end: word.start,
      };
      const nextPhoneme: Phoneme = phonemes[phonemeIndex + 1] ?? {
        widthPercent: 0,
        leftPercent: 100,
        start: word.end,
        end: word.end,
      };
      const startX = e.clientX;
      const startWidthPercent = phoneme.widthPercent;
      const startLeftPercent = phoneme.leftPercent;

      let animationFrameId: number;

      const onMouseMove: EventListener = (moveEvent: Event) => {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          if (isNull(wavesurfer)) {
            return;
          }
          const duration = wavesurfer.getDuration();
          const clientX = (moveEvent as unknown as MouseEvent).clientX;
          const diffPercent = ((clientX - startX) / word.widthPx) * 100;
          if (resizerType === 'left') {
            const newWidthPercent = startWidthPercent - diffPercent;
            const newLeftPercent = startLeftPercent + diffPercent;
            const prevPhonemeRightPercent = prevPhoneme.leftPercent + prevPhoneme.widthPercent;
            if (prevPhoneme && newLeftPercent < prevPhonemeRightPercent) {
              const leftDiffPercent = prevPhonemeRightPercent - phoneme.leftPercent;
              const newPhonemeStart = prevPhoneme.end;
              phoneme.leftPercent = prevPhonemeRightPercent;
              phoneme.start = newPhonemeStart;
              phoneme.widthPercent = phoneme.widthPercent - leftDiffPercent;
            } else {
              const newWidthPx = (newWidthPercent / 100) * word.widthPx;
              if (newWidthPx <= PHONEME_MIN_WIDTH_PX) {
                return;
              }
              phoneme.leftPercent = newLeftPercent;
              const phonemeLeftPx = (newLeftPercent / 100) * word.widthPx;
              phoneme.start = word.start + (phonemeLeftPx / timelineWidth) * duration;
              phoneme.widthPercent = newWidthPercent;
            }
          }
          if (resizerType === 'right') {
            const newWidthPercent = startWidthPercent + diffPercent;
            if (nextPhoneme && phoneme.leftPercent + newWidthPercent > nextPhoneme.leftPercent) {
              phoneme.widthPercent = nextPhoneme.leftPercent - phoneme.leftPercent;
              phoneme.end = nextPhoneme.start;
            } else {
              const newWidthPx = (newWidthPercent / 100) * word.widthPx;
              if (newWidthPx <= PHONEME_MIN_WIDTH_PX) {
                return;
              }
              phoneme.widthPercent = newWidthPercent;
              phoneme.end = phoneme.start + (newWidthPx / timelineWidth) * duration;
            }
          }
          phonemes.splice(phonemeIndex, 1, phoneme);
          word.phonemes = [...phonemes];
          words.splice(wordIndex, 1, word);
          setWords([...words]);
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [words.length, Object.keys(wordsMap).length, wavesurfer, timelineWidth],
  );

export default usePhonemeResizeStart;
