# Guide de Publication sur GitHub - Focusly 🚀

Ce guide vous explique comment publier votre projet Focusly sur GitHub étape par étape.

## 📋 Prérequis

- [ ] Compte GitHub créé
- [ ] Git installé sur votre machine
- [ ] Projet Focusly complété localement

## 🔧 Étape 1 : Préparation Locale

### 1.1 Initialiser Git (si pas déjà fait)
```bash
cd /chemin/vers/focusly
git init
```

### 1.2 Configurer Git
```bash
# Configurer votre identité
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Vérifier la configuration
git config --list
```

### 1.3 Ajouter tous les fichiers
```bash
# Ajouter tous les fichiers
git add .

# Vérifier les fichiers ajoutés
git status
```

### 1.4 Premier commit
```bash
git commit -m "🎉 Initial commit - Focusly v1.0.0

✨ Features:
- Complete ADHD/HPI management app
- Pomodoro timer with notifications
- Task management with priorities
- 4 brain games (memory, attention, logic, speed)
- Meditation and breathing exercises
- Mood tracking with analytics
- Progress charts and wellness score
- PWA with offline support
- Mobile-first responsive design

🛠️ Tech Stack:
- Next.js 15.3.2 + TypeScript
- Tailwind CSS + shadcn/ui
- Recharts for analytics
- Local storage with encryption
- Web Notifications API"
```

## 🌐 Étape 2 : Création du Repository GitHub

