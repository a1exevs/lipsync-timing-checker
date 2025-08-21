import type { Meta } from '@storybook/react';
import * as React from 'react';

import HomePage from 'src/pages/home-page/ui/home-page';
import { DialogProvider } from 'src/shared';
import {
  buildDesktop4KStoryObj,
  buildDesktopStoryObj,
  buildMobileStoryObj,
  buildTabletStoryObj,
} from 'storybook-dir/helpers';

const storyTitle = 'Pages/Home Page/Home Page';

const HomePageComponent: React.FC = () => {
  return (
    <DialogProvider>
      <HomePage />
    </DialogProvider>
  );
};

const meta = {
  title: storyTitle,
  component: HomePageComponent,
} satisfies Meta<typeof HomePageComponent>;

export default meta;

export const Desktop4k = buildDesktop4KStoryObj<typeof meta>({});
export const Desktop = buildDesktopStoryObj<typeof meta>({});
export const Tablet = buildTabletStoryObj<typeof meta>({});
export const Mobile = buildMobileStoryObj<typeof meta>({});
