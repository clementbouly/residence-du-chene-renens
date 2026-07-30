"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import type { IssueSort } from "../model/domain";
import styles from "./IssueSortMenu.module.css";

const sortOptions = [
  { value: "date-desc", label: "Plus récent" },
  { value: "date-asc", label: "Plus ancien" },
  { value: "concerns-desc", label: "Plus de foyers" },
  { value: "concerns-asc", label: "Moins de foyers" },
] satisfies { value: IssueSort; label: string }[];

type IssueSortMenuProps = {
  value: IssueSort;
  onChange: (sort: IssueSort) => void;
};

export default function IssueSortMenu({
  value,
  onChange,
}: IssueSortMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeWithEscape);
    optionRefs.current[sortOptions.findIndex((option) => option.value === value)]
      ?.focus();

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [open, value]);

  const moveFocus = (
    event: ReactKeyboardEvent<HTMLDivElement>,
    direction: 1 | -1,
  ) => {
    event.preventDefault();
    const activeIndex = optionRefs.current.findIndex(
      (option) => option === document.activeElement,
    );
    const nextIndex =
      (activeIndex + direction + sortOptions.length) % sortOptions.length;
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;
          event.preventDefault();
          setOpen(true);
        }}
      >
        <ArrowUpDown aria-hidden="true" size={14} strokeWidth={2.2} />
        <span>Trier</span>
        <ChevronDown
          aria-hidden="true"
          className={open ? styles.chevronOpen : ""}
          size={13}
          strokeWidth={2.2}
        />
      </button>

      {open && (
        <div
          className={styles.menu}
          role="menu"
          aria-label="Trier les problèmes"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") moveFocus(event, 1);
            if (event.key === "ArrowUp") moveFocus(event, -1);
            if (event.key === "Home") {
              event.preventDefault();
              optionRefs.current[0]?.focus();
            }
            if (event.key === "End") {
              event.preventDefault();
              optionRefs.current[sortOptions.length - 1]?.focus();
            }
          }}
        >
          {sortOptions.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              className={styles.option}
              type="button"
              role="menuitemradio"
              aria-checked={value === option.value}
              tabIndex={value === option.value ? 0 : -1}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check aria-hidden="true" size={15} strokeWidth={2.4} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
