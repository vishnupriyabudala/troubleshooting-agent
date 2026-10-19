import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  User,
  Clock,
  ChevronRight,
  RefreshCw,
  Ticket,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Conversation, Message } from '../types.ts';

interface ConversationsViewProps {
  onContinueTroubleshooting: (problemText: string, problemId?: string) => void;
  onViewTicket: (ticketId: string) => void;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  onContinueTroubleshooting
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
      if (data.conversations && data.conversations.length > 0 && !selectedConv) {
        handleSelectConv(data.conversations[0]);
      }
    } catch (e) {
      console.error('Failed to fetch conversations:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelectConv = async (conv: Conversation) => {
    setSelectedConv(conv);
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/conversations/${conv.id}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (e) {
      console.error('Failed to load messages:', e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Diagnostic Conversation History</h1>
        <p className="text-sm text-slate-400">
          Full message transcripts and interaction logs from past AI Support Agent troubleshooting sessions.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mx-auto" />
          <p className="text-xs text-slate-400">Loading conversation history...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400 font-medium">No previous conversations recorded.</p>
          <p className="text-xs text-slate-500">
            Start a diagnosis session from the AI Support Agent to generate conversation records.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversation List Sidebar */}
          <div className="md:col-span-1 space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {conversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500/30'
                      : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{conv.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        conv.status === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : conv.status === 'ESCALATED'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {conv.status}
                    </span>
                  </div>
                  <h3 className={`text-xs font-bold truncate ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                    {conv.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(conv.created_at).toLocaleString()}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Transcript Viewer */}
          <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[75vh] overflow-hidden shadow-xl">
            {/* Transcript Top Bar */}
            {selectedConv && (
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-white truncate">{selectedConv.title}</h2>
                  <p className="text-xs text-slate-400 font-mono">Session ID: {selectedConv.id}</p>
                </div>

                {selectedConv.problem_text && (
                  <button
                    onClick={() =>
                      onContinueTroubleshooting(selectedConv.problem_text!, selectedConv.matched_problem_id || undefined)
                    }
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Re-Diagnose</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Transcript Messages List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {isLoadingMessages ? (
                <div className="text-center py-16 space-y-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-sky-400 mx-auto" />
                  <p className="text-xs text-slate-400">Loading transcript messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-500">
                  Select a session to view dialogue transcript.
                </div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${
                          isUser
                            ? 'bg-indigo-600 text-white'
                            : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs space-y-1.5 leading-relaxed ${
                          isUser
                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                            : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.content}</p>
                        <p className={`text-[10px] ${isUser ? 'text-indigo-200 text-right' : 'text-slate-500'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
