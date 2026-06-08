
# Refonte gestion des événements

## 1. Base de données

**Migration `events`** : ajout `is_open_to_all boolean default false`.

**Migration `event_registrations`** : passer de "membres uniquement" à supporter les invités.
- Ajout colonnes : `guest_email text`, `guest_nom text`, `guest_prenom text`, `is_guest boolean default false`, `amount_paid numeric`, `stripe_session_id text`, `paid_at timestamptz`.
- `user_id` devient nullable (requis si `is_guest=false`).
- Contrainte CHECK : (`user_id IS NOT NULL AND is_guest=false`) OR (`guest_email IS NOT NULL AND is_guest=true`).
- Index unique partiel sur (`event_id`, `user_id`) WHERE user_id IS NOT NULL ; sur (`event_id`, `guest_email`) WHERE guest_email IS NOT NULL.

**Fonction helper `is_member(_email text)`** (SECURITY DEFINER) : retourne true si l'email existe dans `profiles` OU dans `candidatures` avec `statut='approved'`. Utilisée par l'edge function checkout.

**Policies RLS event_registrations** :
- SELECT : un membre connecté voit les inscriptions des événements auxquels il est lui-même inscrit (pour le trombinoscope avant/après) + ses propres inscriptions. Admin voit tout.
- INSERT bloqué côté client : seules les edge functions (service_role) créent les rows après paiement Stripe.

**Policies events** : SELECT public reste, plus un filtre côté query pour `is_open_to_all` quand pertinent.

## 2. Admin — toggle "Ouvert à tous"

`AdminEvenements.tsx` : ajouter une case à cocher `is_open_to_all` dans le formulaire d'édition. Badge visuel "Ouvert à tous" / "Réservé membres" dans la liste.

## 3. Page publique détail événement (nouvelle)

**Nouvelle route** : `/evenements/:slug` → `src/pages/EvenementDetail.tsx`.

Layout inspiré Eventbrite :
- Hero : image, titre, format, date/heure, lieu/ville, prix.
- Colonne gauche : description longue, programme, speakers (JSON `speakers`), infos pratiques.
- Sidebar sticky droite : bloc d'inscription contextuel (voir logique ci-dessous).
- Section "Qui sera là ?" : trombinoscope des membres inscrits (visible uniquement si l'utilisateur courant est lui-même inscrit, conforme RLS). Sinon, message "Inscrivez-vous pour voir qui participe".

**Logique du bloc sidebar** :

| Cas | Affichage |
|---|---|
| Visiteur non connecté + événement réservé membres | Message "Réservé à la communauté" + CTA "Postuler" → `/candidater`. Champ email "Déjà membre ? Renseignez votre email" qui appelle edge function `check-member-email` ; si reconnu, débloque le bouton payer (checkout en mode guest-by-email). |
| Visiteur non connecté + événement ouvert à tous | Formulaire email/prénom/nom + bouton "Payer & s'inscrire" (Stripe Checkout en guest). |
| Membre connecté | Bouton "S'inscrire" (gratuit) ou "Payer Xx €" direct. Si déjà inscrit : badge "✓ Inscrit". |
| Non-membre connecté (cas marginal — pas censé exister mais safe) | Même logique que visiteur non connecté. |

Lien depuis `Evenements.tsx` (liste publique) vers la nouvelle page détail.

## 4. Paiement Stripe (BYOK)

**Secret requis** : `STRIPE_SECRET_KEY` — demandé via `add_secret` après approbation du plan.

**Edge function `create-event-checkout`** (`verify_jwt=false`, validation manuelle) :
- Input : `{ event_id, guest_email?, guest_nom?, guest_prenom? }`.
- Vérifie : événement publié, capacité non atteinte, droit d'inscription (membre OU `is_open_to_all` OU email reconnu membre via `is_member`).
- Si gratuit (prix=0 ou null) : insert direct en DB, statut `registered`, retour `{ free: true }`.
- Sinon : crée une Stripe Checkout Session (mode `payment`), `customer_email` pré-rempli, metadata `event_id` + `user_id`/`guest_email`. Retour `{ url }` → redirect client.

**Edge function `stripe-webhook`** (`verify_jwt=false`) :
- Vérifie la signature Stripe (`STRIPE_WEBHOOK_SECRET`).
- Sur `checkout.session.completed` : insert/upsert `event_registrations` avec statut `paid`, `amount_paid`, `paid_at`, `stripe_session_id`.
- Idempotent via `stripe_session_id` unique.

**Edge function `check-member-email`** (`verify_jwt=false`) :
- Input `{ email }` → output `{ is_member: boolean, prenom?, nom? }` via `is_member()` + lookup profile/candidature pour pré-remplir le nom.

**Pages de retour** :
- `/evenements/:slug/success?session_id=...` — confirmation visuelle "Inscription confirmée", récap, lien vers espace membre.
- `/evenements/:slug/cancel` — message simple, retour à la page détail.

## 5. Espace membre — historique participants

`MembreDashboard.tsx` ou nouvelle section dans `MembreEvenements.tsx` :
- Section "Mes événements passés" : liste des événements passés où le user a une inscription.
- Pour chaque événement : bouton "Voir les participants" → modal/drawer affichant les autres membres inscrits (photo, prénom, nom, entreprise, poste, lien LinkedIn). Données chargées via RLS (le user voit uniquement les participants des événements auxquels il est inscrit).

Mise à jour `MembreEvenements.tsx` existant : remplacer le bouton "S'inscrire" actuel par un lien vers `/evenements/:slug` pour passer par le tunnel unifié.

## 6. Hors scope

- Pas de gestion remboursement.
- Pas d'emails transactionnels (peut être ajouté ensuite via email-domain infra).
- Pas de waitlist quand capacité atteinte.
- Pas de modification du système de candidature/auth.

## Détails techniques

**Fichiers créés**
- `src/pages/EvenementDetail.tsx`
- `src/pages/EvenementSuccess.tsx`
- `src/components/event/RegistrationBlock.tsx`
- `src/components/event/ParticipantsList.tsx`
- `supabase/functions/create-event-checkout/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `supabase/functions/check-member-email/index.ts`

**Fichiers modifiés**
- `src/App.tsx` (routes `/evenements/:slug`, `/evenements/:slug/success`)
- `src/pages/Evenements.tsx` (liens vers détail)
- `src/pages/admin/AdminEvenements.tsx` (toggle is_open_to_all)
- `src/pages/membre/MembreEvenements.tsx` (lien détail + section passés avec trombi)
- `supabase/config.toml` (verify_jwt=false pour stripe-webhook)

**Migrations Supabase**
- Ajout colonnes events/event_registrations.
- Fonction `is_member()` SECURITY DEFINER.
- Refonte policies RLS event_registrations.

**Secrets demandés** : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (après création endpoint webhook le user copie l'URL chez Stripe pour récupérer le secret).
