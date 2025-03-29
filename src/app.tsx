import React, { ChangeEvent, useRef, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';

const App: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const jsonDataContainerRef = useRef<HTMLDivElement>(null);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
    updateCurrentTime();
  };

  const onPlayPause = () => {
    wavesurfer && (wavesurfer as any).playPause();
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    debugger;
    if ((event as any).target.files.length > 0) {
      const file = (event as any).target.files[0];
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const onJSONFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    debugger;
    if ((event as any).target.files.length > 0) {
      const file = (event as any).target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          debugger;
          const jsonData = JSON.parse((e as any).target.result);
          displayJsonData(jsonData);
        } catch (error) {
          alert('Некорректный JSON файл');
        }
      };
      reader.readAsText(file);
    }
  };

  const displayJsonData = (jsonData: any) => {
    // Сброс содержимого, кроме заголовка
    const jsonDataContainer: any = jsonDataContainerRef.current;
    jsonDataContainer.innerHTML = '<h3>Слова и фонемы</h3>';

    // Создаем ползунок для слов и фонем
    const indicator = document.createElement('div');
    indicator.id = 'json-data-indicator';
    indicator.className = 'current-time';
    jsonDataContainer.appendChild(indicator);

    const duration = wavesurfer.getDuration();

    jsonData.words.forEach((wordItem: any) => {
      // Создание блока для слова
      const wordElement = document.createElement('div');
      wordElement.className = 'word';
      wordElement.textContent = wordItem.word;

      // Вычисляем позицию и ширину слова
      const wordStartRatio = wordItem.start / duration;
      const wordEndRatio = wordItem.end / duration;
      const wordLeft = wordStartRatio * 100;
      const wordWidth = (wordEndRatio - wordStartRatio) * 100;
      wordElement.style.left = `${wordLeft}%`;
      wordElement.style.width = `${wordWidth}%`;

      jsonDataContainer.appendChild(wordElement);

      // Создание блока для фонем
      if (wordItem.phonemes && Array.isArray(wordItem.phonemes)) {
        wordItem.phonemes.forEach((phonemeItem: any) => {
          const phonemeElement = document.createElement('div');
          phonemeElement.className = 'phoneme';
          phonemeElement.textContent = phonemeItem.phoneme;

          // Вычисляем позицию и ширину фонемы
          const phonemeStartRatio = phonemeItem.start / duration;
          const phonemeEndRatio = phonemeItem.end / duration;
          const phonemeLeft = phonemeStartRatio * 100;
          const phonemeWidth = (phonemeEndRatio - phonemeStartRatio) * 100;
          phonemeElement.style.left = `${phonemeLeft}%`;
          phonemeElement.style.width = `${phonemeWidth}%`;

          // Смещаем фонемы ниже слов
          phonemeElement.style.top = '30px'; // Отступ от слов
          jsonDataContainer.appendChild(phonemeElement);
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

    // Обновляем позицию ползунка для слов и фонем
    const jsonDataIndicator = document.getElementById('json-data-indicator');
    if (jsonDataIndicator) {
      jsonDataIndicator.style.left = `${percent}%`;
    }
  };

  return (
    <>
      <h1>Audio Waveform and JSON Viewer</h1>
      <div id="waveform">
        {audioUrl && (
          <WavesurferPlayer
            height={200}
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
      <button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <div className="controls">
        <label htmlFor="audio-upload">Выбрать аудио:</label>
        <input type="file" id="audio-upload" accept="audio/*" onChange={onFileChange} />
        <label htmlFor="json-upload">Выбрать JSON:</label>
        <input type="file" id="json-upload" accept="application/json" onChange={onJSONFileChange} />
      </div>
      <div className="json-data" ref={jsonDataContainerRef}>
        <h3>Слова и фонемы:</h3>
        <div className="current-time" id="current-time"></div>
      </div>
    </>
  );
};

export default App;
