
# Plan — Rendre la home plus dynamique

Trois expérimentations structurelles, chacune mappée à une section existante. Le but : tester les patterns d'animation sur le contenu réel et juger ensuite ce qu'on garde.

## 1. Sticky split scroll (inspi Sadewa "Our Approach") → `FormatsSection`

Section dense, parfaite candidate.

- Colonne gauche **sticky** (top ~120px) : kicker "Une commu, plusieurs formats", titre, paragraphe d'intro, petite ligne décorative.
- Colonne droite **scrollable** : les 4 formats (WhatsApp / After Proche / Podcast / Jobs) empilés en grandes cartes plein-largeur, chacune ~80vh. Chaque carte fait fondre/translate à l'arrivée dans le viewport (IntersectionObserver, classe `animate-fade-in` existante).
- Le titre gauche met en surbrillance dynamiquement le format actif (petit indicateur "01/04 → 04/04" qui s'incrémente au scroll).
- La grille photos reste en bas, inchangée.

Layout :
```text
┌─────────────────┬──────────────────┐
│ STICKY          │ 01_WhatsApp      │
│ Une commu,      │ ─────────────    │
│ plusieurs       │ 02_After Proche  │
│ formats.        │ ─────────────    │
│ [01 ● ○ ○ ○]    │ 03_Podcast       │
│                 │ ─────────────    │
│                 │ 04_Jobs          │
└─────────────────┴──────────────────┘
```

## 2. Reveal au scroll progressif (inspi Bima "Is This You ?") → `ForYouSection`

Section à fort impact émotionnel — un reveal séquentiel renforce le punch.

- Le titre "C'est pour vous si..." reste tel quel.
- Les items des deux colonnes (OUI / NON) apparaissent **un par un** au scroll, avec un léger décalage : fade + translate-y de 20px + très subtil flou qui se résout (`blur(8px)` → `blur(0)`).
- Stagger : 80-120ms entre items. Déclenchement via IntersectionObserver (threshold 0.3) sur chaque `<li>`.
- L'effet est doux, pas démo — on garde la lisibilité d'une page corporate sérieuse.

## 3. Compteurs + colonnes animées (inspi Hydra "Our Numbers" + "Industries We Serve") → `KeyElementsSection`

Cette section a déjà des compteurs (`useCountUp`). On enrichit :

- **Numbers** : encadrer chaque stat d'une fine ligne verticale qui se "dessine" de haut en bas au moment où le compteur démarre. Ajouter un label secondaire qui apparaît après le compteur (ex. petit tag mono "B2B • B2C • Startups").
- **Effet 3 colonnes Hydra-like** : optionnellement, sous les 4 stats, ajouter une bande de 3 colonnes "Profils types" (Direction Marketing / Direction Comm / Founders & C-Level) qui se révèlent en cascade horizontale. ⚠️ Réservé à des intitulés courts à faible enjeu SEO (comme tu l'as noté).
- Si la bande 3 colonnes alourdit, on la met dans une variante et on tranche après preview.

## Détails techniques

- Toutes les animations s'appuient sur **IntersectionObserver natif** (déjà utilisé dans `useCountUp`). Pas de dépendance ajoutée (pas de Framer Motion, pas de GSAP) — on reste léger.
- Création d'un petit hook réutilisable `useInViewReveal()` qui retourne un `ref` et une classe `is-revealed` à toggle.
- Sticky CSS pur (`position: sticky`) pour Sadewa — supporté partout, zéro JS.
- Respect de `prefers-reduced-motion` : si activé, on désactive les translate/blur et on affiche tout immédiatement.
- Tokens couleurs / typo inchangés (Space Grotesk, navy, cream, cyan).

## Livraison

J'implémente les 3 essais d'un coup pour que tu puisses les voir en contexte et trancher quoi garder / quoi affiner.
