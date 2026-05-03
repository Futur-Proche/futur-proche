
# Plan — Admin, Espace Membre et Gestion d'Événements

## Prérequis

**Lovable Cloud (Supabase)** doit être activé sur le projet. Il n'y a actuellement aucune intégration Supabase. On commencera par activer Lovable Cloud, puis on construira tout dessus.

---

## 1. Base de données (migrations Supabase)

### Tables principales

- **profiles** — id (FK auth.users), prenom, nom, poste, entreprise, secteur, email, telephone, linkedin, photo_url, bio, ville, statut (`pending` | `approved` | `rejected`), created_at
- **user_roles** — id, user_id (FK auth.users), role (`admin` | `member`). RLS via fonction `has_role()` security definer.
- **candidatures** — id, prenom, nom, poste, entreprise, secteur, email, telephone, linkedin, cooptation, statut (`pending` | `approved` | `rejected`), created_at, reviewed_by, reviewed_at
- **events** — id, titre, slug, description, format (`after_proche` | `diner` | `workshop` | `autre`), date, heure, ville, lieu, capacite, prix (nullable, pour Stripe), image_url, statut (`draft` | `published` | `past`), speakers (jsonb), created_at
- **event_registrations** — id, event_id, user_id, statut (`registered` | `paid` | `cancelled`), stripe_payment_id (nullable), created_at
- **resources** — id, titre, description, type (`etude` | `synthese` | `podcast` | `newsletter` | `autre`), url, file_url, access (`public` | `members`), published_at, created_at

### RLS Policies
- Profiles : les membres voient les profils `approved`, chacun peut éditer le sien
- Candidatures : insert public (formulaire), select/update admin only
- Events : select public pour `published`/`past`, insert/update/delete admin only
- Resources : select selon `access` (public ou authenticated), insert/update/delete admin only

### Storage Buckets
- `avatars` — photos de profil membres
- `event-images` — visuels événements
- `resources` — fichiers ressources

---

## 2. Authentification

- Login par email + mot de passe (Supabase Auth)
- Page `/login` pour les membres
- Trigger DB : quand une candidature est approuvée, un compte auth est créé et un profil `approved` est inséré
- Contexte React `AuthProvider` avec `onAuthStateChange` + `getSession`
- Route guard `ProtectedRoute` pour `/espace-membre/*` et `/admin/*`

---

## 3. Formulaire de candidature (refonte)

- Le formulaire `/candidater` existant sera connecté à Supabase (insert dans `candidatures`)
- Validation Zod côté client
- Confirmation visuelle après soumission

---

## 4. Espace Admin (`/admin/*`)

Accessible uniquement aux users avec le rôle `admin`.

### Pages admin :
- **`/admin/candidatures`** — Liste des candidatures entrantes, filtrage par statut, actions approuver/rejeter. L'approbation crée automatiquement le compte membre.
- **`/admin/membres`** — Annuaire complet des membres avec recherche, filtre par ville/secteur/poste. Actions : modifier, suspendre.
- **`/admin/evenements`** — CRUD événements. Formulaire avec champs : titre, format, date, ville, lieu, capacité, prix, description, speakers, image. Template visuel inspiré du screen (mesh aurora, date encadrée cyan, speakers en grille).
- **`/admin/ressources`** — CRUD ressources (études, synthèses, podcasts). Upload de fichiers, gestion de la visibilité (public/membres).
- **`/admin/dashboard`** — Vue d'ensemble : nombre de membres, candidatures en attente, prochain événement, stats.

### Layout admin
- Sidebar avec navigation (Dashboard, Candidatures, Membres, Événements, Ressources)
- Design Navy sombre cohérent avec la charte

---

## 5. Espace Membre (`/espace-membre/*`)

Accessible aux users authentifiés avec rôle `member` ou `admin`.

### Pages :
- **`/espace-membre`** — Dashboard personnel : prochain événement, dernières ressources
- **`/espace-membre/profil`** — Édition du profil (photo, bio, poste, entreprise, ville, LinkedIn). Upload photo vers bucket `avatars`.
- **`/espace-membre/annuaire`** — Annuaire des membres approuvés. Grille de cards avec photo, nom, poste, entreprise. Recherche + filtres (ville, secteur).
- **`/espace-membre/evenements`** — Événements à venir (inscription) + événements passés. Card visuelle style event poster (inspiré du screen : mesh aurora, date encadrée, speakers).
- **`/espace-membre/ressources`** — Accès aux ressources membres (études, synthèses mensuelles)

---

## 6. Lien Annuaire / MembersCloud (Homepage)

- Le composant `MembersCloud` sur la homepage sera connecté à Supabase
- Query les profils `approved` avec `photo_url` renseigné
- Affiche les vraies photos en cercles (fallback sur initiales si pas de photo)
- Mélange aléatoire, limité à ~24-30 profils

---

## 7. Gestion des événements et billetterie

- Les événements gratuits : inscription directe (insert dans `event_registrations`)
- Les événements payants : le champ `prix` est renseigné, un bouton "Réserver" est prévu pour intégrer Stripe Checkout plus tard
- Pour l'instant, on prépare l'UI et la structure DB. L'intégration Stripe (Lovable Payments) sera activée dans un second temps comme demandé.
- Templates visuels d'événements inspirés du screen : fond mesh aurora bleu/violet, date encadrée en cyan, titre bold + sous-titre italic, speakers en row

---

## 8. Routing

Nouvelles routes :
```
/login
/admin                → AdminDashboard
/admin/candidatures   → AdminCandidatures
/admin/membres        → AdminMembres
/admin/evenements     → AdminEvenements
/admin/ressources     → AdminRessources
/espace-membre        → MembreDashboard
/espace-membre/profil → MembreProfil
/espace-membre/annuaire → MembreAnnuaire
/espace-membre/evenements → MembreEvenements
/espace-membre/ressources → MembreRessources
```

---

## Ordre d'implémentation

1. Activer Lovable Cloud (Supabase)
2. Créer les migrations (tables, RLS, fonctions, triggers, storage)
3. Créer AuthProvider + pages login
4. Connecter le formulaire de candidature
5. Construire l'espace admin (layout + 5 pages)
6. Construire l'espace membre (layout + 5 pages)
7. Connecter MembersCloud à la DB
8. Préparer la structure billetterie (UI prête pour Stripe)

C'est un gros chantier (~20+ fichiers). Je procéderai par blocs logiques.
