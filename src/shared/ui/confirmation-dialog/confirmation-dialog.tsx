import { Nullable } from '@alexevs/ts-guards';
import React, { useCallback, useMemo, useRef } from 'react';

import { DialogActionsContext } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.actions';
import {
  ConfirmationDialogActions,
  ConfirmationDialogProps,
  ConfirmationDialogResult,
  MaybeRenderProp,
} from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';
import useContentNode from 'src/shared/ui/confirmation-dialog/hooks/use-content-node';
import useDialogHotkeys from 'src/shared/ui/confirmation-dialog/hooks/use-dialog-hotkeys';
import useFocusTrap from 'src/shared/ui/confirmation-dialog/hooks/use-focus-trap';
import useFooterNode from 'src/shared/ui/confirmation-dialog/hooks/use-footer-node';
import useHeaderNode from 'src/shared/ui/confirmation-dialog/hooks/use-header-node';

type InternalProps = ConfirmationDialogProps & {
  isOpen: boolean;
  onResolve: (result: ConfirmationDialogResult) => void;
};

const overlayClasses = 'fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40';
const dialogContainerClasses =
  'relative mx-4 max-h-[80vh] w-full max-w-lg overflow-hidden rounded-md bg-white shadow-xl outline-none';

const ConfirmationDialog: React.FC<InternalProps> = ({
  isOpen,
  onResolve,
  title,
  message,
  confirmButtonText = 'Confirm',
  hideCancelButton = false,
  modal = false,
  header,
  content,
  footer,
  initialFocusRef,
}) => {
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const handleConfirm = useCallback(() => onResolve(ConfirmationDialogResult.CONFIRM), [onResolve]);
  const handleCancel = useCallback(() => onResolve(ConfirmationDialogResult.CANCEL), [onResolve]);
  const handleOutsideClick = useCallback(() => {
    if (!modal) {
      onResolve(ConfirmationDialogResult.OUTSIDE_CLICK);
    }
  }, [modal, onResolve]);

  const actions: ConfirmationDialogActions = useMemo(
    () => ({ confirm: handleConfirm, cancel: handleCancel, outsideClick: handleOutsideClick }),
    [handleConfirm, handleCancel, handleOutsideClick],
  );

  const renderMaybe = useCallback(
    (node?: MaybeRenderProp): React.ReactNode =>
      typeof node === 'function' ? (node as (a: ConfirmationDialogActions) => React.ReactNode)(actions) : node,
    [actions],
  );

  const headerNode = useHeaderNode({ renderMaybe, header, title, handleCancel });
  const contentNode = useContentNode({ renderMaybe, content, message, title });
  const footerNode = useFooterNode({
    renderMaybe,
    footer,
    hideCancelButton,
    confirmButtonText,
    handleCancel,
    handleConfirm,
  });

  useDialogHotkeys({ isOpen, onConfirm: handleConfirm, onCancel: handleCancel });
  useFocusTrap({ isOpen, containerRef, initialFocusRef });

  if (!isOpen) {
    return null;
  }

  return (
    <div className={overlayClasses} onMouseDown={handleOutsideClick}>
      <DialogActionsContext.Provider value={actions}>
        <div
          ref={containerRef}
          role="dialog"
          aria-modal={modal}
          aria-labelledby="confirmation-dialog-title"
          className={dialogContainerClasses}
          onMouseDown={e => e.stopPropagation()}
          tabIndex={-1}
        >
          {headerNode}
          {contentNode}
          {footerNode}
        </div>
      </DialogActionsContext.Provider>
    </div>
  );
};

export default ConfirmationDialog;
