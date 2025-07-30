import { Nullable } from '@alexevs/ts-guards';
import { Dispatch, MouseEvent, SetStateAction, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';

import { Phoneme, Word } from 'src/pages/home-page/model/types';

const usePhonemeMoveStart = (
  words: Word[],
  wordsMap: Record<string, Word>,
  setWords: Dispatch<SetStateAction<Word[]>>,
  wavesurfer: Nullable<WaveSurfer>,
  timelineWidth: number,
) =>
  useCallback(
    (e: MouseEvent, wordId: string, phonemeId: string, phonemesMap: Record<string, Phoneme>) => {
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
      const phoneme = phonemesMap[phonemeId];
      if (phoneme === undefined) {
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
      const startLeftPercent = phoneme.leftPercent;

      let animationFrameId: number;

      const onMouseMove: EventListener = (moveEvent: Event) => {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          if (!wavesurfer) {
            return;
          }
          phoneme.movingInProgress = true;
          const duration = wavesurfer.getDuration();
          const clientX = (moveEvent as unknown as MouseEvent).clientX;
          const diffPx = clientX - startX;
          const diffPercent = (diffPx / word.widthPx) * 100;
          const newLeftPercent = startLeftPercent + diffPercent;
          const prevPhonemeRightPercent = prevPhoneme.leftPercent + prevPhoneme.widthPercent;
          const newPhonemeRightPx = newLeftPercent + phoneme.widthPercent;
          if (prevPhoneme && newLeftPercent < prevPhonemeRightPercent) {
            const newPhonemeStart = prevPhoneme.end;
            phoneme.leftPercent = prevPhonemeRightPercent;
            const width = phoneme.end - phoneme.start;
            phoneme.start = newPhonemeStart;
            phoneme.end = newPhonemeStart + width;
          } else if (nextPhoneme && newPhonemeRightPx > nextPhoneme.leftPercent) {
            const newPhonemeEnd = nextPhoneme.start;
            phoneme.leftPercent = nextPhoneme.leftPercent - phoneme.widthPercent;
            const width = phoneme.end - phoneme.start;
            phoneme.end = newPhonemeEnd;
            phoneme.start = newPhonemeEnd - width;
          } else {
            phoneme.leftPercent = newLeftPercent;
            const width = phoneme.end - phoneme.start;
            const newPhonemeLeftPx = (newLeftPercent / 100) * word.widthPx;
            const newPhonemeStart = word.start + (newPhonemeLeftPx / timelineWidth) * duration;
            phoneme.start = newPhonemeStart;
            phoneme.end = newPhonemeStart + width;
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
        phoneme.movingInProgress = false;
        phonemes.splice(phonemeIndex, 1, phoneme);
        word.phonemes = [...phonemes];
        words.splice(wordIndex, 1, word);
        setWords([...words]);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [words.length, Object.keys(wordsMap).length, wavesurfer, timelineWidth],
  );

export default usePhonemeMoveStart;
