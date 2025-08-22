import React from 'react';

import { DialogActionsContext } from 'src/shared/ui/dialog/dialog-actions.context';
import { DialogActionsContextValue } from 'src/shared/ui/dialog/dialog.types';

const useDialogActions = (): DialogActionsContextValue => {
  const ctx = React.useContext(DialogActionsContext);
  if (!ctx) {
    throw new Error('useDialogActions must be used within DialogActionsContext');
  }
  return ctx;
};

export default useDialogActions;
