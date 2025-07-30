import type { Meta } from '@storybook/react';

import HomePage from 'src/pages/home-page/ui/home-page';
import {
  buildDesktop4KStoryObj,
  buildDesktopStoryObj,
  buildMobileStoryObj,
  buildTabletStoryObj,
} from 'storybook-dir/helpers';

const storyTitle = 'Pages/Home Page/Home Page';

const meta = {
  title: storyTitle,
  component: HomePage,
} satisfies Meta<typeof HomePage>;

export default meta;

export const Desktop4k = buildDesktop4KStoryObj<typeof meta>({});
export const Desktop = buildDesktopStoryObj<typeof meta>({});
export const Tablet = buildTabletStoryObj<typeof meta>({});
export const Mobile = buildMobileStoryObj<typeof meta>({});
