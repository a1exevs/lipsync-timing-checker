import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import WordComponent from 'src/pages/home/ui/word/word';
import classes from 'src/pages/home/ui/home.module.scss';
import cn from 'classnames';
import { AudioTrackTextDataDTO, Phoneme, ResizerType, Word } from 'src/pages/home/model/types';
import {
  DEFAULT_TIME_LINE_SCALE_COEFFICIENT,
  DEFAULT_WAVE_FORM_COLOR,
  DEFAULT_WAVE_FORM_WIDTH,
  MAX_TIME_LINE_SCALE_COEFFICIENT,
  MIN_TIME_LINE_SCALE_COEFFICIENT,
  TIME_LINE_SCALE_COEFFICIENT_STEP,
  WAVE_FORM_HEIGHT,
} from 'src/pages/home/model/consts';
import WaveSurfer from 'wavesurfer.js';
import { arrayToObject } from 'src/shared/helpers/arrays';
import { getFileData } from 'src/shared/helpers/files';
import {
  calculatePhonemeLeftPercent,
  calculatePhonemeWidthPercent,
  calculateWordLeftPositionPx,
  calculateWordWidthPx,
  convertWordDTOToWord,
  convertWordToWordDTO,
  recalculatePhonemesStartEnd,
  recalculateWordWithByNewTimelineWidth,
} from 'src/pages/home/api/converters';
import { PHONEME_MIN_WIDTH_PX } from 'src/pages/home/ui/phoneme/phoneme.consts';
import { WORD_MIN_WIDTH_PX, WORD_MOVING_SENSITIVITY } from 'src/pages/home/ui/word/word.consts';

