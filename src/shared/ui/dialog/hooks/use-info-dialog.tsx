import { useCallback, useContext } from 'react';

import { ConfirmationDialogContext } from 'src/shared/ui/dialog/dialog.context';
import { DialogResponse, InfoDialogProps } from 'src/shared/ui/dialog/dialog.types';

const useInfoDialog = (props: InfoDialogProps): (() => Promise<DialogResponse>) => {
  const ctx = useContext(ConfirmationDialogContext);
  if (!ctx) {
    throw new Error('useInfoDialog must be used within DialogProvider');
  }
  return useCallback(() => ctx.open({ ...props, hideCancelButton: true }), [ctx, props]);
};

export default useInfoDialog;
