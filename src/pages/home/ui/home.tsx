import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import WordComponent from 'src/pages/home/ui/word/word';
import classes from 'src/pages/home/ui/home.module.scss';
import cn from 'classnames';
import { AudioTrackTextDataDTO, ResizerSide, Word } from 'src/pages/home/model/types';
import {
  DEFAULT_TIME_LINE_SCALE_COEFFICIENT,
  DEFAULT_WAVE_FORM_COLOR,
  DEFAULT_WAVE_FORM_WIDTH,
  MAX_TIME_LINE_SCALE_COEFFICIENT,
  MIN_TIME_LINE_SCALE_COEFFICIENT,
  WAVE_FORM_HEIGHT,
} from 'src/pages/home/model/consts';
import WaveSurfer from 'wavesurfer.js';
import { arrayToObject } from 'src/shared/helpers/arrays';
import { getFileData } from 'src/shared/helpers/files';
import {
  convertWordDTOToWord,
  convertWordToWordDTO,
  recalculateWordWithByNewTimelineWidth,
} from 'src/pages/home/api/converters';

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

  const onWordClick = (event: MouseEvent): void => {
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
      words: words.map(word =>
        convertWordToWordDTO({
          word,
          timelineWidth,
          audioDuration: wavesurfer?.getDuration() ?? 0,
        }),
      ),
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
      const delta = (event as any).wheelDelta;
      setTimelineScaleCoefficients(prevCoefficient => {
        let newCoefficient = prevCoefficient + delta;
        if (newCoefficient < MIN_TIME_LINE_SCALE_COEFFICIENT) {
          newCoefficient = MIN_TIME_LINE_SCALE_COEFFICIENT;
        }
        if (newCoefficient > MAX_TIME_LINE_SCALE_COEFFICIENT) {
          newCoefficient = MAX_TIME_LINE_SCALE_COEFFICIENT;
        }
        const newTimelineWidth = wavesurfer.getDuration() * newCoefficient;
        setTimelineWidth(newTimelineWidth);
        setWords(words =>
          words.map(word =>
            recalculateWordWithByNewTimelineWidth({
              word,
              prevTimelineWidth: timelineWidth,
              newTimelineWidth,
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
  }, [timelineRef, timelineWidth, wavesurfer, words, setTimelineWidth, setWords]);

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

  const onMouseDown = useCallback(
    (e: MouseEvent, wordId: string, resizerSide: ResizerSide) => {
      const word = wordsMap[wordId];
      if (word === undefined) {
        return;
      }
      const wordIndex = words.indexOf(word);
      if (wordIndex === -1) {
        return;
      }
      const prevWord = words[wordIndex - 1];
      const nextWord = words[wordIndex + 1];

      const startX = e.clientX;
      const startWidthPx = word.widthPx;
      const startLeftPx = word.leftPx;
      const onMouseMove: EventListener = (moveEvent: Event) => {
        if (!wavesurfer) {
          return;
        }
        const duration = wavesurfer.getDuration();
        const clientX = (moveEvent as unknown as MouseEvent).clientX;
        if (resizerSide === 'left') {
          const diffPx = clientX - startX;
          const newWidthPx = startWidthPx - diffPx;
          const newLeftPx = startLeftPx + diffPx;
          const prevWordRightPx = prevWord.leftPx + prevWord.widthPx;
          if (prevWord && newLeftPx < prevWordRightPx) {
            // TODO toFixed(2) for start and end
            const leftDiffPx = prevWordRightPx - word.leftPx;
            const newWordStart = prevWord.end;
            word.leftPx = prevWordRightPx;
            word.start = newWordStart;

            const newWidthPx = word.widthPx - leftDiffPx;
            word.widthPx = newWidthPx;
            word.end = newWordStart + (newWidthPx / timelineWidth) * duration;
          } else {
            // TODO toFixed(2) for start and end
            word.leftPx = newLeftPx;
            word.start = (newLeftPx / timelineWidth) * duration;

            word.widthPx = newWidthPx;
            word.end = ((newLeftPx + newWidthPx) / timelineWidth) * duration;
          }
        }
        if (resizerSide === 'right') {
          const newWidthPx = startWidthPx + (clientX - startX);
          if (nextWord && word.leftPx + newWidthPx > nextWord.leftPx) {
            // TODO toFixed(2) for start and end
            word.widthPx = nextWord.leftPx - word.leftPx;
            word.end = nextWord.start;
          } else {
            // TODO toFixed(2) for start and end
            word.widthPx = newWidthPx;
            word.end = word.start + (newWidthPx / timelineWidth) * duration;
          }
        }
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
    [words.length, Object.keys(wordsMap).length, wavesurfer],
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
      <h1 className={classes.HomePage__Title}>Audio Waveform and JSON Viewer</h1>
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
              {words.map((word: Word, index, arr) => (
                <WordComponent
                  key={word.id}
                  id={word.id}
                  widthPx={word.widthPx}
                  leftPx={word.leftPx}
                  word={word.word}
                  start={word.start}
                  end={word.end}
                  selected={word.selected}
                  phonemes={word.phonemes}
                  hideLeftResizer={index === 0}
                  hideRightResizer={index === arr.length - 1}
                  onResizeStart={onMouseDown}
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
