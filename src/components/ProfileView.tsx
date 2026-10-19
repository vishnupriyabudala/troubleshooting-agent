import React from 'react';
import { UserCheck, Shield, Key, Clock, LogOut, CheckCircle2, User as UserIcon } from 'lucide-react';
import { User } from '../types.ts';

interface ProfileViewProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onOpenAuth, onLogout }) => {
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
          <UserIcon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Guest Session</h2>
        <p className="text-xs text-slate-400">
          You are currently operating in guest mode. Sign in to sync your diagnostic tickets and access your profile history.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
        >
          Sign In or Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Engineer Profile & Credentials</h1>
        <p className="text-sm text-slate-400">
          User account information, secure authentication status, and diagnostic authorization levels.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-sky-500/20">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">User ID</span>
            <p className="font-mono text-xs text-slate-200">{user.id}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Security Standard</span>
            <p className="text-xs text-emerald-400 font-medium">Scrypt Salted Hash</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Account Created</span>
            <p className="text-xs text-slate-200">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Active authenticated session stored securely</span>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
