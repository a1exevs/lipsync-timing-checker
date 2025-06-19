import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import WordComponent from 'src/pages/home/ui/word/word';
import classes from 'src/pages/home/ui/home.module.scss';
import cn from 'classnames';
import { AudioTrackTextDataDTO, Word } from 'src/pages/home/model/types';
import {
  DEFAULT_TIME_LINE_SCALE_COEFFICIENT,
  DEFAULT_WAVE_FORM_COLOR,
  DEFAULT_WAVE_FORM_WIDTH,
  TIME_SCALE_HEIGHT_PX,
  WAVE_FORM_HEIGHT,
} from 'src/pages/home/model/consts';
import WaveSurfer from 'wavesurfer.js';
import { convertWordDTOToWord, convertWordToWordDTO } from 'src/pages/home/api/converters';
import usePhonemeResizeStart from 'src/pages/home/api/hooks/use-phoneme-resize-start';
import useWordResizeStart from 'src/pages/home/api/hooks/use-word-resize-start';
import usePhonemeChainResizeStart from 'src/pages/home/api/hooks/use-phoneme-chain-resize-start';
import useWordChainResizeStart from 'src/pages/home/api/hooks/use-word-chain-resize-start';
import useWordMoveStart from 'src/pages/home/api/hooks/use-word-move-start';
import usePhonemeMoveStart from 'src/pages/home/api/hooks/use-phoneme-move-start';
import { isNull, Nullable } from '@alexevs/ts-guards';
import TimeScale from 'src/pages/home/ui/time-scale/time-scale';
import { Play, Pause, FileAudio, FileJson, Download } from 'lucide-react';
import { FilePicker, Button, IconButton, getFileData, arrayToObject } from 'src/shared';
import useTimelineScaling from 'src/pages/home/api/hooks/use-timeline-scaling';
import DataIOPanel from 'src/pages/home/ui/data-io-panel/data-io-panel';

