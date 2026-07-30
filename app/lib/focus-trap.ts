import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export function keepFocusWithin(
  container: HTMLElement | null,
  event: ReactKeyboardEvent<HTMLElement>,
) {
  if (event.key !== "Tab" || !container) return;

  const focusableElements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);

  if (!firstElement || !lastElement) return;
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}
