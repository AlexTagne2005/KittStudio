import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Sparkles, Check, ArrowRight, RotateCw, Loader2, Sliders, ChevronLeft } from 'lucide-react';
import { Language, ProductData, StudioStyle } from '../types';
import { getT } from '../utils/i18n';
import { generateStudioShotApi } from '../utils/api';
import { synthesizeStudioShot } from '../utils/visualSynthesizer';

interface StudioSectionProps {
  product: ProductData;
  language: Language;
  onConfirmStudio: (updatedProduct: ProductData) => void;
  onBack: () => void;
}

export const StudioSection: React.FC<StudioSectionProps> = ({
  product,
  language,
  onConfirmStudio,
  onBack,
}) => {
  const t = getT(language);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<StudioStyle>(product.studioStyle || 'clean-white');
  const [studioImage, setStudioImage] = useState<string>(product.studioImage || product.originalImage);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Trigger initial studio generation if not yet generated
  useEffect(() => {
    if (product.studioImage === product.originalImage) {
      triggerStudioGeneration('clean-white');
    }
  }, []);

  const triggerStudioGeneration = async (style: StudioStyle) => {
    setIsGenerating(true);
    setSelectedStyle(style);
    try {
      const res = await generateStudioShotApi(product.originalImage, style, 'low');
      if (res.studioImage && !res.fallback && res.studioImage !== product.originalImage) {
        setStudioImage(res.studioImage);
      } else {
        const synth = await synthesizeStudioShot(product.originalImage, style, product.colors);
        setStudioImage(synth);
      }
    } catch (err) {
      console.warn('Synthesizing studio shot:', err);
      const synth = await synthesizeStudioShot(product.originalImage, style, product.colors);
      setStudioImage(synth);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  const stylesList: { id: StudioStyle; label: string; desc: string }[] = [
    {
      id: 'clean-white',
      label: t.styleWhite,
      desc: language === 'fr' ? 'Fond blanc cyclorama e-commerce pur avec ombre douce au sol' : 'Pure white e-commerce cyclorama with soft contact shadow',
    },
    {
      id: 'pedestal',
      label: t.stylePedestal,
      desc: language === 'fr' ? 'Socle en pierre naturelle travertine et lumière douce dorée' : 'Natural stone pedestal with warm architectural light',
    },
    {
      id: 'dark-luxury',
      label: t.styleDark,
      desc: language === 'fr' ? 'Studio noir profond avec reflets spéculaires et éclairage dramatique' : 'Deep dark moody studio with crisp specular highlights',
    },
    {
      id: 'gradient-pastel',
      label: t.stylePastel,
      desc: language === 'fr' ? 'Dégradé subtil chaud et moderne aux teintes tendance' : 'Soft modern pastel gradient background with diffuse glow',
    },
  ];

  const handleConfirm = () => {
    onConfirmStudio({
      ...product,
      studioImage,
      studioStyle: selectedStyle,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Étape 2 &bull; Détourage Automatique IA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Cabinet_Grotesk']">
          {t.studioTitle}
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
          {t.studioSubtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Interactive Before / After Comparison Slider */}
        <div className="md:col-span-7 space-y-3">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerMove={handlePointerMove}
            className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950 select-none touch-none cursor-ew-resize"
          >
            {/* Studio Shot (Background/Right) */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={studioImage}
                alt="Studio Shot"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
              <span className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
                {t.viewStudio}
              </span>
            </div>

            {/* Original Photo (Left clipped layer) */}
            <div
              className="absolute inset-0 overflow-hidden flex items-center justify-center p-4 border-r-2 border-amber-400 shadow-2xl"
              style={{ width: `${sliderPos}%` }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center p-4"
                style={{ width: containerRef.current?.offsetWidth || '100%' }}
              >
                <img
                  src={product.originalImage}
                  alt="Original"
                  className="w-full h-full object-contain filter grayscale-[20%]"
                />
              </div>
              <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700 backdrop-blur-xs">
                {t.viewOriginal}
              </span>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/40 font-black text-xs">
                ↔
              </div>
            </div>

            {/* Generating Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <span className="text-sm font-semibold text-amber-200">
                  {t.generatingStudioShot}
                </span>
                <span className="text-xs text-slate-400">
                  {language === 'fr'
                    ? 'Isolation de la géométrie et reflets studio...'
                    : 'Isolating product shape and applying studio lighting...'}
                </span>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.sliderHelp}</span>
          </p>
        </div>

        {/* Studio Style Options & Confirmation */}
        <div className="md:col-span-5 space-y-5">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              {t.studioStyleTitle}
            </label>
            <div className="space-y-2">
              {stylesList.map((st) => {
                const isSelected = selectedStyle === st.id;
                return (
                  <button
                    key={st.id}
                    disabled={isGenerating}
                    onClick={() => triggerStudioGeneration(st.id)}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                        {st.label}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {st.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              disabled={isGenerating}
              onClick={handleConfirm}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <span>{t.confirmStudio}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBack}
              className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'fr' ? 'Changer de photo' : 'Change product photo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
