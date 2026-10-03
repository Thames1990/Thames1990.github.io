import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'system' | 'light' | 'dark';

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch (error) {
    console.warn('Theme preference could not be read; using system appearance.', error);
    return 'system';
  }
}

function applyTheme(theme: Theme): void {
  if (theme === 'system') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
  document.documentElement.classList.toggle(
    'dark',
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  );
}

export function ThemePreference() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const sync = () => {
      const stored = readTheme();
      setTheme(stored);
      applyTheme(stored);
    };
    sync();
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'theme' || event.key === null) sync();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => applyTheme(theme);
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, [theme]);

  const selectTheme = (value: Theme) => {
    setTheme(value);
    applyTheme(value);
    try {
      if (value === 'system') localStorage.removeItem('theme');
      else localStorage.setItem('theme', value);
    } catch (error) {
      console.warn('Theme preference could not be saved; it applies only to this page.', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-theme-menu>
        <DropdownMenuItem onSelect={() => selectTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => selectTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => selectTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
