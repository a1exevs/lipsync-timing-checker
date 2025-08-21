import { render } from '@testing-library/react';
import { FileAudio } from 'lucide-react';
import React from 'react';

import FilePicker from 'src/shared/ui/file-picker/file-picker';

describe('FilePicker snapshots', () => {
  it('renders default', () => {
    const { asFragment } = render(<FilePicker text="Upload" handleFileUpload={jest.fn()} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with icon', () => {
    const { asFragment } = render(<FilePicker text="Upload" handleFileUpload={jest.fn()} icon={<FileAudio />} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with fileName', () => {
    const { asFragment } = render(<FilePicker text="Upload" handleFileUpload={jest.fn()} fileName="test.txt" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders disabled', () => {
    const { asFragment } = render(<FilePicker text="Upload" handleFileUpload={jest.fn()} disabled />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with accept prop', () => {
    const { asFragment } = render(
      <FilePicker text="Upload" handleFileUpload={jest.fn()} accept=".txt" fileInputTestId="file-input" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
