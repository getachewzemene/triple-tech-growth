import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until after hydration/mount to show theme to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: mounted ? resolvedTheme === "dark" : false,
    mounted,
  };
}
