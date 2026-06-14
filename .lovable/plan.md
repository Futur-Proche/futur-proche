## Ajustement de l'alternance des backgrounds

Cible :

| Section | Background |
|---|---|
| Événements (`EventsTeaserSection`) | **Navy** |
| Ressources (`RessourcesTeaserSection`) | **Navy** (continu avec Événements) |
| ForYouSection ("Votre place est ici si…") | Cream (inchangé) |
| TestimonialsSection ("La parole…") | Navy (inchangé) |
| MembersCloud ("Ils sont déjà Futuristes.") | **Cream** (était navy) |
| JoinSection ("Comment devenir Futuriste ?") | **Navy** (était cream) |

### Modifications

1. **`EventsTeaserSection.tsx`** : `section-cream` → `section-navy`. Adapter les couleurs internes (titres blancs, cartes : conserver fond blanc OK sur navy, ou passer sur surface foncée — on garde les cartes blanches pour la lisibilité, on ajuste juste titres/labels/intro en blanc/cyan).
2. **`RessourcesTeaserSection.tsx`** : `section-cream` → `section-navy`. Mêmes ajustements (titre, intro, lien "Toutes les ressources" en cyan, séparateur en `hsl(228 30% 22%)`). Garder cartes blanches.
3. **`MembersCloud.tsx`** : `section-navy` → `section-cream`. Adapter textes (passer du blanc au navy), retirer/adapter le `dot-grid` s'il existe, ajuster les couleurs des cartes membres pour rester lisibles sur cream.
4. **`JoinSection.tsx`** : `section-cream` → `section-navy`. Adapter titres et textes (blanc), boutons CTA (variante claire sur fond foncé).
5. **`EventsPhotoCarousel`** (juste avant) reste sur `surface="cream"` → enchaînement cream → navy (Events) → ok.
6. **`FormatsSection`** : à vérifier après reorder pour éviter deux cream consécutifs avant Events (Events devient navy, donc Formats peut rester tel quel).

### Détails techniques

- Aucun changement de structure ni de contenu, uniquement les classes de background et les tokens de couleur des textes/bordures à l'intérieur de chaque section concernée.
- Vérifier le contraste des badges (Libre / Membres) sur navy dans les cartes ressources.
- Vérifier le rendu de la pastille date sur les cartes événements (déjà blanche, OK sur navy).
- Pas d'impact sur l'admin ni la data.
