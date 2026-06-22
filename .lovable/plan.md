## 1. Bug admin "0 inscrit" sur la liste des participants

**Symptôme** : Le drawer admin affiche `0 / 50 inscrit` et "Aucun inscrit" alors que `event_registrations` contient bien 3 lignes pour `test-2-david-x-dimitri` (1 membre + 2 invités).

**Cause** : `AdminEventRegistrationsDrawer.tsx` lit `event_registrations` en SELECT direct depuis le client. Bien que la policy `Admins can view all registrations` existe, la lecture directe est fragile (et silencieusement vide en cas de souci RLS / colonne / type). Le badge `EventCountBadge` à côté, lui, utilise une RPC SECURITY DEFINER et fonctionne — d'où l'incohérence.

**Correctif** :
- Créer une RPC SECURITY DEFINER `public.get_event_registrations_admin(_event_id uuid)` qui renvoie toutes les colonnes nécessaires (id, user_id, is_guest, statut, guest_*, stripe_session_id, paid_at, created_at + profile prenom/nom/email/poste/entreprise/photo_url joints) **et vérifie `has_role(auth.uid(), 'admin')`** en interne — sinon `RAISE EXCEPTION`.
- Dans `AdminEventRegistrationsDrawer.tsx` : remplacer les deux queries (`admin-event-regs` + `admin-event-reg-profiles`) par un seul appel `supabase.rpc('get_event_registrations_admin', { _event_id })`. Le reste du rendu (mailto, badges Membre/Invité, Payé/En attente, Clore les inscriptions) reste inchangé.

## 2. UI "Je suis inscrit" sur `/membre/evenements`

**Demandé** : pour un événement à venir auquel le membre est déjà inscrit, le code couleur de la carte change et le bouton "Voir & s'inscrire" devient "Vous êtes inscrit·e, voir l'événement →".

**État actuel** : `MembreEvenements.tsx` affiche déjà une section "Mes prochaines participations" mais la carte garde le même fond, et le bouton est remplacé par un simple texte "✓ Inscrit" non cliquable.

**Correctif dans `src/pages/membre/MembreEvenements.tsx`** :
- Ajouter une variante visuelle "inscrit" à `EventCard` et `EventRow` :
  - Bordure et halo `emerald-400/40`, fond `emerald-400/5`, petit chip "✓ Inscrit·e" en haut de la carte.
- Remplacer le texte plat par un bouton `Link` "Vous êtes inscrit·e, voir l'événement →" stylé emerald (bordure emerald + texte emerald) pointant vers `/evenements/{slug}`.
- Même traitement pour la variante "list" : pastille emerald + lien "Vous êtes inscrit·e → voir l'événement".

## Détails techniques

### SQL (migration)
```sql
CREATE OR REPLACE FUNCTION public.get_event_registrations_admin(_event_id uuid)
RETURNS TABLE (
  id uuid, user_id uuid, is_guest boolean, statut text,
  guest_email text, guest_prenom text, guest_nom text,
  guest_poste text, guest_entreprise text,
  stripe_session_id text, paid_at timestamptz, created_at timestamptz,
  prenom text, nom text, email text,
  poste text, entreprise text, photo_url text
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY
  SELECT r.id, r.user_id, r.is_guest, r.statut,
         r.guest_email, r.guest_prenom, r.guest_nom,
         r.guest_poste, r.guest_entreprise,
         r.stripe_session_id, r.paid_at, r.created_at,
         p.prenom, p.nom, p.email,
         p.poste, p.entreprise, p.photo_url
  FROM public.event_registrations r
  LEFT JOIN public.profiles p ON p.id = r.user_id
  WHERE r.event_id = _event_id
  ORDER BY r.created_at ASC;
END; $$;
```

### Front
- `AdminEventRegistrationsDrawer.tsx` : une seule query, mapping direct sur le retour RPC. `active = data.filter(r => r.statut !== 'cancelled')`. `allEmails = active.map(r => r.email ?? r.guest_email)`. Plus besoin de `profileMap`.
- `MembreEvenements.tsx` : nouveau prop `registered?: boolean` sur `EventCard`/`EventRow`. Styles emerald + nouveau libellé CTA.

## Hors scope
- Pas de modification de la home, du détail événement, ni de Stripe.
- Pas de modification des policies existantes.
