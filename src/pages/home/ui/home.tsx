import { isNull, Nullable } from '@alexevs/ts-guards';
import WavesurferPlayer from '@wavesurfer/react';
import { Ear, Pause, Pin, Play } from 'lucide-react';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

import { convertWordDTOToWord, convertWordToWordDTO } from 'src/pages/home/api/converters';
import usePhonemeChainResizeStart from 'src/pages/home/api/hooks/use-phoneme-chain-resize-start';
import usePhonemeMoveStart from 'src/pages/home/api/hooks/use-phoneme-move-start';
import usePhonemeResizeStart from 'src/pages/home/api/hooks/use-phoneme-resize-start';
import useTimelineScaling from 'src/pages/home/api/hooks/use-timeline-scaling';
import useWordChainResizeStart from 'src/pages/home/api/hooks/use-word-chain-resize-start';
import useWordMoveStart from 'src/pages/home/api/hooks/use-word-move-start';
import useWordResizeStart from 'src/pages/home/api/hooks/use-word-resize-start';
import {
  DEFAULT_TIME_LINE_SCALE_COEFFICIENT,
  DEFAULT_WAVE_FORM_COLOR,
  DEFAULT_WAVE_FORM_WIDTH,
  PLAY_DURING_DRAG_THROTTLE_TIME_SEC,
  TIME_SCALE_HEIGHT_PX,
  WAVE_FORM_CLONE_HEIGHT,
  WAVE_FORM_HEIGHT,
} from 'src/pages/home/model/consts';
import { AudioTrackTextDataDTO, Word } from 'src/pages/home/model/types';
import DataIOPanel from 'src/pages/home/ui/data-io-panel/data-io-panel';
import { wordsDataContainerStyles } from 'src/pages/home/ui/home.consts';
import TimeScale from 'src/pages/home/ui/time-scale/time-scale';
import WordComponent from 'src/pages/home/ui/word/word';
import { arrayToObject, getFileData, IconButton } from 'src/shared';
import { throttleTime } from 'src/shared/api/helpers/intervals';

