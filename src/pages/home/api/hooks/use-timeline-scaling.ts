import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';
import { isNull, Nullable } from '@alexevs/ts-guards';
import {
  MAX_TIME_LINE_SCALE_COEFFICIENT,
  MIN_TIME_LINE_SCALE_COEFFICIENT,
  TIME_LINE_SCALE_COEFFICIENT_STEP,
} from 'src/pages/home/model/consts';
import { recalculateWordWithByNewTimelineWidth } from 'src/pages/home/api/converters';
import WaveSurfer from 'wavesurfer.js';
import { Word } from 'src/pages/home/model/types';

const useTimelineScaling = (
  timelineRef: RefObject<Nullable<HTMLElement>>,
  timelineWidth: number,
  wavesurfer: Nullable<WaveSurfer>,
  setTimelineWidth: Dispatch<SetStateAction<number>>,
  setWords: Dispatch<SetStateAction<Word[]>>,
  setTimelineScaleCoefficients: Dispatch<SetStateAction<number>>,
) => {
  useEffect(() => {
    // TODO Restore time position and scroll position after scaling
    const onScaleTimeline = (event: WheelEvent) => {
      if (event.shiftKey || !event.altKey || isNull(wavesurfer)) {
        return;
      }
      const delta = (event as any).wheelDeltaY;
      setTimelineScaleCoefficients(prevCoefficient => {
        const newCoefficient = prevCoefficient + (delta / Math.abs(delta)) * TIME_LINE_SCALE_COEFFICIENT_STEP;
        if (newCoefficient < MIN_TIME_LINE_SCALE_COEFFICIENT || newCoefficient > MAX_TIME_LINE_SCALE_COEFFICIENT) {
          return prevCoefficient;
        }
        const audioDuration = wavesurfer.getDuration();
        const newTimelineWidth = audioDuration * newCoefficient;
        setTimelineWidth(newTimelineWidth);
        setWords(prevWords =>
          prevWords.map(word =>
            recalculateWordWithByNewTimelineWidth({
              word,
              newTimelineWidth,
              audioDuration,
            }),
          ),
        );
        return newCoefficient;
      });
    };

    if (!isNull(timelineRef.current)) {
      timelineRef.current.addEventListener('wheel', onScaleTimeline);
    }
    return () => {
      if (!isNull(timelineRef.current)) {
        timelineRef.current.removeEventListener('wheel', onScaleTimeline);
      }
    };
  }, [timelineRef, timelineWidth, wavesurfer, setTimelineWidth, setWords, setTimelineScaleCoefficients]);
};

export default useTimelineScaling;
