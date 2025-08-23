import React, { useState, useEffect } from "react";

const ThemeToggler = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "winter";
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.removeAttribute("data-theme");
    htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const daisyThemes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  return (
    <div title="Change Theme" className="dropdown dropdown-end block">
      <div
        tabIndex={0}
        role="button"
        className="btn group btn-sm gap-1.5 px-1.5 btn-ghost"
        aria-label="Change Theme"
      >
        <div className="bg-base-100 group-hover:border-base-content/20 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1 transition-colors">
          <div className="bg-base-content size-1 rounded-full" />
          <div className="bg-primary size-1 rounded-full" />
          <div className="bg-secondary size-1 rounded-full" />
          <div className="bg-accent size-1 rounded-full" />
        </div>
        <svg
          width="12px"
          height="12px"
          className="mt-px hidden size-2 fill-current opacity-60 sm:inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </div>

      <div
        tabIndex={0}
        className="dropdown-content bg-base-200 text-base-content rounded top-px h-[30.5rem] max-h-[calc(100vh-8.6rem)] overflow-y-auto ring ring-base-content/50 mt-16"
      >
        <ul className="menu w-56">
          <li className="menu-title text-xs">Theme</li>
          {daisyThemes.map((t) => (
            <li key={t}>
              <button
                onClick={() => setTheme(t)}
                className={`gap-3 p-2 rounded-none ${
                  theme === t ? "[&_svg]:visible" : ""
                }`}
                style={{ boxShadow: "none", borderBottom:"1px solid #d1d5db" }}
              >
                <div
                  data-theme={t}
                  className="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-lg"
                >
                  <div className="bg-base-content size-1 rounded-full" />
                  <div className="bg-primary size-1 rounded-full" />
                  <div className="bg-secondary size-1 rounded-full" />
                  <div className="bg-accent size-1 rounded-full" />
                </div>
                <div className="w-32 truncate">{t}</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="invisible h-3 w-3 shrink-0"
                >
                  <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ThemeToggler;
