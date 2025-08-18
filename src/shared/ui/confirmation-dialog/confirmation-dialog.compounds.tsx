import React from 'react';

import Button from 'src/shared/ui/button/button';
import { useDialogActions } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.actions';

export const ConfirmButton: React.FC<{ text?: string }> = ({ text = 'Confirm' }) => {
  const { confirm } = useDialogActions();
  return <Button text={text} variant="primary" onClick={confirm} />;
};

export const CancelButton: React.FC<{ text?: string }> = ({ text = 'Cancel' }) => {
  const { cancel } = useDialogActions();
  return <Button text={text} variant="secondary" onClick={cancel} />;
};
