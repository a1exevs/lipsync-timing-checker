import type { Meta } from '@storybook/react';

import ControlPanel from 'src/pages/home-page/ui/control-panel/control-panel';
import { buildDesktopStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Pages/Home Page/Control Panel';

const meta = {
  title: storyTitle,
  component: ControlPanel,
} satisfies Meta<typeof ControlPanel>;

export default meta;

export const Default = buildDesktopStoryObj<typeof meta>({});
export const DisabledButtons = buildDesktopStoryObj<typeof meta>({
  args: {
    isAudioPlayButtonEnabled: false,
    isPinCaretButtonEnabled: false,
    isPlayDuringDragButtonEnabled: false,
  },
});
export const ToggledButtons = buildDesktopStoryObj<typeof meta>({
  args: {
    isPlaying: true,
    isCaretLocked: true,
    playDuringDrag: true,
  },
});
