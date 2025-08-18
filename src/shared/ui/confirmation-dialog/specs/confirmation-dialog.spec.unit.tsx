import { isNull } from '@alexevs/ts-guards';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Button from 'src/shared/ui/button/button';
import {
  ConfirmationDialogProvider,
  useConfirmationDialog,
} from 'src/shared/ui/confirmation-dialog/confirmation-dialog.context';
import { ConfirmationDialogResult } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';

const TestComponent: React.FC = () => {
  const open = useConfirmationDialog({ title: 'Title', message: 'Message' });
  const [text, setText] = React.useState('none');
  const handleClick = async () => {
    const res = await open();
    setText(res);
  };
  return (
    <div>
      <Button text="open" onClick={handleClick} />
      <div data-testid="result">{text}</div>
    </div>
  );
};

describe('ConfirmationDialog', () => {
  const renderWithProvider = () =>
    render(
      <ConfirmationDialogProvider>
        <TestComponent />
      </ConfirmationDialogProvider>,
    );

  it('confirms on enter key', async () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('open'));
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(await screen.findByText(ConfirmationDialogResult.CONFIRM)).toBeInTheDocument();
  });

  it('cancels on escape key', async () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('open'));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(await screen.findByText(ConfirmationDialogResult.CANCEL)).toBeInTheDocument();
  });

  it('returns OUTSIDE_CLICK on overlay click if not modal', async () => {
    const Comp: React.FC = () => {
      const open = useConfirmationDialog({ title: 'Title', message: 'Message', modal: false });
      const [text, setText] = React.useState('none');
      const handleClick = async () => setText(await open());
      return (
        <div>
          <Button text="open" onClick={handleClick} />
          <div data-testid="result">{text}</div>
        </div>
      );
    };
    render(
      <ConfirmationDialogProvider>
        <Comp />
      </ConfirmationDialogProvider>,
    );
    fireEvent.click(screen.getByText('open'));
    const dialogWrapper = screen.getByRole('dialog').parentElement;
    if (!isNull(dialogWrapper)) {
      fireEvent.mouseDown(dialogWrapper);
    }
    expect(await screen.findByText(ConfirmationDialogResult.OUTSIDE_CLICK)).toBeInTheDocument();
  });
});
