# Guide de Résolution de Problèmes - Focusly 🔧

Ce guide vous aide à résoudre les problèmes courants lors de l'utilisation ou du développement de Focusly.

## 🚨 Problèmes de Publication GitHub

### Erreur "failed to execute 'setItem' on 'Storage'"

**Symptôme :** Erreur lors du commit ou de la publication sur GitHub
```
failed to execute 'setItem' on 'Storage'
```

**Cause :** Problème avec le localStorage côté serveur (SSR)

**Solution :**
1. Le problème a été corrigé dans `src/lib/storage.ts`
2. Vérifiez que vous avez la dernière version du fichier
3. Si le problème persiste :
   ```bash
   # Nettoyer le cache Next.js
   rm -rf .next
   npm run build
   ```

### Erreur de Build lors du Déploiement

**Symptôme :** La build échoue sur Vercel/Netlify
```
Build failed with exit code 1
```

**Solutions :**
1. **Vérifier les dépendances :**
   ```bash
   npm install
   npm run build
   ```

2. **Nettoyer et rebuilder :**
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Vérifier les variables d'environnement :**
   - Créer `.env.local` avec `NODE_ENV=production`

## 💾 Problèmes de Stockage Local

### Données Perdues

**Symptôme :** Les données utilisateur disparaissent

**Solutions :**
1. **Vérifier le localStorage :**
   ```javascript
   // Dans la console du navigateur
   console.log(localStorage.getItem('focusly-data'));
   ```

2. **Exporter régulièrement :**
   - Utiliser la fonction d'export dans l'app
   - Sauvegarder le fichier JSON

3. **Mode navigation privée :**
   - Les données sont effacées à la fermeture
   - Utiliser le mode normal

### Erreur "localStorage is not defined"

**Symptôme :** Erreur côté serveur
```
ReferenceError: localStorage is not defined
```

**Solution :** Déjà corrigée dans le code, mais si elle persiste :
```typescript
// Vérifier avant utilisation
if (typeof window !== 'undefined' && window.localStorage) {
  // Utiliser localStorage
}
```

## 🔔 Problèmes de Notifications

### Notifications ne Fonctionnent Pas

**Symptôme :** Pas de notifications malgré l'autorisation

**Solutions :**
1. **Vérifier les permissions :**
   ```javascript
   console.log(Notification.permission);
   ```

2. **Réautoriser :**
   - Paramètres navigateur → Site → Notifications → Autoriser

3. **Tester manuellement :**
   ```javascript
   new Notification('Test', { body: 'Notification test' });
   ```

### Notifications Bloquées

**Symptôme :** Permission refusée automatiquement

**Solutions :**
1. **Réinitialiser les permissions :**
   - Chrome : Paramètres → Confidentialité → Paramètres du site
   - Firefox : Paramètres → Vie privée → Permissions

2. **Vérifier le protocole :**
   - HTTPS requis pour les notifications
   - Localhost fonctionne en développement

## 📱 Problèmes PWA

### App ne s'Installe Pas

**Symptôme :** Pas de bouton "Installer l'app"

**Solutions :**
1. **Vérifier le manifest :**
   - Accessible à `/manifest.json`
   - Syntaxe JSON valide

2. **Vérifier HTTPS :**
   - Requis pour PWA (sauf localhost)

3. **Vider le cache :**
   - F12 → Application → Storage → Clear storage

### Mode Hors Ligne ne Fonctionne Pas

**Symptôme :** App ne fonctionne pas sans internet

**Solutions :**
1. **Service Worker :**
   - Vérifier dans F12 → Application → Service Workers

2. **Cache :**
   - Vérifier le cache dans F12 → Application → Cache Storage

## 🎮 Problèmes de Jeux Cérébraux

### Jeux ne se Chargent Pas

**Symptôme :** Écran blanc ou erreur JavaScript

**Solutions :**
1. **Vérifier la console :**
   - F12 → Console pour voir les erreurs

2. **Recharger la page :**
   - Ctrl+F5 pour forcer le rechargement

3. **Vider le cache :**
   - Paramètres navigateur → Effacer les données

