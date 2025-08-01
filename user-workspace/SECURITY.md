# Politique de Sécurité

## Versions Supportées

Nous prenons la sécurité de Focusly au sérieux. Voici les versions actuellement supportées avec des mises à jour de sécurité :

| Version | Supportée          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Signaler une Vulnérabilité

Si vous découvrez une vulnérabilité de sécurité dans Focusly, nous vous demandons de nous la signaler de manière responsable.

### Comment signaler

1. **NE PAS** créer d'issue publique sur GitHub
2. Envoyez un email à : [security@focusly.app] (remplacez par votre email)
3. Incluez autant de détails que possible :
   - Description de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel
   - Versions affectées
   - Toute information technique pertinente

### Ce que vous pouvez attendre

- **Accusé de réception** : Nous accuserons réception de votre rapport dans les 48 heures
- **Évaluation initiale** : Nous évaluerons la vulnérabilité dans les 7 jours
- **Mise à jour régulière** : Nous vous tiendrons informé de nos progrès
- **Résolution** : Nous nous efforcerons de résoudre les vulnérabilités critiques dans les 30 jours

### Divulgation responsable

Nous suivons le principe de divulgation responsable :

1. Nous travaillerons avec vous pour comprendre et résoudre le problème
2. Nous vous créditerons pour la découverte (si vous le souhaitez)
3. Nous publierons un correctif avant toute divulgation publique
4. Nous coordonnerons la divulgation publique avec vous

## Mesures de Sécurité Implémentées

### Côté Client
- **Validation des données** : Toutes les entrées utilisateur sont validées avec Zod
- **Sanitisation** : Les données sont nettoyées avant stockage
- **Stockage local sécurisé** : Chiffrement des données sensibles
- **CSP (Content Security Policy)** : Protection contre XSS
- **HTTPS uniquement** : Toutes les communications sont chiffrées

### Développement
- **Audit automatique** : `npm audit` dans la CI/CD
- **Dépendances à jour** : Mise à jour régulière des dépendances
- **Linting de sécurité** : Règles ESLint pour la sécurité
- **Review de code** : Toutes les PR sont reviewées

### Infrastructure
- **Déploiement sécurisé** : HTTPS, headers de sécurité
- **Monitoring** : Surveillance des erreurs et anomalies
- **Backup** : Sauvegarde régulière des configurations

## Bonnes Pratiques pour les Utilisateurs

### Protection des Données
- Vos données restent sur votre appareil (localStorage)
- Aucune donnée n'est envoyée à des serveurs externes
- Utilisez la fonction d'export pour sauvegarder vos données

### Navigation Sécurisée
- Utilisez toujours HTTPS
- Gardez votre navigateur à jour
- Activez les mises à jour automatiques de l'application

### Signalement de Problèmes
- Signalez tout comportement suspect
- Ne partagez pas d'informations sensibles dans les issues publiques
- Utilisez les canaux de communication sécurisés

## Conformité et Standards

Focusly respecte les standards suivants :

- **RGPD** : Respect de la vie privée et protection des données
- **WCAG 2.1** : Accessibilité pour tous les utilisateurs
- **OWASP Top 10** : Protection contre les vulnérabilités communes
- **CSP Level 3** : Politique de sécurité du contenu

## Contact Sécurité

Pour toute question relative à la sécurité :

- **Email** : [security@focusly.app] (remplacez par votre email)
- **PGP Key** : [Lien vers votre clé PGP si applicable]

## Remerciements

Nous remercions les chercheurs en sécurité qui nous aident à maintenir Focusly sécurisé :

- [Liste des contributeurs sécurité - à mettre à jour]

---

**Merci de nous aider à garder Focusly sécurisé pour tous ! 🔒**
