# NeuroPaso Web

Sitio de marketing de NeuroPaso, 100 % estático con Astro. Sin runtime, sin SPA, sin cliente web.

El producto es la app Android (`com.unpaso.app`). Esta web solo informa: funciones, manual de uso, contacto y trámites legales.

## Deploy

Despliegue automático con Netlify a partir de `main`.

| Ajuste | Valor |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node | 20 (fijado en `.nvmrc` y en `netlify.toml`) |

No hay variables de entorno. La web no habla con Firebase ni con la IA.

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:4321
```

```bash
npm run build    # genera dist/
npm run preview  # sirve dist/ tal cual se despliega
```

## Estructura

```
src/pages/index.astro     portada (la landing)
src/pages/app.astro       página de información de la app
src/pages/404.astro       404
src/layouts/Layout.astro  head compartido, JSON-LD y nav
public/assets/            iconos, favicons y Open Graph
public/legal/             /legal/privacy.html y /legal/terms.html
public/manual/            manual de uso en HTML y PDF
assets/                   originales SVG y PNG que alimentan los scripts
scripts/                  generadores de iconos y Open Graph
legal/                    copia de los legales sin procesar
docs/                     manual y notas
```

La portada vive en `/`. `/landing` responde 301 hacia `/` para no romper enlaces antiguos. `/app` lleva a la página de información.

## Assets

Los SVG y PNG de origen están en `assets/`. Para regenerar los derivados:

```bash
node scripts/generate-assets.js           # iconos desde assets/logo.svg
node scripts/generate-favicons.cjs        # favicons desde public/assets/logo.svg
node scripts/generate-feature-graphic.cjs
node scripts/generate-og.cjs
```

## Stack

- Astro 5 (genera HTML estático)
- Sin framework de UI, sin Expo, sin React