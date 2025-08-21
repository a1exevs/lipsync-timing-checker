import { render } from '@testing-library/react';
import React from 'react';

import ControlPanel from 'src/pages/home-page/ui/control-panel/control-panel';

describe('ControlPanel', () => {
  const baseProps = {
    isPlaying: false,
    isAudioPlayButtonEnabled: true,
    onPlayPauseClick: jest.fn(),
    isCaretLocked: false,
    isPinCaretButtonEnabled: true,
    onLockCaretClick: jest.fn(),
    playDuringDrag: false,
    isPlayDuringDragButtonEnabled: true,
    onPlayDuringDragClick: jest.fn(),
  };

  it('matches snapshot (default)', () => {
    const { container } = render(<ControlPanel {...baseProps} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot (playing, caret locked, playDuringDrag)', () => {
    const { container } = render(<ControlPanel {...baseProps} isPlaying isCaretLocked playDuringDrag />);
    expect(container).toMatchSnapshot();
  });
});
