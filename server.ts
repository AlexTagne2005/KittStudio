import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

// Body limit for high-res image payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to strip data url prefix
function parseBase64(dataUrl: string): { data: string; mimeType: string } {
  if (!dataUrl) return { data: '', mimeType: 'image/jpeg' };
  const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return { mimeType: matches[1], data: matches[2] };
  }
  return { mimeType: 'image/jpeg', data: dataUrl };
}

/**
 * Resilient Image Generation & Editing helper using gemini-3.1-flash-image-preview
 * Supports graceful fallback when free-tier API quotas are rate-limited or exhausted (429/limit:0).
 */
async function generateOrEditImage(params: {
  base64Data: string;
  mimeType: string;
  prompt: string;
  aspectRatio?: string;
  quality?: 'low' | 'high';
}): Promise<{
  success: boolean;
  image?: string;
  quotaExceeded?: boolean;
  warning?: string;
}> {
  if (!ai) {
    return { success: false, warning: 'No API key configured' };
  }

  // Use gemini-3.1-flash-image-preview as requested, with gemini-3.1-flash-image as fallback
  const modelsToTry = [
    'gemini-3.1-flash-image-preview',
    'gemini-3.1-flash-image',
  ];

  const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  const chosenRatio = validAspectRatios.includes(params.aspectRatio || '')
    ? params.aspectRatio
    : '1:1';

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { data: params.base64Data, mimeType: params.mimeType } },
            { text: params.prompt },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: chosenRatio as any,
            ...(params.quality === 'high' ? { imageSize: '1K' } : {}),
          },
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const outMime = part.inlineData.mimeType || 'image/png';
            return {
              success: true,
              image: `data:${outMime};base64,${part.inlineData.data}`,
            };
          }
        }
      }
    } catch (err: any) {
      const isQuota =
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('Quota exceeded');

      if (isQuota) {
        console.log(`[KittStudio AI] Model ${model} quota rate-limited or limit 0 on free tier.`);
        if (model === modelsToTry[modelsToTry.length - 1]) {
          return {
            success: false,
            quotaExceeded: true,
            warning: 'API quota limit reached for image generation. Switching seamlessly to synthesis mode.',
          };
        }
      } else {
        console.log(`[KittStudio AI] Model ${model} call note: ${err?.message || err}`);
      }
    }
  }

  return { success: false, warning: 'Image generation completed without visual part' };
}

// 1. Health check & status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    supportedModels: {
      imagePrimary: 'gemini-3.1-flash-image-preview',
      imageSecondary: 'gemini-3.1-flash-image',
      text: 'gemini-3.8-flash',
    },
  });
});

