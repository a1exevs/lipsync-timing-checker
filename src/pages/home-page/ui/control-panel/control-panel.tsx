import { Ear, Pause, Pin, Play } from 'lucide-react';
import React from 'react';

import { IconButton } from 'src/shared';
import { currentLang } from 'src/shared';

type Props = {
  isPlaying?: boolean;
  isAudioPlayButtonEnabled?: boolean;
  onPlayPauseClick?: () => void;
  isCaretLocked?: boolean;
  isPinCaretButtonEnabled?: boolean;
  onLockCaretClick?: () => void;
  playDuringDrag?: boolean;
  isPlayDuringDragButtonEnabled?: boolean;
  onPlayDuringDragClick?: () => void;
};

const ControlPanel: React.FC<Props> = ({
  isPlaying = false,
  isAudioPlayButtonEnabled = true,
  onPlayPauseClick = () => {},
  isCaretLocked = false,
  isPinCaretButtonEnabled = true,
  onLockCaretClick = () => {},
  playDuringDrag = false,
  isPlayDuringDragButtonEnabled = true,
  onPlayDuringDragClick = () => {},
}) => (
  <section className="flex items-center gap-6 my-4 rounded-md bg-gray-800 p-4 shadow">
    <IconButton
      title={isPlaying ? currentLang.labels.PAUSE : currentLang.labels.PLAY}
      disabled={!isAudioPlayButtonEnabled}
      onClick={onPlayPauseClick}
    >
      {isPlaying ? <Pause /> : <Play />}
    </IconButton>
    <div className="flex items-center gap-2">
      <IconButton
        title={isCaretLocked ? currentLang.labels.UNLOCK_CARET_POSITION : currentLang.labels.LOCK_CARET_POSITION}
        variant={isCaretLocked ? 'primary' : 'secondary'}
        disabled={!isPinCaretButtonEnabled}
        onClick={onLockCaretClick}
      >
        <Pin />
      </IconButton>
      <IconButton
        title={
          playDuringDrag
            ? currentLang.labels.DISABLE_AUDIO_WHILE_DRAGGING
            : currentLang.labels.ENABLE_AUDIO_WHILE_DRAGGING
        }
        disabled={!isPlayDuringDragButtonEnabled}
        onClick={onPlayDuringDragClick}
        variant={playDuringDrag ? 'primary' : 'secondary'}
      >
        <Ear />
      </IconButton>
    </div>
  </section>
);

export default ControlPanel;
