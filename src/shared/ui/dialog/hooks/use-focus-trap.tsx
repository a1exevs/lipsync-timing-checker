import { Nullable } from '@alexevs/ts-guards';
import React, { useEffect, useRef } from 'react';

const useFocusTrap = ({
  isOpen,
  containerRef,
  initialFocusRef,
}: {
  isOpen: boolean;
  containerRef: React.RefObject<Nullable<HTMLElement>>;
  initialFocusRef?: React.RefObject<Nullable<HTMLElement>>;
}): void => {
  const previousFocusedElementRef = useRef<Nullable<HTMLElement>>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    previousFocusedElementRef.current = (document.activeElement as HTMLElement | null) ?? null;

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const getFocusable = (): HTMLElement[] => {
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
      return nodes.filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    };

    const focusFirst = (): void => {
      const target = initialFocusRef?.current ?? getFocusable()[0] ?? (container as HTMLElement);
      target?.focus?.();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return;
      }
      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        (container as HTMLElement).focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (!active || active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!active || active === last || !container.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (!(container as HTMLElement).hasAttribute('tabindex')) {
      (container as HTMLElement).setAttribute('tabindex', '-1');
    }
    focusFirst();
    (container as HTMLElement).addEventListener('keydown', handleKeyDown);

    return () => {
      (container as HTMLElement).removeEventListener('keydown', handleKeyDown);
      const prev = previousFocusedElementRef.current;
      if (prev && typeof prev.focus === 'function') {
        setTimeout(() => prev.focus(), 0);
      }
    };
  }, [isOpen, containerRef, initialFocusRef]);
};

export default useFocusTrap;