// 2. Analyze product image (detect category, product name, colors, tone)
app.post('/api/analyze-product', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, language = 'fr' } = req.body;
    if (!image) {
      res.status(400).json({ error: 'Image is required' });
      return;
    }

    if (!ai) {
      res.json({
        productName: language === 'fr' ? 'Produit Détecté' : 'Detected Product',
        category: 'e-commerce',
        description:
          language === 'fr'
            ? 'Article commercial élégant prêt pour la mise en scène marketing.'
            : 'Sleek commercial item ready for marketing scene staging.',
        colors: ['#0f172a', '#3b82f6', '#f8fafc', '#d97706'],
        suggestedTone: 'Élégant & Moderne',
        sellingPoints: [
          language === 'fr' ? 'Design soigné et finitions premium' : 'Careful design and premium finishes',
          language === 'fr' ? 'Parfait pour un usage quotidien' : 'Perfect for everyday use',
          language === 'fr' ? 'Qualité supérieure certifiée' : 'Certified superior quality',
        ],
      });
      return;
    }

    const { data: base64Data, mimeType } = parseBase64(image);

    const prompt = `Analyze this product photograph.
Return a structured JSON with:
1. "productName": A concise commercial name for this product (e.g. "Bouteille Gourde Isotherme Inox", "Sneakers Basses Cuir Urbain").
2. "category": Primary retail category (e.g., Cosmétiques, Boisson, Mode, High-Tech, Décoration).
3. "description": A 2-sentence captivating marketing summary of the product.
4. "colors": An array of 4 dominant hex colors found on the product/packaging (e.g. ["#1E293B", "#F59E0B"]).
5. "suggestedTone": Recommended marketing tone (e.g. "Luxe & Minimaliste", "Audacieux & Pop", "Artisanal & Naturel").
6. "sellingPoints": Array of 3 short selling arguments in ${language === 'fr' ? 'French' : 'English'}.

Respond in ${language === 'fr' ? 'French' : 'English'}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            colors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestedTone: { type: Type.STRING },
            sellingPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['productName', 'category', 'description', 'colors', 'suggestedTone', 'sellingPoints'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.log('[KittStudio AI] Product analysis notice:', err?.message || err);
    res.json({
      fallback: true,
      productName: req.body.language === 'fr' ? 'Produit Marketing' : 'Marketing Product',
      category: 'Lifestyle',
      description:
        req.body.language === 'fr'
          ? 'Photo de produit prête pour la génération de kit marketing.'
          : 'Product photo ready for marketing kit generation.',
      colors: ['#0f172a', '#6366f1', '#e2e8f0', '#f59e0b'],
      suggestedTone: 'Élégant & Épuré',
      sellingPoints: [
        req.body.language === 'fr' ? 'Finitions soignées' : 'Careful finishes',
        req.body.language === 'fr' ? 'Matériaux premium' : 'Premium materials',
        req.body.language === 'fr' ? 'Design intemporel' : 'Timeless design',
      ],
    });
  }
});

// 3. Remove background & generate clean studio product shot
app.post('/api/studio-shot', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, style = 'clean-white', quality = 'low' } = req.body;
    if (!image) {
      res.status(400).json({ error: 'Image is required' });
      return;
    }

    if (!ai) {
      res.json({
        studioImage: image,
        style,
        simulated: true,
      });
      return;
    }

    const { data: base64Data, mimeType } = parseBase64(image);

    let stylePrompt =
      'pure seamless bright white photography cyclorama studio with soft contact drop shadow under the product and crisp even commercial e-commerce lighting';
    if (style === 'pedestal') {
      stylePrompt =
        'minimalist smooth geometric stone podium pedestal in soft neutral warm beige aesthetic, delicate natural directional shadow, luxury catalog product display';
    } else if (style === 'dark-luxury') {
      stylePrompt =
        'moody dramatic luxury studio with dark charcoal matte textured surface, sharp rim lighting highlighting the product contours and sleek specular reflections';
    } else if (style === 'gradient-pastel') {
      stylePrompt =
        'aesthetic soft pastel gradient studio background (warm cream to soft lilac/peach), balanced diffuse studio lighting, subtle soft contact shadow';
    }

    const prompt = `CRITICAL TASK: Studio product shot isolation.