const HomePage: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [wordsDataFileData, setWordsDataFileData] = useState<{ fileName: string; extension: string } | null>(null);

  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState<number>(0);

  const timelineRef = useRef<HTMLElement>(null);
  const waveFormContainerRef = useRef<HTMLElement>(null);
  const wordsDataContainerRef = useRef<HTMLDivElement>(null);
  const wordsDataElementRef = useRef<HTMLDivElement>(null);
  const wordsDataTimeIndicator = useRef<HTMLDivElement>(null);

  const [words, setWords] = useState<Word[]>([]);
  const [wordsMap, setWordsMap] = useState<Record<string, Word>>({});

  const [timelineScaleCoefficients, setTimelineScaleCoefficients] = useState<number>(
    DEFAULT_TIME_LINE_SCALE_COEFFICIENT,
  );

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setIsPlaying(false);
    const timelineWidth = ws.getDuration() * timelineScaleCoefficients;
    setTimelineWidth(timelineWidth);

    updateWordsDataTimeIndicatorPosition(ws, ws.getDuration());
    setupContainersWidth(timelineWidth);
  };

  const onPlayPause = (wavesurfer: WaveSurfer | null): void => {
    if (!wavesurfer) {
      return;
    }
    wavesurfer.playPause();
  };

  const onAudioFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event?.target?.files?.length) {
      return;
    }
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    event.target.blur();
  };

  const onWordsDataFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event?.target?.files?.length) {
      return;
    }
    const file = event.target.files[0];
    const { fileName, extension } = getFileData(file);
    const reader = new FileReader();
    event.target.blur();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      try {
        if (!e?.target?.result || typeof e.target.result !== 'string') {
          return;
        }
        // TODO encapsulate JSON.parse in parser factory and add JSON structure validation
        const dataDTO: AudioTrackTextDataDTO = JSON.parse(e.target.result);
        const words: Word[] = dataDTO.words.map((wordDTO, index) =>
          convertWordDTOToWord({
            wordDTO,
            wordId: String(index),
            audioDuration: wavesurfer?.getDuration() ?? 0,
            timelineWidth,
          }),
        );
        setWords(words);
        setWordsDataFileData({ fileName, extension });
      } catch (error) {
        setWords([]);
        setWordsDataFileData(null);
        alert(`Something went wrong while ${extension}-file loading.`);
      }
    };
    reader.readAsText(file);
  };

  const setupContainersWidth = (width: number): void => {
    if (wordsDataElementRef.current) {
      wordsDataElementRef.current.style.width = `${width}px`;
    }
  };

  const updateWordsDataTimeIndicatorPosition = (ws: WaveSurfer, currentTime: number): void => {
    const duration = ws.getDuration();
    const scaledTimePx = (currentTime / duration) * timelineWidth;
    const currentTimePositionLeft = currentTime * timelineScaleCoefficients;
    const containerHScrollPositionLeft = waveFormContainerRef?.current?.scrollLeft ?? 0;
    const containerWidth = waveFormContainerRef?.current?.clientWidth ?? 0;
    if (
      Math.abs(currentTimePositionLeft - containerHScrollPositionLeft) > containerWidth &&
      waveFormContainerRef.current
    ) {
      waveFormContainerRef.current.scrollLeft =
        currentTimePositionLeft - containerHScrollPositionLeft > 0
          ? waveFormContainerRef.current.scrollLeft + containerWidth
          : currentTimePositionLeft;
    }
    if (wordsDataTimeIndicator.current) {
      wordsDataTimeIndicator.current.style.left = `${scaledTimePx}px`;
    }
  };

  const onWordClick = (_: MouseEvent): void => {
    // TODO Support moving functionality
    // const wordElement = (event as any).target.closest(`.${wordClasses.Word}`);
    // if (!wordElement) {
    //   return;
    // }
    // const wordId = wordElement.dataset.id;
    // if (!wordId) {
    //   return;
    // }
    // const wordData = wordsMap[wordId];
    // if (!wordData) {
    //   return;
    // }
    // wordData.selected = !wordData.selected;
    // setWords(structuredClone(words));
  };

  const isLoadJSONDataButtonEnabled = (): boolean => audioUrl !== '';
  const isAudioPlayButtonEnabled = (): boolean => audioUrl !== '';
  const isDownloadJSONDataButtonEnabled = (): boolean => words.length !== 0;

  const onDownloadJSONDataButtonClick = (): void => {
    if (wordsDataFileData === null) {
      return;
    }
    const data = {
      words: words.map(word => convertWordToWordDTO(word)),
    };
    const dataToDownload = JSON.stringify(data, null, 2);
    const blob = new Blob([dataToDownload], { type: `application/${wordsDataFileData.extension}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wordsDataFileData.fileName}.export.${wordsDataFileData.extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // TODO Restore time position and scroll position after scaling
    const onScaleTimeline = (event: WheelEvent) => {
      if (event.shiftKey || !event.altKey || !wavesurfer) {
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

    if (timelineRef.current) {
      timelineRef.current.addEventListener('wheel', onScaleTimeline);
    }
    return () => {
      if (timelineRef.current) {
        timelineRef.current.removeEventListener('wheel', onScaleTimeline);
      }
    };
  }, [timelineRef, timelineWidth, wavesurfer, setTimelineWidth, setWords]);

  useEffect(() => {
    if (!waveFormContainerRef.current || !wordsDataContainerRef.current) {
      return;
    }
    const onWordsDataContainerHScrollChange = (event: any) => {
      if (waveFormContainerRef.current) {
        waveFormContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
    };
    const onWaveFormContainerScrollChange = (event: Event) => {
      if (wordsDataContainerRef.current) {
        wordsDataContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
    };
    waveFormContainerRef.current.addEventListener('scroll', onWaveFormContainerScrollChange);
    wordsDataContainerRef.current.addEventListener('scroll', onWordsDataContainerHScrollChange);
    return () => {
      if (waveFormContainerRef.current) {
        waveFormContainerRef.current.removeEventListener('scroll', onWaveFormContainerScrollChange);
      }
      if (wordsDataContainerRef.current) {
        wordsDataContainerRef.current.removeEventListener('scroll', onWordsDataContainerHScrollChange);
      }
    };
  }, [waveFormContainerRef, wordsDataContainerRef]);

  const onPhonemeResizeStart = useCallback(
    (
      e: MouseEvent,
      wordId: string,
      phonemeId: string,
      resizerType: ResizerType,
      phonemesMap: Record<string, Phoneme>,
    ) => {
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
      const startWidthPercent = phoneme.widthPercent;
      const startLeftPercent = phoneme.leftPercent;
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (!wavesurfer) {
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
            // TODO toFixed(2) for start and end
            const leftDiffPercent = prevPhonemeRightPercent - phoneme.leftPercent;
            const newPhonemeStart = prevPhoneme.end;
            // TODO calculate by 'start' and 'end' for calc improvement
            phoneme.leftPercent = prevPhonemeRightPercent;
            phoneme.start = newPhonemeStart;
            phoneme.widthPercent = phoneme.widthPercent - leftDiffPercent;
          } else {
            // TODO toFixed(2) for start and end
            // TODO calculate by 'start' and 'end' for calc improvement
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
            // TODO toFixed(2) for start and end
            // TODO calculate by 'start' and 'end' for calc improvement
            phoneme.widthPercent = nextPhoneme.leftPercent - phoneme.leftPercent;
            phoneme.end = nextPhoneme.start;
          } else {
            // TODO toFixed(2) for start and end
            // TODO calculate by 'start' and 'end' for calc improvement
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

  const onPhonemeChainResizeStart = useCallback(
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
      const leftPhoneme = phonemesMap[phonemeId];
      if (leftPhoneme === undefined) {
        return;
      }
      const phonemes = word.phonemes;
      const leftPhonemeIndex = phonemes.indexOf(leftPhoneme);
      if (leftPhonemeIndex === -1) {
        return;
      }
      const rightPhoneme: Phoneme = phonemes[leftPhonemeIndex + 1];
      if (rightPhoneme === undefined) {
        return;
      }
      const startX = e.clientX;
      const leftPhonemeStartWidthPercent = leftPhoneme.widthPercent;

      const rightPhonemeStartWidthPercent = rightPhoneme.widthPercent;
      const rightPhonemeStartLeftPercent = rightPhoneme.leftPercent;
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (!wavesurfer) {
          return;
        }
        const duration = wavesurfer.getDuration();
        const clientX = (moveEvent as unknown as MouseEvent).clientX;
        const diffPercent = ((clientX - startX) / word.widthPx) * 100;

        // TODO toFixed(2) for start and end
        // TODO calculate by 'start' and 'end' for calc improvement
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
        // TODO toFixed(2) for start and end
        // TODO calculate by 'start' and 'end' for calc improvement
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

  const onWordResizeStart = useCallback(
    (e: MouseEvent, wordId: string, resizerType: ResizerType) => {
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
      const startLeftPx = word.leftPx;
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (!wavesurfer) {
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

  const onWordChainResizeStart = useCallback(
    (e: MouseEvent, wordId: string) => {
      e.stopPropagation();
      if (!wavesurfer) {
        return;
      }
      const leftWord = wordsMap[wordId];
      if (leftWord === undefined) {
        return;
      }
      const leftWordIndex = words.indexOf(leftWord);
      if (leftWordIndex === -1) {
        return;
      }
      const rightWord: Word = words[leftWordIndex + 1];
      if (rightWord === undefined) {
        return;
      }
      const startX = e.clientX;
      const leftWordStartWidthPx = leftWord.widthPx;

      const rightWordStartWidthPx = rightWord.widthPx;
      const rightWordStartLeftPx = rightWord.leftPx;
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (!wavesurfer) {
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

  const onWordMoveStart = useCallback(
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
          // TODO toFixed(2) for start and end
          // TODO calculate by 'start' and 'end' for calc improvement
          word.start = prevWord.end;
          word.end = prevWord.end + width;
        } else if (nextWord && newWordEnd > nextWord.start) {
          // TODO toFixed(2) for start and end
          // TODO calculate by 'start' and 'end' for calc improvement
          word.start = nextWord.start - width;
          word.end = nextWord.start;
        } else {
          // TODO toFixed(2) for start and end
          // TODO calculate by 'start' and 'end' for calc improvement
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

  const onPhonemeMoveStart = useCallback(
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
        const diff = (diffPx / timelineWidth) * duration * 0.5;
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

  useEffect(() => {
    const handleKeyboardEvents = (event: KeyboardEvent) => {
      if (event.code === 'Space' && wavesurfer) {
        onPlayPause(wavesurfer);
      }
    };
    window.addEventListener('keydown', handleKeyboardEvents);
    return () => {
      window.removeEventListener('keydown', handleKeyboardEvents);
    };
  }, [wavesurfer]);

  useEffect(() => {
    setWordsMap(arrayToObject(words, 'id'));
  }, [words]);

  return (
    <section className={classes.HomePage}>
      <h1 className={classes.HomePage__Title}>Lipsync Timing Checker</h1>
      <section className={classes.HomePage__Controls}>
        <label htmlFor="audio-file-upload">Load audio:</label>
        <input type="file" id="audio-file-upload" accept="audio/*" onChange={onAudioFileChange} />
        <label htmlFor="words-data-upload">Load JSON data:</label>
        <input
          id="words-data-upload"
          type="file"
          disabled={!isLoadJSONDataButtonEnabled()}
          accept="application/json"
          onChange={onWordsDataFileChange}
        />
        <button disabled={!isDownloadJSONDataButtonEnabled()} onClick={onDownloadJSONDataButtonClick}>
          Download JSON data
        </button>
      </section>
      <section className={classes.HomePage__Controls}>
        <button disabled={!isAudioPlayButtonEnabled()} onClick={() => onPlayPause(wavesurfer)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </section>
      <section ref={timelineRef}>
        <section className={classes.HomePage__Waveform} ref={waveFormContainerRef}>
          {audioUrl && (
            <WavesurferPlayer
              dragToSeek={true}
              height={WAVE_FORM_HEIGHT}
              width={timelineWidth || DEFAULT_WAVE_FORM_WIDTH}
              waveColor={DEFAULT_WAVE_FORM_COLOR}
              url={audioUrl}
              onReady={onReady}
              onDrag={(ws, relativeX) => updateWordsDataTimeIndicatorPosition(ws, relativeX * ws.getDuration())}
              onAudioprocess={updateWordsDataTimeIndicatorPosition}
              onSeeking={updateWordsDataTimeIndicatorPosition}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
        </section>
        <section>
          <div className={cn(classes.HomePage__WordsDataContainer)} ref={wordsDataContainerRef}>
            <div className={classes.HomePage__WordsData} ref={wordsDataElementRef} onClick={onWordClick}>
              <div ref={wordsDataTimeIndicator} className={classes.HomePage__TimeIndicator}></div>
              {words.map((word: Word, index, array) => (
                <WordComponent
                  key={word.id}
                  id={word.id}
                  widthPx={word.widthPx}
                  leftPx={word.leftPx}
                  word={word.word}
                  selected={word.selected}
                  phonemes={word.phonemes}
                  onWordResizeStart={onWordResizeStart}
                  onPhonemeResizeStart={onPhonemeResizeStart}
                  hideChainResizer={index === array.length - 1 || word.end !== array[index + 1]?.start}
                  onWordChainResizeStart={onWordChainResizeStart}
                  onPhonemeChainResizeStart={onPhonemeChainResizeStart}
                  onWordMoveStart={onWordMoveStart}
                  movingInProgress={!!word.movingInProgress}
                  onPhonemeMoveStart={onPhonemeMoveStart}
                />
              ))}
            </div>
          </div>
        </section>
      </section>
    </section>
  );
};

export default HomePage;
