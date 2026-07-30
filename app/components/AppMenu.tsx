"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Clock3,
  ListChecks,
  Menu,
  Moon,
  Phone,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, domMax, LazyMotion, m } from "motion/react";
import { Button } from "./ui/Button";
import { keepFocusWithin } from "../lib/focus-trap";
import {
  applyTheme,
  getStoredThemeMode,
  setThemeMode,
  THEME_CHANGE_EVENT,
  type ThemeMode,
} from "../lib/theme";
import styles from "./AppMenu.module.css";

const navLinks = [
  { href: "/", label: "Problèmes signalés", Icon: ListChecks },
  { href: "/infos-pratiques", label: "Infos pratiques", Icon: BookOpen },
  { href: "/contacts", label: "Contacts utiles", Icon: Phone },
];

const themeOptions = [
  { value: "auto", label: "Auto", Icon: Clock3 },
  { value: "light", label: "Clair", Icon: Sun },
  { value: "dark", label: "Sombre", Icon: Moon },
] satisfies { value: ThemeMode; label: string; Icon: typeof Sun }[];

function subscribeToTheme(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export default function AppMenu() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const themeMode = useSyncExternalStore(
    subscribeToTheme,
    getStoredThemeMode,
    () => "auto",
  );

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const menuTrigger = menuButtonRef.current;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    document.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeWithEscape);
      menuTrigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (themeMode !== "auto") return;

    const refreshAutomaticTheme = () => applyTheme("auto");
    const timer = window.setInterval(refreshAutomaticTheme, 60_000);
    document.addEventListener("visibilitychange", refreshAutomaticTheme);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshAutomaticTheme);
    };
  }, [themeMode]);

  const keepFocusInPanel = (event: ReactKeyboardEvent<HTMLElement>) =>
    keepFocusWithin(panelRef.current, event);

  return (
    <>
      <Button
        ref={menuButtonRef}
        size="menu"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
      >
        <Menu aria-hidden="true" size={20} strokeWidth={2} />
      </Button>
      {mounted &&
        createPortal(
          <LazyMotion features={domMax} strict>
            <AnimatePresence>
              {open && (
                <m.div
                  className={styles.backdrop}
                  onMouseDown={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <m.nav
                    ref={panelRef}
                    className={styles.panel}
                    aria-label="Menu principal"
                    onMouseDown={(event) => event.stopPropagation()}
                    onKeyDown={keepFocusInPanel}
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <div className={styles.header}>
                      <strong>Résidence du Chêne</strong>
                      <Button
                        ref={closeButtonRef}
                        size="icon"
                        variant="secondary"
                        onClick={() => setOpen(false)}
                        aria-label="Fermer le menu"
                      >
                        <X aria-hidden="true" size={18} strokeWidth={2} />
                      </Button>
                    </div>
                    {navLinks.map(({ href, label, Icon }) => (
                      <Link
                        key={href}
                        className={`${styles.link}${
                          pathname === href ? ` ${styles.linkActive}` : ""
                        }`}
                        aria-current={pathname === href ? "page" : undefined}
                        href={href}
                        onClick={() => setOpen(false)}
                      >
                        <Icon aria-hidden="true" size={17} strokeWidth={2} />
                        <span>{label}</span>
                      </Link>
                    ))}
                    <div className={styles.themePicker}>
                      <span className={styles.themeLabel}>Apparence</span>
                      <div
                        className={styles.themeOptions}
                        role="group"
                        aria-label="Choisir le thème"
                      >
                        {themeOptions.map(({ value, label, Icon }) => (
                          <button
                            key={value}
                            className={`${styles.themeOption}${
                              themeMode === value
                                ? ` ${styles.themeOptionActive}`
                                : ""
                            }`}
                            type="button"
                            aria-pressed={themeMode === value}
                            onClick={() => setThemeMode(value)}
                          >
                            <Icon
                              aria-hidden="true"
                              size={16}
                              strokeWidth={2}
                            />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                      <small>
                        Auto suit les heures de jour selon la saison.
                      </small>
                    </div>
                  </m.nav>
                </m.div>
              )}
            </AnimatePresence>
          </LazyMotion>,
          document.body,
        )}
    </>
  );
}
