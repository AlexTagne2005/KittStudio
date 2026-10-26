import { AspectRatio, SceneItem } from '../types';

/**
 * Creates high-fidelity visual compositions combining the studio product image
 * with realistic scene environments (mockups, lifestyle settings, and social layouts).
 */
export async function synthesizeSceneVisual(
  studioImageSrc: string,
  scene: SceneItem,
  aspectRatio: AspectRatio,
  palette: string[] = ['#0f172a', '#3b82f6', '#f8fafc', '#f59e0b']
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Determine canvas dimensions based on aspect ratio
      let width = 800;
      let height = 800;

      if (aspectRatio === '9:16') {
        width = 675;
        height = 1200;
      } else if (aspectRatio === '16:9') {
        width = 1200;
        height = 675;
      } else if (aspectRatio === '4:3') {
        width = 1000;
        height = 750;
      } else if (aspectRatio === '3:4') {
        width = 750;
        height = 1000;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(studioImageSrc);
        return;
      }

      const primary = palette[0] || '#1e293b';
      const secondary = palette[1] || '#3b82f6';
      const accent = palette[2] || '#f59e0b';
      const light = palette[3] || '#f8fafc';

      // 1. Render Background Environment
      if (scene.id === 'mockup-mug') {
        renderMugMockup(ctx, img, width, height, primary, secondary, accent);
      } else if (scene.id === 'mockup-tshirt') {
        renderTshirtMockup(ctx, img, width, height, primary, secondary);
      } else if (scene.id === 'mockup-billboard') {
        renderBillboardMockup(ctx, img, width, height, primary, secondary, accent);
      } else if (scene.id === 'mockup-packaging') {
        renderPackagingMockup(ctx, img, width, height, primary, secondary, light);
      } else if (scene.id === 'lifestyle-kitchen') {
        renderKitchenLifestyle(ctx, img, width, height, light, primary);
      } else if (scene.id === 'lifestyle-desk') {
        renderDeskLifestyle(ctx, img, width, height, primary, secondary);
      } else if (scene.id === 'lifestyle-cafe') {
        renderCafeLifestyle(ctx, img, width, height, accent, primary);
      } else if (scene.id === 'lifestyle-nature') {
        renderNatureLifestyle(ctx, img, width, height, secondary, light);
      } else if (scene.id === 'social-story') {
        renderStoryLayout(ctx, img, width, height, primary, secondary, accent, scene.slogan);
      } else if (scene.id === 'social-square') {
        renderSocialSquare(ctx, img, width, height, primary, secondary, accent, scene.slogan);
      } else if (scene.id === 'social-banner') {
        renderBannerLayout(ctx, img, width, height, primary, secondary, accent, scene.slogan);
      } else {
        renderGenericStudio(ctx, img, width, height, primary, secondary);
      }

      resolve(canvas.toDataURL('image/png', 0.9));
    };

    img.onerror = () => {
      resolve(studioImageSrc);
    };

    img.src = studioImageSrc;
  });
}