### Scores ne se Sauvegardent Pas

**Symptôme :** Scores perdus après fermeture

**Solutions :**
1. **Vérifier localStorage :**
   - Voir section "Problèmes de Stockage Local"

2. **Permissions du navigateur :**
   - Autoriser le stockage local

## 🧘‍♀️ Problèmes de Méditation

### Timer ne Fonctionne Pas

**Symptôme :** Compte à rebours bloqué

**Solutions :**
1. **Recharger la page**
2. **Vérifier JavaScript :**
   - F12 → Console pour erreurs

3. **Navigateur à jour :**
   - Mettre à jour le navigateur

### Audio ne Fonctionne Pas

**Symptôme :** Pas de son pour les exercices

**Solutions :**
1. **Vérifier le volume :**
   - Volume système et navigateur

2. **Autoplay bloqué :**
   - Cliquer d'abord sur la page

3. **Permissions audio :**
   - Autoriser l'audio dans les paramètres

## 📊 Problèmes d'Analyses

### Graphiques ne s'Affichent Pas

**Symptôme :** Zone vide à la place des graphiques

**Solutions :**
1. **Données insuffisantes :**
   - Utiliser l'app quelques jours

2. **Erreur JavaScript :**
   - Vérifier F12 → Console

3. **Recharts :**
   - Recharger la page

### Données Incohérentes

**Symptôme :** Statistiques incorrectes

**Solutions :**
1. **Réinitialiser les données :**
   - Paramètres → Effacer toutes les données

2. **Export/Import :**
   - Exporter, vérifier, réimporter

## 🔧 Problèmes de Développement

### Erreurs TypeScript

**Symptôme :** Erreurs de compilation TS

**Solutions :**
1. **Vérifier les types :**
   ```bash
   npx tsc --noEmit
   ```

2. **Mettre à jour les types :**
   ```bash
   npm update @types/node @types/react
   ```

### Erreurs ESLint

**Symptôme :** Erreurs de linting

**Solutions :**
1. **Corriger automatiquement :**
   ```bash
   npm run lint -- --fix
   ```

2. **Configuration :**
   - Vérifier `.eslintrc.json`

### Problèmes de Build

**Symptôme :** `npm run build` échoue

**Solutions :**
1. **Nettoyer :**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Dépendances :**
   ```bash
   npm ci
   ```

## 🌐 Problèmes de Navigateur

### Compatibilité

**Navigateurs supportés :**
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

**Fonctionnalités requises :**
- localStorage
- Notifications API
- Service Workers
- ES6+

### Performance

**Symptômes :** App lente ou qui rame

**Solutions :**
1. **Fermer autres onglets**
2. **Redémarrer navigateur**
3. **Vider le cache**
4. **Mettre à jour navigateur**

## 📞 Obtenir de l'Aide

### Avant de Signaler un Bug

1. **Vérifier ce guide**
2. **Reproduire le problème**
3. **Vérifier la console (F12)**
4. **Tester sur autre navigateur**

### Informations à Fournir

Lors du signalement d'un bug :

```markdown
**Environnement :**
- OS : [Windows 10 / macOS / Linux]
- Navigateur : [Chrome 91 / Firefox 89]
- Version Focusly : [1.0.0]

**Problème :**
- Description claire du problème
- Étapes pour reproduire
- Comportement attendu vs observé

**Console :**
- Messages d'erreur (F12 → Console)
- Screenshots si pertinent
```

### Canaux de Support

- **GitHub Issues :** Pour bugs et fonctionnalités
- **Discussions :** Pour questions générales
- **Documentation :** README et guides

## 🔄 Réinitialisation Complète

**En dernier recours :**

1. **Effacer toutes les données :**
   ```javascript
   // Dans la console
   localStorage.clear();
   location.reload();
   ```

2. **Réinstaller PWA :**
   - Désinstaller l'app
   - Vider cache navigateur
   - Réinstaller

3. **Reset développement :**
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run dev
   ```

---

**Si votre problème n'est pas listé ici, n'hésitez pas à ouvrir une issue sur GitHub ! 🚀**
