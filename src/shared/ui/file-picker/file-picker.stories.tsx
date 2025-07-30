import type { Meta } from '@storybook/react';
import { FileAudio } from 'lucide-react';
import React, { ReactNode, useState } from 'react';

import FilePicker from 'src/shared/ui/file-picker/file-picker';
import { buildDesktopStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Shared/File Picker';

const meta = {
  title: storyTitle,
  component: FilePicker,
} satisfies Meta<typeof FilePicker>;

export default meta;

const Template = (args: {
  text: string;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  fileName?: string;
  icon?: ReactNode;
  disabled?: boolean;
  fileInputTestId?: string;
}) => {
  const [fileName, setFileName] = useState('');
  return (
    <FilePicker
      {...args}
      fileName={fileName}
      handleFileUpload={e => {
        setFileName(e.target.files?.[0]?.name || '');
        if (args.handleFileUpload) {
          args.handleFileUpload(e);
        }
      }}
    />
  );
};

export const Default = buildDesktopStoryObj<typeof meta>({
  render: Template,
  args: {
    text: 'Upload txt',
    accept: '.txt',
    icon: <FileAudio />,
    fileInputTestId: 'file-input',
    handleFileUpload: () => alert('PDF selected!'),
  },
});

export const WithFileName = buildDesktopStoryObj<typeof meta>({
  render: Template,
  args: {
    text: 'Upload',
    accept: '.jpg,.png',
    icon: <FileAudio />,
    fileInputTestId: 'file-input-image',
    handleFileUpload: () => alert('PDF selected!'),
  },
});

export const Disabled = buildDesktopStoryObj<typeof meta>({
  render: Template,
  args: {
    text: 'Upload',
    accept: '.pdf',
    disabled: true,
    icon: <FileAudio />,
    fileInputTestId: 'file-input-disabled',
    handleFileUpload: () => alert('PDF selected!'),
  },
});
