"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-all">
      <div className="flex items-center gap-3">
        {isDark ? <Moon size={20} className="text-blue-500" /> : <Sun size={20} className="text-orange-500" />}
        <span className="font-bold text-sm text-zinc-900 dark:text-white">
          Modo {isDark ? "Escuro" : "Claro"}
        </span>
      </div>
      
      <button 
        onClick={toggleTheme}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isDark ? "bg-blue-600" : "bg-zinc-300"}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isDark ? "left-7" : "left-1"}`} />
      </button>
    </div>
  );
}