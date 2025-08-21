import { Download, FileAudio, FileJson, Rocket } from 'lucide-react';
import React, { ChangeEvent } from 'react';

import {
  AUDIO_FILE_INPUT_TEST_ID,
  JSON_FILE_INPUT_TEST_ID,
} from 'src/pages/home-page/ui/data-io-panel/data-io-panel.consts';
import { Button, currentLang, FilePicker } from 'src/shared';

type Props = {
  audioFileName?: string;
  wordsDataFileName?: string;
  onAudioFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onWordsDataFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoadAudioFileButtonEnabled?: boolean;
  isLoadJSONDataButtonEnabled?: boolean;
  isDownloadJSONDataButtonEnabled?: boolean;
  onDownloadJSONDataClick?: () => void;
  onLoadExampleClick?: () => void;
};

const DataIOPanel: React.FC<Props> = ({
  audioFileName,
  wordsDataFileName,
  onAudioFileChange = () => {},
  onWordsDataFileChange = () => {},
  isLoadAudioFileButtonEnabled = true,
  isLoadJSONDataButtonEnabled = true,
  isDownloadJSONDataButtonEnabled = true,
  onDownloadJSONDataClick = () => {},
  onLoadExampleClick = () => {},
}) => {
  return (
    <section className="flex flex-col md:flex-row md:justify-between items-center my-4 gap-4 rounded-md bg-gray-800 p-4 shadow">
      <div className="flex flex-col gap-3 w-full md:w-1/2">
        <FilePicker
          fileName={audioFileName}
          text={currentLang.labels.LOAD_AUDIO}
          icon={<FileAudio />}
          accept="audio/*"
          disabled={!isLoadAudioFileButtonEnabled}
          handleFileUpload={onAudioFileChange}
          fileInputTestId={AUDIO_FILE_INPUT_TEST_ID}
        />
        <FilePicker
          fileName={wordsDataFileName}
          text={currentLang.labels.LOAD_JSON_DATA}
          icon={<FileJson />}
          accept="application/json"
          disabled={!isLoadJSONDataButtonEnabled}
          handleFileUpload={onWordsDataFileChange}
          fileInputTestId={JSON_FILE_INPUT_TEST_ID}
        />
      </div>
      <div className="flex flex-col gap-3 w-full md:w-auto">
        <Button
          variant="secondary"
          icon={<Rocket />}
          text={currentLang.labels.LOAD_EXAMPLE}
          onClick={onLoadExampleClick}
          widthFull
        />
        <Button
          variant="danger"
          icon={<Download />}
          text={currentLang.labels.DOWNLOAD_JSON_DATA}
          onClick={onDownloadJSONDataClick}
          disabled={!isDownloadJSONDataButtonEnabled}
          widthFull
        />
      </div>
    </section>
  );
};

export default DataIOPanel;