const HomePage: React.FC = () => {
  const [audioFileData, setAudioFileData] = useState<Nullable<{ fileName: string; fileUrl: string }>>(null);
  const [wordsDataFileData, setWordsDataFileData] = useState<Nullable<{ fileName: string; extension: string }>>(null);

  const [wavesurfer, setWavesurfer] = useState<Nullable<WaveSurfer>>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState<number>(0);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1000);

  const timelineRef = useRef<Nullable<HTMLElement>>(null);
  const waveFormContainerRef = useRef<Nullable<HTMLElement>>(null);
  const wordsDataContainerRef = useRef<Nullable<HTMLDivElement>>(null);
  const wordsDataElementRef = useRef<Nullable<HTMLDivElement>>(null);
  const wordsDataTimeIndicator = useRef<Nullable<HTMLDivElement>>(null);

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

  const onPlayPause = (wavesurfer: Nullable<WaveSurfer>): void => {
    if (isNull(wavesurfer)) {
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
    setAudioFileData({ fileName: file.name, fileUrl: url });
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
    if (isNull(wordsDataElementRef.current)) {
      return;
    }
    wordsDataElementRef.current.style.width = `${width}px`;
  };

  const updateWordsDataTimeIndicatorPosition = (ws: WaveSurfer, currentTime: number): void => {
    const duration = ws.getDuration();
    const scaledTimePx = (currentTime / duration) * timelineWidth;
    const currentTimePositionLeft = currentTime * timelineScaleCoefficients;
    const containerHScrollPositionLeft = waveFormContainerRef?.current?.scrollLeft ?? 0;
    const containerWidth = waveFormContainerRef?.current?.clientWidth ?? 0;
    if (
      Math.abs(currentTimePositionLeft - containerHScrollPositionLeft) > containerWidth &&
      !isNull(waveFormContainerRef.current)
    ) {
      waveFormContainerRef.current.scrollLeft =
        currentTimePositionLeft - containerHScrollPositionLeft > 0
          ? waveFormContainerRef.current.scrollLeft + containerWidth
          : currentTimePositionLeft;
    }
    if (!isNull(wordsDataTimeIndicator.current)) {
      wordsDataTimeIndicator.current.style.left = `${scaledTimePx}px`;
    }
  };

  const isLoadJSONDataButtonEnabled = (): boolean => !isNull(audioFileData);
  const isAudioPlayButtonEnabled = (): boolean => !isNull(audioFileData);
  const isDownloadJSONDataButtonEnabled = (): boolean => words.length !== 0;

  const onDownloadJSONDataButtonClick = (): void => {
    if (isNull(wordsDataFileData)) {
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

  useTimelineScaling(timelineRef, timelineWidth, wavesurfer, setTimelineWidth, setWords, setTimelineScaleCoefficients);

  useEffect(() => {
    const updateViewportMetrics = () => {
      if (waveFormContainerRef.current) {
        setScrollLeft(waveFormContainerRef.current.scrollLeft);
        setViewportWidth(waveFormContainerRef.current.clientWidth);
      }
    };

    const onScroll = () => updateViewportMetrics();
    const onResize = () => updateViewportMetrics();

    const container = waveFormContainerRef.current;
    if (container) {
      container.addEventListener('scroll', onScroll);
    }
    window.addEventListener('resize', onResize);

    updateViewportMetrics();

    return () => {
      if (container) {
        container.removeEventListener('scroll', onScroll);
      }
      window.removeEventListener('resize', onResize);
    };
  }, [waveFormContainerRef]);

  useEffect(() => {
    if (isNull(waveFormContainerRef.current) || isNull(wordsDataContainerRef.current)) {
      return;
    }
    const onWordsDataContainerHScrollChange = (event: any) => {
      if (!isNull(waveFormContainerRef.current)) {
        waveFormContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
    };
    const onWaveFormContainerScrollChange = (event: Event) => {
      if (!isNull(wordsDataContainerRef.current)) {
        wordsDataContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
    };
    waveFormContainerRef.current.addEventListener('scroll', onWaveFormContainerScrollChange);
    wordsDataContainerRef.current.addEventListener('scroll', onWordsDataContainerHScrollChange);
    return () => {
      if (!isNull(waveFormContainerRef.current)) {
        waveFormContainerRef.current.removeEventListener('scroll', onWaveFormContainerScrollChange);
      }
      if (!isNull(wordsDataContainerRef.current)) {
        wordsDataContainerRef.current.removeEventListener('scroll', onWordsDataContainerHScrollChange);
      }
    };
  }, [waveFormContainerRef, wordsDataContainerRef]);

  const onWordResizeStart = useWordResizeStart(words, wordsMap, setWords, wavesurfer, timelineWidth);
  const onWordChainResizeStart = useWordChainResizeStart(words, wordsMap, setWords, wavesurfer, timelineWidth);
  const onWordMoveStart = useWordMoveStart(words, wordsMap, setWords, wavesurfer, timelineWidth);
  const onPhonemeResizeStart = usePhonemeResizeStart(words, wordsMap, setWords, wavesurfer, timelineWidth);
  const onPhonemeChainResizeStart = usePhonemeChainResizeStart(words, wordsMap, setWords, wavesurfer, timelineWidth);
  const onPhonemeMoveStart = usePhonemeMoveStart(words, wordsMap, setWords, wavesurfer, timelineWidth);

  useEffect(() => {
    const handleKeyboardEvents = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isNull(wavesurfer)) {
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
      <DataIOPanel
        audioFileName={audioFileData?.fileName}
        wordsDataFileName={wordsDataFileData?.fileName}
        isLoadJSONDataButtonEnabled={isLoadJSONDataButtonEnabled()}
        isDownloadJSONDataButtonEnabled={isDownloadJSONDataButtonEnabled()}
        onAudioFileChange={onAudioFileChange}
        onWordsDataFileChange={onWordsDataFileChange}
        onDownloadJSONDataButtonClick={onDownloadJSONDataButtonClick}
      ></DataIOPanel>
      <section className="flex items-center gap-4 my-4 rounded-md bg-gray-800 p-4 shadow">
        <IconButton
          title={isPlaying ? 'Pause' : 'Play'}
          disabled={!isAudioPlayButtonEnabled()}
          onClick={() => onPlayPause(wavesurfer)}
        >
          {isPlaying ? <Pause /> : <Play />}
        </IconButton>
      </section>
      <section ref={timelineRef}>
        <section className={classes.HomePage__TimeScale}>
          <TimeScale
            duration={wavesurfer?.getDuration() ?? 0}
            timelineWidth={timelineWidth}
            scrollLeft={scrollLeft}
            viewportWidth={viewportWidth}
            height={TIME_SCALE_HEIGHT_PX}
          />
        </section>
        <section className={classes.HomePage__Waveform} ref={waveFormContainerRef}>
          {audioFileData && (
            <WavesurferPlayer
              dragToSeek={true}
              height={WAVE_FORM_HEIGHT}
              width={timelineWidth || DEFAULT_WAVE_FORM_WIDTH}
              waveColor={DEFAULT_WAVE_FORM_COLOR}
              url={audioFileData.fileUrl}
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
            <div className={classes.HomePage__WordsData} ref={wordsDataElementRef}>
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
