import type { Meta } from '@storybook/react';

import Resizer from 'src/pages/home-page/ui/resizer/resizer';
import { buildDesktopStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Pages/Home Page/Resizer';

const meta = {
  title: storyTitle,
  component: Resizer,
} satisfies Meta<typeof Resizer>;

export default meta;

const baseProps = {
  type: 'left' as const,
  onMouseDown: () => {},
  color: 'red',
  zIndex: 10,
  widthPx: 8,
};

export const Desktop = buildDesktopStoryObj<typeof meta>({ args: { ...baseProps } });

// Story with pseudo states (hover, focus, active)
export const PseudoStates = buildDesktopStoryObj<typeof meta>({ args: { ...baseProps } });
PseudoStates.parameters = {
  pseudo: { hover: true, focus: true, active: true },
};
PseudoStates.storyName = 'With Pseudo States (hover, focus, active)';
