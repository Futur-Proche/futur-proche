
## Problèmes constatés

1. **David (logué) ne voit pas son inscription** : David s'est inscrit *avant connexion* (formulaire invité avec `u1david@hotmail.com`). La ligne `event_registrations` a `user_id = NULL` + `is_guest = true`. La page membre filtre uniquement par `user_id = auth.uid()` → rien ne remonte.
2. **Balises HTML brutes** affichées dans les cards événements (admin, espace membre, public) car la description est stockée en HTML (RichTextEditor) mais rendue en texte brut dans les listings.
3. **Espace membre événements** : affiche aussi "Événements passés" auxquels le membre n'a pas participé → bruit inutile.
4. **Confirmation inscription invité gratuit** : le toast s'affiche puis `window.location.reload()` l'efface immédiatement, donc l'utilisateur ne voit rien. Pas d'email envoyé.
5. **Stripe** : le secret est enregistré sous le nom `Stripe` mais l'edge function attend `STRIPE_SECRET_KEY`. Aucun `STRIPE_WEBHOOK_SECRET` n'est encore configuré → après un paiement, l'inscription ne serait jamais créée.

---

## Corrections

### 1. Auto-rattachement invité ↔ membre (DB)

Ajouter un **trigger `BEFORE INSERT`** sur `event_registrations` qui, si `user_id IS NULL` et `guest_email` correspond à un profil, remplit automatiquement `user_id` et bascule `is_guest = false`. Faire un **backfill** sur les lignes existantes (la ligne de David passera ainsi du statut "guest" à "membre rattaché").

Bénéfice : tout futur invité qui devient membre (ou inscription invité avec email déjà membre) est automatiquement reconnu côté profil et listing participants.

### 2. Nettoyage des descriptions dans les listings

Créer un petit utilitaire `stripHtml(html, maxLen)` (`src/lib/text.ts`) qui retire les balises et décode `&nbsp;` → utilisé dans :
- `src/pages/admin/AdminEvenements.tsx` (card + ligne liste)
- `src/pages/membre/MembreEvenements.tsx` (`EventCard.description`)
- `src/components/home/EventsTeaserSection.tsx` (si besoin)

La page détail événement garde déjà le rendu HTML correct via `dangerouslySetInnerHTML`.

### 3. Espace membre — Mes participations seulement

Dans `src/pages/membre/MembreEvenements.tsx` :
- Récupérer aussi l'email du user (`useAuth`) et considérer comme "mes inscriptions" toute ligne où `user_id = me` **OU** `lower(guest_email) = lower(my_email)` (utile tant que le trigger n'a pas migré les anciennes lignes — ceinture + bretelles).
- **Supprimer la section "Événements passés" non-participés** (`otherPast`) — ne plus afficher que `myUpcoming`, `otherUpcoming` (à venir = utile pour s'inscrire), et `myPast` (souvenirs/galerie).

### 4. Confirmation d'inscription gratuite (invité & membre)

Dans `src/components/event/RegistrationBlock.tsx`, remplacer le `toast + reload` par une **redirection vers `/evenements/:slug/success`** dès que la fonction renvoie `{ free: true }` ou `{ registered: true }`. La page success existe déjà et donne un vrai feedback visible. Au retour sur la page événement le compte d'inscrits est rafraîchi (query refetch).

Pas d'email transactionnel pour l'instant (nécessiterait Resend) — à proposer en suivi si vous le souhaitez.

### 5. Stripe (paiements)

a. **Renommer le secret** : le code attend `STRIPE_SECRET_KEY`. Si le secret actuel s'appelle `Stripe`, je vous demanderai de le ré-ajouter sous le nom exact `STRIPE_SECRET_KEY` (ou je le ferai via l'outil secrets).

b. **Webhook Stripe** : la fonction `stripe-webhook` existe déjà et est configurée `verify_jwt = false`. Il faut :
   - Vous communiquer l'URL publique du webhook (`https://<projet>.functions.supabase.co/stripe-webhook`).
   - Vous demandez à Stripe Dashboard → Developers → Webhooks → "Add endpoint" → coller l'URL, sélectionner `checkout.session.completed`, puis copier le **Signing secret** (commence par `whsec_…`).
   - Ajouter ce secret sous le nom `STRIPE_WEBHOOK_SECRET`.

c. **Filet de sécurité côté succès paiement** : si le webhook tarde, l'utilisateur revient sur `/evenements/:slug/success?session_id=…` et ne voit rien. Ajouter dans `EvenementSuccess.tsx` un **polling court** (5×, 1.5 s) qui interroge l'API `event_registrations` filtrée par `stripe_session_id`. Tant que l'inscription n'est pas vue, afficher "Confirmation en cours…", puis success définitif.

d. La logique d'inscription `create-event-checkout` est déjà OK pour le payant ; pas de modif côté SQL.

---

## Détails techniques

```text
DB trigger
──────────
CREATE FUNCTION link_registration_to_profile() RETURNS TRIGGER
  → si NEW.user_id IS NULL AND NEW.guest_email IS NOT NULL :
      SELECT id FROM profiles WHERE lower(email)=lower(NEW.guest_email)
      → si trouvé : NEW.user_id = found.id; NEW.is_guest = false;
                    NEW.guest_email/_prenom/_nom = NULL
  RETURN NEW
TRIGGER BEFORE INSERT ON event_registrations FOR EACH ROW

Backfill UPDATE (one-shot dans la migration) :
  UPDATE event_registrations er
  SET user_id = p.id, is_guest=false, guest_email=null, guest_prenom=null, guest_nom=null
  FROM profiles p
  WHERE er.user_id IS NULL AND lower(er.guest_email)=lower(p.email);
```

Fichiers modifiés :
- `supabase/migrations/<new>.sql` (trigger + backfill)
- `src/lib/text.ts` (nouveau — `stripHtml`)
- `src/pages/membre/MembreEvenements.tsx` (filtres + suppression `otherPast`, stripHtml)
- `src/pages/admin/AdminEvenements.tsx` (stripHtml — bonus visuel)
- `src/components/event/RegistrationBlock.tsx` (redirection success)
- `src/pages/EvenementSuccess.tsx` (polling registration via session_id)
- Secrets : `STRIPE_SECRET_KEY` (à renommer/ré-ajouter), `STRIPE_WEBHOOK_SECRET` (à fournir après création du endpoint dans Stripe).

---

## Questions avant de lancer

1. Pour Stripe : pouvez-vous confirmer le nom exact du secret que vous avez ajouté ? Si c'est "Stripe", je le re-créerai en `STRIPE_SECRET_KEY` (ou vous le faites depuis l'UI Secrets).
2. Souhaitez-vous aussi un **email de confirmation transactionnel** (gratuit/payant) ? Si oui, on branche Resend dans une étape suivante (besoin d'une clé API Resend).
