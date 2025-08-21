import type { Meta } from '@storybook/react';

import Word from 'src/pages/home-page/ui/word/word';
import { buildDesktopStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Pages/Home Page/Word';

const meta = {
  title: storyTitle,
  component: Word,
} satisfies Meta<typeof Word>;

export default meta;

const basePhonemes = [
  {
    id: 'ph1',
    phoneme: 'a',
    leftPercent: 0,
    widthPercent: 50,
    start: 0,
    end: 1,
  },
  {
    id: 'ph2',
    phoneme: 'b',
    leftPercent: 50,
    widthPercent: 50,
    start: 1,
    end: 2,
  },
];

const baseProps = {
  id: 'w1',
  word: 'test',
  widthPx: 100,
  leftPx: 10,
  movingInProgress: false,
  phonemes: basePhonemes,
  onWordResizeStart: () => {},
  onWordChainResizeStart: () => {},
  onPhonemeResizeStart: () => {},
  onPhonemeChainResizeStart: () => {},
  onWordMoveStart: () => {},
  onPhonemeMoveStart: () => {},
};

export const Desktop = buildDesktopStoryObj<typeof meta>({
  args: {
    ...baseProps,
  },
});

// Story with pseudo states (hover, focus, active)
export const PseudoStates = buildDesktopStoryObj<typeof meta>({
  args: {
    ...baseProps,
  },
});
PseudoStates.parameters = {
  pseudo: { hover: true, focus: true, active: true },
};
PseudoStates.storyName = 'With Pseudo States (hover, focus, active)';
