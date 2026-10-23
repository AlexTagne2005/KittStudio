export type Language = 'fr' | 'en';

export type SceneCategory = 'mockups' | 'lifestyle' | 'social';

export type StudioStyle = 'clean-white' | 'pedestal' | 'dark-luxury' | 'gradient-pastel';

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface ProductData {
  id: string;
  originalImage: string;
  studioImage: string;
  studioStyle: StudioStyle;
  productName: string;
  category: string;
  description: string;
  colors: string[];
  suggestedTone: string;
  sellingPoints: string[];
}

export interface BrandKit {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  toneOfVoice: string;
  targetAudience: string;
  keyValues: string[];
}

export interface SceneItem {
  id: string;
  title: string;
  category: SceneCategory;
  description: string;
  aspectRatio: AspectRatio;
  formatLabel: string;
  image?: string;
  quality: 'low' | 'high';
  status: 'idle' | 'generating' | 'ready' | 'error';
  errorMessage?: string;
  slogan: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
  bulletPoints?: string[];
  customPrompt?: string;
  isRegenerating?: boolean;
}

export interface Project {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  product: ProductData;
  brandKit: BrandKit;
  scenes: SceneItem[];
  language: Language;
}

export interface PresetProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  suggestedTone: string;
  sellingPoints: string[];
  image: string;
}
