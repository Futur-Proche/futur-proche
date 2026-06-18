## Objectif
1. Permettre au membre de voir et éditer son email sur `/membre/profil` (le téléphone est déjà éditable).
2. Garantir que l'admin voit et peut éditer email + téléphone d'un membre depuis `/admin/membres`.
3. Garantir le strict cloisonnement : email/téléphone d'un membre **jamais** visibles par les autres membres (ni dans l'annuaire, ni dans la liste des participants).
4. Corriger le bug d'inscription : quand un membre connecté est déjà inscrit, le bouton « Payer / S'inscrire » doit disparaître au profit d'un message « Vous êtes inscrit·e ».

## Diagnostic du bug d'inscription

`davhuin@gmail.com` est bien enregistré en base avec `user_id = 6820e1c3-…` sur l'événement `test-2-david-x-dimitri`. Pourtant le bouton « Payer » reste visible.

Cause probable : la query `event-my-reg` dans `EvenementDetail.tsx` interroge `event_registrations` directement. Les policies RLS autorisent l'utilisateur à voir ses propres lignes, donc la query devrait fonctionner — sauf que `RegistrationBlock` est rendu en parallèle dans l'aside et reçoit `isUserRegistered=false` pendant la phase de chargement (la query est `enabled` mais retourne `undefined` au premier render). Le composant affiche alors la branche « membre connecté → CTA paiement » avant même que `myReg` soit résolu.

Solution : utiliser la RPC dédiée `is_registered_to_event` (déjà en base, security definer) et n'afficher le bloc d'inscription qu'une fois la requête résolue. En complément, ajouter un état de chargement explicite dans `RegistrationBlock`.

## Modifications

### 1. `src/pages/EvenementDetail.tsx`
- Remplacer la query `event-my-reg` par un appel à `supabase.rpc('is_registered_to_event', …)`.
- Exposer `isRegLoading` et passer un placeholder/skeleton dans l'aside tant que la requête n'est pas résolue (évite le flash du bouton Payer).

### 2. `src/components/event/RegistrationBlock.tsx`
- Ajouter une garde : si `user` est connecté mais l'état d'inscription est encore inconnu, afficher un skeleton plutôt que le CTA.
- Améliorer le bloc « Vous y êtes » : afficher le récap (date/lieu/heure) + lien vers « Mes événements ».

### 3. `src/pages/membre/MembreProfil.tsx`
- Ajouter un champ **Email** éditable, à côté du téléphone.
- Validation Zod (email + max 255).
- Mention discrète : « Votre email et votre téléphone ne sont jamais affichés aux autres Futuristes. »
- Mise à jour via `profiles.update({ email })` pour l'utilisateur courant (policy "Users update own profile" existante).

### 4. `src/pages/admin/AdminMembres.tsx`
- Dans le drawer/modal d'édition d'un membre, ajouter les champs Email et Téléphone éditables (policy admin déjà permissive).
- Afficher l'email et le téléphone dans la fiche détaillée.

### 5. Vérification cloisonnement (lecture seule, pas de code à écrire si déjà OK)
- `get_event_participants` (security definer) **ne renvoie pas** `email`/`telephone` ✅ déjà conforme.
- `MembreAnnuaire` : vérifier que `select` ne demande pas `email`/`telephone`. Si oui, retirer ces colonnes.
- `ParticipantsList` : déjà basé sur la RPC sans email ✅.

### 6. RLS / policies
Aucune migration nécessaire :
- La policy `Members can view all profiles` retourne déjà toutes les colonnes ; le cloisonnement est purement front (sélection des colonnes côté client).
- Pour durcir : créer une vue `public.profiles_public` excluant `email` et `telephone` (`security_invoker=on`) et basculer l'annuaire / liste des membres sur cette vue, tout en gardant la table `profiles` pour le propriétaire et l'admin. *Option recommandée — à confirmer avant d'inclure dans l'implémentation.*

## Points à confirmer
- Souhaitez-vous la vue `profiles_public` (durcissement RLS, recommandé) ou se contenter de filtrer côté front ?
