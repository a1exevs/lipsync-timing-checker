import React from 'react';

import { ConfirmationDialogActions } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';

export const DialogActionsContext = React.createContext<ConfirmationDialogActions | null>(null);

export const useDialogActions = (): ConfirmationDialogActions => {
  const ctx = React.useContext(DialogActionsContext);
  if (!ctx) {
    throw new Error('useDialogActions must be used within DialogActionsContext');
  }
  return ctx;
};
