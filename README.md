# Hôtel Luxe - Site Web de Réservations

Un site web hôtelier complet et fonctionnel pour la gestion des réservations en ligne.

## Fonctionnalités

### 🏨 Gestion des Chambres
- **3 types de chambres**: Standard, Deluxe, Suite
- **Affichage détaillé** avec photos et équipements
- **Système de prix** dynamique selon le type
- **Vérification de disponibilité** en temps réel

### 📅 Réservation en Ligne
- **Formulaire rapide** pour vérifier la disponibilité
- **Formulaire complet** avec toutes les informations client
- **Calcul automatique** du prix total
- **Validation des dates** et des informations
- **Confirmation instantanée** avec numéro de réservation

### 🎨 Design & UX
- **Design moderne** et élégant
- **Fully responsive** pour mobile et desktop
- **Navigation fluide** avec smooth scrolling
- **Animations** et transitions fluides
- **Interface intuitive** et ergonomique

### 💾 Gestion des Données
- **Stockage local** des réservations (localStorage)
- **Export des données** pour l'administration
- **Sauvegarde automatique** des réservations

### 📞 Contact & Services
- **Formulaire de contact** fonctionnel
- **Affichage des services** hôteliers
- **Informations complètes** de contact

## Structure du Projet

```
hotelerie/
├── index.html          # Page principale
├── css/
│   └── style.css       # Styles complets
├── js/
│   └── script.js       # Logique JavaScript
├── data/
│   └── rooms.json      # Données des chambres
├── images/             # Images des chambres
└── README.md          # Documentation
```

## Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Design moderne avec animations
- **JavaScript (ES6+)** - Logique interactive
- **Font Awesome** - Icônes professionnelles
- **Google Fonts** - Typographie moderne

## Fonctionnalités Techniques

### Validation
- Validation des emails et numéros de téléphone
- Vérification de la cohérence des dates
- Contrôle des champs obligatoires

### Calculs
- Calcul automatique du nombre de nuits
- Prix total selon le type de chambre et durée
- Mise à jour en temps réel de l'affichage

### Stockage
- Sauvegarde des réservations dans localStorage
- Format JSON pour l'export des données
- Persistance des données entre sessions

### Responsive Design
- Adaptation mobile-first
- Menu hamburger pour mobile
- Grid et Flexbox pour la mise en page
- Points de rupture optimisés

## Comment Utiliser

1. **Ouvrir le site**: Ouvrir `index.html` dans un navigateur web
2. **Navigation**: Utiliser le menu pour naviguer entre les sections
3. **Réservation rapide**: Remplir le formulaire rapide pour vérifier la disponibilité
4. **Réservation complète**: Remplir toutes les informations pour confirmer
5. **Contact**: Utiliser le formulaire de contact pour toute question
## Prix des Chambres

- **Standard**: 300 000 Ar / nuit
- **Deluxe**: 450 000 Ar / nuit
- **Suite**: 700 000 Ar / nuit

## Personnalisation

### Modifier les prix
Éditer les prix dans `js/script.js` dans l'objet `roomPrices`:
```javascript
const roomPrices = {
    standard: 89,
    deluxe: 129,
    suite: 199
};
```

### Ajouter des chambres
Modifier `data/rooms.json` pour ajouter de nouveaux types de chambres.

### Personnaliser le design
Éditer `css/style.css` pour modifier les couleurs, polices et mise en page.

## Fonctionnalités Futures

- [ ] Connexion client avec comptes
- [ ] Paiement en ligne intégré
- [ ] Système d'avis clients
- [ ] Gestion admin complète
- [ ] Multi-langues
- [ ] Newsletter
- [ ] Promotions et offres spéciales

## Compatibilité

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile iOS 12+
- ✅ Mobile Android 7+

## Développement

Le code suit les meilleures pratiques:
- Code commenté et documenté
- Structure sémantique HTML5
- CSS organisé en sections logiques
- JavaScript modulaire et réutilisable
- Performance optimisée

## License

Ce projet est développé à des fins démonstratives.

---

**Hôtel Luxe** - Une expérience de séjour inoubliable vous attend! 🏨✨
