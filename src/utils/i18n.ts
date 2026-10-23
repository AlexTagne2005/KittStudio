import { Language } from '../types';

export const translations = {
  fr: {
    appTitle: 'KittStudio AI',
    appSubtitle: 'Transformez une simple photo de produit en kit marketing complet.',
    step1: '1. Photo Produit',
    step2: '2. Détourage Studio',
    step3: '3. Choix des Scènes',
    step4: '4. Kit Marketing & Galerie',
    
    // Upload step
    uploadTitle: 'Importez votre photo de produit',
    uploadSubtitle: 'Prenez une photo sur votre smartphone ou importez une image existante.',
    dragDropText: 'Glissez votre image ici, ou cliquez pour parcourir',
    capturePhoto: 'Prendre une photo',
    orUseSample: 'Ou essayez instantanément avec un produit démo :',
    analyzingProduct: 'Analyse IA du produit en cours...',
    
    // Studio step
    studioTitle: 'Détourage & Rendu Studio Pro',
    studioSubtitle: 'Le fond est supprimé et votre produit est isolé avec un éclairage studio commercial de qualité supérieure.',
    viewOriginal: 'Original',
    viewStudio: 'Rendu Studio',
    sliderHelp: 'Faites glisser pour comparer avant / après',
    studioStyleTitle: 'Style de studio :',
    styleWhite: 'Studio Blanc Épuré',
    stylePedestal: 'Podium Minéral Luxe',
    styleDark: 'Charbon Sombre & Reflets',
    stylePastel: 'Dégradé Pastel Doux',
    generatingStudioShot: 'Génération du détourage studio en cours...',
    confirmStudio: 'Valider et choisir les scènes →',
    
    // Scene selection step
    scenesTitle: 'Sélectionnez votre pack de scènes',
    scenesSubtitle: 'Choisissez les mises en situation à générer. Le produit sera conservé strictement identique (formes, couleurs, logos).',
    filterAll: 'Toutes les scènes',
    filterMockups: 'Mockups (Mug, T-shirt, Billboard...)',
    filterLifestyle: 'Scènes Lifestyle',
    filterSocial: 'Formats Réseaux Sociaux',
    selectedScenesCount: (count: number) => `${count} scène(s) sélectionnée(s)`,
    selectAll: 'Tout sélectionner',
    deselectAll: 'Tout désélectionner',
    generateKitButton: 'Générer le Kit Marketing complet 🚀',
    
    // Brand Kit & Settings
    brandKitTitle: 'Charte & Identité de Marque',
    brandKitSubtitle: 'Personnalisez le ton, le slogan et la palette extraite de votre produit.',
    brandName: 'Nom de la marque',
    brandTagline: 'Slogan principal',
    brandTone: 'Tonalité de communication',
    toneLuxury: 'Luxe & Élégant',
    toneBold: 'Audacieux & Fun',
    toneEco: 'Naturel & Éco-responsable',
    toneMinimal: 'Minimaliste & Tech',
    toneArtisanal: 'Artisanal & Chaleureux',
    brandColors: 'Couleurs de la marque (extraites)',
    targetAudience: 'Cible / Audience',
    saveBrandKit: 'Enregistrer la charte',
    brandKitSaved: 'Charte enregistrée !',
    
    // Gallery & Results
    galleryTitle: 'Votre Kit Marketing',
    gallerySubtitle: 'Visuels haute fidélité, slogans percutants et légendes prêtes à publier.',
    lowResNotice: 'Mode basse consommation actif (prévisualisation rapide). La haute définition (1K) est générée lors de l\'export.',
    filterReady: 'Prêts',
    filterGenerating: 'En cours',
    regenerateSingle: 'Régénérer cette scène',
    regeneratePromptPlaceholder: 'Ex: "Ajouter des reflets dorés", "Éclairage plus chaud"...',
    editCopy: 'Modifier le texte',
    copyCaption: 'Copier la légende',
    captionCopied: 'Légende et hashtags copiés !',
    copySlogan: 'Copier le slogan',
    sloganCopied: 'Slogan copié !',
    downloadVisual: 'Télécharger l\'image',
    downloadZip: 'Télécharger le Kit ZIP complet (.zip)',
    exportHdOption: 'Générer et exporter en Haute Définition (1K)',
    exportFastOption: 'Export rapide (résolution aperçu)',
    exportPreparing: 'Création de l\'archive ZIP...',
    
    // History
    historyTitle: 'Historique des projets',
    noHistory: 'Aucun projet enregistré pour le moment.',
    openProject: 'Ouvrir',
    deleteProject: 'Supprimer',
    newProject: 'Nouveau projet',
    projectSavedAt: (date: string) => `Créé le ${date}`,
    
    // Misc
    resolutionBadgeLow: 'Aperçu Rapide ⚡',
    resolutionBadgeHd: 'Haute Définition ✨',
    switchLanguage: 'Langue :',
    qualityControl: 'Gestion des coûts API',
  },
  en: {
    appTitle: 'KittStudio AI',
    appSubtitle: 'Turn a single product photo into a complete marketing kit.',
    step1: '1. Product Photo',
    step2: '2. Studio Cutout',
    step3: '3. Scene Pack',
    step4: '4. Marketing Kit & Gallery',
    
    // Upload step
    uploadTitle: 'Upload your product photo',
    uploadSubtitle: 'Snap a photo with your mobile or pick an existing image file.',
    dragDropText: 'Drop your product photo here, or click to browse',
    capturePhoto: 'Take a photo',
    orUseSample: 'Or try instantly with a demo product:',
    analyzingProduct: 'AI is analyzing your product...',
    
    // Studio step
    studioTitle: 'Background Removal & Studio Cutout',
    studioSubtitle: 'The background is cleanly removed with high-end commercial studio lighting and soft contact shadows.',
    viewOriginal: 'Original',
    viewStudio: 'Studio Shot',
    sliderHelp: 'Slide across to compare before / after',
    studioStyleTitle: 'Studio Environment Style:',
    styleWhite: 'Clean White Cyclorama',
    stylePedestal: 'Luxury Mineral Pedestal',
    styleDark: 'Moody Charcoal & Reflections',
    stylePastel: 'Soft Pastel Gradient',
    generatingStudioShot: 'Generating studio cutout...',
    confirmStudio: 'Approve & select scene pack →',
    
    // Scene selection step
    scenesTitle: 'Pick your scene pack',
    scenesSubtitle: 'Choose which scenes to generate. The product geometry, logo, colors, and textures remain strictly identical.',
    filterAll: 'All Scenes',
    filterMockups: 'Mockups (Mug, T-Shirt, Billboard...)',
    filterLifestyle: 'Lifestyle Scenes',
    filterSocial: 'Social Media Formats',
    selectedScenesCount: (count: number) => `${count} scene(s) selected`,
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    generateKitButton: 'Generate Full Marketing Kit 🚀',
    
    // Brand Kit & Settings
    brandKitTitle: 'Brand Identity & Guidelines',
    brandKitSubtitle: 'Customize your tone of voice, slogan, and palette extracted from your product.',
    brandName: 'Brand Name',
    brandTagline: 'Main Tagline',
    brandTone: 'Brand Tone of Voice',
    toneLuxury: 'Luxury & Refined',
    toneBold: 'Bold & Playful',
    toneEco: 'Organic & Sustainable',
    toneMinimal: 'Minimalist & Tech',
    toneArtisanal: 'Artisanal & Warm',
    brandColors: 'Brand Palette (Extracted)',
    targetAudience: 'Target Audience',
    saveBrandKit: 'Save Brand Kit',
    brandKitSaved: 'Brand kit saved!',
    
    // Gallery & Results
    galleryTitle: 'Your Marketing Kit',
    gallerySubtitle: 'High fidelity visuals, punchy slogans, and publish-ready captions.',
    lowResNotice: 'Low-resource preview mode active (fast & cost-effective). High definition (1K) is generated upon export.',
    filterReady: 'Ready',
    filterGenerating: 'Generating',
    regenerateSingle: 'Regenerate this visual',
    regeneratePromptPlaceholder: 'e.g. "Add subtle golden sunset glow", "Softer lighting"...',
    editCopy: 'Edit copy',
    copyCaption: 'Copy caption',
    captionCopied: 'Caption & hashtags copied!',
    copySlogan: 'Copy slogan',
    sloganCopied: 'Slogan copied!',
    downloadVisual: 'Download visual',
    downloadZip: 'Download Complete Kit (.ZIP)',
    exportHdOption: 'Render & export in High Definition (1K)',
    exportFastOption: 'Fast export (preview resolution)',
    exportPreparing: 'Packaging ZIP file...',
    
    // History
    historyTitle: 'Project History',
    noHistory: 'No saved projects yet.',
    openProject: 'Open',
    deleteProject: 'Delete',
    newProject: 'New Project',
    projectSavedAt: (date: string) => `Created on ${date}`,
    
    // Misc
    resolutionBadgeLow: 'Fast Preview ⚡',
    resolutionBadgeHd: 'High Definition ✨',
    switchLanguage: 'Language:',
    qualityControl: 'API Cost Control',
  },
};

export function getT(lang: Language) {
  return translations[lang] || translations.fr;
}
