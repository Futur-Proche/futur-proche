# Refonte ciblée — TensionSection, KeyElementsSection, FormatsSection

## 1. `TensionSection` — Fixer le scroll empilé + repositionner le CTA

**Problème actuel :** les 6 cartes à droite ont `lg:sticky` avec `top` progressif mais `margin-bottom: 2.5rem` seulement — il n'y a pas assez de hauteur scrollable entre chaque carte, donc l'effet d'empilement n'est pas perceptible.

**Correction :**
- Wrapper chaque carte dans un conteneur `min-h-[70vh]` (desktop) qui sert de "rail de scroll".
- À l'intérieur, la carte elle-même est `lg:sticky` avec `top: 112px + idx * 16px` (décalage visible : ~16px par carte).
- Retirer le `margin-bottom` et le spacer final — la hauteur vient maintenant des wrappers.
- Résultat : on scrolle ~70vh entre chaque carte, et chaque nouvelle carte vient se poser légèrement en dessous de la précédente, formant un vrai stack visible.

**Repositionnement du CTA :**
- Sortir le bloc "futur proche existe pour ces moments-là." + bouton "Découvrir la communauté →" de son `mt-16` actuel (en bas du `container`).
- Le déplacer **à l'intérieur de la colonne gauche sticky**, juste sous l'image de pain point en focus (avant ou après l'indicateur de progression).
- Mise en forme verticale compacte : texte au-dessus, CTA en dessous, gap ~16px.
- Conséquence : il "flotte" toujours avec le sticky gauche pendant qu'on parcourt les cartes — plus jamais perdu en bas.

---

## 2. `KeyElementsSection` — Images sur "Trois profils" + démarcation

**Images par défaut sur chaque colonne profil :**
- Remplacer le `linear-gradient` navy de fond de chaque `ProfilCol` par une **image de fond réelle** + overlay sombre dégradé (du bas vers le haut, navy 90% → navy 30%) pour garder la lisibilité du texte.
- Mapping avec assets existants :
  - 01 Direction Marketing → `speaker-event.jpg`
  - 02 Direction Communication → `event-community.jpg`
  - 03 Founders & C-Level → `diner-communaute.jpg`
- Au hover : overlay s'éclaircit légèrement (navy 70% → navy 20%) + tint cyan déjà présent reste. Le watermark `01/02/03` reste visible (opacité légèrement réduite).
- Conserver intacts : clip-path reveal, barre cyan verticale au hover, ligne cyan qui s'étire, animation 140ms stagger, description hidden→hover.

**Démarcation visuelle avec le bloc stats au-dessus :**
- Le bloc profils est actuellement séparé par `mt-24 md:mt-32` seul → trop proche du cadran stats.
- Ajouter avant le bloc profils :
  - Un **séparateur horizontal subtil** : `<div className="h-px bg-white/10 mb-16 md:mb-20" />` après la grille stats.
  - Un **petit label de transition** avant le titre : conserver "— Trois profils, une même exigence" mais l'agrandir légèrement (text-sm au lieu du tiny mono actuel) et ajouter un sous-titre court d'une ligne, par ex. *"À qui s'adresse vraiment Futur Proche"* (style Instrument Serif italic, ton conversationnel).
  - Augmenter le `mt-24` à `mt-32 md:mt-40` pour respiration.

---

## 3. `FormatsSection` — Photo sous "Ce qui se passe à l'intérieur."

- Dans la colonne gauche sticky (entre le paragraphe d'intro et l'indicateur de progression), insérer une **photo d'illustration** :
  - Aspect ratio `4/5`, max-width `sm` (~24rem).
  - Asset : `ambiance-groupe.jpg` (vibe community/coulisses).
  - Border-radius `lg`, légère border `hsl(228 10% 85%)`.
  - Pas de hover (c'est une illustration statique).
- Ajouter une légende discrète au-dessus en mono `text-[10px]` : *"— En coulisses"*.
- L'indicateur de progression reste sous la photo.

---

## Détails techniques

- Aucune nouvelle dépendance.
- Aucun nouveau hook.
- Tokens préservés : navy `hsl(228 56% 10%)`, cyan `hsl(186 79% 47%)`, cream, Space Grotesk, Instrument Serif.
- Respect de `prefers-reduced-motion` déjà en place dans les hooks/observers existants.
- Aucun changement de logique métier ni de routing.

## Fichiers à modifier

- `src/components/home/TensionSection.tsx` — wrappers min-h pour stack visible + CTA déplacé dans la colonne gauche.
- `src/components/home/KeyElementsSection.tsx` — `ProfilCol` reçoit `image` en prop, fond image + overlay ; séparateur + sous-titre avant le bloc profils.
- `src/components/home/FormatsSection.tsx` — ajout de la photo `ambiance-groupe.jpg` dans la colonne sticky gauche.
