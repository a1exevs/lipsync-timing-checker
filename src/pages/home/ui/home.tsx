import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import WordComponent from 'src/pages/home/ui/word/word';
import classes from 'src/pages/home/ui/home.module.scss';
import cn from 'classnames';
import { AudioTrackTextDataDTO, ResizerSide, Word } from 'src/pages/home/model/types';
import { TIME_LINE_SCALE_COEFFICIENT } from 'src/pages/home/model/consts';
import WaveSurfer from 'wavesurfer.js';
import { arrayToObject } from 'src/shared/helpers/arrays';
import { getFileData } from 'src/shared/helpers/files';
import { convertWordDTOToWord, convertWordToWordDTO } from 'src/pages/home/api/converters';

const HomePage: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [wordsDataFileData, setWordsDataFileData] = useState<{ fileName: string; extension: string } | null>(null);

  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState<number>(0);

  const waveFormContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataWordsContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataWordsElRef = useRef<HTMLDivElement>(null);
  const jsonDataPhonemesElRef = useRef<HTMLDivElement>(null);

  const [words, setWords] = useState<Word[]>([]);
  const [wordsMap, setWordsMap] = useState<Record<string, Word>>({});

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setIsPlaying(false);
    updateCurrentTime();
    const width = ws.getDuration() * TIME_LINE_SCALE_COEFFICIENT;
    setTimelineWidth(width);
    setupContainersWidth(width);
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
        // TODO encapsulate JSON.parse in parser factory
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
    if (jsonDataWordsElRef.current) {
      jsonDataWordsElRef.current.style.width = `${width}px`;
    }
    if (jsonDataPhonemesElRef.current) {
      jsonDataPhonemesElRef.current.style.width = `${width}px`;
    }
  };

  const updateCurrentTime = (): void => {
    if (!wavesurfer) {
      return;
    }
    const duration = wavesurfer.getDuration();
    const currentTime = wavesurfer.getCurrentTime();
    const scaledTimePx = (currentTime / duration) * timelineWidth;
    const currentTimePositionLeft = currentTime * TIME_LINE_SCALE_COEFFICIENT;
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
    const jsonDataIndicator1 = document.getElementById('json-data-indicator-1');
    if (jsonDataIndicator1) {
      jsonDataIndicator1.style.left = `${scaledTimePx}px`;
    }
    const jsonDataIndicator2 = document.getElementById('json-data-indicator-2');
    if (jsonDataIndicator2) {
      jsonDataIndicator2.style.left = `${scaledTimePx}px`;
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
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wordsDataFileData.fileName}.export.${wordsDataFileData.extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!waveFormContainerRef.current || !jsonDataWordsContainerRef.current) {
      return;
    }
    const onWordsDataContainerHScrollChange = (event: any) => {
      if (waveFormContainerRef.current) {
        waveFormContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
    };
    const onWaveFormContainerScrollChange = (event: Event) => {
      if (jsonDataWordsContainerRef.current) {
        jsonDataWordsContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
    };
    const onJSONDataPhonemesContainerRef = (event: Event) => {
      if (waveFormContainerRef.current) {
        waveFormContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
      if (jsonDataWordsContainerRef.current) {
        jsonDataWordsContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
    };
    waveFormContainerRef.current.addEventListener('scroll', onWaveFormContainerScrollChange);
    jsonDataWordsContainerRef.current.addEventListener('scroll', onWordsDataContainerHScrollChange);
    return () => {
      if (waveFormContainerRef.current) {
        waveFormContainerRef.current.removeEventListener('scroll', onWaveFormContainerScrollChange);
      }
      if (jsonDataWordsContainerRef.current) {
        jsonDataWordsContainerRef.current.removeEventListener('scroll', onWordsDataContainerHScrollChange);
      }
    };
  }, [waveFormContainerRef, jsonDataWordsContainerRef]);

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
        const clientX = (moveEvent as unknown as MouseEvent).clientX;
        if (resizerSide === 'left') {
          const diffPx = clientX - startX;
          const newWidthPx = startWidthPx - diffPx;
          const newLeftPx = startLeftPx + diffPx;
          const prevWordRightPx = prevWord.leftPx + prevWord.widthPx;
          if (prevWord && newLeftPx < prevWordRightPx) {
            const leftDiffPx = prevWordRightPx - word.leftPx;
            word.leftPx = prevWordRightPx;
            word.widthPx = word.widthPx - leftDiffPx;
          } else {
            word.leftPx = newLeftPx;
            word.widthPx = newWidthPx;
          }
        }
        if (resizerSide === 'right') {
          const newWidthPx = startWidthPx + (clientX - startX);
          if (nextWord && word.leftPx + newWidthPx > nextWord.leftPx) {
            word.widthPx = nextWord.leftPx - word.leftPx;
          } else {
            word.widthPx = newWidthPx;
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
    [words.length, Object.keys(wordsMap).length],
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
        <label htmlFor="audio-upload">Load audio:</label>
        <input type="file" id="audio-upload" accept="audio/*" onChange={onAudioFileChange} />
        <label htmlFor="json-upload">Load JSON data:</label>
        <input
          id="json-upload"
          type="file"
          disabled={!isLoadJSONDataButtonEnabled()}
          accept="application/json"
          onChange={onWordsDataFileChange}
        />
        <button disabled={!isDownloadJSONDataButtonEnabled()} onClick={onDownloadJSONDataButtonClick}>
          Download Download JSON data
        </button>
      </section>
      <section className={classes.HomePage__Controls}>
        <button disabled={!isAudioPlayButtonEnabled()} onClick={() => onPlayPause(wavesurfer)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </section>
      <section className={classes.HomePage__Waveform} ref={waveFormContainerRef}>
        {audioUrl && (
          <WavesurferPlayer
            height={200}
            width={timelineWidth || '100%'}
            waveColor="violet"
            url={audioUrl}
            onReady={onReady}
            onAudioprocess={updateCurrentTime}
            onSeeking={updateCurrentTime}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
      </section>
      <section>
        <div className={cn(classes.HomePage__JSONDataContainer)} ref={jsonDataWordsContainerRef}>
          <div className={classes.HomePage__JSONData} ref={jsonDataWordsElRef} onClick={onWordClick}>
            <div id="json-data-indicator-1" className={classes.HomePage__PositionIndicator}></div>
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
  );
};

export default HomePage;
