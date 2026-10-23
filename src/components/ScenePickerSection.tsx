import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Check,
  CheckSquare,
  Square,
  ArrowRight,
  ChevronLeft,
  Coffee,
  Shirt,
  Tv,
  Box,
  Home,
  Laptop,
  Compass,
  TreePine,
  Instagram,
  Share2,
} from 'lucide-react';
import { BrandKit, Language, ProductData, SceneCategory, SceneItem } from '../types';
import { getT } from '../utils/i18n';

interface ScenePickerSectionProps {
  product: ProductData;
  brandKit: BrandKit;
  onUpdateBrandKit: (kit: BrandKit) => void;
  availableScenes: SceneItem[];
  selectedSceneIds: string[];
  onToggleScene: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onStartGeneration: () => void;
  onBack: () => void;
  language: Language;
}

export const ScenePickerSection: React.FC<ScenePickerSectionProps> = ({
  product,
  brandKit,
  onUpdateBrandKit,
  availableScenes,
  selectedSceneIds,
  onToggleScene,
  onSelectAll,
  onDeselectAll,
  onStartGeneration,
  onBack,
  language,
}) => {
  const t = getT(language);
  const [activeTab, setActiveTab] = useState<'all' | SceneCategory>('all');
  const [showBrandPanel, setShowBrandPanel] = useState<boolean>(false);

  const filteredScenes = availableScenes.filter((s) => {
    if (activeTab === 'all') return true;
    return s.category === activeTab;
  });

  const getSceneIcon = (id: string) => {
    switch (id) {
      case 'mockup-mug':
        return Coffee;
      case 'mockup-tshirt':
        return Shirt;
      case 'mockup-billboard':
        return Tv;
      case 'mockup-packaging':
        return Box;
      case 'lifestyle-kitchen':
        return Home;
      case 'lifestyle-desk':
        return Laptop;
      case 'lifestyle-cafe':
        return Compass;
      case 'lifestyle-nature':
        return TreePine;
      case 'social-story':
      case 'social-square':
        return Instagram;
      default:
        return Share2;
    }
  };

  const tonesList = [
    { id: 'Luxe & Élégant', label: t.toneLuxury },
    { id: 'Audacieux & Fun', label: t.toneBold },
    { id: 'Naturel & Éco-responsable', label: t.toneEco },
    { id: 'Minimaliste & Tech', label: t.toneMinimal },
    { id: 'Artisanal & Chaleureux', label: t.toneArtisanal },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Étape 3 &bull; Sélection du Pack Marketing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Cabinet_Grotesk']">
          {t.scenesTitle}
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
          {t.scenesSubtitle}
        </p>
      </div>

      {/* Brand Tone Quick Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">
              {brandKit.brandName || product.productName}
            </p>
            <p className="text-[11px] text-slate-400">
              {t.brandTone} : <strong className="text-amber-400">{brandKit.toneOfVoice}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowBrandPanel(!showBrandPanel)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            {showBrandPanel ? (language === 'fr' ? 'Fermer les réglages' : 'Close settings') : (language === 'fr' ? 'Ajuster la voix de marque' : 'Tweak brand voice')}
          </button>
        </div>
      </div>

      {/* Expandable Brand Tone Adjuster */}
      {showBrandPanel && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.brandName}
              </label>
              <input
                type="text"
                value={brandKit.brandName}
                onChange={(e) => onUpdateBrandKit({ ...brandKit, brandName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.brandTone}
              </label>
              <select
                value={brandKit.toneOfVoice}
                onChange={(e) => onUpdateBrandKit({ ...brandKit, toneOfVoice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
              >
                {tonesList.map((tone) => (
                  <option key={tone.id} value={tone.id}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Selection Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.filterAll} ({availableScenes.length})
          </button>
          <button
            onClick={() => setActiveTab('mockups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'mockups'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Mockups
          </button>
          <button
            onClick={() => setActiveTab('lifestyle')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'lifestyle'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Lifestyle
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'social'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Social
          </button>
        </div>

        {/* Batch Select Controls */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
          <span className="text-slate-400 font-medium">
            {t.selectedScenesCount(selectedSceneIds.length)}
          </span>
          <button
            onClick={onSelectAll}
            className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            {t.selectAll}
          </button>
          <span className="text-slate-600">&bull;</span>
          <button
            onClick={onDeselectAll}
            className="text-slate-400 hover:text-slate-300 cursor-pointer"
          >
            {t.deselectAll}
          </button>
        </div>
      </div>

      {/* Grid of Scene Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenes.map((scene) => {
          const isSelected = selectedSceneIds.includes(scene.id);
          const Icon = getSceneIcon(scene.id);

          return (
            <div
              key={scene.id}
              onClick={() => onToggleScene(scene.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {scene.formatLabel}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'border border-slate-700 bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {scene.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {scene.description}
                  </p>
                </div>
              </div>

              {/* Reference preview thumbnail */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="capitalize text-slate-400 font-medium">
                  {scene.category} &bull; Ratio {scene.aspectRatio}
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  Produit 100% fidèle
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{language === 'fr' ? 'Retour au détourage' : 'Back to studio'}</span>
        </button>

        <button
          disabled={selectedSceneIds.length === 0}
          onClick={onStartGeneration}
          className={`w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
            selectedSceneIds.length > 0
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 scale-[1.01]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {language === 'fr'
              ? `Générer le Kit Marketing (${selectedSceneIds.length} visuels)`
              : `Generate Marketing Kit (${selectedSceneIds.length} visuals)`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
