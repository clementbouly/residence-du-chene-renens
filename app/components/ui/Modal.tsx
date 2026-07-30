"use client";

import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { m, useDragControls } from "motion/react";
import { keepFocusWithin } from "../../lib/focus-trap";
import styles from "./Modal.module.css";

type ModalProps = {
  children: ReactNode;
  className?: string;
  descriptionId?: string;
  draggable?: boolean;
  elevated?: boolean;
  onClose: () => void;
  role?: "alertdialog" | "dialog";
  sheetOnMobile?: boolean;
  titleId: string;
};

export default function Modal({
  children,
  className,
  descriptionId,
  draggable = false,
  elevated = false,
  onClose,
  role = "dialog",
  sheetOnMobile = false,
  titleId,
}: ModalProps) {
  const dragControls = useDragControls();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    const initialFocus =
      dialogRef.current?.querySelector<HTMLElement>("[data-modal-autofocus]") ??
      dialogRef.current?.querySelector<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href]',
      );
    initialFocus?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  const keepFocusInDialog = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    keepFocusWithin(dialogRef.current, event);
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (draggable) dragControls.start(event);
  };

  const backdropClasses = [
    styles.backdrop,
    elevated ? styles.backdropElevated : "",
    sheetOnMobile ? styles.sheetOnMobile : "",
  ]
    .filter(Boolean)
    .join(" ");
  const panelClasses = [styles.panel, className].filter(Boolean).join(" ");
  const panelMotion = elevated
    ? {
        initial: { opacity: 0, y: 16, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.98 },
      }
    : {
        initial: { opacity: 0, y: 44, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 54, scale: 0.985 },
      };

  return (
    <m.div
      className={backdropClasses}
      onMouseDown={onClose}
      onKeyDown={keepFocusInDialog}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <m.section
        ref={dialogRef}
        className={panelClasses}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onMouseDown={(event) => event.stopPropagation()}
        {...panelMotion}
        drag={draggable ? "y" : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.02, bottom: 0.72 }}
        dragTransition={{ bounceStiffness: 520, bounceDamping: 42 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 700) onClose();
        }}
      >
        {sheetOnMobile && (
          <div
            className={styles.dragHandle}
            aria-hidden="true"
            onPointerDown={startDrag}
          >
            <span />
          </div>
        )}
        {children}
      </m.section>
    </m.div>
  );
}
