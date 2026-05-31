## 1. Déplacer "Trois profils, une même exigence"

- Extraire le bloc `profils` (données + composant `ProfilCard` + JSX du bloc) de `KeyElementsSection.tsx`.
- Créer un nouveau composant `src/components/home/ProfilesSection.tsx` (fond navy, même charte) qui contient ce bloc.
- Dans `src/pages/Index.tsx`, insérer `<ProfilesSection />` **juste après** `<TestimonialsSection />` (et avant `<ForYouSection />`).
- `KeyElementsSection` ne contient plus que les stats + le label "Les chiffres qui comptent".

## 2. "Les chiffres qui comptent" sur 1 ligne

- Passer la grille de `grid-cols-1 md:grid-cols-2` à `grid-cols-2 md:grid-cols-4` (4 cellules alignées).
- Réduire la taille du chiffre : `text-4xl md:text-5xl` (au lieu de `text-6xl md:text-8xl`) pour rester lisible dans une cellule plus étroite.
- Réduire le padding interne des cellules (`p-6 md:p-8`) et la `minHeight` (≈ 240px) pour garder un ratio harmonieux.
- Sur mobile : conserver 2 colonnes (2×2) pour rester lisible, 4 colonnes en `md:` et plus.

## 3. Refonte UX des 6 tensions

Remplacer la couronne statique de blocs texte par une **scène interactive plus vivante**, tout en gardant le contenu actuel (6 points + titre central) :

- Garder le pin desktop (`sticky` + `min-h-[200vh]`), mais transformer la révélation en **diaporama focalisé** :
  - Au scroll, on met en avant **1 tension à la fois** : carte active agrandie, contrastée, avec icône numérotée animée ; les autres restent visibles autour mais atténuées (opacity ~0.25, scale légèrement réduite).
  - Indicateur de progression vertical (6 pastilles) à droite de la scène, cliquable pour sauter à une tension.
  - Le centre garde le titre "Vous connaissez sûrement ça" + ajoute un compteur dynamique `0X / 06`.
- Ajouter une **icône Lucide par tension** (ex. `Wallet`, `Clock`, `User`, `LayoutGrid`, `BarChart3`, `Network`) et un trait cyan animé sous le titre de la carte active.
- Micro-animations : la carte active arrive avec un léger `translateY` + `blur → 0`, les autres restent en place ; transition douce 500ms.
- Mobile : conserver la liste verticale actuelle mais améliorer le visuel (icône + numéro + bordure gauche cyan, alternance subtile de fond).

Ces changements gardent la mécanique de scroll attendue mais rendent la section beaucoup plus engageante qu'une simple grille de textes.

## 4. Revue UX/UI globale après réorganisation

- Vérifier les transitions de couleur entre sections (Hero navy → Tension cream → Vidéo navy → Chiffres navy → Formats cream → Témoignages navy → **Profils navy** → Pour qui cream → Members navy → Join cream → CTA mesh) : si deux sections navy se suivent (Témoignages + Profils), ajouter un séparateur visuel (fine ligne cyan + label différenciant) pour éviter l'effet "mur".
- Harmoniser les paddings verticaux des nouvelles sections (`py-20 md:py-28`).
- Vérifier sur mobile que la nouvelle section Profils ne casse pas le rythme.

## Détails techniques

- Fichiers modifiés : `src/components/home/KeyElementsSection.tsx`, `src/components/home/TensionSection.tsx`, `src/pages/Index.tsx`.
- Fichier créé : `src/components/home/ProfilesSection.tsx`.
- Aucune modification de tokens design ; uniquement Tailwind + styles inline existants.
- Pas de nouvelle dépendance (icônes via `lucide-react` déjà présent).
