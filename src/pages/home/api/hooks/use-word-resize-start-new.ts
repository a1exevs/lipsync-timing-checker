import { useCallback, Dispatch, SetStateAction, MouseEvent, RefObject } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { isNull, isUndefined, Nullable } from '@alexevs/ts-guards';
import { ResizerType, Word } from 'src/pages/home/model/types';
import { WORD_MIN_WIDTH_PX } from 'src/pages/home/ui/word/word.consts';
import { recalculatePhonemesStartEnd } from 'src/pages/home/api/converters';

/**
 * Alternative resizing hook (via ref)
 * @param words
 * @param wordsMap
 * @param setWords
 * @param wavesurfer
 * @param timelineWidth
 */
const useWordResizeStartNew = (
  words: Word[],
  wordsMap: Record<string, Word>,
  setWords: Dispatch<SetStateAction<Word[]>>,
  wavesurfer: Nullable<WaveSurfer>,
  timelineWidth: number,
) =>
  useCallback(
    (e: MouseEvent, wordId: string, resizerType: ResizerType, wordRef: RefObject<Nullable<HTMLDivElement>>) => {
      e.stopPropagation();
      if (isNull(wavesurfer) || isNull(wordRef.current)) {
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

      let animationFrameId: number;

      let total = 0;
      let count = 0;
      wordRef.current.style.willChange = 'left, width';

      const onMouseMove: EventListener = (moveEvent: Event) => {
        const before = performance.now();

        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          if (isNull(wavesurfer) || isNull(wordRef.current)) {
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
              const leftDiffPx = prevWordRightPx - word.leftPx;
              const newWordStart = prevWord.end;
              word.leftPx = prevWordRightPx;
              wordRef.current.style.left = `${prevWordRightPx}px`;
              word.start = newWordStart;
              word.widthPx = word.widthPx - leftDiffPx;
              wordRef.current.style.width = `${word.widthPx - leftDiffPx}px`;
            } else {
              if (newWidthPx <= WORD_MIN_WIDTH_PX) {
                return;
              }
              word.leftPx = newLeftPx;
              wordRef.current.style.left = `${newLeftPx}px`;
              word.start = (newLeftPx / timelineWidth) * duration;
              word.widthPx = newWidthPx;
              wordRef.current.style.width = `${newWidthPx}px`;
            }
          }
          if (resizerType === 'right') {
            const newWidthPx = startWidthPx + diffPx;
            if (nextWord && word.leftPx + newWidthPx > nextWord.leftPx) {
              word.widthPx = nextWord.leftPx - word.leftPx;
              wordRef.current.style.width = `${nextWord.leftPx - word.leftPx}px`;
              word.end = nextWord.start;
            } else {
              if (newWidthPx <= WORD_MIN_WIDTH_PX) {
                return;
              }
              word.widthPx = newWidthPx;
              wordRef.current.style.width = `${newWidthPx}px`;
              word.end = word.start + (newWidthPx / timelineWidth) * duration;
            }
          }
          const after = performance.now();
          total += after - before;
          count++;
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (wordRef.current) {
          console.log(`Average: ${total / count}ms`);
          wordRef.current.style.willChange = '';
        }
        word.phonemes = recalculatePhonemesStartEnd(word);
        words.splice(wordIndex, 1, word);
        setWords([...words]);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [words.length, Object.keys(wordsMap).length, wavesurfer, timelineWidth],
  );

export default useWordResizeStartNew;
