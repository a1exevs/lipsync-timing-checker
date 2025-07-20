import { Ear, Pause, Pin, Play } from 'lucide-react';
import React from 'react';

import { IconButton } from 'src/shared';

type Props = {
  isPlaying: boolean;
  isAudioPlayButtonEnabled: boolean;
  onPlayPause: () => void;
  isCaretLocked: boolean;
  isPinCaretButtonEnabled: boolean;
  onLockCaretButtonClick: () => void;
  playDuringDrag: boolean;
  isPlayDuringDragButtonEnabled: boolean;
  setPlayDuringDrag: React.Dispatch<React.SetStateAction<boolean>>;
};

const ControlPanel: React.FC<Props> = ({
  isPlaying,
  isAudioPlayButtonEnabled,
  onPlayPause,
  isCaretLocked,
  isPinCaretButtonEnabled,
  onLockCaretButtonClick,
  playDuringDrag,
  isPlayDuringDragButtonEnabled,
  setPlayDuringDrag,
}) => (
  <section className="flex items-center gap-6 my-4 rounded-md bg-gray-800 p-4 shadow">
    <IconButton title={isPlaying ? 'Pause' : 'Play'} disabled={!isAudioPlayButtonEnabled} onClick={onPlayPause}>
      {isPlaying ? <Pause /> : <Play />}
    </IconButton>
    <div className="flex items-center gap-2">
      <IconButton
        title={isCaretLocked ? 'Unlock caret position' : 'Lock caret position'}
        variant={isCaretLocked ? 'primary' : 'secondary'}
        disabled={!isPinCaretButtonEnabled}
        onClick={onLockCaretButtonClick}
      >
        <Pin />
      </IconButton>
      <IconButton
        title={playDuringDrag ? 'Disable audio while dragging' : 'Enable audio while dragging'}
        disabled={!isPlayDuringDragButtonEnabled}
        onClick={() => setPlayDuringDrag(prev => !prev)}
        variant={playDuringDrag ? 'primary' : 'secondary'}
      >
        <Ear />
      </IconButton>
    </div>
  </section>
);

export default ControlPanel;
