import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Ticket,
  Clock,
  ChevronRight,
  Filter,
  X,
  RefreshCw,
  Search,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { Issue, TroubleshootingStep } from '../types.ts';

interface IssuesViewProps {
  onContinueTroubleshooting: (problemText: string, problemId?: string) => void;
  onViewTicket: (ticketId: string) => void;
}

export const IssuesView: React.FC<IssuesViewProps> = ({
  onContinueTroubleshooting,
  onViewTicket
}) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issueSteps, setIssueSteps] = useState<TroubleshootingStep[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const fetchIssues = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/issues?status=${filterStatus}`);
      const data = await res.json();
      setIssues(data.issues || []);
    } catch (e) {
      console.error('Failed to fetch issues:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [filterStatus]);

  const handleOpenIssue = async (issue: Issue) => {
    setSelectedIssue(issue);
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`/api/issues/${issue.id}`);
      const data = await res.json();
      setIssueSteps(data.steps || []);
    } catch (e) {
      console.error('Failed to load issue details:', e);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    if (!confirm('Are you sure you want to delete this issue record?')) return;
    try {
      const res = await fetch(`/api/issues/${issueId}`, { method: 'DELETE' });
      if (res.ok) {
        setIssues((prev) => prev.filter((i) => i.id !== issueId));
        if (selectedIssue?.id === issueId) {
          setSelectedIssue(null);
        }
      }
    } catch (e) {
      console.error('Failed to delete issue:', e);
    }
  };

  const handleMarkResolved = async (issueId: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'RESOLVED',
          resolution_summary: 'Marked resolved manually by engineer.'
        })
      });
      if (res.ok) {
        setIssues((prev) =>
          prev.map((i) =>
            i.id === issueId
              ? { ...i, status: 'RESOLVED', resolution_summary: 'Marked resolved manually by engineer.' }
              : i
          )
        );
        if (selectedIssue?.id === issueId) {
          setSelectedIssue((prev) =>
            prev ? { ...prev, status: 'RESOLVED', resolution_summary: 'Marked resolved manually by engineer.' } : null
          );
        }
      }
    } catch (e) {
      console.error('Failed to mark resolved:', e);
    }
  };

  const filtered = issues.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      i.id.toLowerCase().includes(q) ||
      i.problem_text.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Technical Issues</h1>
          <p className="text-sm text-slate-400">
            Audit history of your technical diagnoses, troubleshooting steps, and resolution statuses.
          </p>
        </div>

        <button
          onClick={fetchIssues}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          title="Refresh Issues"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'IN PROGRESS', 'RESOLVED', 'ESCALATED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === status
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issue ID or problem..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Issues Table / List */}
      {isLoading ? (
        <div className="text-center py-16 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mx-auto" />
          <p className="text-xs text-slate-400">Loading issues from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400 font-medium">No technical issues found.</p>
          <p className="text-xs text-slate-500">
            {filterStatus !== 'ALL'
              ? `No issues with status '${filterStatus}'. Try clearing filters.`
              : 'Launch a new diagnosis from the AI Support Agent to create your first issue.'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Issue ID</th>
                  <th className="py-3.5 px-4">Problem Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => handleOpenIssue(issue)}
                    className="hover:bg-slate-800/50 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      {issue.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate font-medium text-slate-200">
                      {issue.problem_text}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {issue.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                          issue.severity === 'CRITICAL'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : issue.severity === 'HIGH'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          issue.status === 'RESOLVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : issue.status === 'ESCALATED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-sky-400 group-hover:text-sky-300 font-semibold flex items-center gap-1 ml-auto">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issue Details Modal Drawer */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                    {selectedIssue.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      selectedIssue.status === 'RESOLVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : selectedIssue.status === 'ESCALATED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {selectedIssue.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{selectedIssue.problem_text}</h3>
              </div>

              <button
                onClick={() => setSelectedIssue(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Metadata Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Category</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedIssue.category}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Severity</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedIssue.severity}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Confidence</span>
                  <p className="font-semibold text-slate-200 mt-0.5">
                    {Math.round(selectedIssue.confidence * 100)}%
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Date</span>
                  <p className="font-semibold text-slate-200 mt-0.5">
                    {new Date(selectedIssue.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Resolution / Escalation Note */}
              {selectedIssue.resolution_summary && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Diagnostic Conclusion:
                  </span>
                  <p className="text-slate-200 leading-relaxed">{selectedIssue.resolution_summary}</p>
                </div>
              )}

              {/* Troubleshooting Step Audit History */}
              <div className="space-y-3">
                <p className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Troubleshooting Steps Attempted ({issueSteps.length})
                </p>

                {isLoadingDetails ? (
                  <div className="py-6 text-center text-slate-400">Loading steps...</div>
                ) : issueSteps.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 text-center">
                    No steps recorded for this session.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {issueSteps.map((step) => (
                      <div
                        key={step.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sky-400 font-bold">Step {step.step_number}</span>
                          <span className="font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                            {step.user_response || 'Pending'}
                          </span>
                        </div>
                        <p className="text-slate-200 font-medium">{step.question}</p>
                        {step.instruction && (
                          <p className="text-slate-400 font-mono text-[11px] whitespace-pre-line bg-slate-900/60 p-2 rounded">
                            {step.instruction}
                          </p>
                        )}
                        {step.outcome && (
                          <p className="text-slate-400 italic text-[11px]">Outcome: {step.outcome}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteIssue(selectedIssue.id)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition flex items-center gap-1"
                  title="Delete Issue"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedIssue.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleMarkResolved(selectedIssue.id)}
                    className="px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedIssue(null);
                    onContinueTroubleshooting(selectedIssue.problem_text, selectedIssue.matched_problem_id || undefined);
                  }}
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Re-run Diagnosis</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
