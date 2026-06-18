## Objectif

Améliorer l'expérience d'inscription aux événements pour les visiteurs, les membres et les administrateurs, et donner à l'admin le contrôle pour clore les inscriptions.

## 1. Nombre de participants visible partout

- **Page liste publique `/evenements`** et **`EventsTeaserSection`** (home) : afficher `X inscrits` (et `/ capacité` si renseignée) sur chaque carte. Une seule requête `event_registrations` groupée par `event_id` (count) jointe côté client.
- **Page détail `/evenements/:slug`** : le nombre est déjà visible dans le titre « Qui sera là (N) » — on conserve.

## 2. Liste des inscrits : règle d'accès

Aujourd'hui : visible uniquement si **l'utilisateur est inscrit** à l'événement.

Nouvelle règle :
- **Visiteur non connecté** → voit uniquement le nombre, pas les noms (message « Connectez-vous pour voir qui participe »).
- **Membre connecté** (inscrit ou non) → voit la liste complète des participants.
- **Admin** → idem membre.

Changement dans `ParticipantsList` : remplacer la prop `visible` par `canSeeNames` calculée à partir de `useAuth().user`.

## 3. Bloc d'inscription pour un membre connecté

Comportement attendu :
- Si déjà inscrit → bloc « Vous êtes inscrit·e » (déjà OK) et **plus aucun bouton** « S'inscrire ».
- Si non inscrit → bouton « S'inscrire » classique.
- Si `registrations_closed = true` ou capacité atteinte → bloc « Inscriptions closes » sans bouton.

Pas de changement majeur, juste s'assurer que la liste des participants est bien affichée juste en dessous.

## 4. Admin — vue claire des inscrits

Sur **`/admin/evenements`** :

a) **Sur chaque carte/ligne**, afficher `N inscrits` (et `/ capacité`), avec un badge `Complet` ou `Inscriptions fermées` si applicable.

b) **Nouveau bouton « Inscrits »** sur chaque événement → ouvre un **drawer/modal** listant tous les inscrits avec :
- Nom, email, entreprise/poste, statut (`membre` ou `invité·e`), date d'inscription, statut paiement.
- Compteur en tête : `N inscrits / capacité`.
- Bouton **« Clore les inscriptions »** / **« Rouvrir les inscriptions »** (toggle sur la colonne `registrations_closed`).
- Pour les événements payants : indication `payé` / `en attente`.

c) **Dans le formulaire d'édition** d'un événement : nouvelle case à cocher **« Inscriptions fermées »** (équivalent du toggle).

## 5. Blocage serveur des inscriptions

- Nouvelle colonne `events.registrations_closed boolean default false`.
- `create-event-checkout` (edge function) refuse l'inscription si :
  - `registrations_closed = true`, ou
  - capacité atteinte (déjà géré).
- Le `RegistrationBlock` affiche le bloc « Inscriptions closes » quand l'un ou l'autre est vrai.

## Détails techniques

**Migration SQL**
```sql
ALTER TABLE public.events
  ADD COLUMN registrations_closed boolean NOT NULL DEFAULT false;
```

**Fichiers modifiés**
- `supabase/migrations/<new>.sql` — ajout colonne `registrations_closed`.
- `supabase/functions/create-event-checkout/index.ts` — refus si `registrations_closed`.
- `src/components/event/ParticipantsList.tsx` — règle d'accès basée sur `user` (membre connecté).
- `src/pages/EvenementDetail.tsx` — passer `canSeeNames = !!user` à `ParticipantsList` ; tenir compte de `registrations_closed`.
- `src/components/event/RegistrationBlock.tsx` — nouveau cas « Inscriptions closes ».
- `src/pages/Evenements.tsx` + `src/components/home/EventsTeaserSection.tsx` — afficher `N inscrits / capacité` sur chaque carte (requête count groupée).
- `src/pages/admin/AdminEvenements.tsx` :
  - badges `N inscrits`, `Complet`, `Inscriptions fermées` sur chaque carte/ligne ;
  - bouton « Inscrits » → drawer avec la liste détaillée + toggle « Clore/Rouvrir » ;
  - case à cocher « Inscriptions fermées » dans le formulaire.
- Nouveau composant `src/components/admin/AdminEventRegistrationsDrawer.tsx`.

**Notes**
- Pas de changement du modèle d'auth ni des politiques RLS sur `event_registrations` (l'admin lit déjà via `has_role`).
- Aucune modification du flow Stripe.
