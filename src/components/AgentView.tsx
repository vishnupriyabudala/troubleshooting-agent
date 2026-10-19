import React, { useState } from 'react';
import {
  Send,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Ticket,
  ChevronRight,
  Sparkles,
  Layers,
  Flame,
  Wifi,
  Laptop,
  Globe,
  Printer,
  HardDrive,
  Cpu,
  Star,
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';
import { DiagnosticSessionState, DecisionOption } from '../types.ts';
import {
  LanguageCode,
  COMMON_PROMPTS_TRANSLATED,
  getTranslation,
  translateOptionLabel,
  getLocalizedNode
} from '../i18n/translations.ts';
import { LanguageSelector } from './LanguageSelector.tsx';

interface AgentViewProps {
  session: DiagnosticSessionState | null;
  isLoading: boolean;
  onStartDiagnosis: (problemText: string, manualProblemId?: string) => Promise<void>;
  onStepResponse: (response: string) => Promise<void>;
  onEscalateManual: () => Promise<void>;
  onResetSession: () => void;
  onViewTicket: (ticketId: string) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const AgentView: React.FC<AgentViewProps> = ({
  session,
  isLoading,
  onStartDiagnosis,
  onStepResponse,
  onEscalateManual,
  onResetSession,
  onViewTicket,
  currentLanguage,
  onLanguageChange
}) => {
  const [problemInput, setProblemInput] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  const [copiedInstruction, setCopiedInstruction] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Localized active step content
  const localizedStep = session
    ? getLocalizedNode(session.currentNodeId, currentLanguage, session.question, session.instruction)
    : { question: '', instruction: '' };

  const handleCopyInstruction = () => {
    const textToCopy = localizedStep.instruction || session?.instruction;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedInstruction(true);
    setTimeout(() => setCopiedInstruction(false), 2000);
  };

  const handleCustomResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customResponse.trim() || isLoading) return;
    onStepResponse(customResponse.trim());
    setCustomResponse('');
  };

  const sampleIcons = [Wifi, Flame, Laptop, Globe, Printer, HardDrive];
  const translatedPrompts = COMMON_PROMPTS_TRANSLATED[currentLanguage] || COMMON_PROMPTS_TRANSLATED.en;
  const sampleProblems = translatedPrompts.map((sample, idx) => ({
    label: sample.label,
    icon: sampleIcons[idx] || Laptop,
    text: sample.text
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemInput.trim() || isLoading) return;
    onStartDiagnosis(problemInput.trim());
  };

  const handleSelectSample = (text: string) => {
    setProblemInput(text);
    onStartDiagnosis(text);
  };

  const handleSendFeedback = async () => {
    if (!session?.issueId) return;
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId: session.issueId,
          rating: feedbackRating,
          comments: feedbackNotes
        })
      });
      setFeedbackSubmitted(true);
    } catch (e) {
      console.error('Failed to submit feedback:', e);
    }
  };

  // 1. Initial Prompt Input Screen (when no active diagnosis)
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{getTranslation(currentLanguage, 'activeEngine')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {getTranslation(currentLanguage, 'heroTitle')}
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {getTranslation(currentLanguage, 'heroDesc')}
          </p>
        </div>

        {/* Input Box Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-950/50 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                placeholder={getTranslation(currentLanguage, 'inputPlaceholder')}
                rows={3}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span>Rule Classifier + Decision Engine Ready</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={onLanguageChange}
                />
                <button
                  type="submit"
                  disabled={!problemInput.trim() || isLoading}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{getTranslation(currentLanguage, 'analyzing')}</span>
                    </>
                  ) : (
                    <>
                      <span>{getTranslation(currentLanguage, 'startDiagnosis')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Example Scenarios */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {getTranslation(currentLanguage, 'chooseScenario')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {sampleProblems.map((sample, idx) => {
                const Icon = sample.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(sample.text)}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition group"
                  >
                    <div className="p-2 rounded-lg bg-slate-900 text-sky-400 group-hover:text-sky-300 group-hover:bg-slate-800 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-white">
                        {sample.label}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {sample.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Phase 1 Architecture Pipeline Explainer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
            <span className="font-mono text-sky-400 font-bold">01. NLP Classifier</span>
            <p className="text-slate-400">Classifies domain, extracts keywords, maps to problem templates.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
            <span className="font-mono text-sky-400 font-bold">02. Knowledge Base</span>
            <p className="text-slate-400">Retrieves symptoms, causes, and verified diagnostic trees.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
            <span className="font-mono text-sky-400 font-bold">03. State Machine</span>
            <p className="text-slate-400">Evaluates answers step-by-step; no premature bulk answers.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
            <span className="font-mono text-sky-400 font-bold">04. Escalation</span>
            <p className="text-slate-400">Generates formal support tickets with structured audit logs.</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Diagnostic Session Screen
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Session Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
              {session.category}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
              session.severity === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : session.severity === 'HIGH'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {session.severity} Severity
            </span>
            <span className="text-xs text-slate-400 font-mono">Issue: {session.issueId}</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">{session.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Chatbot Language Selector */}
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />

          {!session.isComplete && (
            <button
              onClick={onEscalateManual}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{getTranslation(currentLanguage, 'escalateManual')}</span>
            </button>
          )}

          <button
            onClick={onResetSession}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{getTranslation(currentLanguage, 'newProblem')}</span>
          </button>
        </div>
      </div>

      {/* Identified Causes Accordion/Card */}
      {session.possibleCauses && session.possibleCauses.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>{getTranslation(currentLanguage, 'identifiedCauses')}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {session.possibleCauses.map((cause, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-sky-400 font-bold">•</span>
                <span>{cause}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostic Timeline: Previous Steps Attempted */}
      {session.history && session.history.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Troubleshooting Steps Progress ({session.history.length} completed)
          </p>
          <div className="space-y-2">
            {session.history.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {getTranslation(currentLanguage, 'step')} {step.stepNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-200">{step.question}</span>
                  </div>
                  {step.summary && (
                    <p className="text-[11px] text-slate-400 italic pl-1">Note: {step.summary}</p>
                  )}
                </div>

                <div className="shrink-0">
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {translateOptionLabel(currentLanguage, step.userResponse)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE STEP CARD (When in progress) */}
      {!session.isComplete && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 shadow-xl shadow-slate-950/60 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold text-xs">
                {session.stepNumber}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                {getTranslation(currentLanguage, 'diagnosticStep')} {session.stepNumber}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Node: {session.currentNodeId}</span>
          </div>

          {/* Detailed Diagnostic Instruction */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative group">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {getTranslation(currentLanguage, 'recommendedAction')}
              </p>
              <button
                type="button"
                onClick={handleCopyInstruction}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition"
                title="Copy instructions to clipboard"
              >
                {copiedInstruction ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{getTranslation(currentLanguage, 'copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{getTranslation(currentLanguage, 'copy')}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-100 whitespace-pre-line leading-relaxed font-mono">
              {localizedStep.instruction || session.instruction}
            </p>
          </div>

          {/* Diagnostic Question */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <HelpCircle className="w-5 h-5 text-sky-400 shrink-0" />
              <span>{localizedStep.question || session.question}</span>
            </div>

            {/* Interactive Decision Tree Option Buttons */}
            <div className="pt-1 space-y-3">
              <p className="text-xs text-slate-400 font-medium">
                {getTranslation(currentLanguage, 'selectFinding')}
              </p>
              <div className="flex flex-wrap gap-3">
                {session.options.map((optLabel, idx) => {
                  const isYes = optLabel.toUpperCase().includes('YES');
                  const isNo = optLabel.toUpperCase().includes('NO');
                  const displayLabel = translateOptionLabel(currentLanguage, optLabel);
                  return (
                    <button
                      key={idx}
                      onClick={() => onStepResponse(optLabel)}
                      disabled={isLoading}
                      className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition shadow-lg flex items-center gap-2 ${
                        isYes
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                          : isNo
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                          : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>{displayLabel}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Or Type a Custom Answer */}
              <div className="pt-2 border-t border-slate-800/80">
                <form onSubmit={handleCustomResponseSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={customResponse}
                    onChange={(e) => setCustomResponse(e.target.value)}
                    placeholder={getTranslation(currentLanguage, 'orTypeAnswer')}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={!customResponse.trim() || isLoading}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>{getTranslation(currentLanguage, 'send')}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESOLVED STATE CARD */}
      {session.isComplete && session.status === 'RESOLVED' && (
        <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <span>{getTranslation(currentLanguage, 'issueResolved')}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{getTranslation(currentLanguage, 'outcomeConfirmed')}</h3>
              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                {session.resolutionText || 'Your technical issue has been successfully resolved through guided troubleshooting.'}
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          {!feedbackSubmitted ? (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <p className="text-xs font-semibold text-slate-300">{getTranslation(currentLanguage, 'feedbackPrompt')}</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-400 ml-2 font-medium">{feedbackRating} / 5 Stars</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Optional comments or feedback..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={handleSendFeedback}
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
                >
                  {getTranslation(currentLanguage, 'submitFeedback')}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{getTranslation(currentLanguage, 'feedbackRecorded')}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onResetSession}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition"
            >
              {getTranslation(currentLanguage, 'startAnother')}
            </button>
          </div>
        </div>
      )}

      {/* ESCALATED STATE CARD */}
      {session.isComplete && session.status === 'ESCALATED' && (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-semibold">
                <span>{getTranslation(currentLanguage, 'escalatedSupport')}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{getTranslation(currentLanguage, 'ticketGenerated')}</h3>
              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                {session.escalationReason || 'Automated troubleshooting exhausted without resolution. A formal ticket has been filed with full diagnostics.'}
              </p>
            </div>
          </div>

          {session.ticket && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-sky-400" />
                  <span className="font-mono font-bold text-sky-400 text-sm">{session.ticket.id}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
                    {session.ticket.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    Status: {session.ticket.status}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p><span className="text-slate-200 font-medium">Issue Summary:</span> {session.ticket.problem_description}</p>
                <p><span className="text-slate-200 font-medium">Attempted Steps Logged:</span> {session.ticket.steps_attempted?.length || 0} steps logged in audit trail.</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => onViewTicket(session.ticket!.id)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                >
                  <span>{getTranslation(currentLanguage, 'viewTicket')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onResetSession}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              {getTranslation(currentLanguage, 'startAnother')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
