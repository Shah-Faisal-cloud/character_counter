export function initTheme(): void {
  let preference: string = getUserPreference();
  applyTheme(preference);
}

export function handleThemeSelection(selectedPreference: string): void {
  localStorage.setItem("theme", selectedPreference);
  applyTheme(selectedPreference);
}

export function getUserPreference(): string {
  return localStorage.getItem("theme") || "system";
}

function applyTheme(preference: string): void {
  const root = document.documentElement;

  let theme: string = preference;
  if (preference === "system") {
    theme = getSystemTheme();
  }

  root.setAttribute("data-theme", theme);
}

function getSystemTheme(): string {
  const query: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  if (query.matches) {
    return "dark";
  } else {
    return "light";
  }
}