Look at the input image and extract the EXACT product shown.
Keep the product completely identical:
- Keep the exact geometry, shape, dimensions, labels, typography, logos, and original colors strictly intact without alteration.
- Remove all distracting background, hands, or cluttered room elements.
- Place the exact product in this professional studio environment: ${stylePrompt}.
- High-end commercial product photography, sharp focus on the product, photorealistic materials.`;

    const result = await generateOrEditImage({
      base64Data,
      mimeType,
      prompt,
      aspectRatio: '1:1',
      quality,
    });

    if (result.success && result.image) {
      res.json({ studioImage: result.image, style, fallback: false });
    } else {
      // Fallback gracefully without 500 error code
      res.json({
        studioImage: image,
        style,
        fallback: true,
        quotaExceeded: Boolean(result.quotaExceeded),
        warning: result.warning || 'Fallback to client synthesis',
      });
    }
  } catch (err: any) {
    console.log('[KittStudio AI] Studio shot notice:', err?.message || err);
    res.json({
      studioImage: req.body.image,
      style: req.body.style || 'clean-white',
      fallback: true,
      error: err.message,
    });
  }
});

// 4. Generate scene (Mockups, Lifestyle, Social media format)
app.post('/api/generate-scene', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      referenceImage,
      sceneId,
      aspectRatio = '1:1',
      quality = 'low',
      customPrompt,
    } = req.body;

    if (!referenceImage) {
      res.status(400).json({ error: 'Reference image is required' });
      return;
    }

    if (!ai) {
      res.json({
        image: referenceImage,
        simulated: true,
        fallback: true,
      });
      return;
    }

    const { data: base64Data, mimeType } = parseBase64(referenceImage);

    // Build specific prompt tailored to the requested scene
    let sceneDescription = '';

    // MOCKUPS
    if (sceneId === 'mockup-mug') {
      sceneDescription =
        'A photorealistic product mockup printed cleanly on a premium ceramic coffee mug placed on a sunlit oak desk next to an open notebook and keyboard, warm natural depth of field.';
    } else if (sceneId === 'mockup-tshirt') {
      sceneDescription =
        'A premium unisex streetwear cotton t-shirt mockup with the exact logo and branding elements of the product neatly printed across the chest, displayed flat-lay on a clean textured linen surface with stylish accessories.';
    } else if (sceneId === 'mockup-billboard') {
      sceneDescription =
        'A massive outdoor urban advertising billboard mockup in a bustling modern metropolis during twilight, featuring this exact product hero image with sleek commercial typography space.';
    } else if (sceneId === 'mockup-packaging') {
      sceneDescription =
        'A high-end retail packaging box and gift bag mockup matching this exact product, sitting gracefully next to the product on a luxury boutique counter.';
    } else if (sceneId === 'mockup-tote') {
      sceneDescription =
        'An organic natural cotton tote bag mockup with the brand design/logo printed sharply, held naturally in a bright city street setting.';
    }
    // LIFESTYLE
    else if (sceneId === 'lifestyle-kitchen') {
      sceneDescription =
        'The exact product sitting naturally on a sun-drenched Scandinavian kitchen marble countertop with fresh breakfast elements, morning light streaming through windows, soft cinematic bokeh.';
    } else if (sceneId === 'lifestyle-desk') {
      sceneDescription =
        'The exact product integrated cleanly into an aesthetic minimalist workspace desk, beside a sleek aluminum laptop, a green potted plant, and warm ambient desk lamp light.';
    } else if (sceneId === 'lifestyle-cafe') {
      sceneDescription =
        'The exact product resting on a round marble bistro table at a chic Parisian outdoor cafe during golden hour, with soft blurred pedestrians and warm street lights in the background.';
    } else if (sceneId === 'lifestyle-nature') {
      sceneDescription =
        'The exact product beautifully arranged in an outdoor organic botanical setting, resting on smooth river stones surrounded by lush green monstera leaves and dappled sunlight.';
    } else if (sceneId === 'lifestyle-luxury') {
      sceneDescription =
        'The exact product staged in a luxurious high-end interior, on a brushed bronze tray with warm accent mood lighting and soft velvet background.';
    }
    // SOCIAL FORMATS
    else if (sceneId === 'social-story') {
      sceneDescription =
        'A vertical 9:16 high-impact Instagram Story and TikTok commercial poster layout featuring this exact product center-stage with vibrant modern advertising lighting and elegant composition.';
    } else if (sceneId === 'social-square') {
      sceneDescription =
        'A 1:1 square Instagram feed post featuring this exact product with editorial lighting, sharp reflections, and premium studio composition.';
    } else if (sceneId === 'social-banner') {
      sceneDescription =
        'A wide 16:9 panoramic hero website banner showing this exact product displayed on the right with atmospheric space on the left for commercial copy.';
    } else {
      sceneDescription = `The exact product professionally photographed in an elegant commercial context with stunning lighting.`;
    }

    if (customPrompt) {
      sceneDescription += ` User artistic direction: ${customPrompt}.`;
    }

    const fullPrompt = `CRITICAL MANDATE:
