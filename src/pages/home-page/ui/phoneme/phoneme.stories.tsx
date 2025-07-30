import type { Meta } from '@storybook/react';

import Phoneme from 'src/pages/home-page/ui/phoneme/phoneme';
import {
  buildDesktop4KStoryObj,
  buildDesktopStoryObj,
  buildMobileStoryObj,
  buildTabletStoryObj,
} from 'storybook-dir/helpers';

const storyTitle = 'Pages/Home Page/Phoneme';

const meta = {
  title: storyTitle,
  component: Phoneme,
} satisfies Meta<typeof Phoneme>;

export default meta;

const baseProps = {
  id: 'ph1',
  phoneme: 'a',
  leftPercent: 10,
  widthPercent: 20,
  movingInProgress: false,
  onResizeStart: () => {},
  onChainResizeStart: () => {},
  onMoveStart: () => {},
};

export const Desktop4k = buildDesktop4KStoryObj<typeof meta>({ args: { ...baseProps } });
export const Desktop = buildDesktopStoryObj<typeof meta>({ args: { ...baseProps } });
export const Tablet = buildTabletStoryObj<typeof meta>({ args: { ...baseProps } });
export const Mobile = buildMobileStoryObj<typeof meta>({ args: { ...baseProps } });

// Story with pseudo states (hover, focus, active)
export const PseudoStates = buildDesktopStoryObj<typeof meta>({ args: { ...baseProps } });
PseudoStates.parameters = {
  pseudo: { hover: true, focus: true, active: true },
};
PseudoStates.storyName = 'With Pseudo States (hover, focus, active)';
