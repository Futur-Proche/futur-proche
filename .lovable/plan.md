## Objectif

Fusionner `ProfilesSection` ("Trois profils") et `ForYouSection` ("Oui / Non") dans une seule section unifiée **"C'est pour vous si..."** (fond cream), puis supprimer `ProfilesSection` du flux de la home.

## Structure de la section fusionnée

Ordre de lecture pensé en entonnoir : "qui vous êtes" → "comment vous fonctionnez".

```text
[label] — Pour qui
[H2]    C'est pour vous si...
[intro] Trois profils, une même exigence.

┌──────────────────────────────────────────────┐
│  3 cartes profils (Direction Marketing /     │
│  Direction Communication / Founders & C-Level)│
│  → version cream adaptée, cliquables, même   │
│    mécanique d'expansion qu'avant            │
└──────────────────────────────────────────────┘

— séparateur fin + petit label "— Et surtout"

┌─────────────────┬─────────────────┐
│  Oui            │  Non            │
│  (4 items)      │  (3 items)      │
└─────────────────┴─────────────────┘

[CTA] Devenir Futuriste →
```

## Détails UX / UI

- Une seule section `section-cream`, paddings harmonisés (`py-20 md:py-28`).
- Adapter `ProfilCard` au fond cream : fond blanc, bordure `hsl(228 10% 85%)`, accent cyan conservé, texte navy. Garder l'expand au clic et le stagger reveal.
- Garder le titre "C'est pour vous si..." comme H2 principal de la section. Sous-titre serif italic : "Trois profils, une même exigence."
- Petit séparateur (`<div className="h-px bg-navy/10" />`) + label `— Et surtout` entre les profils et le bloc Oui/Non pour montrer la continuité.
- Ajouter un CTA final "Devenir Futuriste →" sous le bloc Oui/Non pour clôturer la section.
- Retirer `ProfilesSection` de `src/pages/Index.tsx` (et son import). Le séparateur cyan en haut de ProfilesSection disparaît du coup.

## Fichiers touchés

- ✏️ `src/components/home/ForYouSection.tsx` — refonte complète : intègre les profils en haut + Oui/Non en bas + CTA.
- 🗑️ `src/components/home/ProfilesSection.tsx` — supprimé.
- ✏️ `src/pages/Index.tsx` — retire l'import et le `<ProfilesSection />`.

## Hors scope

- Pas de modification des autres sections (tensions, stats, témoignages…).
- Pas de changement de copy en dehors du petit label de transition.
