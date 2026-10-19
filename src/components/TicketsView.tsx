import React, { useState, useEffect } from 'react';
import {
  Ticket,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
  CheckCircle2,
  ShieldAlert,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { SupportTicket } from '../types.ts';

interface TicketsViewProps {
  highlightTicketId?: string | null;
}

export const TicketsView: React.FC<TicketsViewProps> = ({ highlightTicketId }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(highlightTicketId || null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(data.tickets || []);
      if (highlightTicketId) {
        setExpandedTicketId(highlightTicketId);
      } else if (data.tickets && data.tickets.length > 0 && !expandedTicketId) {
        setExpandedTicketId(data.tickets[0].id);
      }
    } catch (e) {
      console.error('Failed to fetch tickets:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (e) {
      console.error('Failed to update ticket status:', e);
    }
  };

  const handleCopyReport = (ticket: SupportTicket) => {
    const report = [
      `TECHASSIST AI - ESCALATION SUPPORT TICKET`,
      `===========================================`,
      `Ticket ID: ${ticket.id}`,
      `Status: ${ticket.status}`,
      `Priority: ${ticket.priority} (${ticket.severity})`,
      `Category: ${ticket.category}`,
      `Problem: ${ticket.problem_description}`,
      `Escalation Reason: ${ticket.escalation_reason}`,
      `Created At: ${ticket.created_at}`,
      `-------------------------------------------`,
      `DIAGNOSTIC AUDIT TRAIL:`,
      ...ticket.steps_attempted.map(
        (s, idx) =>
          `Step ${idx + 1}: ${s.question}\nInstruction: ${s.instruction || 'None'}\nUser Response: ${s.userResponse}`
      ),
      `===========================================`
    ].join('\n\n');

    navigator.clipboard.writeText(report);
    setCopiedTicketId(ticket.id);
    setTimeout(() => setCopiedTicketId(null), 2500);
  };

  useEffect(() => {
    fetchTickets();
  }, [highlightTicketId]);

  const filtered = tickets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.problem_description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.priority.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Support Escalation Tickets</h1>
          <p className="text-sm text-slate-400">
            Formal technical support tickets generated when automated decision trees required engineering escalation.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          title="Refresh Tickets"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ticket ID or problem..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <div className="text-center py-20 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mx-auto" />
          <p className="text-xs text-slate-400">Loading support tickets from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
          <Ticket className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400 font-medium">No support tickets found.</p>
          <p className="text-xs text-slate-500">
            Tickets are automatically generated whenever a troubleshooting session reaches an escalation node or when you click "Escalate to Support".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;
            return (
              <div
                key={ticket.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                  className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-400 text-sm">{ticket.id}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {ticket.priority}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {ticket.category}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 mt-1">{ticket.problem_description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-[11px] text-slate-500 hidden sm:block">
                      <p>Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
                      <p className="text-slate-400 font-medium">{ticket.steps_attempted?.length || 0} steps logged</p>
                    </div>

                    <button className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Diagnostic Audit Trail */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs">
                    {/* Escalation Reason */}
                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">
                        Technical Escalation Trigger
                      </span>
                      <p className="text-slate-200 leading-relaxed">{ticket.escalation_reason}</p>
                    </div>

                    {/* Attempted Diagnostic Steps Audit */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Step-by-Step Diagnostic Audit Trail ({ticket.steps_attempted?.length || 0} steps)
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Immutable Log</span>
                      </div>

                      {ticket.steps_attempted && ticket.steps_attempted.length > 0 ? (
                        <div className="space-y-2">
                          {ticket.steps_attempted.map((step, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start justify-between gap-4"
                            >
                              <div className="space-y-1">
                                <span className="font-mono text-sky-400 font-bold">Step {step.step}</span>
                                <p className="text-slate-200 font-medium">{step.question}</p>
                                {step.instruction && (
                                  <p className="text-slate-400 font-mono text-[11px] bg-slate-950 p-2 rounded">
                                    {step.instruction}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                <span className="font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                                  {step.userResponse}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">No prior diagnostic steps logged.</p>
                      )}
                    </div>

                    {/* Ticket Management Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400">Change Status:</span>
                        {['OPEN', 'IN REVIEW', 'RESOLVED', 'CLOSED'].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateStatus(ticket.id, st)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition ${
                              ticket.status === st
                                ? 'bg-sky-500 text-slate-950 font-black'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleCopyReport(ticket)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        {copiedTicketId === ticket.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Report Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy Audit Report</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
