import { useCallback, Dispatch, SetStateAction, MouseEvent } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Nullable } from '@alexevs/ts-guards';
import { Phoneme, Word } from 'src/pages/home/model/types';
import { PHONEME_MOVING_SENSITIVITY } from 'src/pages/home/ui/phoneme/phoneme.consts';
import { calculatePhonemeLeftPercent, calculatePhonemeWidthPercent } from 'src/pages/home/api/converters';

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
        leftPercent: 100,
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
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (!wavesurfer) {
          return;
        }
        const duration = wavesurfer.getDuration();
        const clientX = (moveEvent as unknown as MouseEvent).clientX;
        const diffPx = clientX - startX;
        const diff = (diffPx / timelineWidth) * duration * PHONEME_MOVING_SENSITIVITY;
        const newPhonemeStart = phoneme.start + diff;
        const newPhonemeEnd = phoneme.end + diff;
        const width = ((startWidthPercent * word.widthPx) / 100 / timelineWidth) * duration;
        if (prevPhoneme && newPhonemeStart < prevPhoneme.end) {
          // TODO toFixed(2) for start and end
          // TODO calculate by 'start' and 'end' for calc improvement
          phoneme.start = prevPhoneme.end;
          phoneme.end = prevPhoneme.end + width;
        } else if (nextPhoneme && newPhonemeEnd > nextPhoneme.start) {
          // TODO toFixed(2) for start and end
          // TODO calculate by 'start' and 'end' for calc improvement
          phoneme.start = nextPhoneme.start - width;
          phoneme.end = nextPhoneme.start;
        } else {
          // TODO toFixed(2) for start and end
          // TODO calculate by 'start' and 'end' for calc improvement
          phoneme.start = phoneme.start + diff;
          phoneme.end = phoneme.end + diff;
        }

        phoneme.movingInProgress = true;
        phoneme.widthPercent = calculatePhonemeWidthPercent(phoneme, word);
        phoneme.leftPercent = calculatePhonemeLeftPercent(phoneme, word);

        phonemes.splice(phonemeIndex, 1, phoneme);
        word.phonemes = [...phonemes];
        words.splice(wordIndex, 1, word);
        setWords([...words]);
      };

      const onMouseUp = () => {
        console.log('onMouseUp');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        phoneme.movingInProgress = false;
        phonemes.splice(phonemeIndex, 1, phoneme);
        word.phonemes = [...phonemes];
        words.splice(wordIndex, 1, word);
        setWords([...words]);
      };
      console.log('onMouseDown');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [words.length, Object.keys(wordsMap).length, wavesurfer, timelineWidth],
  );

export default usePhonemeMoveStart;
