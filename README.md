# Gantt Calendar (React + Vite)

Petit projet React qui affiche un calendrier mensuel sous forme de diagramme de Gantt en lignes (personnes) et colonnes (dates). Chaque cellule a un menu contextuel (clic droit) pour marquer l'état: "En congé", "En activité", "En télétravail". Les états sont sauvegardés dans `localStorage`.

## Installer

1. Installer les dépendances:

   npm install

2. Lancer en développement:

   npm run dev

3. Construire et prévisualiser:

   npm run build
   npm run preview

## Fonctionnalités

- Vue Gantt pour le mois courant, avec navigation **Mois précédent / suivant** et bouton "Aujourd'hui"
- Vue hebdo: 7 jours avec badgeuse dématérialisée (Start / Stop) pour le jour courant, compteur journalier et hebdomadaire
- Édition et suppression manuelle des sessions dans la vue hebdo (éditer horaire, supprimer session)
- Sélection de plage par clic-glisser (drag) sur une ligne: lâchez pour ouvrir le menu et appliquer l'état à toute la plage
- Clic droit sur une cellule pour choisir l'état (menu contextuel)
- Sauvegarde automatique dans `localStorage`

---

## Administration (nouveau)

Une petite API Express + SQLite a été ajoutée pour gérer les utilisateurs (CRUD).

- Backend: `server/index.js` (Express) + `server/db.js` (SQLite seed)
- Scripts: pour lancer le serveur: `npm run server` (depuis la racine du projet)
- Frontend: `src/views/AdminView.jsx`, `src/components/UserList.jsx`, `src/components/UserForm.jsx`, `src/api/users.js`

Instructions rapides:

1. Installer dépendances (racine + serveur):

   npm install
   cd server && npm install

2. Lancer le serveur (par défaut sur le port 4000):

   npm run server
> Par défaut un compte admin est seedé: **alice@example.com** / **adminpass** (dev only). Changez le mot de passe en production.
3. Lancer le client dans un autre terminal:

   npm run dev

4. Optionnel: si votre backend n'est pas sur `http://localhost:4000`, définissez la variable d'environnement Vite `VITE_API_URL`:

   # Windows PowerShell
   $env:VITE_API_URL = 'http://localhost:4000'

Puis ouvrez l'UI et cliquez sur le bouton **Admin** dans la barre supérieure pour gérer les utilisateurs.

---

Si vous voulez:
- pagination par mois
- édition par glisser-déposer
- import/export JSON

faites-le moi savoir et j'ajoute ces options. ✅
