import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../i18n/translations.ts';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 transition"
        title="Select AI Chatbot Language"
      >
        <span className="text-sm">{selected.flag}</span>
        {!compact && <span className="font-medium hidden sm:inline">{selected.nativeName}</span>}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 text-xs">
          <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800/80 mb-1">
            Chatbot Language
          </div>
          <div className="max-h-60 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition ${
                    isSelected
                      ? 'bg-sky-500/10 text-sky-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-500">({lang.name})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
