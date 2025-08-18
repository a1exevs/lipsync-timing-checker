import { Nullable, Optional } from '@alexevs/ts-guards';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import ConfirmationDialog from 'src/shared/ui/confirmation-dialog/confirmation-dialog';
import {
  ConfirmationDialogProps,
  ConfirmationDialogResult,
  OpenConfirmationDialog,
} from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';

type PendingRequest = {
  props: ConfirmationDialogProps;
  resolve: (result: ConfirmationDialogResult) => void;
};

type ContextValue = {
  open: OpenConfirmationDialog;
};

const ConfirmationDialogContext = createContext<Optional<ContextValue>>(undefined);

export const ConfirmationDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProps, setCurrentProps] = useState<Nullable<ConfirmationDialogProps>>(null);
  const pendingRef = useRef<Nullable<PendingRequest>>(null);

  const resolveAndClose = useCallback((result: ConfirmationDialogResult) => {
    const pending = pendingRef.current;
    if (pending) {
      pending.resolve(result);
      pendingRef.current = null;
    }
    setIsOpen(false);
    setCurrentProps(null);
  }, []);

  const open = useCallback<OpenConfirmationDialog>(props => {
    return new Promise<ConfirmationDialogResult>(resolve => {
      pendingRef.current = { props, resolve };
      setCurrentProps(props);
      setIsOpen(true);
    });
  }, []);

  const value = useMemo<ContextValue>(() => ({ open }), [open]);

  return (
    <ConfirmationDialogContext.Provider value={value}>
      {children}
      <ConfirmationDialog
        isOpen={isOpen}
        onResolve={resolveAndClose}
        title={currentProps?.title ?? ''}
        message={currentProps?.message}
        confirmButtonText={currentProps?.confirmButtonText}
        hideCancelButton={currentProps?.hideCancelButton}
        modal={currentProps?.modal}
        header={currentProps?.header}
        content={currentProps?.content}
        footer={currentProps?.footer}
      />
    </ConfirmationDialogContext.Provider>
  );
};

export const useConfirmationDialog = (
  defaultProps?: ConfirmationDialogProps,
): (() => Promise<ConfirmationDialogResult>) => {
  const ctx = useContext(ConfirmationDialogContext);
  if (!ctx) {
    throw new Error('useConfirmationDialog must be used within ConfirmationDialogProvider');
  }
  return useCallback(() => ctx.open(defaultProps ?? { title: '' }), [ctx, defaultProps]);
};
