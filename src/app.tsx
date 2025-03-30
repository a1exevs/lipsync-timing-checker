import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';

export type JSONItem = {
  start: number;
  end: number;
};

export type JSONPhoneme = {
  phoneme: string;
} & JSONItem;

export type JSONWord = {
  word: string;
  phonemes: JSONPhoneme[];
} & JSONItem;

export type JSONData = {
  words: JSONWord[];
};

export const TIME_LINE_SCALE_COEFFICIENT = 400;

const App: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [width, setWidth] = useState<number>(0);

  const waveFormContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataWordsContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataPhonemesContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataWordsElRef = useRef<HTMLDivElement>(null);
  const jsonDataPhonemesElRef = useRef<HTMLDivElement>(null);

  const [words, setWords] = useState<JSONWord[]>([]);
  const [phonemes, setPhonemes] = useState<JSONPhoneme[]>([]);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
    updateCurrentTime();
    const width = ws.getDuration() * TIME_LINE_SCALE_COEFFICIENT;
    setWidth(width);
    setupContainersWidth(width);
  };

  const onPlayPause = (wavesurfer: any): void => {
    if (!wavesurfer) {
      return;
    }
    (wavesurfer as any).playPause();
  };

  const onAudioFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if ((event as any).target.files.length === 0) {
      return;
    }
    const file = (event as any).target.files[0];
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    event.target.blur();
  };

  const onJSONFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if ((event as any).target.files.length === 0) {
      return;
    }
    const file = (event as any).target.files[0];
    const reader = new FileReader();
    event.target.blur();
    reader.onload = function (e) {
      try {
        const jsonData: JSONData = JSON.parse((e as any).target.result);
        setWords(jsonData.words);
        setPhonemes(
          jsonData.words.reduce<JSONPhoneme[]>((result, word) => {
            result.push(...word.phonemes);
            return result;
          }, []),
        );
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
    const percent = (currentTime / duration) * 100;

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
      jsonDataIndicator1.style.left = `${percent}%`;
    }
    const jsonDataIndicator2 = document.getElementById('json-data-indicator-2');
    if (jsonDataIndicator2) {
      jsonDataIndicator2.style.left = `${percent}%`;
    }
  };

  const getItemLeftPosition = (item: JSONItem): string => {
    if (!wavesurfer) {
      return '';
    }
    const duration = wavesurfer.getDuration();
    return `${(item.start / duration) * 100}%`;
  };

  const getItemWidth = (item: JSONItem): string => {
    if (!wavesurfer) {
      return '';
    }
    const duration = wavesurfer.getDuration();
    return `${((item.end - item.start) / duration) * 100}%`;
  };

  useEffect(() => {
    if (!waveFormContainerRef.current || !jsonDataWordsContainerRef.current || !jsonDataPhonemesContainerRef.current) {
      return;
    }
    const onJSONDataWordsContainerHScrollChange = (event: Event) => {
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
      if (event.code === 'Space') {
        onPlayPause(wavesurfer);
      }
    };
    window.addEventListener('keydown', handleKeyboardEvents);
    return () => {
      window.removeEventListener('keydown', handleKeyboardEvents);
    };
  }, [wavesurfer]);

  return (
    <div className="App">
      <h1 className="App__Title">Audio Waveform and JSON Viewer</h1>
      <section className="Controls">
        <label htmlFor="audio-upload">Выбрать аудио:</label>
        <input type="file" id="audio-upload" accept="audio/*" onChange={onAudioFileChange} />
        <label htmlFor="json-upload">Выбрать JSON:</label>
        <input type="file" id="json-upload" accept="application/json" onChange={onJSONFileChange} />
        <button onClick={() => onPlayPause(wavesurfer)}>{isPlaying ? 'Pause' : 'Play'}</button>
      </section>
      <section>
        <div className="Waveform" ref={waveFormContainerRef}>
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
        </div>
      </section>
      <section>
        <div className="JSONDataContainer JSONDataContainer_withoutScrollbar" ref={jsonDataWordsContainerRef}>
          <div className="JSONData" ref={jsonDataWordsElRef}>
            <div id="json-data-indicator-1" className="PositionIndicator"></div>
            {words.map((word: JSONWord, index: number) => {
              return (
                <div
                  className="Word"
                  key={index}
                  style={{ width: getItemWidth(word), left: getItemLeftPosition(word) }}
                >
                  {word.word}
                </div>
              );
            })}
          </div>
        </div>
        <div className="JSONDataContainer" ref={jsonDataPhonemesContainerRef}>
          <div className="JSONData" ref={jsonDataPhonemesElRef}>
            <div id="json-data-indicator-2" className="PositionIndicator"></div>
            {phonemes.map((phoneme: JSONPhoneme, index: number) => {
              return (
                <div
                  className="Phoneme"
                  key={index}
                  style={{ width: getItemWidth(phoneme), left: getItemLeftPosition(phoneme) }}
                >
                  {phoneme.phoneme}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
