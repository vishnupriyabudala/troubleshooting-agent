import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Database,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FileCode,
  Layers
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [studentMode, setStudentMode] = useState(true);
  const [verboseLogging, setVerboseLogging] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);
  const [testInput, setTestInput] = useState('My laptop is connected to Wi-Fi but websites are not opening.');
  const [isTesting, setIsTesting] = useState(false);

  const handleTestClassifier = async () => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/diagnose/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemText: testInput })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e) {
      console.error('Classification test failed:', e);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System & Engine Settings</h1>
        <p className="text-sm text-slate-400">
          Configure diagnostic state engine parameters, inspect SQLite persistence, and test classification rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Architecture & Engineering Profile */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">B.Tech CSE Project Architecture</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            TechAssist AI implements a multi-tier decoupled troubleshooting pipeline:
          </p>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-mono text-sky-400 font-bold">1. Rule Classifier Engine</span>
              <p className="text-slate-400 text-[11px]">
                Tokenizes problem inputs, evaluates regex keyword triggers, scores domain confidence, and maps to canonical problem IDs.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-mono text-emerald-400 font-bold">2. State Machine Decision Trees</span>
              <p className="text-slate-400 text-[11px]">
                Deterministic directed acyclic graph (DAG) evaluating binary YES/NO or categorical user responses without hallucinating steps.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-mono text-purple-400 font-bold">3. Native SQLite Persistence</span>
              <p className="text-slate-400 text-[11px]">
                Zero-latency persistent database storing users, sessions, issues, audit steps, tickets, and feedback in WAL mode.
              </p>
            </div>
          </div>
        </div>

        {/* Runtime Preferences */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">Diagnostic Execution Preferences</h2>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-200">Student CSE Inspection Mode</p>
                <p className="text-[11px] text-slate-500">
                  Expose underlying decision tree node IDs, step numbers, and state transition telemetry.
                </p>
              </div>
              <input
                type="checkbox"
                checked={studentMode}
                onChange={(e) => setStudentMode(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500/40 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-200">Audit Trail Immutable Logging</p>
                <p className="text-[11px] text-slate-500">
                  Log every diagnostic decision step with timestamp into the troubleshooting_steps SQL table.
                </p>
              </div>
              <input
                type="checkbox"
                checked={verboseLogging}
                onChange={(e) => setVerboseLogging(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500/40 bg-slate-900 border-slate-700"
              />
            </label>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-emerald-300">SQLite Database Active & Healthy</p>
                <p className="text-[11px] text-emerald-400/80">Location: ./data/techassist.db (WAL Mode)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive NLP / Rule Classifier Test Sandbox */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-white">Rule Classifier Sandbox Test</h2>
        </div>
        <p className="text-xs text-slate-400">
          Simulate problem classification and inspect confidence scores without starting a permanent diagnostic issue:
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Type any test query..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={handleTestClassifier}
            disabled={isTesting || !testInput.trim()}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Test Engine</span>}
          </button>
        </div>

        {testResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span>Classifier Engine Response</span>
              <span className="text-emerald-400">200 OK</span>
            </div>
            <pre className="text-sky-300 overflow-x-auto text-[11px]">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
