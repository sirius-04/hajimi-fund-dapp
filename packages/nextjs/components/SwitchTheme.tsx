"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export const SwitchTheme = ({ className }: { className?: string }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <Button onClick={handleToggle} variant="ghost">
      {isDarkMode ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
      {/* <span className="text-sm">{isDarkMode ? "Dark" : "Light"}</span> */}
    </Button>
  );
};
