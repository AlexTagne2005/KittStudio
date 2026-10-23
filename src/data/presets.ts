import { PresetProduct, SceneItem } from '../types';

// High-fidelity SVG-based product presets
function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const PRESET_PRODUCTS: PresetProduct[] = [
  {
    id: 'perfume-ambre',
    name: 'Parfum Artisanal "Ambre Royal"',
    category: 'Parfumerie & Luxe',
    description: 'Une eau de parfum envoûtante aux notes chaleureuses d\'ambre boisé, de bergamote dorée et de fève tonka.',
    colors: ['#D97706', '#78350F', '#1F2937', '#FEF3C7'],
    suggestedTone: 'Luxe & Mystérieux',
    sellingPoints: [
      'Concentration pure à 22% d\'extraits nobles',
      'Flacon en verre facetté taillé à la main',
      'Tenue exceptionnelle supérieure à 14 heures',
    ],
    image: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#b45309" stop-opacity="0.8"/>
            <stop offset="30%" stop-color="#f59e0b" stop-opacity="0.95"/>
            <stop offset="50%" stop-color="#fbbf24" stop-opacity="0.9"/>
            <stop offset="70%" stop-color="#d97706" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#78350f" stop-opacity="0.85"/>
          </linearGradient>
          <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="50%" stop-color="#fef08a"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="15" flood-color="#000000" flood-opacity="0.7"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGrad)"/>
        <ellipse cx="200" cy="340" rx="90" ry="18" fill="#000" opacity="0.6"/>
        <!-- Bottle Body -->
        <g filter="url(#shadow)">
          <rect x="135" y="150" width="130" height="170" rx="20" fill="url(#glassGrad)"/>
          <rect x="145" y="160" width="110" height="150" rx="14" fill="#78350f" opacity="0.3"/>
          <path d="M140 160 L140 310" stroke="#fef08a" stroke-width="4" opacity="0.4"/>
          <!-- Label -->
          <rect x="155" y="200" width="90" height="70" rx="6" fill="#09090b" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="200" y="222" font-family="serif" font-size="10" font-weight="bold" fill="#f59e0b" text-anchor="middle" letter-spacing="3">MAISON D'OR</text>
          <line x1="165" y1="228" x2="235" y2="228" stroke="#f59e0b" stroke-width="0.8"/>
          <text x="200" y="244" font-family="sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">AMBRE ROYAL</text>
          <text x="200" y="258" font-family="sans-serif" font-size="7" fill="#d1d5db" text-anchor="middle" letter-spacing="2">EAU DE PARFUM</text>
          <!-- Neck & Cap -->
          <rect x="180" y="130" width="40" height="22" rx="4" fill="url(#goldCap)"/>
          <rect x="175" y="90" width="50" height="42" rx="8" fill="url(#goldCap)" stroke="#b45309" stroke-width="1"/>
          <!-- Ribbed texture on cap -->
          <line x1="185" y1="92" x2="185" y2="130" stroke="#b45309" stroke-width="1.5" opacity="0.5"/>
          <line x1="195" y1="92" x2="195" y2="130" stroke="#b45309" stroke-width="1.5" opacity="0.5"/>
          <line x1="205" y1="92" x2="205" y2="130" stroke="#b45309" stroke-width="1.5" opacity="0.5"/>
          <line x1="215" y1="92" x2="215" y2="130" stroke="#b45309" stroke-width="1.5" opacity="0.5"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'gourde-terra',
    name: 'Gourde Isotherme "Terra Steel 750ml"',
    category: 'Outdoor & Écologie',
    description: 'Bouteille en acier inoxydable brossé avec double paroi sous vide gardant le froid 24h et le chaud 12h.',
    colors: ['#047857', '#064E3B', '#E2E8F0', '#F59E0B'],
    suggestedTone: 'Aventure & Éco-responsable',
    sellingPoints: [
      'Garantie sans BPA et zéro plastique',
      'Isolation thermique sous vide thermique 24h',
      'Bouchon en bambou naturel étanche',
    ],
    image: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="terraBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#022c22"/>
          </linearGradient>
          <linearGradient id="bottleMatte" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#065f46"/>
            <stop offset="25%" stop-color="#10b981"/>
            <stop offset="60%" stop-color="#059669"/>
            <stop offset="100%" stop-color="#047857"/>
          </linearGradient>
          <linearGradient id="bambooCap" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#d97706"/>
            <stop offset="40%" stop-color="#fde68a"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
          <filter id="bottleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="20" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#terraBg)"/>
        <ellipse cx="200" cy="355" rx="75" ry="16" fill="#000" opacity="0.5"/>
        <g filter="url(#bottleShadow)">
          <!-- Bottle Body -->
          <rect x="150" y="140" width="100" height="195" rx="16" fill="url(#bottleMatte)"/>
          <path d="M150 160 Q150 140 170 130 L180 120 L220 120 L230 130 Q250 140 250 160 Z" fill="url(#bottleMatte)"/>
          <!-- Highlighting reflection -->
          <rect x="160" y="145" width="8" height="180" rx="4" fill="#ffffff" opacity="0.25"/>
          <!-- Brand print -->
          <circle cx="200" cy="220" r="28" fill="none" stroke="#fde68a" stroke-width="2"/>
          <path d="M188 230 L200 206 L212 230 Z" fill="#fde68a"/>
          <text x="200" y="265" font-family="sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">TERRA</text>
          <text x="200" y="278" font-family="sans-serif" font-size="7" fill="#6ee7b7" text-anchor="middle" letter-spacing="2">STEEL 750 ML</text>
          <!-- Steel ring & Bamboo cap -->
          <rect x="180" y="105" width="40" height="16" rx="3" fill="#cbd5e1"/>
          <rect x="174" y="65" width="52" height="42" rx="10" fill="url(#bambooCap)"/>
          <!-- Metal handle loop -->
          <path d="M185 65 Q200 35 215 65" fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'serum-eclat',
    name: 'Sérum Régénérant "Aura Glow"',
    category: 'Cosmétique Bio',
    description: 'Sérum visage antioxydant à base de vitamine C pure, d\'acide hyaluronique et d\'extrait de rose musquée.',
    colors: ['#F43F5E', '#FB7185', '#FFF1F2', '#1E293B'],
    suggestedTone: 'Frais, Lumineux & Bien-être',
    sellingPoints: [
      'Formule 99.4% d\'ingrédients d\'origine naturelle',
      'Effet éclat visible dès 7 jours d\'utilisation',
      'Flacon en verre recyclé avec pipette précise',
    ],
    image: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="cosBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff1f2"/>
            <stop offset="100%" stop-color="#ffe4e6"/>
          </linearGradient>
          <linearGradient id="serumLiquid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#fb7185" stop-opacity="0.85"/>
            <stop offset="50%" stop-color="#fda4af" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.85"/>
          </linearGradient>
          <filter id="cosShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="15" flood-color="#881337" flood-opacity="0.25"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#cosBg)"/>
        <ellipse cx="200" cy="345" rx="60" ry="14" fill="#be123c" opacity="0.15"/>
        <g filter="url(#cosShadow)">
          <!-- Glass Jar -->
          <rect x="155" y="160" width="90" height="160" rx="22" fill="url(#serumLiquid)"/>
          <rect x="160" y="165" width="80" height="150" rx="18" fill="#ffffff" opacity="0.3"/>
          <path d="M165 175 L165 305" stroke="#ffffff" stroke-width="4" opacity="0.6" stroke-linecap="round"/>
          <!-- Minimalist Label -->
          <rect x="165" y="210" width="70" height="75" rx="6" fill="#ffffff" opacity="0.95"/>
          <text x="200" y="232" font-family="sans-serif" font-size="9" font-weight="900" fill="#881337" text-anchor="middle" letter-spacing="2">AURA</text>
          <text x="200" y="246" font-family="serif" font-size="12" font-style="italic" fill="#e11d48" text-anchor="middle">Glow Booster</text>
          <line x1="175" y1="252" x2="225" y2="252" stroke="#f43f5e" stroke-width="0.7"/>
          <text x="200" y="263" font-family="sans-serif" font-size="6" fill="#64748b" text-anchor="middle" letter-spacing="1">VITAMINE C + BOTANIQUE</text>
          <text x="200" y="274" font-family="sans-serif" font-size="6" font-weight="bold" fill="#0f172a" text-anchor="middle">30 ML / 1.0 FL. OZ</text>
          <!-- Dropper Neck & Bulb -->
          <rect x="185" y="138" width="30" height="24" rx="3" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <rect x="180" y="112" width="40" height="28" rx="6" fill="#e2e8f0"/>
          <path d="M188 112 C188 80 212 80 212 112 Z" fill="#ffffff"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'cafe-kivu',
    name: 'Café de Spécialité "Origine Kivu"',
    category: 'Gastronomie & Épicerie',
    description: 'Grains 100% Arabica récoltés en altitude sur les sols volcaniques, torréfaction artisanale aux arômes de cacao et noisette grillée.',
    colors: ['#78350F', '#B45309', '#FDE68A', '#1E293B'],
    suggestedTone: 'Artisanal & Passionné',
    sellingPoints: [
      'Grains bio certifiés commerce équitable',
      'Score de dégustation SCA d\'excellence (87.5/100)',
      'Torréfié fraîchement en France chaque semaine',
    ],
    image: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="pouchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#92400e"/>
            <stop offset="35%" stop-color="#b45309"/>
            <stop offset="70%" stop-color="#d97706"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
          <filter id="pouchShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="20" stdDeviation="15" flood-color="#000" flood-opacity="0.5"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#27272a"/>
        <ellipse cx="200" cy="345" rx="80" ry="16" fill="#000" opacity="0.6"/>
        <g filter="url(#pouchShadow)">
          <!-- Coffee Pouch Stand-up -->
          <polygon points="140,320 260,320 250,110 150,110" fill="url(#pouchGrad)"/>
          <!-- Top seal -->
          <rect x="145" y="95" width="110" height="18" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1"/>
          <!-- Valve circle -->
          <circle cx="200" cy="140" r="7" fill="#451a03"/>
          <circle cx="200" cy="140" r="3" fill="#92400e"/>
          <!-- Label -->
          <rect x="160" y="165" width="80" height="115" rx="6" fill="#fef3c7" stroke="#b45309" stroke-width="1"/>
          <text x="200" y="185" font-family="serif" font-size="10" font-weight="bold" fill="#78350f" text-anchor="middle" letter-spacing="2">ROASTERS</text>
          <text x="200" y="202" font-family="sans-serif" font-size="14" font-weight="900" fill="#451a03" text-anchor="middle">KIVU</text>
          <text x="200" y="215" font-family="sans-serif" font-size="7" fill="#92400e" text-anchor="middle" letter-spacing="1">SINGLE ORIGIN 1800M</text>
          <line x1="170" y1="222" x2="230" y2="222" stroke="#d97706" stroke-width="0.8"/>
          <text x="200" y="235" font-family="sans-serif" font-size="7" font-weight="bold" fill="#78350f" text-anchor="middle">CACAO &bull; CARAMEL &bull; MIEL</text>
          <rect x="175" y="250" width="50" height="18" rx="4" fill="#78350f"/>
          <text x="200" y="262" font-family="sans-serif" font-size="8" font-weight="bold" fill="#fde68a" text-anchor="middle">250g GRAINS</text>
        </g>
      </svg>
    `),
  },
];

export const INITIAL_SCENES: SceneItem[] = [
  // MOCKUPS
  {
    id: 'mockup-mug',
    title: 'Mug Céramique Minimaliste',
    category: 'mockups',
    description: 'Mise en situation de votre produit et logo sur un mug en céramique mat sur un bureau d\'architecte baigné de lumière.',
    aspectRatio: '1:1',
    formatLabel: 'Mug 1:1',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  {
    id: 'mockup-tshirt',
    title: 'T-Shirt Coton Streetwear',
    category: 'mockups',
    description: 'Branding net imprimé sur un t-shirt premium en coton épais, présenté à plat sur lin naturel avec accessoires mode.',
    aspectRatio: '1:1',
    formatLabel: 'T-Shirt 1:1',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  {
    id: 'mockup-packaging',
    title: 'Coffret Cadeau & Packaging Retail',
    category: 'mockups',
    description: 'Le produit présenté avec élégance aux côtés de son packaging de vente haut de gamme sur un socle épuré.',
    aspectRatio: '4:3',
    formatLabel: 'Packaging 4:3',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  {
    id: 'mockup-billboard',
    title: 'Panneau Publicitaire Urbain',
    category: 'mockups',
    description: 'Affiche publicitaire monumentale au cœur d\'une avenue métropolitaine moderne au crépuscule.',
    aspectRatio: '16:9',
    formatLabel: 'Billboard 16:9',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  // LIFESTYLE
  {
    id: 'lifestyle-kitchen',
    title: 'Cuisine Matinale Scandinave',
    category: 'lifestyle',
    description: 'Le produit posé naturellement sur un plan de travail en marbre baigné par le soleil du matin avec ambiance cosy.',
    aspectRatio: '4:3',
    formatLabel: 'Lifestyle 4:3',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  {
    id: 'lifestyle-desk',
    title: 'Bureau Minimaliste & Créatif',
    category: 'lifestyle',
    description: 'Intégration fluide dans un espace de travail contemporain avec ordinateur portable épuré et touche végétale.',
    aspectRatio: '16:9',
    formatLabel: 'Desk 16:9',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  {
    id: 'lifestyle-cafe',
    title: 'Terrasse de Café Parisien',
    category: 'lifestyle',
    description: 'Table ronde en marbre bistrot en terrasse urbaine à l\'heure dorée avec bokeh cinématique doux.',
    aspectRatio: '4:3',
    formatLabel: 'Café 4:3',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  {
    id: 'lifestyle-nature',
    title: 'Jardin Botanique & Galets Zen',
    category: 'lifestyle',
    description: 'Harmonie organique au milieu de feuillages tropicaux et de minéraux sous une lumière filtrée bienfaisante.',
    aspectRatio: '1:1',
    formatLabel: 'Nature 1:1',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  // SOCIAL MEDIA
  {
    id: 'social-story',
    title: 'Instagram & TikTok Story (9:16)',
    category: 'social',
    description: 'Format vertical immersif avec composition percutante et espace libre pour stickers et textes engageants.',
    aspectRatio: '9:16',
    formatLabel: 'Story 9:16',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  {
    id: 'social-square',
    title: 'Post Carré Instagram Feed (1:1)',
    category: 'social',
    description: 'Composition éditoriale carrée d\'une netteté parfaite, idéale pour attirer le regard dans le flux Instagram.',
    aspectRatio: '1:1',
    formatLabel: 'Post 1:1',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
  {
    id: 'social-banner',
    title: 'Bannière Web Hero & LinkedIn (16:9)',
    category: 'social',
    description: 'Format panoramique professionnel avec le produit mis en avant et un vaste espace pour vos titres et boutons.',
    aspectRatio: '16:9',
    formatLabel: 'Bannière 16:9',
    quality: 'low',
    status: 'idle',
    slogan: '',
    caption: '',
    hashtags: [],
    callToAction: '',
  },
];
