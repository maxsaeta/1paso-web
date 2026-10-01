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

## Reglas de contenido

Estas decisiones están ratificadas y no se revierten sin acuerdo:

| Regla | Qué implica |
|---|---|
| **La IA es Premium y solo existe en Android** | La web no implementa IA ni la vende. Puede describirse el método, pero nunca ofrecer una función de IA en el navegador ni un precio de pago por ella. |
| **Los legales no se mueven** | `legal/` y `public/legal/` se quedan donde están. `legal/` es el origen que se sube a Google Play Console; `public/legal/` es la copia que se sirve en `/legal/...`. Mover cualquiera de los dos rompe el enlace publicado. |
| **Sin datos de salud** | Nada de categorías `health` en el manifest, ni copy de salud, TDAH o neurodivergencia. |
| **Sin reseñas inventadas** | No se publican `aggregateRating` ni puntuaciones en JSON-LD mientras la app no tenga reseñas reales. |

El JSON-LD es parte de estas reglas: cada bloque `FAQPage` se genera desde un array `faq` en el frontmatter de `src/pages/app.astro`, y sus respuestas deben coincidir **literalmente** con el texto visible. Si divergen, Google las descarta.

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
scripts/                  generadores de iconos y Open Graph
legal/                    copia de los legales sin procesar
docs/                     manual y notas
```

La portada vive en `/`. `/landing` responde 301 hacia `/` para no romper enlaces antiguos. `/app` lleva a la página de información.

## Assets

`public/assets/` es la única fuente. Los SVG de origen se editan a mano y los PNG se derivan de ellos:

| Archivo | Contenido |
|---|---|
| `logo.svg` | marca + wordmark "NEUROPASO" |
| `logo-splash.svg` | solo la marca, sin texto |

Para regenerar los derivados:

```bash
npm run assets            # icon.png, splash, adaptive y monocromo de Android
npm run favicons          # favicon-{48..512}.png, favicon.ico, apple-touch-icon
npm run og                # og-image.png (1200x630)
npm run feature-graphic   # feature-graphic.png (1024x500) para Play Store
```

Todo se escribe en `public/assets/`, que es lo único que Astro copia a `dist/`.

`logo.svg` lleva el wordmark, así que no se usa para los iconos de Android: el sistema recorta el foreground a la zona segura central (72 de 108) y el texto quedaría cortado. Para esos se usa `logo-splash.svg`, que es la marca sin texto.

## Stack

- Astro 5 (genera HTML estático)
- `@astrojs/sitemap` (genera `sitemap-index.xml` en el build)
- Sin framework de UI, sin Expo, sin React

## SEO

`src/layouts/Layout.astro` centraliza el head: canonical, Open Graph, Twitter Card, `theme-color`, `author` y los JSON-LD `MobileApplication` + `Organization`.

| Pieza | Dónde |
|---|---|
| `site: 'https://neuropaso.app'` | `astro.config.mjs`, obligatorio para canonical y sitemap |
| canonical | todas las páginas menos las `noindex` |
| `noindex` | `404.astro`, y `Layout` acepta `noindex` como prop |
| `google-play-app:android:package` | `com.unpaso.app` |
| `FAQPage` | prop `faq` del frontmatter de `app.astro` |
| `robots.txt` | `public/robots.txt`, apunta a `sitemap-index.xml` |

Para cambiar los datos estructurados hay que editar los objetos `softwareSchema`, `orgSchema` y `faqSchema` del frontmatter de `Layout.astro`.