### 2.1 Créer le repository
1. Aller sur [github.com](https://github.com)
2. Cliquer sur "New repository" (bouton vert)
3. Remplir les informations :
   - **Repository name** : `focusly`
   - **Description** : `Application mobile progressive pour aider les personnes atteintes de TDA/TDAH et HPI à gérer leur attention, concentration et bien-être`
   - **Visibility** : Public (recommandé pour open source)
   - **Initialize** : Ne pas cocher (nous avons déjà les fichiers)

### 2.2 Configurer le repository
```bash
# Ajouter l'origine remote
git remote add origin https://github.com/VOTRE-USERNAME/focusly.git

# Vérifier
git remote -v
```

### 2.3 Pousser le code
```bash
# Pousser sur la branche main
git branch -M main
git push -u origin main
```

## 🏷️ Étape 3 : Configuration du Repository

### 3.1 Ajouter une description
1. Aller sur votre repository GitHub
2. Cliquer sur l'icône ⚙️ à côté de "About"
3. Ajouter :
   - **Description** : `🧠 Application PWA pour TDAH/HPI - Gestion attention, focus, bien-être`
   - **Website** : URL de déploiement (si disponible)
   - **Topics** : `tdah`, `adhd`, `hpi`, `focus`, `meditation`, `pwa`, `nextjs`, `typescript`, `productivity`, `wellness`

### 3.2 Activer les fonctionnalités
Dans Settings → General :
- [ ] ✅ Issues (pour les bugs et suggestions)
- [ ] ✅ Projects (pour la roadmap)
- [ ] ✅ Wiki (pour la documentation étendue)
- [ ] ✅ Discussions (pour la communauté)

### 3.3 Configurer les branches
Dans Settings → Branches :
- **Default branch** : `main`
- **Branch protection rules** :
  - Require pull request reviews
  - Require status checks (CI)
  - Restrict pushes to matching branches

## 🔒 Étape 4 : Sécurité et Secrets

### 4.1 Configurer Dependabot
Le fichier `.github/dependabot.yml` est déjà créé. Vérifier dans :
Settings → Security & analysis → Dependabot alerts (Activer)

### 4.2 Secrets pour CI/CD (si nécessaire)
Dans Settings → Secrets and variables → Actions :
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 📊 Étape 5 : Améliorer la Visibilité

### 5.1 Ajouter des badges au README
Modifier le README.md pour ajouter en haut :
```markdown
# Focusly 🧠

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.6-38B2AC)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green)](https://web.dev/progressive-web-apps/)
[![GitHub issues](https://img.shields.io/github/issues/VOTRE-USERNAME/focusly)](https://github.com/VOTRE-USERNAME/focusly/issues)
[![GitHub stars](https://img.shields.io/github/stars/VOTRE-USERNAME/focusly)](https://github.com/VOTRE-USERNAME/focusly/stargazers)
```

### 5.2 Créer une release
```bash
# Créer un tag
git tag -a v1.0.0 -m "🎉 Focusly v1.0.0 - Initial Release

🚀 First stable release of Focusly!

✨ Complete feature set:
- ADHD/HPI focused productivity app
- Pomodoro timer with smart notifications  
- Advanced task management
- 4 brain training games
- Meditation & breathing exercises
- Mood tracking & analytics
- PWA with offline support

🛠️ Built with Next.js 15, TypeScript, Tailwind CSS"

# Pousser le tag
git push origin v1.0.0
```

Puis sur GitHub :
1. Aller dans "Releases"
2. "Create a new release"
3. Choisir le tag `v1.0.0`
4. Titre : `🎉 Focusly v1.0.0 - Initial Release`
5. Description : Copier le message du tag
6. "Publish release"

## 🌟 Étape 6 : Promotion et Communauté

### 6.1 Créer des issues initiales
Créer quelques issues pour guider les contributeurs :
- `[ENHANCEMENT] Add more brain games`
- `[FEATURE] Cloud synchronization (optional)`
- `[DOCS] Improve accessibility documentation`
- `[GOOD FIRST ISSUE] Add French translations`

### 6.2 Configurer les discussions
Activer GitHub Discussions avec catégories :
- **General** : Questions générales
- **Ideas** : Nouvelles fonctionnalités
- **Q&A** : Support technique
- **Show and tell** : Partage d'expériences

### 6.3 Ajouter des labels
Dans Issues → Labels, créer :
- `adhd` (couleur bleue)
- `hpi` (couleur verte)
- `accessibility` (couleur orange)
- `good first issue` (couleur verte claire)
- `help wanted` (couleur rouge)
- `enhancement` (couleur bleue claire)

## 📈 Étape 7 : Monitoring et Analytics

### 7.1 GitHub Insights
Surveiller dans l'onglet "Insights" :
- Traffic (visiteurs)
- Clones (téléchargements)
- Forks et stars
- Contributors

### 7.2 Configurer les notifications
Dans Settings → Notifications :
- Issues et PR
- Releases
- Security alerts

## 🚀 Étape 8 : Déploiement

### 8.1 Déployer sur Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### 8.2 Mettre à jour le README
Ajouter l'URL de déploiement :
```markdown
## 🌐 Demo Live
👉 **[Essayer Focusly](https://focusly.vercel.app)**
```

## ✅ Checklist Finale

Avant de publier, vérifier :

### Code et Documentation
- [ ] Tous les fichiers sont committés
- [ ] README.md complet et à jour
- [ ] LICENSE présent
- [ ] CONTRIBUTING.md détaillé
- [ ] SECURITY.md configuré
- [ ] CHANGELOG.md initialisé

### GitHub Configuration
- [ ] Repository public
- [ ] Description et topics ajoutés
- [ ] Issues et Discussions activées
- [ ] Branch protection configurée
- [ ] Labels créés
- [ ] Release v1.0.0 publiée

### CI/CD
- [ ] GitHub Actions fonctionnelles
- [ ] Tests automatiques passent
- [ ] Déploiement automatique configuré
- [ ] Lighthouse CI configuré

### Communauté
- [ ] Issues initiales créées
- [ ] Templates configurés
- [ ] Code of conduct (optionnel)
- [ ] Discussions initialisées

## 🎉 Félicitations !

Votre projet Focusly est maintenant publié sur GitHub et prêt à aider la communauté TDAH/HPI ! 

### Prochaines étapes :
1. **Partager** sur les réseaux sociaux
2. **Soumettre** à des listes de projets open source
3. **Engager** avec la communauté
4. **Itérer** basé sur les retours

---

**Merci de contribuer à l'amélioration de la vie des personnes neuroatypiques ! 🧠✨**
