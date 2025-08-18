import { render } from '@testing-library/react';
import React from 'react';

import ConfirmationDialog from 'src/shared/ui/confirmation-dialog/confirmation-dialog';

describe('ConfirmationDialog snapshots', () => {
  const baseHandlers = {
    onResolve: () => {},
    onRequestClose: () => {},
  };

  it('renders default with title only', () => {
    const { asFragment } = render(<ConfirmationDialog isOpen title="Title" {...baseHandlers} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with message and custom confirm button text', () => {
    const { asFragment } = render(
      <ConfirmationDialog
        isOpen
        title="Delete file"
        message="Are you sure?"
        confirmButtonText="Delete"
        {...baseHandlers}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders without cancel button', () => {
    const { asFragment } = render(
      <ConfirmationDialog isOpen title="Only confirm" hideCancelButton {...baseHandlers} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders in modal mode', () => {
    const { asFragment } = render(<ConfirmationDialog isOpen title="Modal" modal {...baseHandlers} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with custom header, content and footer', () => {
    const { asFragment } = render(
      <ConfirmationDialog
        isOpen
        title="Ignored title"
        header={<div data-testid="custom-header">Header</div>}
        content={<div data-testid="custom-content">Content</div>}
        footer={<div data-testid="custom-footer">Footer</div>}
        {...baseHandlers}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
