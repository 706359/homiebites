import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Enterprise modal focus: save focus when modal opens, restore when it closes.
 * Call once with show (boolean). Optionally pass containerRef to also trap focus (Tab cycles inside modal).
 * @param {boolean} show - Whether the modal is open
 * @param {{ current: HTMLElement | null } | null} [containerRef] - Ref to modal container for focus trap
 */
export function useModalFocus(show, containerRef = null) {
  const previousFocusRef = useRef(/** @type {HTMLElement | null} */ (null));

  // Save focus when opening; focus first focusable when containerRef provided
  useEffect(() => {
    if (!show) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (containerRef?.current) {
      const first = containerRef.current.querySelector(FOCUSABLE);
      if (first) {
        const t = requestAnimationFrame(() => {
          first.focus();
        });
        return () => cancelAnimationFrame(t);
      }
    }
  }, [show, containerRef]);

  // Restore focus when closing
  useEffect(() => {
    if (!show && previousFocusRef.current) {
      const prev = previousFocusRef.current;
      previousFocusRef.current = null;
      requestAnimationFrame(() => {
        if (prev && typeof prev.focus === 'function') prev.focus();
      });
    }
  }, [show]);
}

/**
 * Focus trap: Tab cycles within container. Call in keydown on document/modal when open.
 * @param {KeyboardEvent} e
 * @param {HTMLElement | null} container
 */
export function handleFocusTrapKeydown(e, container) {
  if (e.key !== 'Tab' || !container) return;
  const focusables = Array.from(container.querySelectorAll(FOCUSABLE));
  if (focusables.length < 2) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export { FOCUSABLE };
