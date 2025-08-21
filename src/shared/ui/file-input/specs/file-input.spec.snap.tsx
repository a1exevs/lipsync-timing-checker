import { render } from '@testing-library/react';
import React from 'react';

import FileInput from 'src/shared/ui/file-input/file-input';

describe('FileInput snapshots', () => {
  it('renders default', () => {
    const { asFragment } = render(<FileInput accept=".txt" handleFileUpload={jest.fn()} dataTestId="file-input" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with different accept', () => {
    const { asFragment } = render(
      <FileInput accept=".jpg,.png" handleFileUpload={jest.fn()} dataTestId="file-input" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with no dataTestId', () => {
    const { asFragment } = render(<FileInput accept=".txt" handleFileUpload={jest.fn()} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
