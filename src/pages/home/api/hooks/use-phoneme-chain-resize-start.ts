import { useCallback, Dispatch, SetStateAction, MouseEvent } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { isNull, isUndefined, Nullable } from '@alexevs/ts-guards';
import { Phoneme, Word } from 'src/pages/home/model/types';
import { PHONEME_MIN_WIDTH_PX } from 'src/pages/home/ui/phoneme/phoneme.consts';

const usePhonemeChainResizeStart = (
  words: Word[],
  wordsMap: Record<string, Word>,
  setWords: Dispatch<SetStateAction<Word[]>>,
  wavesurfer: Nullable<WaveSurfer>,
  timelineWidth: number,
) =>
  useCallback(
    (e: MouseEvent, wordId: string, phonemeId: string, phonemesMap: Record<string, Phoneme>) => {
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
      const leftPhoneme = phonemesMap[phonemeId];
      if (isUndefined(leftPhoneme)) {
        return;
      }
      const phonemes = word.phonemes;
      const leftPhonemeIndex = phonemes.indexOf(leftPhoneme);
      if (leftPhonemeIndex === -1) {
        return;
      }
      const rightPhoneme: Phoneme = phonemes[leftPhonemeIndex + 1];
      if (isUndefined(rightPhoneme)) {
        return;
      }
      const startX = e.clientX;
      const leftPhonemeStartWidthPercent = leftPhoneme.widthPercent;

      const rightPhonemeStartWidthPercent = rightPhoneme.widthPercent;
      const rightPhonemeStartLeftPercent = rightPhoneme.leftPercent;
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (isNull(wavesurfer)) {
          return;
        }
        const duration = wavesurfer.getDuration();
        const clientX = (moveEvent as unknown as MouseEvent).clientX;
        const diffPercent = ((clientX - startX) / word.widthPx) * 100;

        const leftPhonemeNewWidthPercent = leftPhonemeStartWidthPercent + diffPercent;
        const leftPhonemeWidthPx = (leftPhonemeNewWidthPercent / 100) * word.widthPx;
        const rightPhonemeNewWidthPercent = rightPhonemeStartWidthPercent - diffPercent;
        const rightPhonemeWidthPx = (rightPhonemeNewWidthPercent / 100) * word.widthPx;
        if (leftPhonemeWidthPx <= PHONEME_MIN_WIDTH_PX || rightPhonemeWidthPx <= PHONEME_MIN_WIDTH_PX) {
          return;
        }

        leftPhoneme.widthPercent = leftPhonemeNewWidthPercent;
        leftPhoneme.end = leftPhoneme.start + (leftPhonemeWidthPx / timelineWidth) * duration;

        const rightPhonemeNewLeftPercent = rightPhonemeStartLeftPercent + diffPercent;
        const rightPhonemeLeftPx = (rightPhonemeNewLeftPercent / 100) * word.widthPx;
        rightPhoneme.leftPercent = rightPhonemeNewLeftPercent;
        rightPhoneme.start = word.start + (rightPhonemeLeftPx / timelineWidth) * duration;
        rightPhoneme.widthPercent = rightPhonemeNewWidthPercent;

        phonemes.splice(leftPhonemeIndex, 2, leftPhoneme, rightPhoneme);
        word.phonemes = [...phonemes];
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

export default usePhonemeChainResizeStart;
