## Objectif
Refondre la section « Vous connaissez sûrement ça. » pour obtenir un vrai empilement de 6 cartes comme sur votre visuel :
- bloc de gauche fixe,
- bloc de droite fixe,
- le scroll fait avancer les cartes qui viennent se poser les unes sur les autres,
- un clic sur une carte permet de la rouvrir pour relire son contenu.

## Ce que je vais construire

### 1. Repenser la structure de la section
- Conserver une colonne gauche sticky avec le titre, le texte, l’image et le CTA.
- Remplacer la logique actuelle de cartes sticky indépendantes par une seule zone de droite fixe contenant un stack piloté par le scroll.
- Ajouter sous cette zone un rail de scroll invisible, suffisamment haut pour piloter les 6 étapes sans que les cartes bougent physiquement dans la page.

### 2. Créer un vrai empilement visuel
- Afficher 3 états de cartes à droite :
  - cartes déjà passées = empilées en arrière-plan,
  - carte active = ouverte avec titre + texte,
  - cartes à venir = compactes, visibles en haut de pile.
- Reproduire l’effet du visuel : chaque nouvelle carte “descend” et se pose sur la précédente avec un léger décalage vertical.
- Donner aux cartes un fond crème, une bordure douce et une hiérarchie très lisible pour que le stack soit net et stable.

### 3. Piloter l’animation par le scroll
- Mapper la progression du scroll à un index actif de 0 à 5.
- Faire évoluer les positions, l’opacité et la profondeur des cartes à partir de cet index.
- Garder les deux colonnes fixes pendant toute la séquence, puis relâcher la section une fois les 6 cartes parcourues.

### 4. Ajouter l’interaction au clic
- Rendre chaque carte cliquable.
- Au clic sur une carte empilée ou compacte, l’ouvrir dans la pile sans casser la progression visuelle.
- Prévoir un état “lecture” simple : la carte choisie devient la carte ouverte tant que l’utilisateur n’a pas repris le scroll.

### 5. Préserver le responsive intelligemment
- Desktop : stack fixe complet, fidèle à votre référence.
- Mobile/tablette : fallback plus simple en liste ou accordéon, pour éviter un comportement frustrant sur petit écran.

## Détails techniques
- Fichier principal : `src/components/home/TensionSection.tsx`
- Remplacement de l’`IntersectionObserver` actuel par une logique scroll-progress plus contrôlée.
- Utilisation d’un conteneur sticky unique côté droit au lieu de 6 sticky séparés.
- Animation sans nouvelle dépendance, en gardant le style existant du site.
- Les cartes seront pilotées par un `activeIndex` (scroll) et un `selectedIndex` (clic), avec priorité au clic jusqu’à reprise du scroll.

## Résultat attendu
Une section beaucoup plus claire et maîtrisée : la gauche reste ancrée, la droite devient un stack éditorial interactif, et l’effet d’empilement correspond enfin à ce que montre votre maquette.