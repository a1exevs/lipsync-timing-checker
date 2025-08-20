import { render } from '@testing-library/react';
import React from 'react';

import Dialog from 'src/shared/ui/dialog/dialog';

describe('Dialog', () => {
  it('renders default with title only', () => {
    const { asFragment } = render(<Dialog instanceId="dialog" isOpen title="Title" onResolve={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with message and custom confirm button text', () => {
    const { asFragment } = render(
      <Dialog
        instanceId="dialog"
        isOpen
        title="Delete file"
        message="Are you sure?"
        confirmButtonText="Delete"
        onResolve={() => {}}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders without cancel button', () => {
    const { asFragment } = render(
      <Dialog instanceId="dialog" isOpen title="Only confirm" hideCancelButton onResolve={() => {}} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders in modal mode', () => {
    const { asFragment } = render(<Dialog instanceId="dialog" isOpen title="Modal" modal onResolve={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with custom header, content and footer', () => {
    const { asFragment } = render(
      <Dialog
        instanceId="dialog"
        isOpen
        title="Ignored title"
        header={<div data-testid="custom-header">Header</div>}
        content={<div data-testid="custom-content">Content</div>}
        footer={<div data-testid="custom-footer">Footer</div>}
        onResolve={() => {}}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
