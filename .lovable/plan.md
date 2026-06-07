# Hero avec photo de groupe

## Objectif
Faire ressentir immédiatement que Futur Proche = des humains, en intégrant une vraie photo de communauté dès le hero (au-dessus de la ligne de flottaison).

## Direction visuelle proposée

Remplacer la colonne droite actuelle du hero (2 cartes stats "Commu_Active" / "Séniorité_Min") par une **composition photo + overlay stats légers**, sur fond navy conservé.

### Layout (desktop, lg:grid-cols-12)
- **Gauche (col-span-6)** : inchangé — badge, H1 rotatif, sous-titre, CTAs.
- **Droite (col-span-6)** : grande photo de groupe (ratio 4/5 ou 5/6 portrait), coins arrondis, halo cyan derrière, grain léger, coins futuristes cyan (style VideoSection). 
  - Petit "polaroïd" décalé en bas-gauche : second visuel plus serré (visages / échange) pour densifier l'humain.
  - Badge flottant en bas-droite : pastille `850+ Futuristes` (mono caps, fond cream/cyan), pour conserver la preuve sociale chiffrée perdue avec les cartes stats.
  - Étiquette mono en haut : `COMMU_2026 · IRL.JPG`, cohérent avec la VideoSection.

### Mobile
- Photo de groupe en pleine largeur **sous** le bloc texte (et au-dessus des CTAs ? → à confirmer). Par défaut : texte → CTAs → photo, pour ne pas pousser le H1 trop bas.
- Le polaroïd secondaire est masqué (`hidden md:block`) pour rester lisible.

### Stats supprimées du hero
Les chiffres "850+" et "7 ans" ne disparaissent pas du site : ils restent traités plus bas dans `KeyElementsSection`. Le hero ne garde que la pastille `850+ Futuristes` en overlay, plus émotionnelle que démonstrative.

## Photo utilisée
Réutiliser `src/assets/community-group.jpg` (déjà dans `PhotoBanner`) comme image principale, et `src/assets/networking-echanges.jpg` comme polaroïd secondaire — pas de nouvel asset à générer dans un premier temps. Si tu veux une photo dédiée hero (plus large, plus "héroïque"), on pourra l'ajouter ensuite.

## Fichiers touchés
- `src/components/home/HeroSection.tsx` — remplacement de la colonne droite, ajout des imports d'images, ajustements responsive.
- Aucun changement sur `index.css`, tokens, ou autres sections.

## Détails techniques
- Image : `<img loading="eager" fetchpriority="high">` (LCP candidate).
- Halo : réutilisation de la classe `card-halo` ou orb cyan dédiée derrière la photo.
- Accessibilité : alt descriptif ("La communauté Futur Proche réunie lors d'un After Proche").
- Performance : pas d'animation lourde sur l'image (respect `prefers-reduced-motion` déjà en place via les hooks existants).

## Hors scope
- Pas de refonte du H1 rotatif ni des CTAs.
- Pas de modification de `PhotoBanner` (la triple photo plus bas reste, on verra après si elle fait doublon).
- Pas de nouvelle photo générée à ce stade.
