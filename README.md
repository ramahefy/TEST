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

Si vous voulez:
- pagination par mois
- édition par glisser-déposer
- import/export JSON

faites-le moi savoir et j'ajoute ces options. ✅
