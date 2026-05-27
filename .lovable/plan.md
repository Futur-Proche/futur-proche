## Objectif

Remplacer le pattern actuel "média sticky + textes empilés à droite" par un **pattern Sadewa** : chaque format occupe sa **propre section pleine hauteur** (≈100vh), centrée, avec un grand numéro `/01`, une image hero centrale et un titre + description à droite. On scrolle → la section suivante prend toute la place. Une seule image visible à la fois, pas d'empilement.

Concerne deux endroits :
- Home → `src/components/home/FormatsSection.tsx`
- Communauté → bloc `FormatsScroller` dans `src/pages/Communaute.tsx`

## Structure d'une "étape" Sadewa

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│   /01        [   IMAGE     ]      Discover         │
│   (gros)     [   centrale  ]      Texte court…     │
│                                                     │
└─────────────────────────────────────────────────────┘
   ← min-h-screen, contenu centré verticalement →
```

- Layout : `grid lg:grid-cols-[auto_1fr_1.2fr]` → numéro / image / texte.
- Numéro façon Sadewa : très gros (`text-7xl md:text-8xl`), gris clair, avec un slash cyan en accent (cohérent avec notre identité navy/cyan, pas de vert).
- Image : `aspect-square` ou `4/5`, max ~420px, centrée, ombre douce.
- Texte : titre `text-4xl md:text-5xl`, description courte en muted.
- Mobile : stack vertical (numéro → image → texte), `min-h-[80vh]`.

## Animation à l'entrée de chaque section

Chaque étape devient visible quand elle entre dans le viewport (IntersectionObserver, threshold ~0.4) :
- numéro : fade + slide depuis la gauche (translateX -20px → 0)
- image : fade + scale (0.92 → 1) + léger float continu
- texte : fade + slide depuis le bas (translateY 24px → 0), stagger 120ms entre titre/description

Respecte `prefers-reduced-motion`.

## Indicateur de progression (optionnel mais Sadewa-like)

Petite barre verticale fixe à droite (desktop only) avec un point par étape ; le point actif passe en cyan. Permet de voir "où on en est" dans la séquence. Cliquable pour sauter à une étape (`scrollIntoView({ behavior: "smooth" })`).

## Composants

Créer un composant réutilisable `src/components/shared/ScrollyFormats.tsx` :

```tsx
type Step = { tag: string; title: string; desc: string; image: string };
<ScrollyFormats steps={steps} accentLabel="Une commu, plusieurs formats" heading="..." intro="..." />
```

- Gère lui-même les sections `min-h-screen`, l'observer d'index actif, l'indicateur latéral.
- Utilisé par `FormatsSection` (home) et par la page Communauté à la place du `FormatsScroller` actuel.

## Contenu

On garde **strictement** les textes / images / tags existants des deux pages. Aucune modif de copy.

## Détails techniques

- Tokens : navy `hsl(228 56% 10%)`, cyan `hsl(186 79% 47%)`, cream `section-cream`. Pas de vert Sadewa.
- Le bloc reste dans une `section-cream` (home) / fond cohérent (communauté).
- En-tête de section (label + h2 + intro) conservé, affiché **une seule fois** avant la première étape.
- Padding inter-étape : `py-24 md:py-32` pour laisser respirer, mais `min-h-screen` garantit le "une à une".
- IntersectionObserver avec `rootMargin: "-40% 0px -40% 0px"` pour activer l'étape vraiment centrée.

## Fichiers modifiés

- ➕ `src/components/shared/ScrollyFormats.tsx` (nouveau)
- ✏️ `src/components/home/FormatsSection.tsx` (utilise le nouveau composant)
- ✏️ `src/pages/Communaute.tsx` (remplace `FormatsScroller` par `ScrollyFormats`)
