import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ConfirmationDialog from 'src/shared/ui/dialog/dialog';
import { ConfirmationDialogContext } from 'src/shared/ui/dialog/dialog.context';
import {
  ConfirmationDialogResult,
  DialogContextValue,
  OpenConfirmationDialog,
  StackedDialogData,
} from 'src/shared/ui/dialog/dialog.types';

type Props = { children: React.ReactNode };

const ConfirmationDialogProvider: React.FC<Props> = ({ children }) => {
  const [stack, setStack] = useState<StackedDialogData[]>([]);
  const idSeqRef = useRef(0);
  const isLockedRef = useRef(false);
  const savedOverflowRef = useRef<string>('');
  const savedPaddingRightRef = useRef<string>('');

  const closeTop = useCallback((result: ConfirmationDialogResult) => {
    setStack(prev => {
      if (prev.length === 0) {
        return prev;
      }
      const top = prev[prev.length - 1];
      // mark closing
      const next = prev.map(item => (item.id === top.id ? { ...item, isOpen: false } : item));
      // schedule removal and resolve after animation
      setTimeout(() => {
        setStack(curr => curr.filter(i => i.id !== top.id));
        top.resolve(result);
      }, 200);
      return next;
    });
  }, []);

  const open = useCallback<OpenConfirmationDialog>(props => {
    return new Promise<ConfirmationDialogResult>(resolve => {
      const id = ++idSeqRef.current;
      setStack(prev => [...prev, { id, props, isOpen: true, resolve }]);
    });
  }, []);

  const value = useMemo<DialogContextValue>(() => ({ open }), [open]);

  useEffect(() => {
    const appRoot = document.querySelector<HTMLElement>('#root');
    if (!appRoot) {
      return;
    }
    const body = document.body;
    const applyLock = () => {
      if (isLockedRef.current) {
        return;
      }
      savedOverflowRef.current = body.style.overflow;
      savedPaddingRightRef.current = body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
      appRoot.inert = true;
      isLockedRef.current = true;
    };
    const releaseLock = () => {
      if (!isLockedRef.current) {
        return;
      }
      body.style.overflow = savedOverflowRef.current || '';
      body.style.paddingRight = savedPaddingRightRef.current || '';
      appRoot.inert = false;
      isLockedRef.current = false;
    };
    if (stack.length > 0) {
      applyLock();
    } else {
      releaseLock();
    }
    return () => {
      // on unmount provider
      releaseLock();
    };
  }, [stack.length]);

  return (
    <ConfirmationDialogContext.Provider value={value}>
      {children}
      {stack.map((item, index) => (
        <ConfirmationDialog
          key={item.id}
          instanceId={String(item.id)}
          isOpen={item.isOpen}
          onResolve={closeTop}
          title={item.props.title}
          message={item.props.message}
          confirmButtonText={item.props.confirmButtonText}
          hideCancelButton={item.props.hideCancelButton}
          modal={item.props.modal}
          header={item.props.header}
          content={item.props.content}
          footer={item.props.footer}
          initialFocusRef={item.props.initialFocusRef}
          isTop={index === stack.length - 1}
          zIndexBase={1000 + index * 10}
        />
      ))}
    </ConfirmationDialogContext.Provider>
  );
};

export default ConfirmationDialogProvider;
