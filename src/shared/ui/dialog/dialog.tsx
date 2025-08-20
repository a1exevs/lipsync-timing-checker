import { Nullable } from '@alexevs/ts-guards';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { DialogActionsContext } from 'src/shared/ui/dialog/dialog-actions.context';
import { DIALOG_BASE_Z_INDEX, DIALOG_OPEN_CLOSE_ANIMATION_MS } from 'src/shared/ui/dialog/dialog.consts';
import {
  DialogActionsContextValue,
  DialogResponse,
  InternalDialogProps,
  MaybeRenderProp,
} from 'src/shared/ui/dialog/dialog.types';
import { getOrBuildDialogPortalRoot } from 'src/shared/ui/dialog/dialog.utils';
import useContentNode from 'src/shared/ui/dialog/hooks/use-content-node';
import useDialogHotkeys from 'src/shared/ui/dialog/hooks/use-dialog-hotkeys';
import useFocusTrap from 'src/shared/ui/dialog/hooks/use-focus-trap';
import useFooterNode from 'src/shared/ui/dialog/hooks/use-footer-node';
import useHeaderNode from 'src/shared/ui/dialog/hooks/use-header-node';

const overlayClasses = 'fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40';
const dialogContainerClasses =
  'relative mx-4 max-h-[80vh] w-full max-w-lg overflow-hidden rounded-md bg-white shadow-xl outline-none';

const Dialog: React.FC<InternalDialogProps> = ({
  instanceId,
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
  isTop = true,
  zIndexBase = DIALOG_BASE_Z_INDEX,
}) => {
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const handleConfirm = useCallback(() => onResolve(DialogResponse.CONFIRM), [onResolve]);
  const handleCancel = useCallback(() => onResolve(DialogResponse.CANCEL), [onResolve]);
  const handleOutsideClick = useCallback(() => {
    if (!modal) {
      onResolve(DialogResponse.OUTSIDE_CLICK);
    }
  }, [modal, onResolve]);

  const actions: DialogActionsContextValue = useMemo(
    () => ({ confirm: handleConfirm, cancel: handleCancel, outsideClick: handleOutsideClick }),
    [handleConfirm, handleCancel, handleOutsideClick],
  );

  const renderMaybe = useCallback(
    (node?: MaybeRenderProp): React.ReactNode =>
      typeof node === 'function' ? (node as (a: DialogActionsContextValue) => React.ReactNode)(actions) : node,
    [actions],
  );

  const titleId = `confirmation-dialog-title-${instanceId}`;
  const descriptionId = `confirmation-dialog-description-${instanceId}`;

  const headerNode = useHeaderNode({ renderMaybe, header, title, titleId, handleCancel });
  const contentNode = useContentNode({ renderMaybe, content, message, title, descriptionId });
  const footerNode = useFooterNode({
    renderMaybe,
    footer,
    hideCancelButton,
    confirmButtonText,
    handleCancel,
    handleConfirm,
  });

  useDialogHotkeys({ isOpen: isOpen && isTop, onConfirm: handleConfirm, onCancel: handleCancel });
  useFocusTrap({ isOpen: isOpen && isTop, containerRef, initialFocusRef });

  // Shared portal root
  const portalRoot = getOrBuildDialogPortalRoot();

  const [isMounted, setIsMounted] = useState<boolean>(isOpen);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsLeaving(false);
      setIsVisible(false);
      // ensure first frame renders with invisible state, then show
      requestAnimationFrame(() => setIsVisible(true));
    } else if (isMounted) {
      setIsVisible(false);
      setIsLeaving(true);
      const t = setTimeout(() => {
        setIsMounted(false);
        setIsLeaving(false);
        // defer clearing props in provider until unmount is done
      }, DIALOG_OPEN_CLOSE_ANIMATION_MS);
      return () => clearTimeout(t);
    }
  }, [isOpen, isMounted]);

  if (!isMounted) {
    return null;
  }

  const overlayAnimatedClasses = `${overlayClasses} transition-opacity duration-[${DIALOG_OPEN_CLOSE_ANIMATION_MS}ms] ${
    isVisible && !isLeaving ? 'opacity-100' : 'opacity-0'
  }`;
  const dialogAnimatedClasses = `${dialogContainerClasses} transition duration-[${DIALOG_OPEN_CLOSE_ANIMATION_MS}ms] ease-out ${
    isVisible && !isLeaving
      ? 'opacity-100 u-translate-y-0 u-scale-100'
      : 'opacity-0 u-translate-y-4 u-scale-95 will-change-transform'
  }`;

  const dialogTree = (
    <div className={overlayAnimatedClasses} onMouseDown={handleOutsideClick} style={{ zIndex: zIndexBase }}>
      <DialogActionsContext.Provider value={actions}>
        <div
          ref={containerRef}
          role="dialog"
          aria-modal={modal}
          aria-labelledby={titleId}
          aria-describedby={message ? descriptionId : undefined}
          className={dialogAnimatedClasses}
          onMouseDown={e => e.stopPropagation()}
          tabIndex={-1}
          style={{ zIndex: zIndexBase + 1, pointerEvents: isTop ? 'auto' : 'none' }}
        >
          {headerNode}
          {contentNode}
          {footerNode}
        </div>
      </DialogActionsContext.Provider>
    </div>
  );

  if (!portalRoot) {
    return dialogTree;
  }
  return createPortal(dialogTree, portalRoot);
};

export default Dialog;
