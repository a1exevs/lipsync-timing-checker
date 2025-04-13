import React, { ChangeEvent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import Word from 'src/pages/home/ui/word/word';
import { arrayToObject } from 'src/shared/helpers/arrays';
import classes from 'src/pages/home/ui/home.module.scss';
import cn from 'classnames';
import { JSONData, JSONItem, JSONPhoneme, JSONWord, ResizerSide } from 'src/pages/home/model/types';
import { TIME_LINE_SCALE_COEFFICIENT } from 'src/pages/home/model/consts';
import WaveSurfer from 'wavesurfer.js';

const HomePage: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [width, setWidth] = useState<number>(0);

  const waveFormContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataWordsContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataPhonemesContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataWordsElRef = useRef<HTMLDivElement>(null);
  const jsonDataPhonemesElRef = useRef<HTMLDivElement>(null);

  const [words, setWords] = useState<JSONWord[]>([]);
  const [wordsMap, setWordsMap] = useState<Record<number, JSONWord>>({});

  const [phonemes, setPhonemes] = useState<JSONPhoneme[]>([]);

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setIsPlaying(false);
    updateCurrentTime();
    const width = ws.getDuration() * TIME_LINE_SCALE_COEFFICIENT;
    setWidth(width);
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

  const onJSONFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event?.target?.files?.length) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    event.target.blur();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      try {
        if (!e?.target?.result || typeof e.target.result !== 'string') {
          return;
        }
        const jsonData: JSONData = JSON.parse(e.target.result);
        const words = jsonData.words.map((word, index) => ({ ...word, id: String(index), selected: false }));
        setWords(words);
        const phonemes = jsonData.words
          .reduce<JSONPhoneme[]>((result, word) => {
            result.push(...word.phonemes);
            return result;
          }, [])
          .map((phoneme, index) => ({ ...phoneme, id: String(index), selected: false }));
        setPhonemes(phonemes);
      } catch (error) {
        alert('Некорректный JSON файл');
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
    const scaledTimePx = (currentTime / duration) * width;
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

  const getItemLeftPosition = (item: JSONItem): string => {
    if (!wavesurfer) {
      return '';
    }
    const duration = wavesurfer.getDuration();
    return `${(item.start / duration) * width}px`;
  };

  const getItemWidth = (item: JSONItem): string => {
    if (!wavesurfer) {
      return '';
    }
    const duration = wavesurfer.getDuration();
    return `${((item.end - item.start) / duration) * width}px`;
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

  useEffect(() => {
    if (!waveFormContainerRef.current || !jsonDataWordsContainerRef.current || !jsonDataPhonemesContainerRef.current) {
      return;
    }
    const onJSONDataWordsContainerHScrollChange = (event: any) => {
      if (waveFormContainerRef.current) {
        waveFormContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
      if (jsonDataPhonemesContainerRef.current) {
        jsonDataPhonemesContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
    };
    const onWaveFormContainerScrollChange = (event: Event) => {
      if (jsonDataWordsContainerRef.current) {
        jsonDataWordsContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
      }
      if (jsonDataPhonemesContainerRef.current) {
        jsonDataPhonemesContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
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
    jsonDataWordsContainerRef.current.addEventListener('scroll', onJSONDataWordsContainerHScrollChange);
    jsonDataPhonemesContainerRef.current.addEventListener('scroll', onJSONDataPhonemesContainerRef);
    return () => {
      if (waveFormContainerRef.current) {
        waveFormContainerRef.current.removeEventListener('scroll', onWaveFormContainerScrollChange);
      }
      if (jsonDataWordsContainerRef.current) {
        jsonDataWordsContainerRef.current.removeEventListener('scroll', onJSONDataWordsContainerHScrollChange);
      }
      if (jsonDataPhonemesContainerRef.current) {
        jsonDataPhonemesContainerRef.current.removeEventListener('scroll', onJSONDataPhonemesContainerRef);
      }
    };
  }, [waveFormContainerRef, jsonDataWordsContainerRef, jsonDataPhonemesContainerRef]);

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

  const onMouseDown = (e: MouseEvent, ref: RefObject<HTMLDivElement>, resizerSide: ResizerSide) => {
    if (!ref.current) {
      return;
    }
    const startX = e.clientX;
    const startWidth = ref.current.offsetWidth;
    const startLeft = ref.current.offsetLeft;
    const onMouseMove: EventListener = (moveEvent: Event) => {
      if (!ref.current) {
        return;
      }
      const clientX = (moveEvent as unknown as MouseEvent).clientX;
      if (resizerSide === 'left') {
        const diff = clientX - startX;
        const newWidth = startWidth - diff;
        ref.current.style.left = `${startLeft + diff}px`;
        ref.current.style.width = `${newWidth}px`;
      }
      if (resizerSide === 'right') {
        const newWidth = startWidth + (clientX - startX);
        ref.current.style.width = `${newWidth}px`;
      }
    };

    const onMouseUp = () => {
      console.log('onMouseUp');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    console.log('onMouseDown');
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <section className={classes.HomePage}>
      <h1 className={classes.HomePage__Title}>Audio Waveform and JSON Viewer</h1>
      <section className={classes.HomePage__Controls}>
        <label htmlFor="audio-upload">Выбрать аудио:</label>
        <input type="file" id="audio-upload" accept="audio/*" onChange={onAudioFileChange} />
        <label htmlFor="json-upload">Выбрать JSON:</label>
        <input type="file" id="json-upload" accept="application/json" onChange={onJSONFileChange} />
        <button onClick={() => onPlayPause(wavesurfer)}>{isPlaying ? 'Pause' : 'Play'}</button>
      </section>
      <section className={classes.HomePage__Waveform} ref={waveFormContainerRef}>
        {audioUrl && (
          <WavesurferPlayer
            height={200}
            width={width || '100%'}
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
        <div
          className={cn(classes.HomePage__JSONDataContainer, classes.HomePage__JSONDataContainer_withoutScrollbar)}
          ref={jsonDataWordsContainerRef}
        >
          <div className={classes.HomePage__JSONData} ref={jsonDataWordsElRef} onClick={onWordClick}>
            <div id="json-data-indicator-1" className="PositionIndicator"></div>
            {words.map((word: JSONWord) => (
              <Word
                key={word.id}
                word={word}
                selected={word.selected}
                width={getItemWidth(word)}
                left={getItemLeftPosition(word)}
                onResizeStart={(e, ref, resizerSide: ResizerSide) => onMouseDown(e, ref, resizerSide)}
              />
            ))}
          </div>
        </div>
        <div className={classes.HomePage__JSONDataContainer} ref={jsonDataPhonemesContainerRef}>
          <div className="JSONData" ref={jsonDataPhonemesElRef}>
            <div id="json-data-indicator-2" className="PositionIndicator"></div>
            {phonemes.map((phoneme: JSONPhoneme) => {
              return (
                <div
                  className="Phoneme"
                  key={phoneme.id}
                  style={{ width: getItemWidth(phoneme), left: getItemLeftPosition(phoneme) }}
                >
                  {phoneme.phoneme}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
};

export default HomePage;
