import type { Meta } from '@storybook/react';
import { FileAudio } from 'lucide-react';

import Button from 'src/shared/ui/button/button';
import { buildDesktopStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Shared/UI/Button';

const meta = {
  title: storyTitle,
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

const defaultProps = {
  text: 'Button',
  onClick: () => {},
};

export const Default = buildDesktopStoryObj<typeof meta>(defaultProps);
export const Primary = buildDesktopStoryObj<typeof meta>({ ...defaultProps, variant: 'primary' });
export const Secondary = buildDesktopStoryObj<typeof meta>({ ...defaultProps, variant: 'secondary' });
export const Danger = buildDesktopStoryObj<typeof meta>({ ...defaultProps, variant: 'danger' });
export const DefaultDisabled = buildDesktopStoryObj<typeof meta>({ ...defaultProps, disabled: true });
export const PrimaryDisabled = buildDesktopStoryObj<typeof meta>({
  ...defaultProps,
  variant: 'primary',
  disabled: true,
});
export const SecondaryDisabled = buildDesktopStoryObj<typeof meta>({
  ...defaultProps,
  variant: 'secondary',
  disabled: true,
});
export const DangerDisabled = buildDesktopStoryObj<typeof meta>({
  ...defaultProps,
  variant: 'danger',
  disabled: true,
});
export const DefaultWidthFull = buildDesktopStoryObj<typeof meta>({ ...defaultProps, widthFull: true });
export const DefaultWithIcon = buildDesktopStoryObj<typeof meta>({ ...defaultProps, icon: <FileAudio /> });
export const DefaultWithRightIcon = buildDesktopStoryObj<typeof meta>({
  ...defaultProps,
  iconPosition: 'right',
  icon: <FileAudio />,
});
export const DefaultWithAdditionalClasses = buildDesktopStoryObj<typeof meta>({
  ...defaultProps,
  iconPosition: 'right',
  icon: <FileAudio />,
  additionalClasses: 'w-1/2',
});
