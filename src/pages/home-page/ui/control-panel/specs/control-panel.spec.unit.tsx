import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import ControlPanel from 'src/pages/home-page/ui/control-panel/control-panel';
import { currentLang } from 'src/shared';

describe('ControlPanel', () => {
  const defaultProps = {
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

  it('renders play button when not playing', () => {
    const { getByTitle } = render(<ControlPanel {...defaultProps} />);
    expect(getByTitle(currentLang.labels.PLAY)).toBeInTheDocument();
  });

  it('renders pause button when playing', () => {
    const { getByTitle } = render(<ControlPanel {...defaultProps} isPlaying={true} />);
    expect(getByTitle(currentLang.labels.PAUSE)).toBeInTheDocument();
  });

  it('calls onPlayPauseClick when play/pause button is clicked', () => {
    const onPlayPauseClick = jest.fn();
    const { getByTitle } = render(<ControlPanel {...defaultProps} onPlayPauseClick={onPlayPauseClick} />);
    fireEvent.click(getByTitle(currentLang.labels.PLAY));
    expect(onPlayPauseClick).toHaveBeenCalled();
  });

  it('calls onLockCaretClick when pin button is clicked', () => {
    const onLockCaretClick = jest.fn();
    const { getByTitle } = render(<ControlPanel {...defaultProps} onLockCaretClick={onLockCaretClick} />);
    fireEvent.click(getByTitle(currentLang.labels.LOCK_CARET_POSITION));
    expect(onLockCaretClick).toHaveBeenCalled();
  });

  it('calls onPlayDuringDragClick when ear button is clicked', () => {
    const onPlayDuringDragClick = jest.fn();
    const { getByTitle } = render(<ControlPanel {...defaultProps} onPlayDuringDragClick={onPlayDuringDragClick} />);
    fireEvent.click(getByTitle(currentLang.labels.ENABLE_AUDIO_WHILE_DRAGGING));
    expect(onPlayDuringDragClick).toHaveBeenCalled();
  });
});
