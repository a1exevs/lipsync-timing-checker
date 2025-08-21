import type { Meta } from '@storybook/react';
import { FileAudio } from 'lucide-react';

import { IconButton } from 'src/shared';
import { buildDesktopStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Shared/Icon Button';

const meta = {
  title: storyTitle,
  component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;

export const Default = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
  },
});
export const Primary = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
    variant: 'primary',
  },
});
export const Secondary = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
    variant: 'secondary',
  },
});
export const Danger = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
    variant: 'danger',
  },
});
export const PrimaryDisabled = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
    variant: 'primary',
    disabled: true,
  },
});
export const SecondaryDisabled = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
    variant: 'secondary',
    disabled: true,
  },
});
export const DangerDisabled = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
    variant: 'danger',
    disabled: true,
  },
});
export const PrimarySm = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
    variant: 'primary',
    size: 'sm',
  },
});
export const PrimaryMd = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
    variant: 'primary',
    size: 'md',
  },
});
export const PrimaryLg = buildDesktopStoryObj<typeof meta>({
  args: {
    children: <FileAudio />,
    variant: 'primary',
    size: 'lg',
  },
});
