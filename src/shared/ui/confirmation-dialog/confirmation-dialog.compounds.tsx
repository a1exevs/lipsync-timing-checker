import { X as CloseIcon } from 'lucide-react';
import React from 'react';

import Button from 'src/shared/ui/button/button';
import { useDialogActions } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.actions';
import IconButton from 'src/shared/ui/icon-button/icon-button';

export const ConfirmButton: React.FC<{ text?: string }> = ({ text = 'Confirm' }) => {
  const { confirm } = useDialogActions();
  return <Button text={text} variant="primary" onClick={confirm} />;
};

export const CancelButton: React.FC<{ text?: string }> = ({ text = 'Cancel' }) => {
  const { cancel } = useDialogActions();
  return <Button text={text} variant="secondary" onClick={cancel} />;
};

export const Header: React.FC<{ title: string; handleCancel: () => void }> = ({ title, handleCancel }) => {
  const titleClasses = 'text-lg font-semibold text-gray-900';
  const headerClasses =
    'sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3';
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
};

export const Content: React.FC<{ message?: string }> = ({ message = '' }) => {
  const contentWrapperClasses =
    'break-all max-h-[calc(80vh-7rem)] overflow-y-auto overflow-x-hidden px-4 py-4 text-gray-800';
  return <div className={contentWrapperClasses}>{message}</div>;
};

export const Footer: React.FC<{
  hideCancelButton: boolean;
  confirmButtonText: string;
  handleCancel: () => void;
  handleConfirm: () => void;
}> = ({ hideCancelButton, confirmButtonText, handleCancel, handleConfirm }) => {
  const footerClasses =
    'sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t border-gray-200 bg-white px-4 py-3';
  return (
    <div className={footerClasses}>
      {!hideCancelButton && <Button text="Cancel" variant="secondary" onClick={handleCancel} />}
      <Button text={confirmButtonText} variant="primary" onClick={handleConfirm} />
    </div>
  );
};
