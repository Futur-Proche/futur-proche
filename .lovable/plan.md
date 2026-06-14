
## 1. Carte de France des membres (`/carte`)

**Données**
- Migration : ajouter `code_postal TEXT` sur `profiles` ET `candidatures` (si pas déjà fait côté candidatures).
- Champ "Code postal" affiché et éditable :
  - sur `Candidater.tsx` (étape coordonnées)
  - sur `MembreProfil.tsx` (auto-éditable par le membre)
  - sur `AdminMembres.tsx` (édition admin)
- Dataset INSEE FR open data (`public/data/fr-postal-codes.json`, ~1.5 MB, lazy fetch côté `/carte` uniquement) : `{ code_postal → { lat, lng, ville, departement } }`.

**Page `/carte` (publique)**
- Carte SVG France via `react-simple-maps` + topojson FR départements.
- Agrégation côté client : groupe les profils par département (2 premiers chiffres du CP).
- **Visiteur non loggué** : bulles départementales avec compteur, tooltip "X Futuristes dans le {nom département}", CTA flottant "Rejoindre la communauté → /candidater". Aucune donnée nominative.
- **Membre loggué** : clic département → panneau latéral listant les membres (photo, prénom + initiale du nom, ville, fonction, lien `/espace-membre/annuaire?member=:id`). Zoom progressif possible.
- Légende, recherche par ville, compteur total.
- Route ajoutée dans `App.tsx`. CTA `04` de la home (`FormatsSection`) déjà préparé → pointe vers `/carte`.

**Dépendances** : `react-simple-maps`, `d3-geo`, `topojson-client`.

## 2. Navigation membre loggué sur le site public

Aujourd'hui la `Navbar` affiche toujours "Se connecter" + "Devenir Futuriste", même quand un membre est authentifié. À retravailler.

- `Navbar.tsx` : si `user` présent
  - remplace "Se connecter" par un bouton/menu **"Mon espace"** → `/espace-membre`
  - ajoute un badge discret **"Admin"** → `/admin` si `isAdmin`
  - bouton "Devenir Futuriste" caché (déjà membre)
  - menu déroulant : Mon espace · Annuaire · Mes événements · Profil · Déconnexion
- `Ressources.tsx` (page publique) : marquer visuellement les ressources réservées membres avec cadenas ; si `user` connecté → CTA "Accéder" qui redirige vers `/espace-membre/ressources` ou ouvre directement le contenu ; sinon → CTA "Se connecter".
- `EvenementDetail.tsx` : si membre loggué, pré-remplir l'inscription avec son profil, ne plus redemander email/nom.
- Garder l'accès public en lecture aux pages `/communaute`, `/evenements`, `/ressources` (teasers), mais avec affordances claires pour les membres.

## 3. Mot de passe oublié

- `Login.tsx` : lien "Mot de passe oublié ?" sous le formulaire.
- **Nouvelle page `/mot-de-passe-oublie`** (`ForgotPassword.tsx`) :
  - input email → `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reinitialiser-mot-de-passe' })`
  - toast de confirmation, design cohérent avec `Login.tsx`.
- **Nouvelle page `/reinitialiser-mot-de-passe`** (`ResetPassword.tsx`, route publique) :
  - détecte `type=recovery` dans le hash
  - formulaire nouveau mot de passe + confirmation
  - `supabase.auth.updateUser({ password })`
  - redirige vers `/espace-membre` après succès
- Routes ajoutées dans `App.tsx`.
- Note : les emails auth utilisent les templates Lovable par défaut (suffisant). Pas de scaffolding custom demandé.

## Fichiers

**Créés**
- `src/pages/Carte.tsx`
- `src/pages/ForgotPassword.tsx`
- `src/pages/ResetPassword.tsx`
- `src/components/carte/FranceMap.tsx`
- `src/components/carte/DepartementPanel.tsx`
- `public/data/fr-postal-codes.json` (script de génération depuis dataset INSEE public)
- `public/data/fr-departements.topo.json`
- Migration SQL : `code_postal` sur `candidatures` (et sur `profiles` si manquant)

**Édités**
- `src/App.tsx` (routes `/carte`, `/mot-de-passe-oublie`, `/reinitialiser-mot-de-passe`)
- `src/components/Navbar.tsx` (état loggué + admin)
- `src/pages/Login.tsx` (lien mdp oublié)
- `src/pages/Candidater.tsx` (champ code postal)
- `src/pages/membre/MembreProfil.tsx` (champ code postal)
- `src/pages/admin/AdminMembres.tsx` (champ code postal)
- `src/pages/Ressources.tsx` (affordances membre)
- `package.json` (deps map)

## Détails techniques

- Carte : `react-simple-maps` permet `<ComposableMap projection="geoMercator">` centré sur la France, `<Geographies>` pour les départements, `<Marker>` pour les bulles agrégées. Tailwind + couleurs design tokens (cyan accent, navy bg).
- Géocodage : pas d'API externe — lookup direct dans le JSON local par `code_postal`. Profils sans CP affichés dans une section "Localisation à compléter" pour les admins.
- RLS : la liste publique sur `/carte` n'expose que les compteurs ; côté membre loggué la liste détaillée passe par les policies `profiles` existantes (membres voient les autres membres).
- Auth : `resetPasswordForEmail` + page `/reinitialiser-mot-de-passe` publique (critique pour ne pas auto-logger l'utilisateur sans changement).
