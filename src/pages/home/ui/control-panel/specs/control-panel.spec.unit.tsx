import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import ControlPanel from 'src/pages/home/ui/control-panel/control-panel';
import { currentLang } from 'src/shared';

describe('ControlPanel', () => {
  const defaultProps = {
    isPlaying: false,
    isAudioPlayButtonEnabled: true,
    onPlayPause: jest.fn(),
    isCaretLocked: false,
    isPinCaretButtonEnabled: true,
    onLockCaretButtonClick: jest.fn(),
    playDuringDrag: false,
    isPlayDuringDragButtonEnabled: true,
    setPlayDuringDrag: jest.fn(),
  };

  it('renders play button when not playing', () => {
    const { getByTitle } = render(<ControlPanel {...defaultProps} />);
    expect(getByTitle(currentLang.labels.PLAY)).toBeInTheDocument();
  });

  it('renders pause button when playing', () => {
    const { getByTitle } = render(<ControlPanel {...defaultProps} isPlaying={true} />);
    expect(getByTitle(currentLang.labels.PAUSE)).toBeInTheDocument();
  });

  it('calls onPlayPause when play/pause button is clicked', () => {
    const onPlayPause = jest.fn();
    const { getByTitle } = render(<ControlPanel {...defaultProps} onPlayPause={onPlayPause} />);
    fireEvent.click(getByTitle(currentLang.labels.PLAY));
    expect(onPlayPause).toHaveBeenCalled();
  });

  it('calls onLockCaretButtonClick when pin button is clicked', () => {
    const onLockCaretButtonClick = jest.fn();
    const { getByTitle } = render(<ControlPanel {...defaultProps} onLockCaretButtonClick={onLockCaretButtonClick} />);
    fireEvent.click(getByTitle(currentLang.labels.LOCK_CARET_POSITION));
    expect(onLockCaretButtonClick).toHaveBeenCalled();
  });

  it('calls setPlayDuringDrag when ear button is clicked', () => {
    const setPlayDuringDrag = jest.fn();
    const { getByTitle } = render(<ControlPanel {...defaultProps} setPlayDuringDrag={setPlayDuringDrag} />);
    fireEvent.click(getByTitle(currentLang.labels.ENABLE_AUDIO_WHILE_DRAGGING));
    expect(setPlayDuringDrag).toHaveBeenCalled();
  });
});
