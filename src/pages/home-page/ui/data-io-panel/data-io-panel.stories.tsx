import type { Meta } from '@storybook/react';

import DataIOPanel from 'src/pages/home-page/ui/data-io-panel/data-io-panel';
import { buildDesktopStoryObj, buildMobileStoryObj, buildTabletStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Pages/Home Page/Data IO Panel';

const meta = {
  title: storyTitle,
  component: DataIOPanel,
} satisfies Meta<typeof DataIOPanel>;

export default meta;

export const DefaultDesktop = buildDesktopStoryObj<typeof meta>({});
export const DefaultTablet = buildTabletStoryObj<typeof meta>({});
export const DefaultMobile = buildMobileStoryObj<typeof meta>({});

const disapledControlsProps = {
  isLoadAudioFileButtonEnabled: false,
  isLoadJSONDataButtonEnabled: false,
  isDownloadJSONDataButtonEnabled: false,
};
export const DisabledControlsDesktop = buildDesktopStoryObj<typeof meta>({ args: disapledControlsProps });
export const DisabledControlsTablet = buildTabletStoryObj<typeof meta>({ args: disapledControlsProps });
export const DisabledControlsMobile = buildMobileStoryObj<typeof meta>({ args: disapledControlsProps });

const selectedFilesProps = {
  audioFileName: 'audio.mp3',
  wordsDataFileName: 'words.json',
};
export const SelectedFilesDesktop = buildDesktopStoryObj<typeof meta>({ args: selectedFilesProps });
export const SelectedFilesTablet = buildTabletStoryObj<typeof meta>({ args: selectedFilesProps });
export const SelectedFilesMobile = buildMobileStoryObj<typeof meta>({ args: selectedFilesProps });

const selectedFilesWithLongNamesProps = {
  audioFileName: 'long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-file-name.mp3',
  wordsDataFileName: 'long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-file-name.json',
};
export const SelectedFilesWithLongNamesDesktop = buildDesktopStoryObj<typeof meta>({
  args: selectedFilesWithLongNamesProps,
});
export const SelectedFilesWithLongNamesTablet = buildTabletStoryObj<typeof meta>({
  args: selectedFilesWithLongNamesProps,
});
export const SelectedFilesWithLongNamesMobile = buildMobileStoryObj<typeof meta>({
  args: selectedFilesWithLongNamesProps,
});
