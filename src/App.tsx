import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepProgress } from './components/StepProgress';
import { UploadSection } from './components/UploadSection';
import { StudioSection } from './components/StudioSection';
import { ScenePickerSection } from './components/ScenePickerSection';
import { GallerySection } from './components/GallerySection';
import { BrandKitModal } from './components/BrandKitModal';
import { HistoryModal } from './components/HistoryModal';
import { BrandKit, Language, ProductData, Project, SceneItem } from './types';
import { INITIAL_SCENES, PRESET_PRODUCTS } from './data/presets';
import { getT } from './utils/i18n';
import { generateCopyApi, generateSceneApi } from './utils/api';
import { synthesizeSceneVisual } from './utils/visualSynthesizer';
import { Loader2, Sparkles, Wand2, Layers, CheckCircle2 } from 'lucide-react';

const STORAGE_PROJECTS_KEY = 'kittstudio_saved_projects_v1';
const STORAGE_LANG_KEY = 'kittstudio_lang_v1';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_LANG_KEY) as Language) || 'fr';
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(1);

  const [product, setProduct] = useState<ProductData | null>(null);

  const [brandKit, setBrandKit] = useState<BrandKit>({
    brandName: '',
    tagline: '',
    primaryColor: '#0f172a',
    secondaryColor: '#3b82f6',
    accentColor: '#f59e0b',
    backgroundColor: '#f8fafc',
    toneOfVoice: 'Luxe & Élégant',
    targetAudience: 'Amateurs de design et de produits haut de gamme',
    keyValues: ['Excellence', 'Innovation', 'Authenticité'],
  });

  const [availableScenes, setAvailableScenes] = useState<SceneItem[]>(INITIAL_SCENES);
  const [selectedSceneIds, setSelectedSceneIds] = useState<string[]>([
    'mockup-mug',
    'mockup-tshirt',
    'mockup-billboard',
    'lifestyle-kitchen',
    'social-story',
  ]);

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isBrandKitOpen, setIsBrandKitOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGeneratingKit, setIsGeneratingKit] = useState(false);
  const [generationProgressText, setGenerationProgressText] = useState('');
  const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState(0);

  // Sync language to storage
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  };

  // Step 1: Product ready
  const handleProductReady = (prod: ProductData) => {
    setProduct(prod);
    setBrandKit((prev) => ({
      ...prev,
      brandName: prod.productName,
      primaryColor: prod.colors[0] || prev.primaryColor,
      secondaryColor: prod.colors[1] || prev.secondaryColor,
      accentColor: prod.colors[2] || prev.accentColor,
      backgroundColor: prod.colors[3] || prev.backgroundColor,
      toneOfVoice: prod.suggestedTone || prev.toneOfVoice,
    }));
    setCurrentStep(2);
    setMaxAccessibleStep((prev) => Math.max(prev, 2));
  };

  // Step 2: Confirm Studio Cutout
  const handleConfirmStudio = (updatedProduct: ProductData) => {
    setProduct(updatedProduct);
    setCurrentStep(3);
    setMaxAccessibleStep((prev) => Math.max(prev, 3));
  };

  // Step 3: Toggle scenes
  const handleToggleScene = (id: string) => {
    setSelectedSceneIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedSceneIds(availableScenes.map((s) => s.id));
  };

  const handleDeselectAll = () => {
    setSelectedSceneIds([]);
  };

  // Step 3 -> 4: Batch generate all selected scenes + copy
  const handleStartGeneration = async () => {
    if (!product || selectedSceneIds.length === 0) return;

    setIsGeneratingKit(true);
    setCurrentStep(4);
    setMaxAccessibleStep(4);

    const scenesToProcess = availableScenes.filter((s) => selectedSceneIds.includes(s.id));
    const processedScenes: SceneItem[] = [];

    for (let i = 0; i < scenesToProcess.length; i++) {
      const scene = scenesToProcess[i];
      setCurrentGeneratingIndex(i + 1);
      setGenerationProgressText(
        language === 'fr'
          ? `Génération visuel ${i + 1}/${scenesToProcess.length} : ${scene.title}...`
          : `Rendering visual ${i + 1}/${scenesToProcess.length}: ${scene.title}...`
      );

      let renderedImage = '';
      try {
        const genRes = await generateSceneApi({
          referenceImage: product.studioImage,
          sceneId: scene.id,
          sceneCategory: scene.category,
          aspectRatio: scene.aspectRatio,
          quality: 'low',
          brandContext: { tone: brandKit.toneOfVoice },
        });

        if (genRes.image && !genRes.simulated && !genRes.fallback && genRes.image !== product.studioImage) {
          renderedImage = genRes.image;
        } else {
          // Visual synthesizer fallback with product isolation & branding
          renderedImage = await synthesizeSceneVisual(
            product.studioImage,
            scene,
            scene.aspectRatio,
            product.colors
          );
        }
      } catch (err) {
        console.warn('Fallback synthesizer for scene:', err);
        renderedImage = await synthesizeSceneVisual(
          product.studioImage,
          scene,
          scene.aspectRatio,
          product.colors
        );
      }

      // Copy generation (slogan, caption, hashtags, CTA)
      setGenerationProgressText(
        language === 'fr'
          ? `Rédaction des slogans & légendes pour ${scene.title}...`
          : `Writing catchy slogans & captions for ${scene.title}...`
      );

      let copyRes: any = {};
      try {
        copyRes = await generateCopyApi({
          productName: product.productName,
          productDescription: product.description,
          sceneTitle: scene.title,
          sceneCategory: scene.category,
          language,
          brandTone: brandKit.toneOfVoice,
          brandName: brandKit.brandName || product.productName,
        });
      } catch (err) {
        console.warn('Fallback copy generator:', err);
        copyRes = {
          slogan: `${product.productName} : L'excellence au quotidien`,
          caption: `Sublimez chaque instant avec un design conçu pour inspirer et durer.`,
          hashtags: ['#Design', '#Excellence', '#Nouveauté', '#Lifestyle'],
          callToAction: language === 'fr' ? 'Découvrir' : 'Shop Now',
        };
      }

      processedScenes.push({
        ...scene,
        image: renderedImage,
        slogan: copyRes.slogan || `${product.productName} : L'art du détail`,
        caption: copyRes.caption || '',
        hashtags: copyRes.hashtags || ['#KittStudio', '#Launch'],
        callToAction: copyRes.callToAction || 'En savoir plus',
        bulletPoints: copyRes.bulletPoints || [],
        status: 'ready',
      });
    }

    setAvailableScenes((prev) =>
      prev.map((s) => {
        const found = processedScenes.find((p) => p.id === s.id);
        return found || s;
      })
    );

    setIsGeneratingKit(false);

    // Auto save new project in history
    saveCurrentProjectToStorage(processedScenes);
  };

  // Regenerate a single scene without affecting others
  const handleRegenerateScene = async (
    sceneId: string,
    customPrompt?: string,
    quality: 'low' | 'high' = 'low'
  ) => {
    if (!product) return;

    setAvailableScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, isRegenerating: true } : s))
    );

    const targetScene = availableScenes.find((s) => s.id === sceneId);
    if (!targetScene) return;

    let newImage = '';
    try {
      const res = await generateSceneApi({
        referenceImage: product.studioImage,
        sceneId: targetScene.id,
        sceneCategory: targetScene.category,
        aspectRatio: targetScene.aspectRatio,
        quality,
        customPrompt,
        brandContext: { tone: brandKit.toneOfVoice },
      });

      if (res.image && !res.simulated && !res.fallback && res.image !== product.studioImage) {
        newImage = res.image;
      } else {
        newImage = await synthesizeSceneVisual(
          product.studioImage,
          targetScene,
          targetScene.aspectRatio,
          product.colors
        );
      }
    } catch {
      newImage = await synthesizeSceneVisual(
        product.studioImage,
        targetScene,
        targetScene.aspectRatio,
        product.colors
      );
    }

    // Refresh copy if tone or direction changed
    let copyRes: any = {};
    try {
      copyRes = await generateCopyApi({
        productName: product.productName,
        productDescription: product.description,
        sceneTitle: targetScene.title,
        sceneCategory: targetScene.category,
        language,
        brandTone: brandKit.toneOfVoice,
        brandName: brandKit.brandName || product.productName,
      });
    } catch {
      copyRes = {
        slogan: targetScene.slogan,
        caption: targetScene.caption,
        hashtags: targetScene.hashtags,
        callToAction: targetScene.callToAction,
      };
    }

    setAvailableScenes((prev) =>
      prev.map((s) =>
        s.id === sceneId
          ? {
              ...s,
              image: newImage,
              slogan: copyRes.slogan || s.slogan,
              caption: copyRes.caption || s.caption,
              hashtags: copyRes.hashtags || s.hashtags,
              callToAction: copyRes.callToAction || s.callToAction,
              customPrompt,
              isRegenerating: false,
              quality,
            }
          : s
      )
    );
  };

  // Update scene text copy inline
  const handleUpdateSceneCopy = (sceneId: string, updates: Partial<SceneItem>) => {
    setAvailableScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, ...updates } : s))
    );
  };

  // Save current state to project history
  const saveCurrentProjectToStorage = (scenesToSave?: SceneItem[]) => {
    if (!product) return;
    const finalScenes =
      scenesToSave || availableScenes.filter((s) => selectedSceneIds.includes(s.id) && s.image);

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: brandKit.brandName || product.productName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product,
      brandKit,
      scenes: finalScenes,
      language,
    };

    setProjects((prev) => {
      const updated = [newProject, ...prev.filter((p) => p.title !== newProject.title)];
      try {
        localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updated.slice(0, 15)));
      } catch (e) {
        console.warn('Storage limit:', e);
      }
      return updated;
    });
  };

  // Restore project from history
  const handleLoadProject = (proj: Project) => {
    setProduct(proj.product);
    setBrandKit(proj.brandKit);
    setLanguage(proj.language);
    setSelectedSceneIds(proj.scenes.map((s) => s.id));
    setAvailableScenes((prev) =>
      prev.map((s) => {
        const found = proj.scenes.find((ps) => ps.id === s.id);
        return found || s;
      })
    );
    setCurrentStep(4);
    setMaxAccessibleStep(4);
  };

  // Delete project from history
  const handleDeleteProject = (projId: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== projId);
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(filtered));
      return filtered;
    });
  };

  // Start fresh project
  const handleNewProject = () => {
    setProduct(null);
    setCurrentStep(1);
    setMaxAccessibleStep(1);
  };

  const activeScenes = availableScenes.filter((s) => selectedSceneIds.includes(s.id));

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenBrandKit={() => setIsBrandKitOpen(true)}
        currentProjectTitle={brandKit.brandName || product?.productName}
        hasProjects={projects.length > 0}
      />

      {/* 4-Step Progress Navigation */}
      <StepProgress
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        maxAccessibleStep={maxAccessibleStep}
        language={language}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col">
        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <UploadSection
            language={language}
            onProductReady={handleProductReady}
          />
        )}

        {/* Step 2: Studio Background Removal & Lighting */}
        {currentStep === 2 && product && (
          <StudioSection
            product={product}
            language={language}
            onConfirmStudio={handleConfirmStudio}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Step 3: Scene Pack Picker */}
        {currentStep === 3 && product && (
          <ScenePickerSection
            product={product}
            brandKit={brandKit}
            onUpdateBrandKit={setBrandKit}
            availableScenes={availableScenes}
            selectedSceneIds={selectedSceneIds}
            onToggleScene={handleToggleScene}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onStartGeneration={handleStartGeneration}
            onBack={() => setCurrentStep(2)}
            language={language}
          />
        )}

        {/* Step 4: Results Gallery & Marketing Kit */}
        {currentStep === 4 && product && (
          <GallerySection
            product={product}
            brandKit={brandKit}
            scenes={activeScenes}
            onRegenerateScene={handleRegenerateScene}
            onUpdateSceneCopy={handleUpdateSceneCopy}
            onSaveProject={() => saveCurrentProjectToStorage()}
            onNewProject={handleNewProject}
            onOpenBrandKit={() => setIsBrandKitOpen(true)}
            language={language}
          />
        )}
      </main>

      {/* Full-Screen Batch Generation Overlay */}
      {isGeneratingKit && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <Sparkles className="w-7 h-7 text-amber-400" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                {language === 'fr'
                  ? 'Création de votre Kit Marketing...'
                  : 'Crafting your Marketing Kit...'}
              </h2>
              <p className="text-xs text-amber-300 font-medium">
                {generationProgressText}
              </p>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${(currentGeneratingIndex / Math.max(1, selectedSceneIds.length)) * 100}%`,
                }}
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              {language === 'fr'
                ? 'Le modèle analyse la géométrie du produit, respecte vos logos et génère les slogans publicitaires adaptés.'
                : 'The model respects exact product geometry and generates matching advertising copy.'}
            </p>
          </div>
        </div>
      )}

      {/* Brand Kit Modal */}
      <BrandKitModal
        isOpen={isBrandKitOpen}
        onClose={() => setIsBrandKitOpen(false)}
        brandKit={brandKit}
        onSave={(kit) => setBrandKit(kit)}
        language={language}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        projects={projects}
        onLoadProject={handleLoadProject}
        onDeleteProject={handleDeleteProject}
        onNewProject={handleNewProject}
        language={language}
      />
    </div>
  );
}
