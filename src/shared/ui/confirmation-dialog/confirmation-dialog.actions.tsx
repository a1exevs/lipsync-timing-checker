import { Nullable } from '@alexevs/ts-guards';
import React from 'react';

import { ConfirmationDialogActions } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';

export const DialogActionsContext = React.createContext<Nullable<ConfirmationDialogActions>>(null);

export const useDialogActions = (): ConfirmationDialogActions => {
  const ctx = React.useContext(DialogActionsContext);
  if (!ctx) {
    throw new Error('useDialogActions must be used within DialogActionsContext');
  }
  return ctx;
};
