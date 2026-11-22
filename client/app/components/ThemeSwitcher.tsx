"use client";
import React from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    const current = resolvedTheme || theme;
    setTheme(current === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-center mx-4">
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="w-[35px] h-[35px] flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
      >
        <BiMoon
          className="block dark:hidden text-black fill-black transition-transform duration-200 hover:scale-110"
          size={24}
        />
        <BiSun
          className="hidden dark:block text-white fill-white transition-transform duration-200 hover:scale-110"
          size={24}
        />
      </button>
    </div>
  );
};

export default ThemeSwitcher;

