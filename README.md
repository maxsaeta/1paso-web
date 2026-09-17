# UnPaso Web

Aplicación de productividad para personas con TDAH. Una tarea a la vez.

## Deploy

Este proyecto está configurado para deploy automático en Netlify.

### Variables de entorno en Netlify

Configurar en Netlify Dashboard > Site settings > Environment variables:

- `EXPO_PUBLIC_GEMINI_API_KEY` = tu API key de Google Gemini

### Build

```bash
npm install
npx expo export --platform web
```

### Desarrollo local

```bash
npm start
```

Esto abrirá en `http://localhost:19006`

## Stack

- React Native Web
- Expo SDK 57
- Firebase (Auth + Firestore)
- Google Gemini AI
