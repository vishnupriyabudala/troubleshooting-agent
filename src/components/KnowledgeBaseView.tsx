import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  X
} from 'lucide-react';
import { KBProblemEntry } from '../types.ts';

interface KnowledgeBaseViewProps {
  onTestProblemTree: (problemId: string, title: string) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ onTestProblemTree }) => {
  const [entries, setEntries] = useState<KBProblemEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  // New tree modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProblemId, setNewProblemId] = useState('');
  const [newCategory, setNewCategory] = useState('Hardware');
  const [newSeverity, setNewSeverity] = useState('MEDIUM');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newCauses, setNewCauses] = useState('');
  const [newStepInstruction, setNewStepInstruction] = useState('');
  const [newStepQuestion, setNewStepQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchKB = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/knowledge-base');
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (e) {
      console.error('Failed to load KB:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProblemId.trim() || !newStepQuestion.trim()) return;

    setIsSubmitting(true);
    try {
      const symptomsList = newSymptoms
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const causesList = newCauses
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const treeNodes = {
        start: {
          stepNumber: 1,
          instruction: newStepInstruction.trim() || 'Inspect the hardware connections and power cycling.',
          question: newStepQuestion.trim(),
          options: [
            {
              label: 'YES',
              isResolution: true,
              resolutionText: 'Basic reset step resolved the reported problem.'
            },
            {
              label: 'NO',
              isEscalation: true,
              escalationReason: 'Initial diagnostic step did not restore functionality. Support ticket escalated.'
            }
          ]
        }
      };

      const res = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: newProblemId.trim().toLowerCase().replace(/\s+/g, '-'),
          category: newCategory,
          title: newTitle.trim(),
          severity: newSeverity,
          symptoms: symptomsList.length > 0 ? symptomsList : ['Observed device malfunction'],
          possibleCauses: causesList.length > 0 ? causesList : ['Configuration or driver mismatch'],
          nodes: treeNodes
        })
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewProblemId('');
        setNewSymptoms('');
        setNewCauses('');
        setNewStepInstruction('');
        setNewStepQuestion('');
        await fetchKB();
      }
    } catch (err) {
      console.error('Failed to create tree:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchKB();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(entries.map((e) => e.category)))];

  const filtered = entries.filter((entry) => {
    const matchesCat = selectedCategory === 'ALL' || entry.category === selectedCategory;
    if (!matchesCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q) ||
      entry.problemId.toLowerCase().includes(q) ||
      entry.symptoms.some((s) => s.toLowerCase().includes(q)) ||
      entry.possibleCauses.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Technical Knowledge Base</h1>
          <p className="text-sm text-slate-400">
            Modular diagnostic decision trees powering TechAssist AI. Add or inspect troubleshooting trees without altering core application logic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Problem Tree</span>
          </button>

          <button
            onClick={fetchKB}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, causes, or title..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Entries List */}
      {isLoading ? (
        <div className="text-center py-20 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mx-auto" />
          <p className="text-xs text-slate-400">Loading diagnostic trees from knowledge base...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400 font-medium">No knowledge base entries matched your query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((entry) => {
            const isExpanded = expandedEntryId === entry.problemId;
            const nodeCount = Object.keys(entry.nodes || {}).length;
            return (
              <div
                key={entry.problemId}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition"
              >
                {/* Header Row */}
                <div className="p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                        {entry.problemId}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {entry.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          entry.severity === 'CRITICAL'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : entry.severity === 'HIGH'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {entry.severity}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                        {nodeCount} Diagnostic Nodes
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{entry.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onTestProblemTree(entry.problemId, entry.title)}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Test in AI Agent</span>
                    </button>

                    <button
                      onClick={() => setExpandedEntryId(isExpanded ? null : entry.problemId)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs">
                    {/* Symptoms & Causes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Symptoms */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                          Recognized Symptoms
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {entry.symptoms.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-sky-400">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Possible Causes */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                          Isolate Possible Causes
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {entry.possibleCauses.map((c, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-400">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Nodes Preview */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Decision Tree State Machine Nodes ({nodeCount})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(entry.nodes || {}).map(([nodeKey, node]) => (
                          <div key={nodeKey} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1">
                            <div className="flex items-center justify-between font-mono text-[10px]">
                              <span className="text-sky-400 font-bold">Node: {nodeKey} (Step {node.stepNumber})</span>
                              <span className="text-slate-500">{node.options?.length || 0} branches</span>
                            </div>
                            <p className="text-slate-200 font-medium line-clamp-1">{node.question}</p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {node.options?.map((opt, i) => (
                                <span
                                  key={i}
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                                    opt.isResolution
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : opt.isEscalation
                                      ? 'bg-rose-500/20 text-rose-400'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {opt.label} → {opt.isResolution ? 'RESOLVE' : opt.isEscalation ? 'ESCALATE' : opt.nextNodeId}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Diagnostic Tree Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                Knowledge Base Architect
              </span>
              <h2 className="text-lg font-bold text-white">Create New Troubleshooting Tree</h2>
              <p className="text-xs text-slate-400">
                Add a new verified problem template to the SQLite knowledge base without changing application code.
              </p>
            </div>

            <form onSubmit={handleCreateTree} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Problem Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Bluetooth Audio Stutter"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Problem ID (Slug)</label>
                  <input
                    type="text"
                    required
                    value={newProblemId}
                    onChange={(e) => setNewProblemId(e.target.value)}
                    placeholder="e.g. bluetooth-audio-lag"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {['Network', 'Hardware', 'Performance', 'Browser', 'Printer', 'Software', 'Operating System', 'Storage'].map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((sev) => (
                      <option key={sev} value={sev}>
                        {sev}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Symptoms (comma separated)</label>
                <input
                  type="text"
                  value={newSymptoms}
                  onChange={(e) => setNewSymptoms(e.target.value)}
                  placeholder="e.g. Audio cuts out, Crackling noise, Headset disconnects"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Possible Causes (comma separated)</label>
                <input
                  type="text"
                  value={newCauses}
                  onChange={(e) => setNewCauses(e.target.value)}
                  placeholder="e.g. 2.4GHz interference, Bluetooth driver buffer underrun, Power saving mode"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Step 1 Action / Instruction</label>
                <textarea
                  rows={2}
                  value={newStepInstruction}
                  onChange={(e) => setNewStepInstruction(e.target.value)}
                  placeholder="e.g. Disconnect the Bluetooth device, toggle Bluetooth OFF for 10 seconds, then toggle back ON."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Step 1 Diagnostic Question</label>
                <input
                  type="text"
                  required
                  value={newStepQuestion}
                  onChange={(e) => setNewStepQuestion(e.target.value)}
                  placeholder="e.g. Did toggling Bluetooth off and on restore clear audio?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Save to Knowledge Base</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
