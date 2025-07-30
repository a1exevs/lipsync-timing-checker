import type { Meta } from '@storybook/react';

import FileInput from 'src/shared/ui/file-input/file-input';
import { buildDesktopStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Shared/File Input';

const meta = {
  title: storyTitle,
  component: FileInput,
} satisfies Meta<typeof FileInput>;

export default meta;

export const Default = buildDesktopStoryObj<typeof meta>({
  args: {
    accept: '.txt',
    handleFileUpload: () => alert('File selected!'),
    dataTestId: 'file-input',
  },
});

export const WithImageAccept = buildDesktopStoryObj<typeof meta>({
  args: {
    accept: '.jpg,.png',
    handleFileUpload: () => alert('Image file selected!'),
    dataTestId: 'file-input-image',
  },
});

export const WithoutDataTestId = buildDesktopStoryObj<typeof meta>({
  args: {
    accept: '.pdf',
    handleFileUpload: () => alert('PDF selected!'),
  },
});
