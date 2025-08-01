#!/bin/bash

# Script de configuration pour Focusly
# Ce script configure l'environnement de développement

set -e

echo "🧠 Configuration de Focusly - Application TDAH/HPI"
echo "=================================================="

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION détectée. Version 18+ requise."
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm $(npm -v) détecté"

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."
npm install

# Vérifier l'installation
if [ $? -eq 0 ]; then
    echo "✅ Dépendances installées avec succès"
else
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# Créer le fichier .env.local s'il n'existe pas
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Création du fichier .env.local..."
    cat > .env.local << EOL
# Configuration locale pour Focusly
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Ajoutez vos variables d'environnement ici si nécessaire
EOL
    echo "✅ Fichier .env.local créé"
fi

# Vérifier la build
echo ""
echo "🔨 Test de build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussie"
else
    echo "❌ Erreur lors de la build"
    exit 1
fi

# Nettoyer après le test
rm -rf .next

# Configuration Git hooks (optionnel)
if [ -d .git ]; then
    echo ""
    echo "🔧 Configuration des Git hooks..."
    
    # Pre-commit hook pour linting
    cat > .git/hooks/pre-commit << 'EOL'
#!/bin/bash
echo "🔍 Vérification du code avant commit..."

# Linting
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Erreurs de linting détectées. Commit annulé."
    exit 1
fi

# Build test
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Erreur de build. Commit annulé."
    exit 1
fi

echo "✅ Code vérifié avec succès"
EOL

    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks configurés"
fi

# Afficher les informations finales
echo ""
echo "🎉 Configuration terminée avec succès !"
echo ""
echo "📋 Commandes disponibles :"
echo "  npm run dev     - Démarrer en mode développement"
echo "  npm run build   - Construire pour la production"
echo "  npm run start   - Démarrer en mode production"
echo "  npm run lint    - Vérifier le code"
echo ""
echo "🚀 Pour commencer :"
echo "  npm run dev"
echo ""
echo "📖 Documentation :"
echo "  README.md       - Documentation complète"
echo "  QUICK_START.md  - Guide de démarrage rapide"
echo "  CONTRIBUTING.md - Guide de contribution"
echo ""
echo "🧠 Focusly est prêt pour le développement !"
echo "Aidons les personnes avec TDAH et HPI ! ✨"
