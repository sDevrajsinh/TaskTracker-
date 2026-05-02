// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('tp_theme') === 'dark'
  );

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('tp_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return { isDark, toggleTheme };
}
