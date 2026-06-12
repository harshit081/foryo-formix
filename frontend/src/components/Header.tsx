import React from 'react';
import { LogOut, LogIn, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onLogin: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  mode: string;
  onModeChange: (mode: string) => void;
}

export default function Header({
  user,
  onLogout,
  onLogin,
  theme,
  onThemeChange,
  mode,
  onModeChange,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-theme-border-subtle bg-theme-card/75 backdrop-blur-md flex justify-between items-center px-8 z-40 transition-all duration-200">
      {/* Left section: Logo & Sandbox Alert */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 shrink-0 select-none">
            <defs>
              <linearGradient id="header-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6D5EF9" />
                <stop offset="25%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="75%" stopColor="#FF6B6B" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <path d="M12 2C12 2 12.5 8.5 19 9C12.5 9.5 12 16 12 16C12 16 11.5 9.5 5 9C11.5 8.5 12 2 12 2Z" fill="url(#header-spark-grad)" />
            <path d="M12 12C12 12 12.25 15.25 15.5 15.5C12.25 15.75 12 19 12 19C12 19 11.75 15.75 8.5 15.5C11.75 15.25 12 12 12 12Z" fill="url(#header-spark-grad)" opacity="0.8" />
            <path d="M18 4C18 4 18.15 5.95 20.1 6.1C18.15 6.25 18 8.2 18 8.2C18 8.2 17.85 6.25 15.9 6.1C17.85 5.95 18 4 18 4Z" fill="url(#header-spark-grad)" opacity="0.9" />
          </svg>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] font-bold text-[#A855F7] tracking-wider uppercase font-display select-none">Foryo</span>
            <span className="text-base font-extrabold font-display tracking-tight text-theme-text-main">
              Formix
            </span>
          </div>
        </div>

        {!user && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-theme-warning/20 bg-theme-warning/5 text-[10px] font-bold text-theme-warning uppercase tracking-wider animate-pulse">
            <span className="w-1 h-1 rounded-full bg-theme-warning"></span>
            <span>Sandbox Mode</span>
          </div>
        )}
      </div>

      {/* Middle section: Relocated Theme Switcher */}
      <div className="flex items-center gap-3 p-1 rounded-full bg-white/3 border border-theme-border-subtle">
        {/* Style selection */}
        <div className="flex gap-0.5">
          <button
            onClick={() => onThemeChange('glass')}
            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all duration-150 ${
              theme === 'glass'
                ? 'bg-theme-primary text-white shadow-sm'
                : 'text-theme-text-muted hover:text-theme-text-main'
            }`}
          >
            Glass
          </button>
          <button
            onClick={() => onThemeChange('neo-brutalism')}
            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all duration-150 ${
              theme === 'neo-brutalism'
                ? 'bg-theme-primary text-white shadow-sm'
                : 'text-theme-text-muted hover:text-theme-text-main'
            }`}
          >
            Brutalist
          </button>
          <button
            onClick={() => onThemeChange('minimalist')}
            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all duration-150 ${
              theme === 'minimalist'
                ? 'bg-theme-primary text-white shadow-sm'
                : 'text-theme-text-muted hover:text-theme-text-main'
            }`}
          >
            Minimalist
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-3 bg-theme-border-subtle"></div>

        {/* Light/Dark Toggle */}
        <button
          onClick={() => onModeChange(mode === 'dark' ? 'light' : 'dark')}
          className="p-1 rounded-full text-theme-text-muted hover:text-theme-text-main hover:bg-white/5 cursor-pointer transition-colors"
          title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {mode === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>

      {/* Right section: Login Status */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-right min-w-0">
              <span className="text-xs font-semibold text-theme-text-main truncate leading-tight">
                {user.name || 'Google User'}
              </span>
              <span className="text-[10px] text-theme-text-muted truncate leading-none mt-0.5">
                {user.email}
              </span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-theme-primary/10 flex items-center justify-center font-bold text-theme-primary border border-theme-primary text-xs shrink-0 select-none">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-full hover:bg-white/5 text-theme-text-muted hover:text-theme-text-main cursor-pointer transition-colors"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="theme-btn-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogIn size={13} />
            <span>Connect Google</span>
          </button>
        )}
      </div>
    </header>
  );
}
