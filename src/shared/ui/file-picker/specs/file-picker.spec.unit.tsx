import { fireEvent, render } from '@testing-library/react';
import { FileAudio } from 'lucide-react';
import React from 'react';

import FilePicker from 'src/shared/ui/file-picker/file-picker';

describe('FilePicker', () => {
  it('renders button with text', () => {
    const { getByText } = render(<FilePicker text="Upload" handleFileUpload={jest.fn()} />);
    expect(getByText('Upload')).toBeInTheDocument();
  });

  it('renders icon if provided', () => {
    const { getByTestId } = render(
      <FilePicker text="Upload" handleFileUpload={jest.fn()} icon={<FileAudio data-testid="icon" />} />,
    );
    expect(getByTestId('icon')).toBeInTheDocument();
  });

  it('renders fileName if provided', () => {
    const { getByText } = render(<FilePicker text="Upload" handleFileUpload={jest.fn()} fileName="test.txt" />);
    expect(getByText('test.txt')).toBeInTheDocument();
  });

  it('sets fileName as title on span', () => {
    const { getByTitle } = render(<FilePicker text="Upload" handleFileUpload={jest.fn()} fileName="test.txt" />);
    expect(getByTitle('test.txt')).toBeInTheDocument();
  });

  it('disables button if disabled is true', () => {
    const { getByRole } = render(<FilePicker text="Upload" handleFileUpload={jest.fn()} disabled />);
    expect(getByRole('button')).toBeDisabled();
  });

  it('calls file input click when button is clicked', () => {
    const handleFileUpload = jest.fn();
    const { getByRole, getByTestId } = render(
      <FilePicker text="Upload" handleFileUpload={handleFileUpload} fileInputTestId="file-input" />,
    );
    const input = getByTestId('file-input');
    const clickSpy = jest.spyOn(input, 'click');
    fireEvent.click(getByRole('button'));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('passes accept prop to FileInput', () => {
    const { getByTestId } = render(
      <FilePicker text="Upload" handleFileUpload={jest.fn()} accept=".txt" fileInputTestId="file-input" />,
    );
    expect(getByTestId('file-input')).toHaveAttribute('accept', '.txt');
  });
});
