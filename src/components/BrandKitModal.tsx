import React, { useState } from 'react';
import { Layers, Sparkles, Check, Save, Download, Palette, Volume2, Target } from 'lucide-react';
import { BrandKit, Language } from '../types';
import { getT } from '../utils/i18n';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandKit: BrandKit;
  onSave: (kit: BrandKit) => void;
  language: Language;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({
  isOpen,
  onClose,
  brandKit,
  onSave,
  language,
}) => {
  if (!isOpen) return null;

  const t = getT(language);
  const [formData, setFormData] = useState<BrandKit>({ ...brandKit });
  const [savedToast, setSavedToast] = useState(false);

  const tonesList = [
    { id: 'Luxe & Élégant', label: t.toneLuxury },
    { id: 'Audacieux & Fun', label: t.toneBold },
    { id: 'Naturel & Éco-responsable', label: t.toneEco },
    { id: 'Minimaliste & Tech', label: t.toneMinimal },
    { id: 'Artisanal & Chaleureux', label: t.toneArtisanal },
  ];

  const handleSave = () => {
    onSave(formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                {t.brandKitTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.brandKitSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.brandName === 'Nom de la marque' ? 'Fermer' : 'Close'}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Brand Name & Tagline */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t.brandName}
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t.brandTagline}
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Ex: L'art du détail au quotidien"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Tone of Voice Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.brandTone}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tonesList.map((tone) => {
                const isSelected = formData.toneOfVoice === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, toneOfVoice: tone.id })}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-sm'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tone.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette (4 swatches with color picker) */}
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.brandColors}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Principale', key: 'primaryColor' as const },
                { label: 'Secondaire', key: 'secondaryColor' as const },
                { label: 'Accent', key: 'accentColor' as const },
                { label: 'Fond / Neutre', key: 'backgroundColor' as const },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-1">
                  <div className="relative w-full h-11 rounded-xl overflow-hidden border border-white/20 shadow-sm flex items-center justify-center">
                    <input
                      type="color"
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: formData[key] }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-medium block truncate">
                      {label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 font-bold block truncate">
                      {formData[key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.targetAudience}</span>
            </label>
            <textarea
              rows={2}
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="Ex: Passionnés de design, urbains 25-45 ans sensibles à l'authenticité"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Fermer
          </button>
          <button
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
          >
            {savedToast ? (
              <>
                <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>{t.brandKitSaved}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t.saveBrandKit}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
