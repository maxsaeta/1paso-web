# F7.5 — Proceso de captura de las 6 pantallas Android para Play Store

> **Objetivo**: Obtener capturas reales de las 6 pantallas principales de la app Android en español, con el tema verde (#006E54 / #84DAB9), para subirlas a Play Console y usarlas en la landing web.

---

## 1. Preparación del entorno

### Requisitos

- Android Studio Ladybug+ (o dispositivo físico con Android 10+)
- App instalada en modo debug (`./gradlew installDebug`)
- Cuenta de prueba con tareas de ejemplo variadas (algunas completadas, otras con pasos IA)
- Tema del sistema en **claro** (para capturas principales) y **oscuro** (opcional, 2º set)
- Idioma del dispositivo: **Español (España)**

### Datos de prueba recomendados

Crear al menos:

- 3 tareas activas (una con IA, una manual, una completada parcialmente)
- 1 "La Cosa" de mañana seleccionada en Regla del 3
- 1 sesión Pomodoro completada hoy
- 1 ritual de cierre completado ayer
- Configuración timer: 25/5 (default) y otra personalizada 45/10

---

## 2. Las 6 pantallas requeridas (orden Play Store)

| #     | Pestaña / Pantalla                   | Qué mostrar                                              | Detalles clave                                                           |
| ----- | ------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| **1** | **Pasos** (TasksScreen)              | Lista de tareas activas con micro-pasos IA expandidos    | Mostrar "Paso 2 de 5", botón "Iniciar Timer", check ✓, chip de categoría |
| **2** | **Timer** (TimerScreen)              | Timer Pomodoro en marcha (ej. 12:34)                     | Anillo de progreso, "Bloques completados hoy: 3", botón configurar       |
| **3** | **Regla 3** (PrioritiesScreen)       | 3 slots: _La Cosa_, _Estaría Bien_, _Si Estoy Encendido_ | Colores #BA1A1A / #E69A0B / #107C41, tarea elegida en slot 1             |
| **4** | **Ánimo** (MoodScreen)               | Selector 5 niveles con rampa verde→violeta               | Nota opcional visible, botón "Guardar", 1 registro por día               |
| **5** | **Cierre** (ShutdownScreen)          | 4 pasos con check, prioridad de mañana seleccionada      | Ilustración hero, botón "Confirmar: Hoy terminé" habilitado              |
| **6** | **Progreso** (StatsAndPremiumScreen) | Métricas 2×2, gráfico semanal, tarjeta Cuenta            | "Tareas ilimitadas" (debug), racha compasiva, botón sincronizar          |

---

## 3. Procedimiento de captura

### En emulador (recomendado para consistencia)

```bash
# 1. Crear AVD Pixel 8 Pro API 34 (1440x3120, 440 dpi)
# 2. Iniciar emulador con tema claro del sistema
# 3. Instalar app
adb install -r app/build/outputs/apk/debug/app-debug.apk

# 4. Para cada pantalla:
#    - Navegar a la pestaña
#    - Esperar animaciones (0.5s)
#    - Capturar: Extended Controls (⋯) → Camera → Save screenshot
#    - Guardar como: pantalla-01-pasos.png, pantalla-02-timer.png, etc.

# 5. Repetir en modo oscuro (Settings → Display → Dark theme)
#    Guardar como: pantalla-01-pasos-dark.png, etc.
```

### En dispositivo físico (para capturas reales de Play)

```bash
# 1. Activar "Depuración USB" y "Permitir depuración USB"
# 2. Conectar dispositivo
adb devices  # verificar conexión
# 3. Instalar y capturar igual que arriba
# 4. Usar botones físicos: Power + Vol- (Android 10+)
# 5. Transferir: adb pull /sdcard/Pictures/Screenshots/ .
```

### Atajos útiles

- **Captura rápida emulador**: `Ctrl+S` (Linux/Win) / `Cmd+S` (Mac) en Extended Controls
- **Captura sin UI del emulador**: `adb exec-out screencap -p > pantalla.png`
- **Grabación vídeo (para GIF timer)**: Extended Controls → Record → Save .webm

---

## 4. Especificaciones técnicas Play Store

| Especificación             | Valor                                                   |
| -------------------------- | ------------------------------------------------------- |
| **Formato**                | PNG (sin transparencia) o JPEG (calidad 90+)            |
| **Resolución mínima**      | 1080 × 1920 px (portrait)                               |
| **Resolución recomendada** | 1440 × 2960 px (Pixel 8 Pro) o 1080 × 2400 px           |
| **Ratio**                  | 9:16 a 9:19.5                                           |
| **Tamaño máx.**            | 8 MB por imagen                                         |
| **Cantidad**               | Mín 2, máx 8 por form factor (phone, 7", 10", TV, Wear) |
| **Orientación**            | Solo portrait (la app no soporta landscape)             |

> **Nota**: Play Store redimensiona automáticamente. Subir la mayor resolución posible (1440p) para mejor calidad en todos los dispositivos.

---

## 5. Naming convention para archivos

```
screens/
├── phone/
│   ├── light/
│   │   ├── 01-pasos.png
│   │   ├── 02-timer.png
│   │   ├── 03-regla3.png
│   │   ├── 04-animo.png
│   │   ├── 05-cierre.png
│   │   └── 06-progreso.png
│   └── dark/
│       ├── 01-pasos-dark.png
│       ├── 02-timer-dark.png
│       ├── 03-regla3-dark.png
│       ├── 04-animo-dark.png
│       ├── 05-cierre-dark.png
│       └── 06-progreso-dark.png
└── seven-inch/ (opcional, tablet)
    └── ...
```

---

## 6. GIF del Timer (opcional pero recomendado)

Para la landing (`/landing` sección hero):

```bash
# Grabar 10-15s del timer contando (ej. 25:00 → 24:50)
# En emulador: Extended Controls → Record → Save as .webm
# Convertir a GIF optimizado:
ffmpeg -i timer.webm -vf "fps=10,scale=600:-1:flags=lanczos" -loop 0 timer.gif
gifsicle -O3 --lossy=80 timer.gif -o timer-opt.gif
# Objetivo: < 500 KB, 600px ancho
```

---

## 7. Checklist pre-subida

- [ ] 6 capturas light (portrait, 1440p mínimo)
- [ ] 6 capturas dark (opcional, para ficha Play Store)
- [ ] GIF timer optimizado < 500 KB (opcional)
- [ ] Nombres de archivo según convención
- [ ] Sin datos personales visibles (emails reales, ubicaciones)
- [ ] UI en español, sin textos de prueba ("Test", "Lorem ipsum")
- [ ] Tema verde visible (#006E54 primario, #84DAB9 acento)
- [ ] No hay elementos de debug visibles (botones "Demo", "Eliminar cuenta" en release)
- [ ] Subidas a Play Console → Main store listing → Phone screenshots

---

## 8. Uso en la web (landing.astro)

Una vez subidas a `/public/assets/screens/`:

```astro
<!-- En landing.astro, sección hero o features -->
<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="/assets/screens/phone/dark/01-pasos-dark.png"
    type="image/png"
  />
  <img
    src="/assets/screens/phone/light/01-pasos.png"
    alt="Pantalla Pasos: lista de tareas con micro-pasos IA"
    width="320"
    height="640"
    loading="lazy"
    decoding="async"
  />
</picture>
```

---

## 9. Próximos pasos tras captura

1. Subir a Play Console → **Main store listing** → **Phone screenshots**
2. Añadir capturas a `landing.astro` con `<picture>` + `loading="lazy"`
3. Actualizar `og-image.png` si se usa captura real en lugar de generada
4. Verificar en Play Console preview (device frames)
5. Marcar F7.5 como completado en todo list

---

> **Nota**: Si no hay acceso a emulador/dispositivo ahora, documentar el proceso aquí y ejecutar cuando se tenga el build release firmado. Las capturas son **requisito obligatorio** para publicar en Play Store.