function renderMugMockup(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  primary: string,
  secondary: string,
  accent: string
) {
  // Cozy wooden desk with ambient light
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#f1f5f9');
  bgGrad.addColorStop(0.6, '#e2e8f0');
  bgGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Table surface
  ctx.fillStyle = '#b45309';
  const woodGrad = ctx.createLinearGradient(0, h * 0.55, 0, h);
  woodGrad.addColorStop(0, '#78350f');
  woodGrad.addColorStop(0.2, '#92400e');
  woodGrad.addColorStop(1, '#451a03');
  ctx.fillStyle = woodGrad;
  ctx.fillRect(0, h * 0.55, w, h * 0.45);

  // Soft table shadow for mug
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.72, w * 0.26, h * 0.05, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.filter = 'blur(16px)';
  ctx.fill();
  ctx.restore();

  // Ceramic Mug Body
  const mugW = w * 0.38;
  const mugH = h * 0.42;
  const mugX = w * 0.5 - mugW * 0.5;
  const mugY = h * 0.35;

  // Handle
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(mugX + mugW + w * 0.05, mugY + mugH * 0.45, w * 0.07, h * 0.12, 0, 0, Math.PI * 2);
  ctx.lineWidth = w * 0.035;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.restore();

  // Mug cylindrical body
  const mugGrad = ctx.createLinearGradient(mugX, 0, mugX + mugW, 0);
  mugGrad.addColorStop(0, '#e2e8f0');
  mugGrad.addColorStop(0.15, '#ffffff');
  mugGrad.addColorStop(0.7, '#f8fafc');
  mugGrad.addColorStop(1, '#94a3b8');

  ctx.fillStyle = mugGrad;
  roundRect(ctx, mugX, mugY, mugW, mugH, 18);
  ctx.fill();

  // Print product design / logo on the mug center
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, mugX + mugW * 0.15, mugY + mugH * 0.18, mugW * 0.7, mugH * 0.65, 12);
  ctx.clip();
  ctx.drawImage(productImg, mugX + mugW * 0.12, mugY + mugH * 0.15, mugW * 0.76, mugH * 0.7);
  ctx.restore();

  // Specular curved cylinder sheen
  const sheenGrad = ctx.createLinearGradient(mugX, 0, mugX + mugW, 0);
  sheenGrad.addColorStop(0, 'rgba(255,255,255,0)');
  sheenGrad.addColorStop(0.2, 'rgba(255,255,255,0.4)');
  sheenGrad.addColorStop(0.4, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheenGrad;
  roundRect(ctx, mugX, mugY, mugW, mugH, 18);
  ctx.fill();
}

