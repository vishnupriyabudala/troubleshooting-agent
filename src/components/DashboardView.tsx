import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Ticket,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Wifi,
  Flame,
  Laptop,
  Globe,
  Printer,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { DashboardStats } from '../types.ts';

interface DashboardViewProps {
  stats: DashboardStats | null;
  isLoading: boolean;
  onStartDiagnosis: (problemText: string) => void;
  onOpenConversation: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  isLoading,
  onStartDiagnosis,
  onOpenConversation,
  onNavigateTab
}) => {
  const commonCategories = [
    {
      category: 'Network',
      title: 'Wi-Fi & Internet Drops',
      icon: Wifi,
      defaultProblem: 'My laptop is connected to Wi-Fi but websites are not opening.'
    },
    {
      category: 'Hardware',
      title: 'Overheating & Fan Noise',
      icon: Flame,
      defaultProblem: 'My laptop is extremely hot and the fan is loud.'
    },
    {
      category: 'Performance',
      title: 'Slow Laptop & 100% Disk',
      icon: Laptop,
      defaultProblem: 'My laptop is very slow and freezing with high disk usage.'
    },
    {
      category: 'Browser',
      title: 'Browser Crashes & Tabs',
      icon: Globe,
      defaultProblem: 'My Chrome keeps closing unexpectedly with an Aw Snap error.'
    },
    {
      category: 'Printer',
      title: 'Printer Offline / Queue Stuck',
      icon: Printer,
      defaultProblem: 'My printer is connected but not printing documents.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">System Diagnostic Dashboard</h1>
          </div>
          <p className="text-sm text-slate-400">
            Real-time analytics and telemetry connected directly to your persistent SQLite diagnostic database.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('agent')}
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start New Diagnosis</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Issues */}
        <div
          onClick={() => onNavigateTab('issues')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between text-amber-400">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-amber-300">
              View Issues
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white tracking-tight">
              {isLoading ? '...' : stats?.activeIssues ?? 0}
            </p>
            <p className="text-xs text-slate-400 font-medium">Active Diagnoses in Progress</p>
          </div>
        </div>

        {/* Resolved Issues */}
        <div
          onClick={() => onNavigateTab('issues')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-emerald-300">
              Resolved
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white tracking-tight">
              {isLoading ? '...' : stats?.resolvedIssues ?? 0}
            </p>
            <p className="text-xs text-slate-400 font-medium">Successfully Resolved</p>
          </div>
        </div>

        {/* Open Support Tickets */}
        <div
          onClick={() => onNavigateTab('tickets')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between text-rose-400">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-rose-300">
              Tickets
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white tracking-tight">
              {isLoading ? '...' : stats?.openTickets ?? 0}
            </p>
            <p className="text-xs text-slate-400 font-medium">Escalated Support Tickets</p>
          </div>
        </div>

        {/* Knowledge Base Trees */}
        <div
          onClick={() => onNavigateTab('knowledge')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between text-sky-400">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-sky-300">
              KB Trees
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white tracking-tight">8 Trees</p>
            <p className="text-xs text-slate-400 font-medium">Loaded Knowledge Domains</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Conversations & Problem Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Diagnostic Conversations (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <h2 className="text-base font-bold text-white">Recent Diagnostic Sessions</h2>
            </div>
            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats?.recentConversations && stats.recentConversations.length > 0 ? (
            <div className="space-y-2.5">
              {stats.recentConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onOpenConversation(conv.id)}
                  className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-sky-300 truncate">
                        {conv.title}
                      </span>
                      {conv.category && (
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {conv.category}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {new Date(conv.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        conv.status === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : conv.status === 'ESCALATED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {conv.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 space-y-2">
              <FolderOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-medium">No diagnostic sessions recorded yet.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Start your first interactive diagnosis by clicking the button above or describing your problem.
              </p>
            </div>
          )}
        </div>

        {/* Common Problem Categories (1 col) */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-white">Common Problem Categories</h2>
          </div>
          <p className="text-xs text-slate-400">
            Launch verified step-by-step diagnostic trees directly:
          </p>

          <div className="space-y-2">
            {commonCategories.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onStartDiagnosis(item.defaultProblem)}
                  className="w-full p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 text-sky-400 group-hover:text-sky-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200 group-hover:text-white">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-500">{item.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
