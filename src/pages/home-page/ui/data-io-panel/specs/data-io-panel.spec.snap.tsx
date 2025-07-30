import { render } from '@testing-library/react';
import React from 'react';

import DataIOPanel from 'src/pages/home-page/ui/data-io-panel/data-io-panel';

describe('DataIOPanel', () => {
  const defaultProps = {
    audioFileName: 'audio.mp3',
    wordsDataFileName: 'data.json',
    onAudioFileChange: jest.fn(),
    onWordsDataFileChange: jest.fn(),
    isLoadJSONDataButtonEnabled: true,
    isDownloadJSONDataButtonEnabled: true,
    onDownloadJSONDataClick: jest.fn(),
  };

  it('matches snapshot (default)', () => {
    const { container } = render(<DataIOPanel {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot (disabled buttons)', () => {
    const { container } = render(
      <DataIOPanel {...defaultProps} isLoadJSONDataButtonEnabled={false} isDownloadJSONDataButtonEnabled={false} />,
    );
    expect(container).toMatchSnapshot();
  });
});
