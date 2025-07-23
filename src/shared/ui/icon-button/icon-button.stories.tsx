import type { Meta } from '@storybook/react';
import { FileAudio } from 'lucide-react';

import { IconButton } from 'src/shared';
import { buildDesktopStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Shared/UI/Icon Button';

const meta = {
  title: storyTitle,
  component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;

export const Default = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
});
export const Primary = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
  variant: 'primary',
});
export const Secondary = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
  variant: 'secondary',
});
export const Danger = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
  variant: 'danger',
});
export const PrimaryDisabled = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
  variant: 'primary',
  disabled: true,
});
export const SecondaryDisabled = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
  variant: 'secondary',
  disabled: true,
});
export const DangerDisabled = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
  variant: 'danger',
  disabled: true,
});
export const PrimarySm = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
  variant: 'primary',
  size: 'sm',
});
export const PrimaryMd = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
  variant: 'primary',
  size: 'md',
});
export const PrimaryLg = buildDesktopStoryObj<typeof meta>({
  children: <FileAudio />,
  variant: 'primary',
  size: 'lg',
});
