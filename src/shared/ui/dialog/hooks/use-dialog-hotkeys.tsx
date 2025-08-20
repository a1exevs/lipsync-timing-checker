import React from 'react';

const useDialogHotkeys = ({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}): void => {
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };
    const target: Document | undefined = typeof document !== 'undefined' ? document : undefined;
    target?.addEventListener('keydown', handler);
    return () => target?.removeEventListener('keydown', handler);
  }, [isOpen, onConfirm, onCancel]);
};

export default useDialogHotkeys;
