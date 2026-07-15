import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-14 border border-white/15 border-t border-t-(--color-border) bg-black/35 text-white backdrop-blur-[2px] shadow-md"
      role="navigation"
      aria-label="Bottom"
      style={{
        boxShadow: "var(--shadow-md)",
        paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
      }}
    >
      <div className="mx-auto grid h-full max-w-180 grid-cols-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 no-underline ${
              isActive
                ? "text-(--color-text)"
                : "text-(--color-text-secondary)"
            }`
          }
        >
          <span className="leading-none" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
            </svg>
          </span>

          <span className="text-xs">
            Home
          </span>
        </NavLink>

        <NavLink
          to="/saved"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 no-underline ${
              isActive
                ? "text-(--color-text)"
                : "text-(--color-text-secondary)"
            }`
          }
        >
          <span className="leading-none" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
            </svg>
          </span>

          <span className="text-xs">
            Saved
          </span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;