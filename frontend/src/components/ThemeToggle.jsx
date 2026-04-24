import React from "react";
export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="toggle"
      title="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
