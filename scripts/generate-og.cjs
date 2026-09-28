const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create OG image (1200x630) programmatically
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FDFDF8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#DCE5DF;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="neuroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#006E54;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#84DAB9;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="neuroGradText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#006E54;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#84DAB9;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect x="0" y="0" width="1200" height="630" fill="url(#bgGrad)"/>

  <!-- Decorative top accent -->
  <rect x="0" y="0" width="1200" height="8" fill="url(#neuroGrad)"/>

  <!-- Left side: Logo mark -->
  <g transform="translate(120, 150)">
    <defs>
      <linearGradient id="neuroGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#006E54;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#84DAB9;stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="M 80 244 
             L 80 76 
             Q 80 44 112 44 
             L 280 44 
             Q 312 44 312 76 
             L 312 244" 
         fill="none" 
         stroke="url(#neuroGrad)" 
         stroke-width="28" 
         stroke-linecap="round"
         stroke-linejoin="round"/>

    <path d="M 320 188 
             L 380 188 
             L 380 168 
             L 420 188 
             L 380 208 
             L 380 188 
             L 320 188" 
         fill="url(#neuroGrad)" 
         stroke="none"/>

    <path d="M 112 156 
             L 160 204 
             L 310 88" 
         fill="none" 
         stroke="#FDFDF8" 
         stroke-width="20" 
         stroke-linecap="round"
         stroke-linejoin="round"/>
  </g>

  <!-- Right side: Text content -->
  <text x="520" y="240" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="72" font-weight="800" fill="url(#neuroGradText)">NEUROPASO</text>
  <text x="520" y="310" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="28" font-weight="400" fill="#404944">Un paso a la vez</text>

  <!-- Tagline -->
  <text x="520" y="380" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="32" font-weight="500" fill="#1A1C1B">Productividad compasiva sin suscripciones</text>
  <text x="520" y="430" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="26" font-weight="400" fill="#404944">Regla del 3 · Micro-pasos IA · Pomodoro · Rachas compasivas · Cierre diario</text>

  <!-- Feature badges -->
  <g transform="translate(520, 480)">
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="220" height="56" rx="28" fill="url(#neuroGrad)" opacity="0.15"/>
      <text x="110" y="36" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="18" font-weight="600" fill="url(#neuroGrad)">✓ 100% Gratis</text>
    </g>
    <g transform="translate(240, 0)">
      <rect x="0" y="0" width="220" height="56" rx="28" fill="#BA1A1A" opacity="0.15"/>
      <text x="110" y="36" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="18" font-weight="600" fill="#BA1A1A">La Cosa</text>
    </g>
    <g transform="translate(480, 0)">
      <rect x="0" y="0" width="220" height="56" rx="28" fill="#E69A0B" opacity="0.15"/>
      <text x="110" y="36" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="18" font-weight="600" fill="#E69A0B">Estaría Bien</text>
    </g>
    <g transform="translate(720, 0)">
      <rect x="0" y="0" width="220" height="56" rx="28" fill="#107C41" opacity="0.15"/>
      <text x="110" y="36" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="18" font-weight="600" fill="#107C41">Si Estoy Encendido</text>
    </g>
  </g>

  <!-- Bottom attribution -->
  <text x="1100" y="600" text-anchor="end" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="18" font-weight="400" fill="#707974" opacity="0.7">neuropaso.app</text>
</svg>
`;

async function generateOg() {
  const outputDir = path.resolve(__dirname, '..', 'public', 'assets');
  const outputPng = path.join(outputDir, 'og-image.png');
  
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630, { fit: 'fill' })
    .png()
    .toFile(outputPng);
  
  console.log('✓ og-image.png (1200x630) generado en', outputPng);
}

generateOg().catch(console.error);