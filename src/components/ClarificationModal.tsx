import React from 'react';
import { HelpCircle, X, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface ClarificationModalProps {
  isOpen: boolean;
  message: string;
  categories: string[];
  onSelectCategory: (category: string) => void;
  onClose: () => void;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  isOpen,
  message,
  categories,
  onSelectCategory,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Clarification Needed
            </span>
            <h3 className="text-base font-bold text-white">Let's Narrow Down the Issue</h3>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">{message}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Which category matches what you are seeing?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 text-left transition flex items-center justify-between group"
              >
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">{cat}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400 transition" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
