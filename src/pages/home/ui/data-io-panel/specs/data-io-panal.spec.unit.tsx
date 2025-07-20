import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import DataIOPanel from 'src/pages/home/ui/data-io-panel/data-io-panel';
import {
  AUDIO_FILE_INPUT_TEST_ID,
  JSON_FILE_INPUT_TEST_ID,
} from 'src/pages/home/ui/data-io-panel/data-io-panel.consts';

describe('DataIOPanel', () => {
  const defaultProps = {
    audioFileName: 'audio.mp3',
    wordsDataFileName: 'data.json',
    onAudioFileChange: jest.fn(),
    onWordsDataFileChange: jest.fn(),
    isLoadJSONDataButtonEnabled: true,
    isDownloadJSONDataButtonEnabled: true,
    onDownloadJSONDataButtonClick: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders FilePicker and Button components with correct props', () => {
    render(<DataIOPanel {...defaultProps} />);
    expect(screen.getByText('Load audio')).toBeInTheDocument();
    expect(screen.getByText('Load JSON data')).toBeInTheDocument();
    expect(screen.getByText('Download JSON data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load audio' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Load JSON data' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Download JSON data' })).not.toBeDisabled();
  });

  it('disables Load JSON data and Download JSON data buttons when props are false', () => {
    render(
      <DataIOPanel {...defaultProps} isLoadJSONDataButtonEnabled={false} isDownloadJSONDataButtonEnabled={false} />,
    );
    expect(screen.getByRole('button', { name: 'Load JSON data' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Download JSON data' })).toBeDisabled();
  });

  it('calls onAudioFileChange when audio file is selected', () => {
    render(<DataIOPanel {...defaultProps} />);
    const audioInput = screen.getByTestId(AUDIO_FILE_INPUT_TEST_ID);
    fireEvent.change(audioInput, { target: { files: [new File([''], 'test.mp3', { type: 'audio/mp3' })] } });
    expect(defaultProps.onAudioFileChange).toHaveBeenCalled();
  });

  it('calls onWordsDataFileChange when JSON file is selected', () => {
    render(<DataIOPanel {...defaultProps} />);
    const jsonInput = screen.getByTestId(JSON_FILE_INPUT_TEST_ID);
    fireEvent.change(jsonInput, { target: { files: [new File([''], 'test.json', { type: 'application/json' })] } });
    expect(defaultProps.onWordsDataFileChange).toHaveBeenCalled();
  });

  it('calls onDownloadJSONDataButtonClick when Download JSON data button is clicked', () => {
    render(<DataIOPanel {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Download JSON data' }));
    expect(defaultProps.onDownloadJSONDataButtonClick).toHaveBeenCalled();
  });
});