function renderTshirtMockup(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  primary: string,
  secondary: string
) {
  // Textured linen background
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, w, h);

  // Subtle studio glow
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, w * 0.6);
  glow.addColorStop(0, 'rgba(39, 39, 42, 0.9)');
  glow.addColorStop(1, '#09090b');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // T-Shirt Shape
  const tshirtW = w * 0.72;
  const tshirtH = h * 0.72;
  const cx = w * 0.5;
  const cy = h * 0.5;

  ctx.save();
  // Drop shadow
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 20;

  ctx.beginPath();
  // Collar & Shoulders
  ctx.moveTo(cx - tshirtW * 0.2, cy - tshirtH * 0.44);
  ctx.quadraticCurveTo(cx, cy - tshirtH * 0.38, cx + tshirtW * 0.2, cy - tshirtH * 0.44);
  // Right sleeve
  ctx.lineTo(cx + tshirtW * 0.48, cy - tshirtH * 0.28);
  ctx.lineTo(cx + tshirtW * 0.4, cy - tshirtH * 0.1);
  ctx.lineTo(cx + tshirtW * 0.28, cy - tshirtH * 0.16);
  // Right body side
  ctx.lineTo(cx + tshirtW * 0.26, cy + tshirtH * 0.46);
  // Bottom hem
  ctx.quadraticCurveTo(cx, cy + tshirtH * 0.49, cx - tshirtW * 0.26, cy + tshirtH * 0.46);
  // Left body side
  ctx.lineTo(cx - tshirtW * 0.28, cy - tshirtH * 0.16);
  // Left sleeve
  ctx.lineTo(cx - tshirtW * 0.4, cy - tshirtH * 0.1);
  ctx.lineTo(cx - tshirtW * 0.48, cy - tshirtH * 0.28);
  ctx.closePath();

  // Premium cotton fabric gradient
  const fabric = ctx.createLinearGradient(0, cy - tshirtH * 0.5, 0, cy + tshirtH * 0.5);
  fabric.addColorStop(0, '#f8fafc');
  fabric.addColorStop(0.5, '#e2e8f0');
  fabric.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = fabric;
  ctx.fill();
  ctx.restore();

  // Print product artwork on chest
  const printW = tshirtW * 0.36;
  const printH = tshirtH * 0.36;
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, cx - printW * 0.5, cy - printH * 0.55, printW, printH, 8);
  ctx.clip();
  ctx.drawImage(productImg, cx - printW * 0.5, cy - printH * 0.55, printW, printH);
  ctx.restore();

  // Soft fabric crease overlay
  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, tshirtW * 0.2, tshirtH * 0.4, 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function renderBillboardMockup(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  primary: string,
  secondary: string,
  accent: string
) {
  // Twilight city sky
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#0f172a');
  sky.addColorStop(0.5, '#1e1b4b');
  sky.addColorStop(1, '#312e81');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Billboard Board frame
  const bbW = w * 0.78;
  const bbH = h * 0.65;
  const bbX = w * 0.11;
  const bbY = h * 0.12;

  // Steel poles
  ctx.fillStyle = '#334155';
  ctx.fillRect(bbX + bbW * 0.3, bbY + bbH, w * 0.04, h * 0.3);
  ctx.fillRect(bbX + bbW * 0.66, bbY + bbH, w * 0.04, h * 0.3);

  // Outer frame
  ctx.fillStyle = '#020617';
  roundRect(ctx, bbX - 10, bbY - 10, bbW + 20, bbH + 20, 8);
  ctx.fill();

  // Billboard lit screen
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, bbX, bbY, bbW, bbH, 4);
  ctx.clip();

  // Poster background
  const posterBg = ctx.createLinearGradient(bbX, bbY, bbX + bbW, bbY + bbH);
  posterBg.addColorStop(0, '#09090b');
  posterBg.addColorStop(0.7, primary);
  posterBg.addColorStop(1, '#000000');
  ctx.fillStyle = posterBg;
  ctx.fillRect(bbX, bbY, bbW, bbH);

  // Product hero image on the right
  const prodSize = Math.min(bbW * 0.55, bbH * 0.85);
  ctx.drawImage(productImg, bbX + bbW * 0.45, bbY + (bbH - prodSize) * 0.5, prodSize, prodSize);

  // Typographic commercial message on the left
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${Math.floor(bbH * 0.11)}px 'Cabinet Grotesk', sans-serif`;
  ctx.fillText('DISCOVER', bbX + bbW * 0.07, bbY + bbH * 0.38);
  ctx.fillStyle = accent;
  ctx.fillText('THE ICON.', bbX + bbW * 0.07, bbY + bbH * 0.52);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = `500 ${Math.floor(bbH * 0.05)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText('Pure Design & Superior Quality', bbX + bbW * 0.07, bbY + bbH * 0.64);
  ctx.restore();

  // Billboard floodlights
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(bbX + bbW * 0.2, bbY - 22, 28, 12);
  ctx.fillRect(bbX + bbW * 0.5, bbY - 22, 28, 12);
  ctx.fillRect(bbX + bbW * 0.8, bbY - 22, 28, 12);
}

