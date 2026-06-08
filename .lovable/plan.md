# Refonte TensionSection — Nuage de pensées CMO

Inspiration : section "Is this you?" de bima.framer.media — apparition progressive de bulles au scroll, qui s'accumulent jusqu'à former un nuage de pensées illustrant le quotidien mental d'un·e leader Marketing / Comm.

## Concept

Remplacer le système actuel (1 carte active + rail de progression) par un **canvas de pensées flottantes** sur fond cream :

- Chaque pensée = une bulle façon "speech bubble" / sticky note, écrite à la première personne (vouvoiement → ici tutoiement intérieur = monologue interne, on garde le "je").
- Au scroll dans la section (sticky), les bulles apparaissent une par une, à des positions pré-calculées autour d'un point central, avec rotations légères, tailles variées, et un léger flottement.
- À la fin du scroll, ~15 bulles sont visibles → un véritable nuage de pensées dense.
- Sous le nuage final, une ligne de conclusion révèle le pivot : *"Et si vous n'étiez plus seul·e à y penser ?"* + CTA "Devenir Futuriste →".

## Contenu — 15 pensées de CMO

Mappées sur les 6 tensions existantes + élargies pour densifier le nuage.

1. "Je suis seul·e à me battre avec mon CEO. Pas assez de soutien de la tech et du produit." *(isolement)*
2. "CAC ou LTV — quelle north star je suis censé·e suivre ce trimestre ?" *(KPIs)*
3. "Encore un board deck à défendre sans benchmark sectoriel solide." *(budget)*
4. "On me demande de couper 20% du budget paid. Sur quoi ?" *(budget)*
5. "Cette agence me ressort les mêmes slides que la précédente." *(prestataires)*
6. "Faut-il vraiment changer de CRM maintenant ? Et pour lequel ?" *(décisions rapides)*
7. "Je passe plus de temps à justifier qu'à exécuter." *(isolement)*
8. "Mon équipe attend une vision. Je n'ai que des hypothèses." *(isolement)*
9. "Ce SDR tool à 80k€/an — est-ce que quelqu'un l'a vraiment testé ?" *(prestataires)*
10. "Le ComEx veut du ROI. Le brand met 18 mois à payer." *(KPIs)*
11. "Je n'ai personne à qui demander 'tu ferais quoi à ma place ?'" *(isolement)*
12. "Recruter un Head of Growth — mais où sont les bons en off ?" *(carrière)*
13. "L'IA générative : je dois trancher cette semaine, sans recul." *(décisions rapides)*
14. "Mon NPS monte, mon CAC aussi. Bonne ou mauvaise nouvelle ?" *(KPIs)*
15. "Si je quitte, qui dans mon réseau peut me passer le bon poste ?" *(carrière)*

Copy ajustable d'un clic une fois la structure validée.

## Structure visuelle

```text
┌─────────────────────────────────────────────────┐
│  — Le constat                                    │
│  Ce qui tourne en boucle dans la tête           │
│  d'un·e leader Marketing / Comm.                │
│                                                  │
│      ╭──────────╮      ╭───────────╮            │
│      │ pensée 1 │      │ pensée 3  │            │
│      ╰──────────╯  ╭─────────╮     ╰──          │
│                    │pensée 2 │                  │
│   ╭─────────╮      ╰─────────╯  ╭──────────╮   │
│   │pensée 5 │       (avatar      │ pensée 4 │   │
│   ╰─────────╯        silhouette  ╰──────────╯   │
│         ╭──────────╮  centrée?)                 │
│         │ pensée 6 │                            │
│         ╰──────────╯       ... etc 15 bulles    │
│                                                  │
│       Et si vous n'étiez plus seul·e ?          │
│           [ Devenir Futuriste → ]               │
└─────────────────────────────────────────────────┘
```

## Détails techniques

- Fichier modifié : `src/components/home/TensionSection.tsx` (réécriture complète, on garde l'export et l'usage dans `Index.tsx`).
- Conteneur sticky : `min-h-[300vh]` desktop, sticky `top-0 h-screen` pour le stage du nuage.
- Positions des bulles : tableau statique `{ x: %, y: %, rotate: deg, size: 'sm'|'md'|'lg', delay: 0..1 }` calculé manuellement pour éviter le chevauchement.
- Apparition : progress scroll 0→1 mappé linéairement sur les 15 bulles. Bulle `i` visible quand `progress >= i/15`. Animation `opacity + scale + translateY` via classes Tailwind + style inline.
- Style bulle : fond blanc, bord cyan léger, ombre douce, `border-radius` asymétrique (queue de bulle façon speech bubble via `::after` ou SVG inline), typo Space Grotesk + une accentuation Instrument Serif italic sur 2-3 mots clés par bulle si possible (sinon plein texte sans italique).
- Tailles : `sm` 200px, `md` 260px, `lg` 320px — variation pour densité visuelle.
- Léger flottement perpétuel (`@keyframes float`) avec délai aléatoire par bulle (basé sur l'index, déterministe).
- Mobile (`md:` non) : pas de sticky. Liste verticale révélée au scroll via IntersectionObserver, bulles empilées en quinconce gauche/droite (façon fil de pensées). Pas de positionnement absolu.
- Respect `prefers-reduced-motion` : toutes les bulles visibles d'emblée, pas de float, pas de scroll lock.
- Rail de progression à droite : conservé en version simplifiée (15 petits points) ou supprimé — proposition : **supprimé**, remplacé par un compteur discret `01 → 15` en bas qui s'incrémente au scroll.
- Pas de modif backend, pas de modif autres composants, pas de nouvelle dépendance.

## Hors scope

- Pas de changement des autres sections de la home.
- Pas d'ajout d'avatar/illustration centrale (le nuage parle de lui-même) — à ajouter dans une 2e passe si souhaité.
- Pas de tracking analytics sur les bulles.
