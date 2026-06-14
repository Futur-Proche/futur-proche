# Pourquoi les blocs n'apparaissent pas

Vérification en base :
- **Événements à venir publiés** : `0` (5 événements en base, mais aucun avec `statut='published'` ET `date >= aujourd'hui`)
- **Ressources publiées** : `0` (table vide)

Les deux composants `EventsTeaserSection` et `RessourcesTeaserSection` font `if (!events.length) return null;` → ils disparaissent silencieusement de la home.

## Plan

### 1. `EventsTeaserSection` — état vide élégant
- Garder le header (titre + CTA "Tous les événements").
- Si aucun événement à venir → afficher une **carte d'invitation** unique :
  - Titre : *"Le prochain rendez-vous arrive bientôt."*
  - Sous-titre : *"Les dates des prochains After Proche et dîners sont en cours de calage."*
  - CTA : "Être prévenu·e" → `/candidater`
- Visuel cohérent avec le reste (carte cream, bordure, accent cyan).

### 2. `RessourcesTeaserSection` — état vide élégant
- Garder le header.
- Si aucune ressource → afficher **3 cartes "teaser"** statiques décrivant ce qui arrive (Podcast, Études, Frameworks) avec un badge "Bientôt" — pas de lien cassé. CTA global vers `/ressources` conservé.

### 3. `TensionSection` — +10 pensées
Ajouter 10 nouvelles citations signées (CMO/VP/Head of), repositionnées sur la stage desktop (coords `x/y/rotate/size`) sans chevaucher les 10 existantes. Total = **20 pensées**.

Nouvelles pensées proposées (à signer comme les actuelles) :
1. "Mon CFO veut un ROI à 90 jours sur une campagne brand."
2. "On me parle de MMM, MTA, incrementality — je tranche comment ?"
3. "Recruter un·e Head of Growth senior : 6 mois que je cherche."
4. "Le board me demande une stratégie IA. Personne en interne n'en a fait."
5. "Mon équipe brûle. Je n'ose plus leur ajouter un projet."
6. "Faut-il internaliser le SEO ou rester avec l'agence ?"
7. "Mon NPS monte, mes ventes baissent. Qu'est-ce que je rate ?"
8. "Le DG veut « faire comme Backmarket ». On n'a ni le budget ni la marque."
9. "Comment je justifie un budget influence sans data propre ?"
10. "On a 4 outils d'analytics. Aucun ne dit la même chose."

Coords ajustées pour densifier le nuage sans masquer le header (zones libres : 25-35% / 64-72% / 88-92%) et avec tailles variées (sm/md/lg).

### Détails techniques

**Fichiers modifiés** :
- `src/components/home/EventsTeaserSection.tsx` — retirer `return null`, ajouter branche vide.
- `src/components/home/RessourcesTeaserSection.tsx` — retirer `return null`, ajouter 3 cartes placeholder.
- `src/components/home/TensionSection.tsx` — étendre le tableau `thoughts` à 20 entrées + ajuster le compteur (`xx / 20`).

Aucune migration, aucun changement de schéma.
