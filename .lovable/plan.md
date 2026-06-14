## Réorganisation de la home

### 1. Regrouper Événements + Ressources

Dans `src/pages/Index.tsx`, placer `EventsTeaserSection` et `RessourcesTeaserSection` côte à côte, avec **le même background cream**, sans rupture visuelle entre les deux.

Pour assurer la cohérence :
- Supprimer le `<section class="section-cream">` interne de `RessourcesTeaserSection.tsx` (le remplacer par un simple wrapper `<div>` sans background), idem possiblement pour `EventsTeaserSection.tsx`.
- Créer dans `Index.tsx` un seul bloc `<section className="section-cream">` qui contient les deux teasers à la suite, avec un seul padding vertical global et un séparateur léger (ou juste un espacement) entre les deux.
- Réduire les paddings verticaux internes (`py-20 md:py-24`) pour éviter le double espacement.

### 2. Nouvel ordre des sections dans `Index.tsx`

```
HeroSection
TensionSection
VideoSection
EventsPhotoCarousel (la vie de la communauté)
KeyElementsSection
FormatsSection
[Bloc groupé : EventsTeaserSection + RessourcesTeaserSection]  ← même background cream
ForYouSection                  ("Votre place est ici si...")
TestimonialsSection            ("La parole à ceux qui en sont.")  ← déplacée ici
MembersCloud                   ("Ils sont déjà Futuristes.")
JoinSection
CTASection
```

### Détails techniques

- **Fichiers modifiés** :
  - `src/pages/Index.tsx` : nouvel ordre + wrapper unique pour Events+Ressources.
  - `src/components/home/EventsTeaserSection.tsx` : export d'un variant "inline" (sans `<section>` ni background) OU prop `wrapper={false}`.
  - `src/components/home/RessourcesTeaserSection.tsx` : idem.
- **Harmonie background** : la nouvelle séquence reste alternée (navy / cream / navy …). À vérifier après reorder :
  - FormatsSection → cream
  - Events+Ressources → cream (peut créer 2 cream consécutifs) → on ajoutera une transition douce (séparateur fin ou variation de teinte) si nécessaire.
  - TestimonialsSection → navy (inchangé)
  - MembersCloud → vérifier qu'elle reste sur navy/cream cohérent.
- **Aucun changement** sur le contenu des cartes, la data, ou l'admin.
