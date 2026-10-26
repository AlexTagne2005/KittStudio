import React from 'react';
import { Sparkles, Globe, History, Layers, ShieldCheck, Zap } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../utils/i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenHistory: () => void;
  onOpenBrandKit: () => void;
  currentProjectTitle?: string;
  hasProjects: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenHistory,
  onOpenBrandKit,
  currentProjectTitle,
  hasProjects,
}) => {
  const t = getT(language);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base md:text-lg font-['Cabinet_Grotesk']">
                KittStudio
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                AI Kit
              </span>
            </div>
            {currentProjectTitle && (
              <p className="text-xs text-slate-400 max-w-[140px] md:max-w-xs truncate hidden sm:block">
                {currentProjectTitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* API Cost badge */}
          <div
            title={t.qualityControl}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Éco-API ⚡</span>
          </div>

          {/* Brand Kit button */}
          <button
            onClick={onOpenBrandKit}
            aria-label={t.brandKitTitle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
            title={t.brandKitTitle}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{language === 'fr' ? 'Charte Marque' : 'Brand Kit'}</span>
          </button>

          {/* History button */}
          <button
            onClick={onOpenHistory}
            aria-label={t.historyTitle}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
            title={t.historyTitle}
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">{t.historyTitle}</span>
            {hasProjects && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 absolute -top-0.5 -right-0.5" />
            )}
          </button>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => onLanguageChange('fr')}
              aria-pressed={language === 'fr'}
              className={`px-2 py-1 rounded-md text-xs font-bold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                language === 'fr'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              aria-pressed={language === 'en'}
              className={`px-2 py-1 rounded-md text-xs font-bold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
