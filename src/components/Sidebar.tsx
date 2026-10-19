import React from 'react';
import {
  LayoutDashboard,
  Bot,
  AlertCircle,
  MessageSquare,
  Ticket,
  BookOpen,
  Settings,
  UserCheck,
  Cpu,
  LogIn,
  LogOut,
  User as UserIcon,
  Shield,
  Sparkles,
  Globe
} from 'lucide-react';
import { User } from '../types.ts';
import { LanguageCode } from '../i18n/translations.ts';
import { LanguageSelector } from './LanguageSelector.tsx';
import { ProfileCorner } from './ProfileCorner.tsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openTicketsCount?: number;
  activeIssuesCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openTicketsCount = 0,
  activeIssuesCount = 0,
  mobileOpen = false,
  onCloseMobile,
  user,
  onOpenAuth,
  onLogout,
  currentLanguage,
  onLanguageChange
}) => {
  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    {
      id: 'agent',
      label: 'AI Support Agent',
      icon: Bot,
      highlight: true,
      badge: 'Primary'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'issues',
      label: 'My Issues',
      icon: AlertCircle,
      badgeCount: activeIssuesCount > 0 ? activeIssuesCount : undefined
    },
    {
      id: 'history',
      label: 'Conversation History',
      icon: MessageSquare
    },
    {
      id: 'tickets',
      label: 'Support Tickets',
      icon: Ticket,
      badgeCount: openTicketsCount > 0 ? openTicketsCount : undefined
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: BookOpen
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserCheck
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-3.5 space-y-4 overflow-y-auto flex-1">
          {/* Prominent Profile on Left Corner (Sidebar Top) */}
          <ProfileCorner
            user={user}
            onOpenAuth={onOpenAuth}
            onLogout={onLogout}
            onNavigateToProfile={() => handleNavClick('profile')}
            variant="sidebar-top"
          />

          {/* Navigation list */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Main Application
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition group ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive
                          ? 'text-sky-400'
                          : item.highlight
                          ? 'text-sky-400 group-hover:text-sky-300'
                          : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {item.badge}
                    </span>
                  )}

                  {item.badgeCount !== undefined && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Phase 1 Architecture Card */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Phase 1 Architecture</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Rule Classifier → Diagnostic Trees → State Machine → Support Tickets.
            </p>
            <div className="pt-0.5 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-mono">SQLite + TS Engine Active</span>
            </div>
          </div>
        </div>

        {/* Bottom Pinned Controls */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950">
          {/* Language Selector Row */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Language:</span>
            </span>
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              compact={false}
            />
          </div>

          {/* Bottom Quick Sign Out / User Status */}
          <div className="pt-1">
            <ProfileCorner
              user={user}
              onOpenAuth={onOpenAuth}
              onLogout={onLogout}
              onNavigateToProfile={() => handleNavClick('profile')}
              variant="sidebar-bottom"
            />
          </div>
        </div>
      </aside>
    </>
  );
};
