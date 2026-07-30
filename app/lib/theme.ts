export type ThemeMode = "auto" | "light" | "dark";
export type ResolvedTheme = Exclude<ThemeMode, "auto">;

export const THEME_STORAGE_KEY = "residence-theme";
export const THEME_CHANGE_EVENT = "residence-theme-change";

export const seasonalThemeSchedule = [
  { lightAt: 8 * 60, darkAt: 18 * 60 },
  { lightAt: 7 * 60 + 30, darkAt: 18 * 60 + 30 },
  { lightAt: 7 * 60, darkAt: 19 * 60 + 30 },
  { lightAt: 6 * 60 + 30, darkAt: 20 * 60 + 30 },
  { lightAt: 6 * 60, darkAt: 21 * 60 },
  { lightAt: 6 * 60, darkAt: 21 * 60 },
  { lightAt: 6 * 60, darkAt: 21 * 60 },
  { lightAt: 6 * 60 + 30, darkAt: 21 * 60 },
  { lightAt: 7 * 60, darkAt: 20 * 60 },
  { lightAt: 7 * 60 + 30, darkAt: 19 * 60 },
  { lightAt: 8 * 60, darkAt: 18 * 60 },
  { lightAt: 8 * 60, darkAt: 18 * 60 },
] as const;

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "auto" || value === "light" || value === "dark";
}

export function resolveTheme(
  mode: ThemeMode,
  date = new Date(),
): ResolvedTheme {
  if (mode !== "auto") return mode;

  const schedule = seasonalThemeSchedule[date.getMonth()];
  const minutes = date.getHours() * 60 + date.getMinutes();

  return minutes < schedule.lightAt || minutes >= schedule.darkAt
    ? "dark"
    : "light";
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "auto";

  const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(storedMode) ? storedMode : "auto";
}

export function applyTheme(mode: ThemeMode) {
  const resolvedTheme = resolveTheme(mode);
  const root = document.documentElement;

  root.dataset.theme = resolvedTheme;
  root.dataset.themeMode = mode;
  root.style.colorScheme = resolvedTheme;
}

export function setThemeMode(mode: ThemeMode) {
  const updateTheme = () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    applyTheme(mode);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };
  const nextTheme = resolveTheme(mode);
  const currentTheme = document.documentElement.dataset.theme;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (
    currentTheme === nextTheme ||
    reduceMotion ||
    !document.startViewTransition
  ) {
    updateTheme();
    return;
  }

  document.startViewTransition(updateTheme);
}
