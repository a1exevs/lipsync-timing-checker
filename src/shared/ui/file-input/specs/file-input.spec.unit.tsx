import { fireEvent, render } from '@testing-library/react';
import React, { createRef } from 'react';

import FileInput from 'src/shared/ui/file-input/file-input';

describe('FileInput', () => {
  it('renders input with type file', () => {
    const { getByTestId } = render(<FileInput accept=".txt" handleFileUpload={jest.fn()} dataTestId="file-input" />);
    const input = getByTestId('file-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
  });

  it('calls handleFileUpload on change', () => {
    const handleFileUpload = jest.fn();
    const { getByTestId } = render(
      <FileInput accept=".txt" handleFileUpload={handleFileUpload} dataTestId="file-input" />,
    );
    const input = getByTestId('file-input');
    fireEvent.change(input, { target: { files: [new File([''], 'test.txt')] } });
    expect(handleFileUpload).toHaveBeenCalled();
  });

  it('passes accept prop', () => {
    const { getByTestId } = render(
      <FileInput accept=".jpg,.png" handleFileUpload={jest.fn()} dataTestId="file-input" />,
    );
    expect(getByTestId('file-input')).toHaveAttribute('accept', '.jpg,.png');
  });

  it('forwards ref to input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileInput accept=".txt" handleFileUpload={jest.fn()} dataTestId="file-input" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });
});
