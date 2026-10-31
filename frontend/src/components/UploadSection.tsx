import React, { useRef, useState } from 'react';
import { Upload, Camera, Sparkles, Check, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { Language, PresetProduct, ProductData } from '../types';
import { PRESET_PRODUCTS } from '../data/presets';
import { getT } from '../utils/i18n';
import { analyzeProductApi } from '../utils/api';

interface UploadSectionProps {
  language: Language;
  onProductReady: (product: ProductData) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  language,
  onProductReady,
}) => {
  const t = getT(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    productName: string;
    category: string;
    description: string;
    colors: string[];
    suggestedTone: string;
    sellingPoints: string[];
  } | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);
      runAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: PresetProduct) => {
    setSelectedImage(preset.image);
    setAnalysisResult({
      productName: preset.name,
      category: preset.category,
      description: preset.description,
      colors: preset.colors,
      suggestedTone: preset.suggestedTone,
      sellingPoints: preset.sellingPoints,
    });
  };

  const runAnalysis = async (imgData: string) => {
    setIsAnalyzing(true);
    try {
      const data = await analyzeProductApi(imgData, language);
      setAnalysisResult({
        productName: data.productName || 'Produit',
        category: data.category || 'Retail',
        description: data.description || '',
        colors: data.colors && data.colors.length ? data.colors : ['#0f172a', '#3b82f6', '#f59e0b', '#f8fafc'],
        suggestedTone: data.suggestedTone || 'Élégant & Moderne',
        sellingPoints: data.sellingPoints || ['Qualité supérieure', 'Design soigné'],
      });
    } catch (err) {
      console.warn('Fallback analysis:', err);
      setAnalysisResult({
        productName: language === 'fr' ? 'Produit Détecté' : 'Detected Product',
        category: 'E-commerce',
        description: language === 'fr' ? 'Article commercial prêt pour le shooting studio.' : 'Commercial item ready for studio staging.',
        colors: ['#18181b', '#d97706', '#f59e0b', '#fef3c7'],
        suggestedTone: 'Élégant & Moderne',
        sellingPoints: ['Finitions soignées', 'Matériaux de haute qualité'],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProceed = () => {
    if (!selectedImage) return;

    const finalProduct: ProductData = {
      id: `prod_${Date.now()}`,
      originalImage: selectedImage,
      studioImage: selectedImage,
      studioStyle: 'clean-white',
      productName: analysisResult?.productName || (language === 'fr' ? 'Mon Produit' : 'My Product'),
      category: analysisResult?.category || 'Général',
      description: analysisResult?.description || '',
      colors: analysisResult?.colors || ['#0f172a', '#3b82f6', '#f59e0b', '#f8fafc'],
      suggestedTone: analysisResult?.suggestedTone || 'Élégant & Moderne',
      sellingPoints: analysisResult?.sellingPoints || [],
    };

    onProductReady(finalProduct);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title & Intro */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Cabinet_Grotesk']">
          {t.uploadTitle}
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
          {t.uploadSubtitle}
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7 space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[260px] ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                : selectedImage
                ? 'border-amber-500/50 bg-slate-900/60'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />

            {selectedImage ? (
              <div className="relative w-full flex flex-col items-center">
                <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-lg border border-slate-700/80 bg-slate-950 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Aperçu Produit"
                    className="w-full h-full object-contain p-2"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                      <span className="text-xs font-semibold text-amber-300">
                        {t.analyzingProduct}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-400 font-medium">
                  {language === 'fr'
                    ? 'Cliquez pour remplacer l\'image'
                    : 'Click to replace image'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {t.dragDropText}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, WEBP jusqu'à 20 Mo
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Camera Button */}
          <div className="flex gap-2">
            <button
              onClick={() => cameraInputRef.current?.click()}
              type="button"
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>{t.capturePhoto}</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              aria-label="Galerie"
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            >
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Galerie</span>
            </button>
          </div>
        </div>

        {/* Right column: Analysis & Preset samples */}
        <div className="md:col-span-5 space-y-4">
          {/* Analysis Card if available */}
          {analysisResult && selectedImage && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'fr' ? 'Détection IA' : 'AI Analysis'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {analysisResult.category}
                </span>
              </div>

              <div>
                <input
                  type="text"
                  value={analysisResult.productName}
                  onChange={(e) =>
                    setAnalysisResult({ ...analysisResult, productName: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {analysisResult.description && (
                <p className="text-xs text-slate-400 leading-relaxed">
                  {analysisResult.description}
                </p>
              )}

              {/* Extracted Colors */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
                  {t.brandColors} :
                </span>
                <div className="flex items-center gap-2">
                  {analysisResult.colors.map((hex, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-lg border border-white/20 shadow-sm flex items-center justify-center text-[9px] font-mono font-bold"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>

              {/* Selling points */}
              {analysisResult.sellingPoints?.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  {analysisResult.sellingPoints.map((sp, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{sp}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleProceed}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <span>{language === 'fr' ? 'Détourer en studio' : 'Start Studio Cutout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick presets */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              {t.orUseSample}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_PRODUCTS.map((preset) => {
                const isCurrent =
                  analysisResult?.productName === preset.name && selectedImage === preset.image;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition cursor-pointer ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-950 border border-slate-800">
                      <img
                        src={preset.image}
                        alt={preset.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">
                        {preset.name.split('"')[1] || preset.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {preset.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
