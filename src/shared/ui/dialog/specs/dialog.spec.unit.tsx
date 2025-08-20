import { isNull } from '@alexevs/ts-guards';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Button from 'src/shared/ui/button/button';
import DialogProvider from 'src/shared/ui/dialog/dialog.provider';
import { DialogResponse } from 'src/shared/ui/dialog/dialog.types';
import useConfirmationDialog from 'src/shared/ui/dialog/hooks/use-confirmation-dialog';

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

describe('Dialog', () => {
  const renderWithProvider = () =>
    render(
      <DialogProvider>
        <TestComponent />
      </DialogProvider>,
    );

  it('confirms on enter key', async () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('open'));
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(await screen.findByText(DialogResponse.CONFIRM)).toBeInTheDocument();
  });

  it('cancels on escape key', async () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('open'));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(await screen.findByText(DialogResponse.CANCEL)).toBeInTheDocument();
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
      <DialogProvider>
        <Comp />
      </DialogProvider>,
    );
    fireEvent.click(screen.getByText('open'));
    const dialogWrapper = screen.getByRole('dialog').parentElement;
    if (!isNull(dialogWrapper)) {
      fireEvent.mouseDown(dialogWrapper);
    }
    expect(await screen.findByText(DialogResponse.OUTSIDE_CLICK)).toBeInTheDocument();
  });
});
