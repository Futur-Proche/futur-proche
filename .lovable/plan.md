## Importer 8 membres depuis le Google Sheet

### Données détectées (8 profils)

| Nom | Prénom | Poste | Entreprise | Ville |
|-----|--------|-------|------------|-------|
| DOSNE | Arthur | CMO | Lunii | Paris |
| TEILLAC | Jeanne | Dir. Marketing | Indépendante | Lyon |
| DENOYELLE | Arthur | Head of Marketing | Howdens | Paris |
| FUENTES | Maria | CMO | Pivote Consulting | Paris |
| LAFLORENCIE | Delphine | Dir. Marketing / Com | Independante | Paris |
| CATONNE | Sophie | Head of Digital Marketing | Hiflow | Paris |
| DE PONTBRIAND | Goulven | Directeur Marketing et Growth | Posos | Paris |
| BISCAUT | Peggy | Head of Marketing | Independante | — |

Chaque profil a aussi : email, téléphone, LinkedIn, secteur.

### Ce que je vais faire

1. **Créer un compte utilisateur** pour chaque profil (via l'authentification backend) avec leur email
2. **Insérer les profils** dans la table `profiles` avec toutes les infos : nom, prénom, poste, entreprise, secteur, ville, email, téléphone, LinkedIn
3. **Récupérer les photos LinkedIn** si possible via les URLs fournies

### Point d'attention

- La table `profiles` utilise `id` comme clé (qui correspond à `auth.users.id`). Il faut donc d'abord créer les utilisateurs dans le système d'authentification, puis créer les profils avec les mêmes IDs.
- Les mots de passe seront générés aléatoirement (les membres pourront utiliser "mot de passe oublié" pour se connecter).
- Les emails ne seront pas auto-confirmés sauf si tu le souhaites.

### Question

Veux-tu que je crée les comptes utilisateurs avec confirmation automatique de l'email (pour qu'ils puissent se connecter directement via "mot de passe oublié") ?
