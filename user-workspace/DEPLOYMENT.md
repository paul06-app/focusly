# Guide de Déploiement - Focusly 🚀

Ce guide vous explique comment déployer Focusly sur différentes plateformes.

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Git
- Compte sur la plateforme de déploiement choisie

## 🌐 Options de Déploiement

### 1. Vercel (Recommandé)

Vercel est la plateforme idéale pour les applications Next.js.

#### Déploiement automatique depuis GitHub

1. **Connecter le repository**
   ```bash
   # Pousser votre code sur GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Configurer Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Se connecter avec GitHub
   - Importer le repository `focusly`
   - Vercel détectera automatiquement Next.js

3. **Configuration automatique**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Variables d'environnement** (si nécessaire)
   ```
   NODE_ENV=production
   ```

#### Déploiement via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### 2. Netlify

#### Via GitHub

1. **Connecter le repository**
   - Aller sur [netlify.com](https://netlify.com)
   - "New site from Git" → GitHub
   - Sélectionner le repository `focusly`

2. **Configuration de build**
   ```
   Build command: npm run build
   Publish directory: out
   ```

3. **Ajouter dans next.config.ts**
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

#### Via CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Déployer
netlify deploy --prod --dir=out
```

### 3. GitHub Pages

1. **Configurer next.config.ts**
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     basePath: '/focusly',
     assetPrefix: '/focusly/',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

2. **Créer le workflow GitHub Actions**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

3. **Activer GitHub Pages**
   - Repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`

### 4. Docker

#### Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  focusly:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Commandes Docker

```bash
# Build
docker build -t focusly .

# Run
docker run -p 3000:3000 focusly

# Avec Docker Compose
docker-compose up -d
```

## 🔧 Configuration de Production

### Variables d'Environnement

```bash
# .env.production
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Optimisations Next.js

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Compression
  compress: true,
  
  // PWA
  experimental: {
    webpackBuildWorker: true,
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## 📊 Monitoring et Analytics

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Performance Monitoring

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: true,
  },
}
```

## 🔒 Sécurité en Production

### Headers de Sécurité

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### Content Security Policy

```typescript
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
```

## 🚀 Déploiement Automatique

### GitHub Actions pour Vercel

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📱 PWA en Production

### Service Worker

Le service worker est automatiquement généré par Next.js avec la configuration PWA.

### Manifest

Assurez-vous que le manifest.json est accessible :
- URL : `https://votre-domaine.com/manifest.json`
- Headers : `Content-Type: application/manifest+json`

### Installation

Les utilisateurs pourront installer l'app via :
- Chrome : Bouton "Installer" dans la barre d'adresse
- Safari : "Ajouter à l'écran d'accueil"
- Edge : Menu → "Applications" → "Installer cette application"

## 🔍 Tests de Production

### Lighthouse

```bash
# Installer Lighthouse CLI
npm install -g lighthouse

# Tester le site
lighthouse https://votre-domaine.com --output html --output-path ./lighthouse-report.html
```

### Tests de Performance

```bash
# Tester avec différents appareils
lighthouse https://votre-domaine.com --preset=desktop
lighthouse https://votre-domaine.com --preset=mobile
```

## 📞 Support Post-Déploiement

### Monitoring des Erreurs

- Configurer Sentry ou LogRocket
- Surveiller les Core Web Vitals
- Monitorer l'utilisation des ressources

### Mises à Jour

```bash
# Déploiement d'une nouvelle version
git tag v1.0.1
git push origin v1.0.1

# Vercel déploiera automatiquement
```

---

**Votre application Focusly est maintenant prête pour la production ! 🎉**