You are generating a marketing visual featuring the EXACT product from the reference image.
1. PRESERVE THE PRODUCT: The product shape, colors, logo, brand label typography, and textures must remain 100% IDENTICAL to the reference photo. Do not morph, redesign, or alter the product.
2. ENVIRONMENT & CONTEXT: ${sceneDescription}
3. COMPOSITION: Professional commercial photography, cinematic lighting, ultra-sharp detail, photorealistic rendering.`;

    const result = await generateOrEditImage({
      base64Data,
      mimeType,
      prompt: fullPrompt,
      aspectRatio,
      quality,
    });

    if (result.success && result.image) {
      res.json({ image: result.image, fallback: false });
    } else {
      res.json({
        image: referenceImage,
        fallback: true,
        quotaExceeded: Boolean(result.quotaExceeded),
        warning: result.warning || 'Fallback to client synthesis',
      });
    }
  } catch (err: any) {
    console.log('[KittStudio AI] Scene generation notice:', err?.message || err);
    res.json({
      image: req.body.referenceImage,
      fallback: true,
      error: err.message,
    });
  }
});

// 5. Generate copywriting (slogan, caption, hashtags, CTA) for a visual
app.post('/api/generate-copy', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      productName = 'Produit',
      productDescription = '',
      sceneTitle = '',
      sceneCategory = '',
      language = 'fr',
      brandTone = 'Moderne & Inspirant',
      brandName = '',
    } = req.body;

    if (!ai) {
      const isFr = language === 'fr';
      res.json({
        slogan: isFr ? `${productName} : L'excellence au quotidien.` : `${productName}: Everyday excellence.`,
        caption: isFr
          ? `Découvrez l'alliance parfaite du style et de la performance. Conçu pour sublimer votre quotidien.`
          : `Discover the perfect balance of style and performance. Designed to elevate your daily routine.`,
        hashtags: ['#ProductLaunch', '#QualityFirst', '#DesignLovers', '#NewDrop', '#Lifestyle'],
        callToAction: isFr ? 'Commander maintenant' : 'Shop Now',
        bulletPoints: [
          isFr ? 'Design ergonomique et élégant' : 'Ergonomic & sleek design',
          isFr ? 'Qualité premium garantie' : 'Premium quality guaranteed',
          isFr ? 'Livraison rapide offerte' : 'Free fast shipping',
        ],
      });
      return;
    }

    const langName =
      language === 'fr' ? 'French' : language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'German';

    const prompt = `You are an elite advertising copywriter.
Generate high-converting marketing copy for this visual in ${langName}.

Product Name: ${productName}
${brandName ? `Brand Name: ${brandName}` : ''}
Product Details: ${productDescription}
Visual Scene: ${sceneTitle} (${sceneCategory})
Brand Tone of Voice: ${brandTone}

Requirements:
1. "slogan": Punchy, memorable advertising headline (3 to 7 words).
2. "caption": Engaging social media caption (2 to 4 sentences) highlighting emotional benefit, lifestyle appeal, and a natural call to action.
3. "hashtags": Array of 5 to 7 trending, relevant hashtags (including niche and broad).
4. "callToAction": Compelling button/action text (e.g., "Découvrir la collection", "Commander le vôtre").
5. "bulletPoints": Array of 3 high-impact marketing bullet points.

Format strictly as JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogan: { type: Type.STRING },
            caption: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            callToAction: { type: Type.STRING },
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['slogan', 'caption', 'hashtags', 'callToAction', 'bulletPoints'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.log('[KittStudio AI] Copywriting notice:', err?.message || err);
    res.json({
      fallback: true,
      slogan: `${req.body.productName || 'Produit'} : L'art du détail`,
      caption: 'Conçu avec passion pour sublimer votre quotidien.',
      hashtags: ['#Nouveauté', '#Design', '#Qualité', '#CollectionExclusive'],
      callToAction: req.body.language === 'en' ? 'Shop Now' : 'Découvrir la collection',
      bulletPoints: ['Finition haut de gamme', 'Design exclusif', 'Qualité supérieure'],
    });
  }
});

// 6. Custom scene edit with free text prompt using gemini-3.1-flash-image-preview
app.post('/api/custom-edit', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, editPrompt, quality = 'low', aspectRatio = '1:1' } = req.body;
    if (!image || !editPrompt) {
      res.status(400).json({ error: 'Image and editPrompt are required' });
      return;
    }

    if (!ai) {
      res.json({ image, simulated: true, fallback: true });
      return;
    }

    const { data: base64Data, mimeType } = parseBase64(image);

    const prompt = `CRITICAL TASK: Edit or refine this commercial visual based on user prompt while keeping the central product identical.
User instruction: ${editPrompt}
Ensure the product shape, logo, and core branding remain faithful to the original image.`;

    const result = await generateOrEditImage({
      base64Data,
      mimeType,
      prompt,
      aspectRatio,
      quality,
    });

    if (result.success && result.image) {
      res.json({ image: result.image, fallback: false });
    } else {
      res.json({
        image,
        fallback: true,
        quotaExceeded: Boolean(result.quotaExceeded),
        warning: result.warning || 'Fallback to original',
      });
    }
  } catch (err: any) {
    console.log('[KittStudio AI] Custom edit notice:', err?.message || err);
    res.json({ image: req.body.image, fallback: true, error: err.message });
  }
});

// Vite Middleware for Full-Stack dev mode
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve('dist'));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: 3000, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 KittStudio full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
