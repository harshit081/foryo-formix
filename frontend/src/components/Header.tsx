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
          <div className="w-8 h-8 rounded-lg theme-btn-primary flex items-center justify-center font-bold text-white font-display text-base shadow-sm">
            F
          </div>
          <span className="text-base font-bold font-display tracking-tight text-theme-text-main hidden sm:inline">
            FormsPro
          </span>
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
