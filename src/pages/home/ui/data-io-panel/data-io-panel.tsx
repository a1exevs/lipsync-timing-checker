import { Download, FileAudio, FileJson } from 'lucide-react';
import React, { ChangeEvent } from 'react';

import { Button, FilePicker } from 'src/shared';

type Props = {
  audioFileName?: string;
  wordsDataFileName?: string;
  onAudioFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onWordsDataFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoadJSONDataButtonEnabled?: boolean;
  isDownloadJSONDataButtonEnabled?: boolean;
  onDownloadJSONDataButtonClick: () => void;
};

const DataIOPanel: React.FC<Props> = ({
  audioFileName,
  wordsDataFileName,
  onAudioFileChange,
  onWordsDataFileChange,
  isLoadJSONDataButtonEnabled = true,
  isDownloadJSONDataButtonEnabled = true,
  onDownloadJSONDataButtonClick,
}) => {
  return (
    <section className="flex flex-col md:flex-row md:justify-between items-center my-4 gap-4 rounded-md bg-gray-800 p-4 shadow">
      <div className="flex flex-col gap-3 w-full md:w-1/2">
        <FilePicker
          fileName={audioFileName}
          text={'Load audio'}
          icon={<FileAudio />}
          accept="audio/*"
          handleFileUpload={onAudioFileChange}
        />
        <FilePicker
          fileName={wordsDataFileName}
          text={'Load JSON data'}
          icon={<FileJson />}
          accept="application/json"
          disabled={!isLoadJSONDataButtonEnabled}
          handleFileUpload={onWordsDataFileChange}
        />
      </div>
      <Button
        variant="danger"
        icon={<Download />}
        text={'Download JSON data'}
        onClick={e => {
          onDownloadJSONDataButtonClick();
          if (e.detail !== 0) {
            e.currentTarget.blur();
          }
        }}
        disabled={!isDownloadJSONDataButtonEnabled}
      />
    </section>
  );
};

export default DataIOPanel;
