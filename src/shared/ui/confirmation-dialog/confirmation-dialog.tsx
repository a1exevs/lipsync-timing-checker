import { X as CloseIcon } from 'lucide-react';
import React, { useCallback, useEffect, useMemo } from 'react';

import Button from 'src/shared/ui/button/button';
import { DialogActionsContext } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.actions';
import {
  ConfirmationDialogActions,
  ConfirmationDialogProps,
  ConfirmationDialogResult,
  MaybeRenderProp,
} from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';
import IconButton from 'src/shared/ui/icon-button/icon-button';

type InternalProps = ConfirmationDialogProps & {
  isOpen: boolean;
  onResolve: (result: ConfirmationDialogResult) => void;
};

const overlayClasses = 'fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40';
const dialogContainerClasses =
  'relative mx-4 max-h-[80vh] w-full max-w-lg overflow-hidden rounded-md bg-white shadow-xl outline-none';
const headerClasses = 'sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3';
const titleClasses = 'text-lg font-semibold text-gray-900';
const contentWrapperClasses = 'max-h-[calc(80vh-7rem)] overflow-y-auto px-4 py-4 text-gray-800';
const footerClasses =
  'sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t border-gray-200 bg-white px-4 py-3';

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
}) => {
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onResolve(ConfirmationDialogResult.CANCEL);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        onResolve(ConfirmationDialogResult.CONFIRM);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onResolve]);

  const headerNode = useMemo(() => {
    const custom = renderMaybe(header);
    if (custom) {
      return custom;
    }
    return (
      <div className={headerClasses}>
        <div id="confirmation-dialog-title" className={titleClasses}>
          {title}
        </div>
        <IconButton title="Close" variant="secondary" size="sm" onClick={handleCancel}>
          <CloseIcon size={16} />
        </IconButton>
      </div>
    );
  }, [renderMaybe, header, title, handleCancel]);

  const contentNode = useMemo(() => {
    const custom = renderMaybe(content);
    if (custom) {
      return custom;
    }
    return <div className={contentWrapperClasses}>{message ?? title}</div>;
  }, [renderMaybe, content, message, title]);

  const footerNode = useMemo(() => {
    const custom = renderMaybe(footer);
    if (custom) {
      return custom;
    }
    return (
      <div className={footerClasses}>
        {!hideCancelButton && <Button text="Cancel" variant="secondary" onClick={handleCancel} />}
        <Button text={confirmButtonText} variant="primary" onClick={handleConfirm} />
      </div>
    );
  }, [renderMaybe, footer, hideCancelButton, confirmButtonText, handleCancel, handleConfirm]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={overlayClasses} onMouseDown={handleOutsideClick}>
      <DialogActionsContext.Provider value={actions}>
        <div
          role="dialog"
          aria-modal={modal}
          aria-labelledby="confirmation-dialog-title"
          className={dialogContainerClasses}
          onMouseDown={e => e.stopPropagation()}
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
