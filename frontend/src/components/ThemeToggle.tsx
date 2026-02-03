import { createSignal, onMount } from 'solid-js';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'comanager-theme';

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  window.localStorage.setItem(STORAGE_KEY, theme);
};

export function ThemeToggle() {
  const [theme, setTheme] = createSignal<ThemeMode>('light');

  onMount(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      applyTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme: ThemeMode = prefersDark ? 'dark' : 'light';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  });

  const toggleTheme = () => {
    const next = theme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
    >
      <span class="text-base">{theme() === 'dark' ? '🌙' : '☀️'}</span>
      <span>{theme() === 'dark' ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}
