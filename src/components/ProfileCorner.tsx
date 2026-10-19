import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  LogOut,
  LogIn,
  Shield,
  ChevronDown,
  UserCheck,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { User } from '../types.ts';

interface ProfileCornerProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateToProfile?: () => void;
  variant?: 'navbar-left' | 'sidebar-top' | 'sidebar-bottom';
}

export const ProfileCorner: React.FC<ProfileCornerProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onNavigateToProfile,
  variant = 'navbar-left'
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // -------------------------------------------------------------
  // VARIANT 1: Top-Left Header Corner (in Navbar)
  // -------------------------------------------------------------
  if (variant === 'navbar-left') {
    return (
      <div className="relative inline-block" ref={containerRef}>
        {user ? (
          <div className="flex items-center gap-1.5 p-1 pr-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-sm">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-left focus:outline-none"
              title="Open Profile Menu"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
              </div>
              <div className="hidden lg:block min-w-0 pr-1">
                <p className="text-xs font-bold text-slate-200 truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-sky-400 capitalize font-mono">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Direct 1-Click Sign Out Button on the Pill */}
            <button
              type="button"
              onClick={onLogout}
              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold transition shadow-sm"
            title="Sign In to TechAssist AI"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Profile</span>
          </button>
        )}

        {/* Dropdown Popover */}
        {dropdownOpen && user && (
          <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-mono capitalize">{user.role} • Active</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {onNavigateToProfile && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToProfile();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-400" />
                    <span>View Profile & Credentials</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 2: Top of Sidebar (Sidebar Left Corner)
  // -------------------------------------------------------------
  if (variant === 'sidebar-top') {
    return (
      <div className="p-3 mb-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
            <UserIcon className="w-3 h-3" />
            <span>Profile & Account</span>
          </span>
          {user && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Signed In</span>
            </span>
          )}
        </div>

        {user ? (
          <div className="space-y-2">
            <div
              onClick={onNavigateToProfile}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Click to view full profile"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow shrink-0">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-200 group-hover:text-sky-300 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                <span className="inline-block mt-0.5 text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/80">
              {onNavigateToProfile && (
                <button
                  type="button"
                  onClick={onNavigateToProfile}
                  className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition text-center"
                >
                  Profile
                </button>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="py-1 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] font-bold transition flex items-center justify-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Guest Mode</p>
                <p className="text-[10px] text-slate-400">Sign in to save issues & tickets</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] transition shadow flex items-center justify-center gap-1"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] transition flex items-center justify-center"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 3: Bottom of Sidebar
  // -------------------------------------------------------------
  return (
    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 transition flex items-center justify-between gap-2">
      {user ? (
        <>
          <div
            onClick={onNavigateToProfile}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 truncate group-hover:text-sky-300">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate capitalize font-mono">
                {user.role} • Online
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </>
      ) : (
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Guest User</span>
            </span>
            <span className="text-[10px] text-slate-500">Not logged in</span>
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Sign Up</span>
          </button>
        </div>
      )}
    </div>
  );
};
