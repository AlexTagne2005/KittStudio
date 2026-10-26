import JSZip from 'jszip';
import { AspectRatio, BrandKit, Language, SceneItem, StudioStyle } from '../types';

export async function analyzeProductApi(image: string, language: Language) {
  const res = await fetch('/api/analyze-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image, language }),
  });
  if (!res.ok) {
    throw new Error('Failed to analyze product');
  }
  return await res.json();
}

export async function generateStudioShotApi(
  image: string,
  style: StudioStyle = 'clean-white',
  quality: 'low' | 'high' = 'low'
) {
  try {
    const res = await fetch('/api/studio-shot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, style, quality }),
    });
    return await res.json();
  } catch {
    return { studioImage: image, style, fallback: true };
  }
}

export async function generateSceneApi(params: {
  referenceImage: string;
  sceneId: string;
  sceneCategory: string;
  aspectRatio: AspectRatio;
  quality: 'low' | 'high';
  customPrompt?: string;
  brandContext?: { tone: string };
}) {
  try {
    const res = await fetch('/api/generate-scene', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch {
    return { image: params.referenceImage, fallback: true };
  }
}

export async function generateCopyApi(params: {
  productName: string;
  productDescription: string;
  sceneTitle: string;
  sceneCategory: string;
  language: Language;
  brandTone: string;
  brandName: string;
}) {
  try {
    const res = await fetch('/api/generate-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch {
    return {
      slogan: `${params.productName} : L'excellence au quotidien`,
      caption: 'Conçu avec passion pour sublimer votre quotidien.',
      hashtags: ['#ProductLaunch', '#QualityFirst', '#DesignLovers'],
      callToAction: params.language === 'fr' ? 'Découvrir' : 'Shop Now',
    };
  }
}

export async function customEditApi(params: {
  image: string;
  editPrompt: string;
  quality: 'low' | 'high';
  aspectRatio: AspectRatio;
}) {
  try {
    const res = await fetch('/api/custom-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch {
    return { image: params.image, fallback: true };
  }
}

// Convert Data URL / Base64 to ArrayBuffer / Blob for JSZip
function dataUrlToUint8Array(dataUrl: string): { bytes: Uint8Array; extension: string } {
  const [header, base64Data] = dataUrl.split(',');
  const isSvg = header.includes('image/svg+xml');
  const isJpg = header.includes('image/jpeg') || header.includes('image/jpg');
  const extension = isSvg ? 'svg' : isJpg ? 'jpg' : 'png';

  if (isSvg) {
    const rawSvg = decodeURIComponent(base64Data);
    const encoder = new TextEncoder();
    return { bytes: encoder.encode(rawSvg), extension: 'svg' };
  }

  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return { bytes, extension };
}

// Generate ZIP file of all visuals, marketing copy, and brand guidelines
export async function downloadMarketingKitZip(params: {
  projectName: string;
  studioImage: string;
  scenes: SceneItem[];
  brandKit: BrandKit;
  language: Language;
}) {
  const { projectName, studioImage, scenes, brandKit, language } = params;
  const zip = new JSZip();

  const folderVisuels = zip.folder('01_visuels_hd');
  const folderTextes = zip.folder('02_textes_et_slogans');
  const folderMarque = zip.folder('03_charte_marque');

  // 1. Add Studio Cutout Image
  if (studioImage) {
    const { bytes, extension } = dataUrlToUint8Array(studioImage);
    folderVisuels?.file(`00_studio_detoure_original.${extension}`, bytes);
  }

  // 2. Add each generated scene visual
  scenes.forEach((scene, index) => {
    if (scene.image) {
      const { bytes, extension } = dataUrlToUint8Array(scene.image);
      const safeTitle = scene.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .slice(0, 30);
      folderVisuels?.file(`${String(index + 1).padStart(2, '0')}_${safeTitle}.${extension}`, bytes);
    }
  });

  // 3. Add Markdown and text summary of marketing copy
  let copyMarkdown = `# Kit Marketing & Slogans - ${projectName || 'Mon Produit'}\n\n`;
  copyMarkdown += `Généré automatiquement par KittStudio AI\n`;
  copyMarkdown += `Date : ${new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}\n\n`;
  copyMarkdown += `---\n\n`;

  scenes.forEach((scene, index) => {
    copyMarkdown += `## Visual ${index + 1} : ${scene.title} (${scene.formatLabel})\n\n`;
    if (scene.slogan) {
      copyMarkdown += `**Slogan / Accroche :**\n> "${scene.slogan}"\n\n`;
    }
    if (scene.caption) {
      copyMarkdown += `**Légende Réseaux Sociaux :**\n${scene.caption}\n\n`;
    }
    if (scene.callToAction) {
      copyMarkdown += `**Appel à l'action (CTA) :** [ ${scene.callToAction} ]\n\n`;
    }
    if (scene.hashtags && scene.hashtags.length > 0) {
      copyMarkdown += `**Hashtags recommandés :**\n${scene.hashtags.join(' ')}\n\n`;
    }
    if (scene.bulletPoints && scene.bulletPoints.length > 0) {
      copyMarkdown += `**Arguments clés :**\n`;
      scene.bulletPoints.forEach((bp) => {
        copyMarkdown += `- ${bp}\n`;
      });
      copyMarkdown += `\n`;
    }
    copyMarkdown += `---\n\n`;
  });

  folderTextes?.file('slogans_et_legendes.md', copyMarkdown);

  // 4. Add Brand Kit Guide
  let brandGuide = `# Charte Graphique & Voix de Marque\n\n`;
  brandGuide += `**Marque :** ${brandKit.brandName || 'Ma Marque'}\n`;
  brandGuide += `**Slogan :** ${brandKit.tagline || '-'}\n`;
  brandGuide += `**Tonalité de communication :** ${brandKit.toneOfVoice}\n`;
  brandGuide += `**Public cible :** ${brandKit.targetAudience || 'Grand public & amateurs de qualité'}\n\n`;
  brandGuide += `### Palette de Couleurs Officielles :\n`;
  brandGuide += `- Principale : ${brandKit.primaryColor}\n`;
  brandGuide += `- Secondaire : ${brandKit.secondaryColor}\n`;
  brandGuide += `- Accent : ${brandKit.accentColor}\n`;
  brandGuide += `- Fond / Neutre : ${brandKit.backgroundColor}\n\n`;

  folderMarque?.file('CHARTE_GRAPHIQUE.md', brandGuide);

  // 5. JSON dump for headless integration
  const manifest = {
    projectName,
    brandKit,
    generatedAt: new Date().toISOString(),
    scenes: scenes.map((s) => ({
      title: s.title,
      category: s.category,
      aspectRatio: s.aspectRatio,
      slogan: s.slogan,
      caption: s.caption,
      hashtags: s.hashtags,
      callToAction: s.callToAction,
    })),
  };
  zip.file('kit_marketing_manifest.json', JSON.stringify(manifest, null, 2));

  // Generate ZIP and trigger instant download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  const safeFilename = (projectName || 'kit-marketing')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  anchor.download = `${safeFilename}-kittstudio.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}
