import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';

const App: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [width, setWidth] = useState<number>(0);

  const waveFormContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataContainerRef = useRef<HTMLDivElement>(null);
  const jsonDataElRef = useRef<HTMLDivElement>(null);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
    updateCurrentTime();
    const width = ws.getDuration() * 400;
    setWidth(width);
  };

  const onPlayPause = () => {
    wavesurfer && (wavesurfer as any).playPause();
  };

  const onAudioFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if ((event as any).target.files.length === 0) {
      return;
    }
    const file = (event as any).target.files[0];
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  const onJSONFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if ((event as any).target.files.length === 0) {
      return;
    }
    const file = (event as any).target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const jsonData = JSON.parse((e as any).target.result);
        displayJsonData(jsonData);
      } catch (error) {
        alert('Некорректный JSON файл');
      }
    };
    reader.readAsText(file);
  };

  const displayJsonData = (jsonData: any) => {
    const jsonDataEl: any = jsonDataElRef.current;
    jsonDataEl.style.width = `${width}px`;
    jsonDataEl.innerHTML = '<h3>Слова и фонемы</h3>';

    const jsonDataContainer: any = jsonDataContainerRef.current;
    const indicator = document.createElement('div');
    indicator.id = 'json-data-indicator';
    indicator.className = 'PositionIndicator';
    jsonDataEl.appendChild(indicator);

    const duration = wavesurfer.getDuration();

    jsonData.words.forEach((wordItem: any) => {
      // Создание блока для слова
      const wordElement = document.createElement('div');
      wordElement.className = 'Word';
      wordElement.textContent = wordItem.word;

      // Вычисляем позицию и ширину слова
      const wordStartRatio = wordItem.start / duration;
      const wordEndRatio = wordItem.end / duration;
      const wordLeft = wordStartRatio * 100;
      const wordWidth = (wordEndRatio - wordStartRatio) * 100;
      wordElement.style.left = `${wordLeft}%`;
      wordElement.style.width = `${wordWidth}%`;

      jsonDataEl.appendChild(wordElement);

      // Создание блока для фонем
      if (wordItem.phonemes && Array.isArray(wordItem.phonemes)) {
        wordItem.phonemes.forEach((phonemeItem: any) => {
          const phonemeElement = document.createElement('div');
          phonemeElement.className = 'Phoneme';
          phonemeElement.textContent = phonemeItem.phoneme;

          // Вычисляем позицию и ширину фонемы
          const phonemeStartRatio = phonemeItem.start / duration;
          const phonemeEndRatio = phonemeItem.end / duration;
          const phonemeLeft = phonemeStartRatio * 100;
          const phonemeWidth = (phonemeEndRatio - phonemeStartRatio) * 100;
          phonemeElement.style.left = `${phonemeLeft}%`;
          phonemeElement.style.width = `${phonemeWidth}%`;

          // Смещаем фонемы ниже слов
          phonemeElement.style.top = '60px'; // Отступ от слов
          jsonDataEl.appendChild(phonemeElement);
        });
      }
    });
  };

  const updateCurrentTime = (): void => {
    if (!wavesurfer) {
      return;
    }
    const duration = wavesurfer.getDuration();
    const currentTime = wavesurfer.getCurrentTime();
    const percent = (currentTime / duration) * 100;

    const jsonDataIndicator = document.getElementById('json-data-indicator');
    if (jsonDataIndicator) {
      jsonDataIndicator.style.left = `${percent}%`;
    }
  };

  useEffect(() => {
    if (!waveFormContainerRef.current || !jsonDataContainerRef.current) {
      return;
    }
    const waveFormContainerRefScrollSyncFn = (event: Event) => {
      if (!waveFormContainerRef.current) {
        return;
      }
      waveFormContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
    };
    const jsonDataContainerRefHScrollSyncFn = (event: Event) => {
      if (!jsonDataContainerRef.current) {
        return;
      }
      jsonDataContainerRef.current.scrollLeft = (event as any).target.scrollLeft;
    };
    waveFormContainerRef.current.addEventListener('scroll', jsonDataContainerRefHScrollSyncFn);
    jsonDataContainerRef.current.addEventListener('scroll', waveFormContainerRefScrollSyncFn);
    return () => {
      if (waveFormContainerRef.current) {
        waveFormContainerRef.current.removeEventListener('scroll', jsonDataContainerRefHScrollSyncFn);
      }
      if (jsonDataContainerRef.current) {
        jsonDataContainerRef.current.removeEventListener('scroll', waveFormContainerRefScrollSyncFn);
      }
    };
  }, [waveFormContainerRef, jsonDataContainerRef]);

  return (
    <div className="App">
      <h1 className="App__Title">Audio Waveform and JSON Viewer</h1>
      <section className="Controls">
        <label htmlFor="audio-upload">Выбрать аудио:</label>
        <input type="file" id="audio-upload" accept="audio/*" onChange={onAudioFileChange} />
        <label htmlFor="json-upload">Выбрать JSON:</label>
        <input type="file" id="json-upload" accept="application/json" onChange={onJSONFileChange} />
        <button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
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
        <div className="JSONDataContainer" ref={jsonDataContainerRef}>
          <div className="JSONData" ref={jsonDataElRef}></div>
        </div>
      </section>
    </div>
  );
};

export default App;