const HomePage: React.FC = () => {
  const [audioFileData, setAudioFileData] = useState<Nullable<{ fileName: string; fileUrl: string }>>(null);
  const [wordsDataFileData, setWordsDataFileData] = useState<Nullable<{ fileName: string; extension: string }>>(null);

  const [wavesurfer, setWavesurfer] = useState<Nullable<WaveSurfer>>(null);
  const [wavesurferClone, setWavesurferClone] = useState<Nullable<WaveSurfer>>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playDuringDrag, setPlayDuringDrag] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState<number>(0);

  const [isCaretLocked, setIsCaretLocked] = useState(false);
  const [lockedCaretPosition, setLockedCaretPosition] = useState(0);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1000);

  const timelineRef = useRef<Nullable<HTMLElement>>(null);
  const waveFormContainerRef = useRef<Nullable<HTMLElement>>(null);
  const wordsDataContainerRef = useRef<Nullable<HTMLDivElement>>(null);
  const wordsDataElementRef = useRef<Nullable<HTMLDivElement>>(null);
  const wordsDataTimeIndicator = useRef<Nullable<HTMLDivElement>>(null);
  const rafIdRef = useRef<Nullable<number>>(null);

  const [words, setWords] = useState<Word[]>([]);
  const [wordsMap, setWordsMap] = useState<Record<string, Word>>({});

  const [timelineScaleCoefficients, setTimelineScaleCoefficients] = useState<number>(
    DEFAULT_TIME_LINE_SCALE_COEFFICIENT,
  );

  const onWSCloneReady = (ws: WaveSurfer) => {
    setWavesurferClone(ws);
  };

  const onWSReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setIsPlaying(false);
    setLockedCaretPosition(0);
    const timelineWidth = ws.getDuration() * timelineScaleCoefficients;
    setTimelineWidth(timelineWidth);

    updateWordsDataTimeIndicatorPosition(ws, ws.getDuration());
    setupContainersWidth(timelineWidth);
  };

  const onPlayPause = (wavesurfer: Nullable<WaveSurfer>): void => {
    if (isNull(wavesurfer)) {
      return;
    }
    if (isPlaying && isCaretLocked) {
      wavesurfer.setTime(lockedCaretPosition);
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
      } catch {
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
  const isPinCaretButtonEnabled = (): boolean => !isNull(audioFileData);
  const isPlayDuringDragButtonEnabled = (): boolean => !isNull(audioFileData);
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

  const onLockCaretButtonClick = (wavesurfer: Nullable<WaveSurfer>): void => {
    if (wavesurfer) {
      const time = wavesurfer.getCurrentTime();
      setLockedCaretPosition(time);
    }
    setIsCaretLocked(prev => !prev);
  };

  const onDragEnd = () => {
    if (!isNull(rafIdRef.current)) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setTimeout(() => {
      wavesurferClone?.pause();
    }, PLAY_DURING_DRAG_THROTTLE_TIME_SEC * 1000);
  };

  const onPlayDuringDragThrottled = useCallback(
    throttleTime((ws: WaveSurfer, relativeX: number) => {
      if (!playDuringDrag || isNull(wavesurferClone)) {
        return;
      }
      const playSegment = async () => {
        const curr = ws.getDuration() * relativeX;
        wavesurferClone.play(curr - PLAY_DURING_DRAG_THROTTLE_TIME_SEC, curr);
      };
      if (!isNull(rafIdRef.current)) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(playSegment);
    }, PLAY_DURING_DRAG_THROTTLE_TIME_SEC * 1000),
    [playDuringDrag, wavesurferClone],
  );

  const onWSDragPosition = (ws: WaveSurfer, relativeX: number): void => {
    const time = ws.getDuration() * relativeX;
    setLockedCaretPosition(time);
    updateWordsDataTimeIndicatorPosition(ws, time);
    onPlayDuringDragThrottled(ws, relativeX);
  };

  const onWSSeekPosition = (ws: WaveSurfer, time: number) => {
    setLockedCaretPosition(time);
    updateWordsDataTimeIndicatorPosition(ws, time);
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
    const onWordsDataContainerHScrollChange = (event: Event) => {
      if (!isNull(waveFormContainerRef.current)) {
        waveFormContainerRef.current.scrollLeft = (event.target as EventTarget & { scrollLeft: number }).scrollLeft;
      }
    };
    const onWaveFormContainerScrollChange = (event: Event) => {
      if (!isNull(wordsDataContainerRef.current)) {
        wordsDataContainerRef.current.scrollLeft = (event.target as EventTarget & { scrollLeft: number }).scrollLeft;
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
  }, [wavesurfer, isPlaying, isCaretLocked, lockedCaretPosition]);

  useEffect(() => {
    setWordsMap(arrayToObject(words, 'id'));
  }, [words]);

  useEffect(() => {
    if (!playDuringDrag) {
      setWavesurferClone(null);
    }
  }, [playDuringDrag, setWavesurferClone]);

  return (
    <section className="flex flex-col">
      <h1 className="text-center">Lipsync Timing Checker</h1>
      <DataIOPanel
        audioFileName={audioFileData?.fileName}
        wordsDataFileName={wordsDataFileData?.fileName}
        isLoadJSONDataButtonEnabled={isLoadJSONDataButtonEnabled()}
        isDownloadJSONDataButtonEnabled={isDownloadJSONDataButtonEnabled()}
        onAudioFileChange={onAudioFileChange}
        onWordsDataFileChange={onWordsDataFileChange}
        onDownloadJSONDataButtonClick={onDownloadJSONDataButtonClick}
      ></DataIOPanel>
      <section className="flex items-center gap-6 my-4 rounded-md bg-gray-800 p-4 shadow">
        <IconButton
          title={isPlaying ? 'Pause' : 'Play'}
          disabled={!isAudioPlayButtonEnabled()}
          onClick={() => onPlayPause(wavesurfer)}
        >
          {isPlaying ? <Pause /> : <Play />}
        </IconButton>
        <section className="flex items-center gap-2">
          <IconButton
            title={isCaretLocked ? 'Unlock caret position' : 'Lock caret position'}
            variant={isCaretLocked ? 'primary' : 'secondary'}
            disabled={!isPinCaretButtonEnabled()}
            onClick={() => onLockCaretButtonClick(wavesurfer)}
          >
            <Pin />
          </IconButton>
          <IconButton
            title={playDuringDrag ? 'Disable audio while dragging' : 'Enable audio while dragging'}
            disabled={!isPlayDuringDragButtonEnabled()}
            onClick={() => setPlayDuringDrag(prev => !prev)}
            variant={playDuringDrag ? 'primary' : 'secondary'}
          >
            <Ear />
          </IconButton>
        </section>
      </section>
      <section ref={timelineRef}>
        <section
          className="flex overflow-x-auto overflow-y-hidden border border-gray-300"
          style={{ scrollbarWidth: 'none' }}
        >
          <TimeScale
            duration={wavesurfer?.getDuration() ?? 0}
            timelineWidth={timelineWidth}
            scrollLeft={scrollLeft}
            viewportWidth={viewportWidth}
            height={TIME_SCALE_HEIGHT_PX}
          />
        </section>
        <section
          className="flex h-[200px] overflow-x-auto overflow-y-hidden border border-gray-300"
          style={{ scrollbarWidth: 'none' }}
          ref={waveFormContainerRef}
        >
          {audioFileData && (
            <WavesurferPlayer
              dragToSeek={true}
              height={WAVE_FORM_HEIGHT}
              width={timelineWidth || DEFAULT_WAVE_FORM_WIDTH}
              waveColor={DEFAULT_WAVE_FORM_COLOR}
              url={audioFileData.fileUrl}
              onReady={onWSReady}
              onDrag={onWSDragPosition}
              onDragend={onDragEnd}
              onAudioprocess={updateWordsDataTimeIndicatorPosition}
              onSeeking={onWSSeekPosition}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
          {audioFileData && playDuringDrag && (
            <WavesurferPlayer
              dragToSeek={true}
              height={WAVE_FORM_CLONE_HEIGHT}
              width={timelineWidth || DEFAULT_WAVE_FORM_WIDTH}
              waveColor={DEFAULT_WAVE_FORM_COLOR}
              url={audioFileData.fileUrl}
              onReady={onWSCloneReady}
            />
          )}
        </section>
        <section>
          <div
            className="relative h-[100px] border border-gray-300 overflow-x-auto overflow-y-hidden"
            style={wordsDataContainerStyles}
            ref={wordsDataContainerRef}
          >
            <div className="relative h-[100px]" ref={wordsDataElementRef}>
              <div
                ref={wordsDataTimeIndicator}
                className="absolute top-0 h-full w-[2px] bg-red-500 pointer-events-none z-10"
              ></div>
              {words.map((word: Word, index, array) => (
                <WordComponent
                  key={word.id}
                  id={word.id}
                  widthPx={word.widthPx}
                  leftPx={word.leftPx}
                  word={word.word}
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
