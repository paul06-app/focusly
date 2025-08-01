# Focusly 🧠

Une application mobile progressive (PWA) conçue pour aider les personnes atteintes de TDA/TDAH et à haut potentiel intellectuel (HPI) à gérer leur attention, concentration, gestion du temps, stimulation cognitive et bien-être émotionnel.

![Focusly Screenshot](https://placehold.co/800x400?text=Focusly+App+Screenshot)

## ✨ Fonctionnalités

### 🎯 Gestion de l'attention
- **Timer Pomodoro** personnalisable (25/5/15 minutes)
- **Notifications intelligentes** pour rester concentré
- **Mode focus** avec suivi des sessions
- **Historique détaillé** des sessions de travail

### 📋 Suivi et organisation des tâches
- **To-do lists interactives** avec priorités (haute/moyenne/basse)
- **Sous-tâches** pour décomposer les projets complexes
- **Échéances et rappels** pour ne rien oublier
- **Filtres et tri avancés** pour une organisation optimale
- **Statistiques de completion** pour suivre vos progrès

### 🧠 Stimulation cognitive
- **4 types de jeux cérébraux** :
  - 🧩 **Mémoire** : Reproduire des séquences de couleurs
  - 🎯 **Attention** : Identifier rapidement des couleurs cibles
  - 🔢 **Logique** : Compléter des suites numériques
  - ⚡ **Vitesse** : Résoudre des calculs chronométrés
- **Scores et progression** sauvegardés automatiquement
- **Statistiques par type** de jeu

### 🧘‍♀️ Gestion émotionnelle
- **Exercices de respiration guidée** avec 4 rythmes différents
- **Méditation guidée** (pleine conscience, scan corporel)
- **Suivi d'humeur quotidien** avec évaluation de l'énergie et du stress
- **Suggestions personnalisées** selon votre état émotionnel
- **Historique et tendances** pour identifier les patterns

### 📊 Analyses et progrès
- **Score de bien-être global** calculé automatiquement
- **Graphiques interactifs** pour visualiser vos progrès
- **Objectifs hebdomadaires** avec suivi de progression
- **Séries de jours consécutifs** (streaks) pour la motivation
- **Insights personnalisés** et recommandations

### 🎨 Interface moderne
- **Design minimaliste** en noir et blanc pour réduire les distractions
- **Navigation mobile intuitive** avec onglets en bas d'écran
- **Mode sombre par défaut** pour réduire la fatigue oculaire
- **PWA installable** sur mobile et desktop
- **Notifications navigateur** pour les rappels

## 🚀 Installation et utilisation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/votre-username/focusly.git
cd focusly

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Ouvrir http://localhost:3000 dans votre navigateur
```

### Installation comme PWA
1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "Installer l'application" dans la barre d'adresse
3. L'application sera disponible comme une app native sur votre appareil

## 🛠️ Technologies utilisées

- **Framework** : Next.js 15.3.2 avec App Router
- **Language** : TypeScript
- **Styling** : Tailwind CSS 4.1.6
- **UI Components** : shadcn/ui avec Radix UI
- **Charts** : Recharts pour les graphiques
- **Forms** : React Hook Form + Zod
- **Dates** : date-fns
- **Storage** : localStorage avec gestion d'erreurs
- **PWA** : Manifest + Service Worker
- **Notifications** : Web Notifications API

## 📱 Compatibilité

- ✅ Chrome/Chromium (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile (iOS/Android)
- ✅ Mode hors ligne (PWA)

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linting
npm run lint
```

## 📊 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Dashboard principal
│   ├── tasks/             # Gestion des tâches
│   ├── timers/            # Timer et focus
│   ├── cognitive/         # Jeux cérébraux
│   ├── emotion/           # Bien-être émotionnel
│   └── analytics/         # Analyses et progrès
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI (shadcn)
│   ├── Timer.tsx         # Timer Pomodoro
│   ├── TaskList.tsx      # Gestion des tâches
│   ├── BrainGame.tsx     # Jeux cérébraux
│   ├── MeditationGuide.tsx # Méditation
│   ├── MoodTracker.tsx   # Suivi d'humeur
│   └── AnalyticsChart.tsx # Graphiques
├── contexts/             # Contextes React
├── hooks/               # Hooks personnalisés
├── lib/                 # Utilitaires
├── types/               # Types TypeScript
└── styles/              # Styles globaux
```

## 💾 Gestion des données

- **Stockage local** : Toutes les données sont stockées localement dans le navigateur
- **Export/Import** : Possibilité d'exporter et importer vos données
- **Pas de serveur** : Application entièrement côté client
- **Confidentialité** : Vos données restent privées sur votre appareil

## 🎯 Public cible

Cette application est spécialement conçue pour :
- Personnes atteintes de **TDA/TDAH**
- Personnes à **haut potentiel intellectuel (HPI)**
- Toute personne souhaitant améliorer sa **concentration** et son **bien-être**

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour le framework
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [shadcn/ui](https://ui.shadcn.com/) pour les composants UI
- [Recharts](https://recharts.org/) pour les graphiques
- La communauté open source pour les outils utilisés

## 📞 Support

Si vous avez des questions ou des problèmes :
- Ouvrez une [issue](https://github.com/votre-username/focusly/issues)
- Consultez la [documentation](https://github.com/votre-username/focusly/wiki)

---

**Focusly** - Prenez le contrôle de votre attention et de votre bien-être 🧠✨