function renderPackagingMockup(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  primary: string,
  secondary: string,
  light: string
) {
  // Luxury studio setting
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#1c1917');
  bg.addColorStop(1, '#0c0a09');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Marble podium
  const podW = w * 0.75;
  const podH = h * 0.16;
  const podX = w * 0.5 - podW * 0.5;
  const podY = h * 0.72;

  ctx.fillStyle = '#292524';
  roundRect(ctx, podX, podY, podW, podH, 8);
  ctx.fill();

  // Packaging Box (Matte black with gold edges)
  const boxW = w * 0.32;
  const boxH = h * 0.44;
  const boxX = w * 0.2;
  const boxY = podY - boxH + 20;

  ctx.save();
  ctx.fillStyle = '#171717';
  roundRect(ctx, boxX, boxY, boxW, boxH, 10);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Box embossed label
  ctx.fillStyle = '#d97706';
  ctx.font = `700 ${Math.floor(boxW * 0.09)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('EXCLUSIVE EDITION', boxX + boxW * 0.5, boxY + boxH * 0.45);
  ctx.restore();

  // Product placed right beside box
  const prodSize = Math.min(w * 0.45, h * 0.55);
  const prodX = w * 0.5;
  const prodY = podY - prodSize + 30;

  // Soft contact shadow under product
  ctx.beginPath();
  ctx.ellipse(prodX + prodSize * 0.5, podY + 5, prodSize * 0.35, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fill();

  ctx.drawImage(productImg, prodX, prodY, prodSize, prodSize);
}

function renderKitchenLifestyle(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  light: string,
  primary: string
) {
  // Morning kitchen soft warm sunlit ambient
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#fef3c7');
  bg.addColorStop(0.4, '#f8fafc');
  bg.addColorStop(0.65, '#e2e8f0');
  bg.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Marble countertop
  const counterY = h * 0.62;
  const marble = ctx.createLinearGradient(0, counterY, 0, h);
  marble.addColorStop(0, '#ffffff');
  marble.addColorStop(0.3, '#f1f5f9');
  marble.addColorStop(1, '#94a3b8');
  ctx.fillStyle = marble;
  ctx.fillRect(0, counterY, w, h - counterY);

  // Marble vein accents
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, counterY + 40);
  ctx.bezierCurveTo(w * 0.3, counterY + 20, w * 0.6, counterY + 70, w, counterY + 50);
  ctx.stroke();

  // Product hero placed with realistic contact reflection
  const prodSize = Math.min(w * 0.55, h * 0.65);
  const prodX = w * 0.5 - prodSize * 0.5;
  const prodY = counterY - prodSize * 0.9;

  // Countertop shadow
  ctx.beginPath();
  ctx.ellipse(w * 0.5, counterY + 10, prodSize * 0.35, 14, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fill();

  ctx.drawImage(productImg, prodX, prodY, prodSize, prodSize);
}

function renderDeskLifestyle(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  primary: string,
  secondary: string
) {
  // Modern desk environment
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Wooden desk surface
  const deskY = h * 0.55;
  const wood = ctx.createLinearGradient(0, deskY, 0, h);
  wood.addColorStop(0, '#78350f');
  wood.addColorStop(1, '#451a03');
  ctx.fillStyle = wood;
  ctx.fillRect(0, deskY, w, h - deskY);

  // Product hero on desk
  const prodSize = Math.min(w * 0.45, h * 0.7);
  const prodX = w * 0.5 - prodSize * 0.5;
  const prodY = deskY - prodSize * 0.85;

  ctx.beginPath();
  ctx.ellipse(w * 0.5, deskY + 12, prodSize * 0.38, 16, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();

  ctx.drawImage(productImg, prodX, prodY, prodSize, prodSize);
}

function renderCafeLifestyle(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  accent: string,
  primary: string
) {
  // Parisian bistro cafe outdoor bokeh
  const bg = ctx.createRadialGradient(w * 0.7, h * 0.3, 20, w * 0.5, h * 0.5, w * 0.8);
  bg.addColorStop(0, '#fef08a');
  bg.addColorStop(0.3, '#fed7aa');
  bg.addColorStop(0.7, '#ca8a04');
  bg.addColorStop(1, '#451a03');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Round marble bistro table top
  const tableY = h * 0.65;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, tableY + h * 0.15, w * 0.45, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#b45309';
  ctx.stroke();

  // Product on bistro table
  const prodSize = Math.min(w * 0.5, h * 0.6);
  const prodX = w * 0.5 - prodSize * 0.5;
  const prodY = tableY - prodSize * 0.7;

  ctx.beginPath();
  ctx.ellipse(w * 0.5, tableY + 5, prodSize * 0.35, 14, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  ctx.drawImage(productImg, prodX, prodY, prodSize, prodSize);
}

function renderNatureLifestyle(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  secondary: string,
  light: string
) {
  // Botanical forest light
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#064e3b');
  bg.addColorStop(0.5, '#047857');
  bg.addColorStop(1, '#022c22');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Flat zen stone
  const stoneY = h * 0.68;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, stoneY, w * 0.4, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#334155';
  ctx.fill();

  // Product hero on stone
  const prodSize = Math.min(w * 0.58, h * 0.65);
  const prodX = w * 0.5 - prodSize * 0.5;
  const prodY = stoneY - prodSize * 0.88;

  ctx.beginPath();
  ctx.ellipse(w * 0.5, stoneY + 5, prodSize * 0.32, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(2, 44, 34, 0.6)';
  ctx.fill();

  ctx.drawImage(productImg, prodX, prodY, prodSize, prodSize);
}

function renderStoryLayout(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  primary: string,
  secondary: string,
  accent: string,
  slogan: string
) {
  // Vertical 9:16 dynamic story poster
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#020617');
  grad.addColorStop(0.4, primary || '#1e1b4b');
  grad.addColorStop(1, '#09090b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Glow orb behind product
  const orb = ctx.createRadialGradient(w * 0.5, h * 0.52, 20, w * 0.5, h * 0.52, w * 0.45);
  orb.addColorStop(0, secondary || 'rgba(59, 130, 246, 0.4)');
  orb.addColorStop(1, 'transparent');
  ctx.fillStyle = orb;
  ctx.fillRect(0, 0, w, h);

  // Header tag
  ctx.fillStyle = accent || '#f59e0b';
  ctx.font = `800 ${Math.floor(w * 0.045)}px 'Cabinet Grotesk', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('NOUVEAUTÉ EXCLUSIVE', w * 0.5, h * 0.14);

  // Dynamic Slogan at top
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${Math.floor(w * 0.075)}px 'Cabinet Grotesk', sans-serif`;
  const cleanSlogan = slogan || "L'EXCELLENCE AU QUOTIDIEN";
  ctx.fillText(cleanSlogan.slice(0, 28), w * 0.5, h * 0.22);

  // Product hero in center
  const prodSize = Math.min(w * 0.8, h * 0.48);
  const prodX = w * 0.5 - prodSize * 0.5;
  const prodY = h * 0.32;

  // Soft shadow
  ctx.beginPath();
  ctx.ellipse(w * 0.5, prodY + prodSize * 0.95, prodSize * 0.4, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();

  ctx.drawImage(productImg, prodX, prodY, prodSize, prodSize);

  // CTA button at bottom
  const btnW = w * 0.72;
  const btnH = h * 0.06;
  const btnX = w * 0.5 - btnW * 0.5;
  const btnY = h * 0.84;

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, btnX, btnY, btnW, btnH, 30);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = `700 ${Math.floor(w * 0.042)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText('DÉCOUVRIR MAINTENANT →', w * 0.5, btnY + btnH * 0.65);
}

function renderSocialSquare(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  primary: string,
  secondary: string,
  accent: string,
  slogan: string
) {
  // Editorial Square 1:1 layout
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#09090b');
  grad.addColorStop(0.5, primary || '#18181b');
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Circular halo
  ctx.save();
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.48, w * 0.36, 0, Math.PI * 2);
  ctx.fillStyle = secondary || '#3b82f6';
  ctx.globalAlpha = 0.15;
  ctx.fill();
  ctx.restore();

  // Product hero
  const prodSize = w * 0.65;
  const prodX = w * 0.5 - prodSize * 0.5;
  const prodY = h * 0.48 - prodSize * 0.5;

  ctx.beginPath();
  ctx.ellipse(w * 0.5, prodY + prodSize * 0.94, prodSize * 0.36, 16, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fill();

  ctx.drawImage(productImg, prodX, prodY, prodSize, prodSize);

  // Slogan footer badge
  if (slogan) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    roundRect(ctx, w * 0.1, h * 0.85, w * 0.8, h * 0.08, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.floor(w * 0.038)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(slogan, w * 0.5, h * 0.9);
  }
}

function renderBannerLayout(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  primary: string,
  secondary: string,
  accent: string,
  slogan: string
) {
  // 16:9 Widescreen hero e-commerce banner
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, '#09090b');
  grad.addColorStop(0.55, primary || '#0f172a');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Left copy section
  ctx.textAlign = 'left';
  ctx.fillStyle = accent || '#f59e0b';
  ctx.font = `800 ${Math.floor(h * 0.07)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText('NOUVELLE COLLECTION 2026', w * 0.08, h * 0.3);

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${Math.floor(h * 0.13)}px 'Cabinet Grotesk', sans-serif`;
  const bannerSlogan = slogan || 'CONÇU POUR INSPIRER';
  ctx.fillText(bannerSlogan.slice(0, 24), w * 0.08, h * 0.46);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${Math.floor(h * 0.065)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText('Livraison offerte & Garantie satisfait ou remboursé', w * 0.08, h * 0.58);

  // Shop CTA button
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, w * 0.08, h * 0.68, w * 0.22, h * 0.15, 8);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = `700 ${Math.floor(h * 0.06)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('COMMANDER →', w * 0.19, h * 0.77);

  // Product hero on the right
  const prodSize = h * 0.85;
  const prodX = w * 0.65;
  const prodY = (h - prodSize) * 0.5;

  ctx.beginPath();
  ctx.ellipse(prodX + prodSize * 0.5, prodY + prodSize * 0.94, prodSize * 0.38, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();

  ctx.drawImage(productImg, prodX, prodY, prodSize, prodSize);
}

function renderGenericStudio(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
  w: number,
  h: number,
  primary: string,
  secondary: string
) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#f8fafc');
  grad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const prodSize = Math.min(w * 0.7, h * 0.7);
  const prodX = (w - prodSize) * 0.5;
  const prodY = (h - prodSize) * 0.5;

  ctx.beginPath();
  ctx.ellipse(w * 0.5, prodY + prodSize * 0.95, prodSize * 0.35, 14, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fill();

  ctx.drawImage(productImg, prodX, prodY, prodSize, prodSize);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Creates a clean, professional studio-style product shot with background isolation,
 * studio lighting and soft drop shadow according to selected style.
 */
export async function synthesizeStudioShot(
  originalImageSrc: string,
  style: 'clean-white' | 'pedestal' | 'dark-luxury' | 'gradient-pastel' = 'clean-white',
  colors: string[] = ['#0f172a', '#3b82f6', '#f8fafc', '#f59e0b']
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 1000;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(originalImageSrc);
        return;
      }

      // 1. Draw Studio Background according to style
      if (style === 'pedestal') {
        // Warm architectural minimalist studio
        const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(0.55, '#f1f5f9');
        bgGrad.addColorStop(0.56, '#e2e8f0');
        bgGrad.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, size, size);

        // Pedestal base shadow
        ctx.beginPath();
        ctx.ellipse(size * 0.5, size * 0.88, size * 0.38, size * 0.08, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
        ctx.fill();

        // 3D Stone Cylinder Pedestal
        const pedW = size * 0.54;
        const pedH = size * 0.18;
        const pedX = (size - pedW) * 0.5;
        const pedY = size * 0.70;

        // Pedestal cylinder wall
        const cylGrad = ctx.createLinearGradient(pedX, 0, pedX + pedW, 0);
        cylGrad.addColorStop(0, '#e2e8f0');
        cylGrad.addColorStop(0.3, '#f1f5f9');
        cylGrad.addColorStop(0.7, '#e2e8f0');
        cylGrad.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = cylGrad;
        ctx.fillRect(pedX, pedY, pedW, pedH);

        // Pedestal bottom ellipse
        ctx.beginPath();
        ctx.ellipse(size * 0.5, pedY + pedH, pedW * 0.5, size * 0.04, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#cbd5e1';
        ctx.fill();

        // Pedestal top surface ellipse
        const topGrad = ctx.createRadialGradient(size * 0.45, pedY, 20, size * 0.5, pedY, pedW * 0.5);
        topGrad.addColorStop(0, '#ffffff');
        topGrad.addColorStop(0.7, '#f8fafc');
        topGrad.addColorStop(1, '#e2e8f0');
        ctx.beginPath();
        ctx.ellipse(size * 0.5, pedY, pedW * 0.5, size * 0.045, 0, 0, Math.PI * 2);
        ctx.fillStyle = topGrad;
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Soft product contact shadow on top of pedestal
        ctx.beginPath();
        ctx.ellipse(size * 0.5, pedY + 4, size * 0.22, size * 0.024, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fill();

        // Draw Product Centered
        const prodH = size * 0.52;
        const aspect = img.width / img.height;
        const prodW = prodH * aspect;
        const px = (size - prodW) * 0.5;
        const py = pedY - prodH + (size * 0.02);
        ctx.drawImage(img, px, py, prodW, prodH);
      } else if (style === 'dark-luxury') {
        // Dramatic Dark Charcoal Obsidian Studio
        const bgGrad = ctx.createRadialGradient(size * 0.5, size * 0.42, 60, size * 0.5, size * 0.5, size * 0.7);
        bgGrad.addColorStop(0, '#27272a');
        bgGrad.addColorStop(0.6, '#18181b');
        bgGrad.addColorStop(1, '#09090b');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, size, size);

        // Ground floor line reflection
        const groundGrad = ctx.createLinearGradient(0, size * 0.65, 0, size);
        groundGrad.addColorStop(0, '#18181b');
        groundGrad.addColorStop(0.1, '#0f172a');
        groundGrad.addColorStop(1, '#020617');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, size * 0.68, size, size * 0.32);

        // Rim lighting glow
        const glowGrad = ctx.createRadialGradient(size * 0.5, size * 0.45, 80, size * 0.5, size * 0.45, size * 0.35);
        glowGrad.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, size, size);

        // Floor reflection
        const prodH = size * 0.52;
        const aspect = img.width / img.height;
        const prodW = prodH * aspect;
        const px = (size - prodW) * 0.5;
        const py = size * 0.22;

        ctx.save();
        ctx.translate(0, py + prodH * 2);
        ctx.scale(1, -1);
        ctx.globalAlpha = 0.15;
        ctx.drawImage(img, px, py, prodW, prodH);
        ctx.restore();

        // Floor contact shadow
        ctx.beginPath();
        ctx.ellipse(size * 0.5, py + prodH, prodW * 0.42, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();

        // Draw Product
        ctx.drawImage(img, px, py, prodW, prodH);
      } else if (style === 'gradient-pastel') {
        // Aesthetic warm pastel gradient studio
        const bgGrad = ctx.createLinearGradient(0, 0, size, size);
        bgGrad.addColorStop(0, '#fef3c7'); // warm cream
        bgGrad.addColorStop(0.5, '#fce7f3'); // soft rose/peach
        bgGrad.addColorStop(1, '#ede9fe'); // delicate lavender
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, size, size);

        // Diffuse ambient floor oval
        ctx.beginPath();
        ctx.ellipse(size * 0.5, size * 0.74, size * 0.32, size * 0.05, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 116, 139, 0.22)';
        ctx.fill();

        const prodH = size * 0.54;
        const aspect = img.width / img.height;
        const prodW = prodH * aspect;
        const px = (size - prodW) * 0.5;
        const py = size * 0.22;
        ctx.drawImage(img, px, py, prodW, prodH);
      } else {
        // Clean White Studio Cyclorama (default)
        const bgGrad = ctx.createRadialGradient(size * 0.5, size * 0.35, 40, size * 0.5, size * 0.5, size * 0.75);
        bgGrad.addColorStop(0, '#ffffff');
        bgGrad.addColorStop(0.7, '#f8fafc');
        bgGrad.addColorStop(1, '#f1f5f9');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, size, size);

        // Ground curvature soft transition
        const groundGrad = ctx.createLinearGradient(0, size * 0.7, 0, size);
        groundGrad.addColorStop(0, 'rgba(241, 245, 249, 0)');
        groundGrad.addColorStop(1, 'rgba(226, 232, 240, 0.5)');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, size * 0.7, size, size * 0.3);

        const prodH = size * 0.54;
        const aspect = img.width / img.height;
        const prodW = prodH * aspect;
        const px = (size - prodW) * 0.5;
        const py = size * 0.22;

        // Realistic layered contact shadow
        ctx.beginPath();
        ctx.ellipse(size * 0.5, py + prodH, prodW * 0.44, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.14)';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(size * 0.5, py + prodH, prodW * 0.28, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
        ctx.fill();

        // Draw Product
        ctx.drawImage(img, px, py, prodW, prodH);
      }

      resolve(canvas.toDataURL('image/png', 0.95));
    };

    img.onerror = () => {
      resolve(originalImageSrc);
    };

    img.src = originalImageSrc;
  });
}

