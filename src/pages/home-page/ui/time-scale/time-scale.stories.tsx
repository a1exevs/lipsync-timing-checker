import type { Meta } from '@storybook/react';

import { TICK_STEP_THRESHOLD_HALF_SECOND, TICK_STEP_THRESHOLD_SUB_SECOND } from 'src/pages/home-page/model/consts';
import TimeScale from 'src/pages/home-page/ui/time-scale/time-scale';
import { buildDesktopStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Pages/Home Page/Time Scale';

const meta = {
  title: storyTitle,
  component: TimeScale,
} satisfies Meta<typeof TimeScale>;

export default meta;

const durationSec = 20;
export const ScaleWithSubSecondStep = buildDesktopStoryObj<typeof meta>({
  args: {
    durationSec,
    timelineWidthPx: durationSec * TICK_STEP_THRESHOLD_SUB_SECOND,
    scrollLeftPx: 0,
    viewportWidthPx: 1000,
    heightPx: 50,
  },
});
export const ScaleWithHalfSecondStep = buildDesktopStoryObj<typeof meta>({
  args: {
    durationSec,
    timelineWidthPx: durationSec * TICK_STEP_THRESHOLD_HALF_SECOND,
    scrollLeftPx: 0,
    viewportWidthPx: 1000,
    heightPx: 50,
  },
});
export const ScaleWithSecondStep = buildDesktopStoryObj<typeof meta>({
  args: {
    durationSec,
    timelineWidthPx: durationSec * (TICK_STEP_THRESHOLD_HALF_SECOND - 1),
    scrollLeftPx: 0,
    viewportWidthPx: 1000,
    heightPx: 50,
  },
});
const scrollLeftPx = 215;
export const ScaleWithSubSecondStepAndWithScrollLeft = buildDesktopStoryObj<typeof meta>({
  args: {
    durationSec,
    timelineWidthPx: durationSec * TICK_STEP_THRESHOLD_SUB_SECOND,
    scrollLeftPx,
    viewportWidthPx: 1000,
    heightPx: 50,
  },
});
export const ScaleWithHalfSecondStepAndWithScrollLeft = buildDesktopStoryObj<typeof meta>({
  args: {
    durationSec,
    timelineWidthPx: durationSec * TICK_STEP_THRESHOLD_HALF_SECOND,
    scrollLeftPx,
    viewportWidthPx: 1000,
    heightPx: 50,
  },
});
export const ScaleWithSecondStepAndWithScrollLeft = buildDesktopStoryObj<typeof meta>({
  args: {
    durationSec,
    timelineWidthPx: durationSec * (TICK_STEP_THRESHOLD_HALF_SECOND - 1),
    scrollLeftPx,
    viewportWidthPx: 1000,
    heightPx: 50,
  },
});
export const ScaleWithSecondStepAndHeight100px = buildDesktopStoryObj<typeof meta>({
  args: {
    durationSec,
    timelineWidthPx: durationSec * (TICK_STEP_THRESHOLD_HALF_SECOND - 1),
    scrollLeftPx,
    viewportWidthPx: 1000,
    heightPx: 100,
  },
});
