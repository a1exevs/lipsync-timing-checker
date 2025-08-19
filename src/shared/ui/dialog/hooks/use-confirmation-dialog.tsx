import { useCallback, useContext } from 'react';

import { ConfirmationDialogContext } from 'src/shared/ui/dialog/dialog.context';
import { ConfirmationDialogProps, ConfirmationDialogResult } from 'src/shared/ui/dialog/dialog.types';

const useConfirmationDialog = (defaultProps?: ConfirmationDialogProps): (() => Promise<ConfirmationDialogResult>) => {
  const ctx = useContext(ConfirmationDialogContext);
  if (!ctx) {
    throw new Error('useConfirmationDialog must be used within ConfirmationDialogProvider');
  }
  return useCallback(() => ctx.open(defaultProps ?? { title: '' }), [ctx, defaultProps]);
};

export default useConfirmationDialog;
