const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Feature Graphic para Play Store: 1024x500 px
// Safe zone: mantener contenido importante a >= 80px de los bordes
const featureSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
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
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#BA1A1A;stop-opacity:1" />
      <stop offset="33%" style="stop-color:#E69A0B;stop-opacity:1" />
      <stop offset="66%" style="stop-color:#107C41;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#006E54;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect x="0" y="0" width="1024" height="500" fill="url(#bgGrad)"/>

  <!-- Safe zone indicator (debug - remove in production) -->
  <!-- <rect x="80" y="60" width="864" height="380" fill="none" stroke="#ff0000" stroke-width="2" stroke-dasharray="5,5"/> -->

  <!-- Left side: Logo mark (centered vertically, well within safe zone) -->
  <g transform="translate(120, 130)">
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

  <!-- Right side content: starts at x=500, well within safe zone (80px from right = 944) -->
  <!-- Title -->
  <text x="500" y="110" text-anchor="start" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" fill="url(#neuroGradText)">NEUROPASO</text>
  
  <!-- Tagline -->
  <text x="500" y="155" text-anchor="start" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="400" fill="#404944">Un paso a la vez</text>

  <!-- Subtitle -->
  <text x="500" y="195" text-anchor="start" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="500" fill="#1A1C1B">Productividad compasiva sin suscripciones</text>

  <!-- Feature badges - Regla del 3 colors -->
  <g transform="translate(500, 240)">
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="180" height="44" rx="22" fill="url(#neuroGrad)" opacity="0.15"/>
      <text x="90" y="28" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="600" fill="url(#neuroGrad)">✓ 100% Gratis</text>
    </g>
    <g transform="translate(200, 0)">
      <rect x="0" y="0" width="160" height="44" rx="22" fill="#BA1A1A" opacity="0.15"/>
      <text x="80" y="28" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="600" fill="#BA1A1A">La Cosa</text>
    </g>
    <g transform="translate(380, 0)">
      <rect x="0" y="0" width="160" height="44" rx="22" fill="#E69A0B" opacity="0.15"/>
      <text x="80" y="28" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="600" fill="#E69A0B">Estaría Bien</text>
    </g>
    <g transform="translate(560, 0)">
      <rect x="0" y="0" width="180" height="44" rx="22" fill="#107C41" opacity="0.15"/>
      <text x="90" y="28" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="600" fill="#107C41">Si Estoy Encendido</text>
    </g>
  </g>

  <!-- Feature icons row -->
  <g transform="translate(500, 310)">
    <!-- Feature 1: Pasos IA -->
    <g transform="translate(0, 0)">
      <circle cx="30" cy="30" r="30" fill="url(#neuroGrad)" opacity="0.15"/>
      <path d="M 15 20 L 30 35 L 45 15" fill="none" stroke="url(#neuroGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="80" y="24" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="600" fill="#1A1C1B">Micro-pasos IA</text>
      <text x="80" y="44" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="400" fill="#404944">Divide tareas en pasos</text>
    </g>
    
    <!-- Feature 2: Pomodoro -->
    <g transform="translate(260, 0)">
      <circle cx="30" cy="30" r="30" fill="#BA1A1A" opacity="0.15"/>
      <circle cx="30" cy="30" r="20" fill="none" stroke="#BA1A1A" stroke-width="3"/>
      <path d="M 30 10 L 30 20" fill="none" stroke="#BA1A1A" stroke-width="3" stroke-linecap="round"/>
      <path d="M 30 40 L 30 50" fill="none" stroke="#BA1A1A" stroke-width="3" stroke-linecap="round"/>
      <text x="80" y="24" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="600" fill="#1A1C1B">Timer Pomodoro</text>
      <text x="80" y="44" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="400" fill="#404944">25/5 + descanso largo</text>
    </g>
    
    <!-- Feature 3: Regla del 3 -->
    <g transform="translate(520, 0)">
      <circle cx="30" cy="30" r="30" fill="#E69A0B" opacity="0.15"/>
      <rect x="15" y="10" width="30" height="6" rx="3" fill="#BA1A1A"/>
      <rect x="15" y="24" width="30" height="6" rx="3" fill="#E69A0B"/>
      <rect x="15" y="38" width="30" height="6" rx="3" fill="#107C41"/>
      <text x="80" y="24" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="600" fill="#1A1C1B">Regla del 3</text>
      <text x="80" y="44" text-anchor="start" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="400" fill="#404944">3 prioridades diarias</text>
    </g>
  </g>

  <!-- Bottom: download CTA (centered, well above bottom edge) -->
  <g transform="translate(362, 410)">
    <rect x="0" y="0" width="300" height="48" rx="24" fill="url(#neuroGrad)"/>
    <text x="150" y="30" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="16" font-weight="700" fill="#FFFFFF">Descargar gratis en Google Play</text>
  </g>

  <!-- Small attribution -->
  <text x="944" y="475" text-anchor="end" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="400" fill="#707974" opacity="0.7">neuropaso.app</text>
</svg>
`;

async function generateFeatureGraphic() {
  const outputDir = path.resolve(__dirname, '..', 'public', 'assets');
  const outputPng = path.join(outputDir, 'feature-graphic.png');
  
  await sharp(Buffer.from(featureSvg))
    .resize(1024, 500, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile(outputPng);
  
  console.log('✓ feature-graphic.png (1024x500) generado en', outputPng);
  
  // Verify size
  const stats = fs.statSync(outputPng);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`  Tamaño: ${sizeMB} MB (límite: 15 MB)`);
}

generateFeatureGraphic().catch(console.error);