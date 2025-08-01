# Guide de Contribution - Focusly 🤝

Merci de votre intérêt pour contribuer à Focusly ! Ce guide vous aidera à comprendre comment participer au développement de cette application destinée aux personnes atteintes de TDA/TDAH et HPI.

## 🎯 Comment contribuer

### Types de contributions recherchées

- 🐛 **Corrections de bugs**
- ✨ **Nouvelles fonctionnalités** liées au bien-être et à la concentration
- 📚 **Amélioration de la documentation**
- 🎨 **Améliorations de l'interface utilisateur**
- ♿ **Améliorations d'accessibilité**
- 🌍 **Traductions** (actuellement en français)
- 🧪 **Tests** et amélioration de la qualité du code

### Avant de commencer

1. **Consultez les issues existantes** pour éviter les doublons
2. **Ouvrez une issue** pour discuter des changements majeurs
3. **Respectez l'objectif** de l'application : aider les personnes avec TDA/TDAH et HPI

## 🚀 Configuration de l'environnement de développement

### Prérequis
- Node.js 18+
- npm ou yarn
- Git

### Installation
```bash
# Fork et cloner le repository
git clone https://github.com/votre-username/focusly.git
cd focusly

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Structure du projet
```
src/
├── app/                    # Pages Next.js (App Router)
├── components/            # Composants réutilisables
├── contexts/             # Contextes React
├── hooks/               # Hooks personnalisés
├── lib/                 # Utilitaires
├── types/               # Types TypeScript
└── styles/              # Styles globaux
```

## 📝 Standards de code

### Style de code
- **TypeScript** obligatoire pour tous les nouveaux fichiers
- **ESLint** et **Prettier** pour la cohérence du code
- **Tailwind CSS** pour le styling
- **Composants fonctionnels** avec hooks React

### Conventions de nommage
- **Fichiers** : PascalCase pour les composants (`Timer.tsx`)
- **Variables** : camelCase (`currentTask`)
- **Constantes** : UPPER_SNAKE_CASE (`TIMER_DURATION`)
- **Types** : PascalCase (`TimerSession`)

### Structure des composants
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ComponentProps {
  // Props typées
}

export function Component({ prop }: ComponentProps) {
  // Hooks en premier
  const [state, setState] = useState();
  
  // Fonctions utilitaires
  const handleAction = () => {
    // Logique avec gestion d'erreurs
    try {
      // ...
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // JSX avec accessibilité
  return (
    <div className="space-y-4">
      {/* Contenu */}
    </div>
  );
}
```

## 🎨 Guidelines UI/UX

### Principes de design
- **Minimalisme** : Interface épurée pour réduire les distractions
- **Accessibilité** : Contraste élevé, navigation au clavier
- **Mobile-first** : Responsive design prioritaire
- **Mode sombre** : Par défaut pour réduire la fatigue oculaire

### Couleurs
- **Primaire** : Noir et blanc
- **Accents** : Couleurs subtiles pour les états (succès, erreur, etc.)
- **Éviter** : Couleurs vives ou distractives

### Typographie
- **Police** : Inter (Google Fonts)
- **Hiérarchie** : Tailles cohérentes avec Tailwind
- **Lisibilité** : Espacement suffisant, contraste élevé

## 🧪 Tests et qualité

### Avant de soumettre
```bash
# Vérifier le linting
npm run lint

# Construire le projet
npm run build

# Tester localement
npm run dev
```

### Tests manuels
- ✅ Navigation mobile
- ✅ Fonctionnalités principales
- ✅ Stockage local
- ✅ Notifications
- ✅ Mode hors ligne (PWA)

## 📋 Processus de Pull Request

### 1. Préparation
```bash
# Créer une branche
git checkout -b feature/nom-de-la-fonctionnalite

# Ou pour un bug
git checkout -b fix/description-du-bug
```

### 2. Développement
- Commits atomiques avec messages clairs
- Respecter les conventions de code
- Tester les changements

### 3. Soumission
- **Titre** : Description claire et concise
- **Description** : Expliquer le problème résolu ou la fonctionnalité ajoutée
- **Screenshots** : Pour les changements visuels
- **Tests** : Décrire comment tester les changements

### Template de PR
```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Amélioration
- [ ] Documentation

## Tests
- [ ] Tests manuels effectués
- [ ] Build réussi
- [ ] Lint passé

## Screenshots (si applicable)
[Ajouter des captures d'écran]

## Checklist
- [ ] Code respecte les standards
- [ ] Documentation mise à jour
- [ ] Changements testés
```

## 🐛 Signaler des bugs

### Informations à inclure
- **Description** : Comportement attendu vs observé
- **Étapes** : Comment reproduire le bug
- **Environnement** : Navigateur, OS, version
- **Screenshots** : Si applicable
- **Console** : Messages d'erreur éventuels

### Template d'issue
```markdown
## Description du bug
Description claire du problème

## Étapes pour reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement attendu
Ce qui devrait se passer

## Screenshots
[Ajouter des captures d'écran]

## Environnement
- OS: [ex: Windows 10]
- Navigateur: [ex: Chrome 91]
- Version: [ex: 1.0.0]
```

## 💡 Proposer des fonctionnalités

### Critères d'acceptation
- **Pertinence** : Aide aux personnes avec TDA/TDAH ou HPI
- **Simplicité** : N'ajoute pas de complexité inutile
- **Accessibilité** : Respecte les standards d'accessibilité
- **Performance** : N'impacte pas négativement l'application

### Template de proposition
```markdown
## Fonctionnalité proposée
Description de la fonctionnalité

## Problème résolu
Quel problème cette fonctionnalité résout-elle ?

## Solution proposée
Comment implémenter cette fonctionnalité ?

## Alternatives considérées
Autres approches envisagées

## Bénéfices
- Bénéfice 1
- Bénéfice 2
```

## 🌍 Traductions

Nous accueillons les traductions dans d'autres langues :

1. Créer un fichier `src/locales/[langue].json`
2. Traduire toutes les chaînes de caractères
3. Mettre à jour les composants pour utiliser les traductions
4. Tester l'interface dans la nouvelle langue

## 📞 Obtenir de l'aide

- **Issues GitHub** : Pour les bugs et fonctionnalités
- **Discussions** : Pour les questions générales
- **Documentation** : Consulter le README et le code

## 🙏 Reconnaissance

Tous les contributeurs seront mentionnés dans le README et les notes de version.

---

Merci de contribuer à Focusly et d'aider à améliorer la vie des personnes avec TDA/TDAH et HPI ! 🧠✨
