import React from 'react';
import { ShieldCheck, User as UserIcon, LogOut, Terminal, Sparkles, RefreshCw, Menu } from 'lucide-react';
import { User } from '../types.ts';
import { LanguageCode } from '../i18n/translations.ts';
import { LanguageSelector } from './LanguageSelector.tsx';
import { ProfileCorner } from './ProfileCorner.tsx';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  onOpenAuth: () => void;
  onLogout: () => void;
  onStartNewDiagnosis: () => void;
  onToggleMobileSidebar?: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigateToProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onOpenAuth,
  onLogout,
  onStartNewDiagnosis,
  onToggleMobileSidebar,
  currentLanguage,
  onLanguageChange,
  onNavigateToProfile
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Brand & Left Corner Profile */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Terminal className="w-5 h-5 text-sky-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white tracking-tight">TECHASSIST <span className="text-sky-400">AI</span></span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
              v1.0 Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">Intelligent Technical Support, Step by Step</p>
        </div>

        {/* Profile on Left Corner */}
        <div className="hidden sm:block ml-2 pl-3 border-l border-slate-800">
          <ProfileCorner
            user={user}
            onOpenAuth={onOpenAuth}
            onLogout={onLogout}
            onNavigateToProfile={onNavigateToProfile}
            variant="navbar-left"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Language Selector */}
        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />

        <button
          onClick={onStartNewDiagnosis}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition shadow-sm shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Diagnosis</span>
        </button>

        {/* Mobile Left Corner Profile fallback if screen is small */}
        <div className="sm:hidden">
          <ProfileCorner
            user={user}
            onOpenAuth={onOpenAuth}
            onLogout={onLogout}
            onNavigateToProfile={onNavigateToProfile}
            variant="navbar-left"
          />
        </div>
      </div>
    </header>
  );
};
