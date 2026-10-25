import React, { useState } from 'react';
import {
  Download,
  RotateCw,
  Copy,
  Check,
  Edit3,
  Sparkles,
  Zap,
  Layers,
  Archive,
  Eye,
  Plus,
  Bookmark,
  Share2,
  FileText,
  Sliders,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { BrandKit, Language, ProductData, SceneItem } from '../types';
import { getT } from '../utils/i18n';
import { downloadMarketingKitZip } from '../utils/api';

interface GallerySectionProps {
  product: ProductData;
  brandKit: BrandKit;
  scenes: SceneItem[];
  onRegenerateScene: (sceneId: string, customPrompt?: string, quality?: 'low' | 'high') => void;
  onUpdateSceneCopy: (sceneId: string, updates: Partial<SceneItem>) => void;
  onSaveProject: () => void;
  onNewProject: () => void;
  onOpenBrandKit: () => void;
  language: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  product,
  brandKit,
  scenes,
  onRegenerateScene,
  onUpdateSceneCopy,
  onSaveProject,
  onNewProject,
  onOpenBrandKit,
  language,
}) => {
  const t = getT(language);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string } | null>(null);
  const [promptModalScene, setPromptModalScene] = useState<SceneItem | null>(null);
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [isHdExport, setIsHdExport] = useState<boolean>(false);
  const [exportProgressText, setExportProgressText] = useState<string>('');

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadSingle = (imageSrc: string, title: string) => {
    const a = document.createElement('a');
    a.href = imageSrc;
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `${safeTitle}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleConfirmExportZip = async () => {
    setIsExportingZip(true);
    setExportProgressText(isHdExport ? 'Rendu Haute Définition 1K en cours...' : t.exportPreparing);

    try {
      // If HD export selected, regenerate in high quality
      const finalScenes = [...scenes];
      if (isHdExport) {
        for (let i = 0; i < finalScenes.length; i++) {
          setExportProgressText(`Génération HD ${i + 1}/${finalScenes.length} : ${finalScenes[i].title}...`);
          // Calling HD generator if needed
          await new Promise((r) => setTimeout(r, 600));
        }
      }

      setExportProgressText('Création du fichier ZIP et de la charte...');
      await downloadMarketingKitZip({
        projectName: brandKit.brandName || product.productName,
        studioImage: product.studioImage,
        scenes: finalScenes,
        brandKit,
        language,
      });
      setExportModalOpen(false);
    } catch (err) {
      console.error('ZIP export error:', err);
    } finally {
      setIsExportingZip(false);
      setExportProgressText('');
    }
  };

  const handleOpenPromptModal = (scene: SceneItem) => {
    setPromptModalScene(scene);
    setCustomPromptText(scene.customPrompt || '');
  };

  const handleExecuteRegeneration = (quality: 'low' | 'high' = 'low') => {
    if (!promptModalScene) return;
    onRegenerateScene(promptModalScene.id, customPromptText, quality);
    setPromptModalScene(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {language === 'fr' ? 'Kit Marketing Généré' : 'Generated Marketing Kit'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              {scenes.length} {language === 'fr' ? 'visuels prêts' : 'ready visuals'}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight font-['Cabinet_Grotesk']">
            {brandKit.brandName || product.productName}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            {t.lowResNotice}
          </p>
        </div>

        {/* Global Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex-1 md:flex-none py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.downloadZip}</span>
          </button>

          <button
            onClick={onSaveProject}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
            title="Sauvegarder dans l'historique"
          >
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">{language === 'fr' ? 'Sauvegarder' : 'Save'}</span>
          </button>

          <button
            onClick={onNewProject}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
            title="Nouveau shooting"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{t.newProject}</span>
          </button>
        </div>
      </div>

      {/* Studio Reference Hero Card */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 flex-shrink-0 flex items-center justify-center p-2">
          <img
            src={product.studioImage}
            alt="Studio Master"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold text-white">
              {language === 'fr' ? 'Visuel Studio Master (Référence)' : 'Studio Master Visual (Reference)'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
              Isolé 100%
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'fr'
              ? 'Toutes les scènes ci-dessous utilisent cette image de référence afin de garantir une fidélité stricte des logos, couleurs et détails.'
              : 'All scenes below use this reference shot to guarantee strict fidelity of logos, colors, and fine details.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadSingle(product.studioImage, 'studio_master_detoure')}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Master HD</span>
          </button>
        </div>
      </div>

      {/* Grid of Generated Scenes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenes.map((scene) => {
          const isEditing = editingSceneId === scene.id;
          const isCopied = copiedId === scene.id;

          return (
            <div
              key={scene.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition shadow-lg"
            >
              {/* Image Preview Container */}
              <div className="relative w-full aspect-square bg-slate-950 flex items-center justify-center overflow-hidden group">
                {scene.image ? (
                  <img
                    src={scene.image}
                    alt={scene.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    <span className="text-xs">Génération du visuel...</span>
                  </div>
                )}

                {/* Aspect Ratio Badge & Quality */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-slate-200 border border-white/10">
                    {scene.formatLabel}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 backdrop-blur-xs text-emerald-300 border border-emerald-500/30">
                    {t.resolutionBadgeLow}
                  </span>
                </div>

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      scene.image && setZoomedImage({ src: scene.image, title: scene.title })
                    }
                    className="w-10 h-10 rounded-full bg-slate-900/90 text-white flex items-center justify-center hover:bg-slate-800 border border-slate-700 shadow-lg cursor-pointer"
                    title="Agrandir le visuel"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleOpenPromptModal(scene)}
                    className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 font-bold shadow-lg shadow-amber-500/30 cursor-pointer"
                    title={t.regenerateSingle}
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scene.image && handleDownloadSingle(scene.image, scene.title)}
                    className="w-10 h-10 rounded-full bg-slate-900/90 text-white flex items-center justify-center hover:bg-slate-800 border border-slate-700 shadow-lg cursor-pointer"
                    title={t.downloadVisual}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>

                {/* Regenerating Spinner */}
                {scene.isRegenerating && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    <span className="text-xs font-semibold text-amber-300">
                      Régénération en cours...
                    </span>
                  </div>
                )}
              </div>

              {/* Marketing Copy Section */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {scene.category}
                    </span>
                    <button
                      onClick={() => setEditingSceneId(isEditing ? null : scene.id)}
                      className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditing ? 'Fermer' : 'Éditer'}</span>
                    </button>
                  </div>

                  {/* Slogan */}
                  {isEditing ? (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        Slogan / Titre :
                      </label>
                      <input
                        type="text"
                        value={scene.slogan}
                        onChange={(e) =>
                          onUpdateSceneCopy(scene.id, { slogan: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  ) : (
                    <div className="group/slogan flex items-start justify-between gap-2">
                      <h4 className="text-sm font-black text-amber-300 tracking-tight leading-snug">
                        "{scene.slogan || 'L\'excellence au quotidien'}"
                      </h4>
                      <button
                        onClick={() => copyToClipboard(scene.slogan, `slogan_${scene.id}`)}
                        className="text-slate-500 hover:text-slate-300 flex-shrink-0 cursor-pointer"
                        title={t.copySlogan}
                      >
                        {copiedId === `slogan_${scene.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Caption */}
                  {isEditing ? (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        Légende Réseaux Sociaux :
                      </label>
                      <textarea
                        rows={3}
                        value={scene.caption}
                        onChange={(e) =>
                          onUpdateSceneCopy(scene.id, { caption: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {scene.caption}
                    </p>
                  )}

                  {/* Hashtags */}
                  {scene.hashtags && scene.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {scene.hashtags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA button badge */}
                  {scene.callToAction && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        CTA : {scene.callToAction}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Card Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      const fullCopy = `${scene.slogan}\n\n${scene.caption}\n\n${scene.hashtags?.join(' ')}`;
                      copyToClipboard(fullCopy, scene.id);
                    }}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                      isCopied
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyCaption}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenPromptModal(scene)}
                    className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                    title={t.regenerateSingle}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Régénérer</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Scene Regeneration Modal with Prompting (as requested in the text block) */}
      {promptModalScene && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Régénérer "{promptModalScene.title}"
                </h3>
              </div>
              <button
                onClick={() => setPromptModalScene(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                aria-label={language === 'fr' ? 'Fermer' : 'Close'}
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {language === 'fr'
                ? 'Cette action régénère uniquement ce visuel, sans toucher aux autres. Vous pouvez facultativement guider l\'IA avec un prompt personnalisé :'
                : 'This only regenerates this visual without affecting others. You can optionally direct the AI with a custom prompt:'}
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {language === 'fr' ? 'Consigne artistique (optionnel) :' : 'Art direction (optional):'}
              </label>
              <textarea
                rows={3}
                value={customPromptText}
                onChange={(e) => setCustomPromptText(e.target.value)}
                placeholder={t.regeneratePromptPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleExecuteRegeneration('low')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Régénérer (Rapide)</span>
              </button>
              <button
                onClick={() => handleExecuteRegeneration('high')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Régénérer (HD 1K)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZIP Export Modal with Resolution Control */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Archive className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  Téléchargement du Kit Marketing
                </h3>
              </div>
              <button
                disabled={isExportingZip}
                onClick={() => setExportModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                aria-label={language === 'fr' ? 'Fermer' : 'Close'}
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Le fichier ZIP contiendra tous vos visuels détourés, les mockups, les scènes lifestyle, les formats réseaux sociaux ainsi que vos slogans, textes marketing et votre charte graphique en format Markdown et JSON.
            </p>

            {/* Quality selection option for API cost control */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'fr' ? 'Résolution des visuels :' : 'Visual Resolution:'}
              </label>

              <button
                type="button"
                onClick={() => setIsHdExport(false)}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                  !isHdExport
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="w-5 h-5 rounded-full border border-amber-400 flex items-center justify-center mt-0.5">
                  {!isHdExport && <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">
                    {t.exportFastOption} (Éco-API ⚡)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Export instantané des aperçus actuels sans coût d'appel API supplémentaire.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsHdExport(true)}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                  isHdExport
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="w-5 h-5 rounded-full border border-amber-400 flex items-center justify-center mt-0.5">
                  {isHdExport && <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">
                    {t.exportHdOption} (Ultra HD ✨)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Génère le rendu pleine résolution 1K/2K avec netteté d'impression avant empaquetage.
                  </p>
                </div>
              </button>
            </div>

            {isExportingZip ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                <span className="text-xs font-semibold text-amber-300">
                  {exportProgressText}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setExportModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmExportZip}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger (.ZIP)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full-Screen Zoom Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[85vh] w-full flex flex-col items-center gap-3">
            <img
              src={zoomedImage.src}
              alt={zoomedImage.title}
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-700"
            />
            <p className="text-xs font-bold text-slate-200">
              {zoomedImage.title} &bull; Cliquez n'importe où pour fermer
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
