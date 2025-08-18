import React, { useMemo } from 'react';

import { Footer } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.compounds';
import { MaybeRenderProp } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';

const useFooterNode = ({
  renderMaybe,
  footer,
  hideCancelButton,
  confirmButtonText,
  handleCancel,
  handleConfirm,
}: {
  renderMaybe: (node?: MaybeRenderProp) => React.ReactNode;
  footer?: MaybeRenderProp;
  hideCancelButton: boolean;
  confirmButtonText: string;
  handleCancel: () => void;
  handleConfirm: () => void;
}): React.ReactNode => {
  return useMemo(() => {
    const custom = renderMaybe(footer);
    if (custom) {
      return custom;
    }
    return (
      <Footer
        hideCancelButton={hideCancelButton}
        confirmButtonText={confirmButtonText}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
      />
    );
  }, [renderMaybe, footer, hideCancelButton, confirmButtonText, handleCancel, handleConfirm]);
};

export default useFooterNode;
