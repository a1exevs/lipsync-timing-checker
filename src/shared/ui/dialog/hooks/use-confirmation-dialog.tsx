import { useCallback, useContext } from 'react';

import { ConfirmationDialogContext } from 'src/shared/ui/dialog/dialog.context';
import { ConfirmationDialogProps, DialogResponse } from 'src/shared/ui/dialog/dialog.types';

const useConfirmationDialog = (props?: ConfirmationDialogProps): (() => Promise<DialogResponse>) => {
  const ctx = useContext(ConfirmationDialogContext);
  if (!ctx) {
    throw new Error('useConfirmationDialog must be used within DialogProvider');
  }
  return useCallback(() => ctx.open(props ?? { title: '' }), [ctx, props]);
};

export default useConfirmationDialog;
