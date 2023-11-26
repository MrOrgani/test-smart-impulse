# Test métier React - Smart Impulse

Ce projet a été créé avec [Create React App](https://github.com/facebook/create-react-app).

## Scripts disponibles et détails

Depuis le dossier principal, vous pouvez lancer:

### `yarn start`

Lance l'app en mode de développement.\
Le serveur est disponible à l'adresse [http://localhost:3000](http://localhost:3000).

L'appli React se recharge automatiquement quand des modifications sont apportées sur le code client.

Un serveur d'API se lance également en arrière plan, à l'adresse [http://localhost:4000](http://localhost:4000).\
Le code de ce serveur est dans le fichier `server.js`. C'est une simple API qui répond à quelques requêtes en renvoyant le contenu de fichiers JSON.\
Le fichier `packages.json` contient l'instruction `proxy`, qui permet d'automatiquement appeler le serveur depuis le client de façon transparente.

Le fichier `App.js` montre les 2 points d'entrée de l'API:
* `GET /api/projects` renvoie le détail des projets disponibles (tel que le ferait un site réel une fois l'utilisateur connecté). Chaque projet a un nom, une timezone (heure de Paris pour tous les projets ici) et un `uuid`.
* `GET /api/energy?uuid=UUID` renvoie les données associées à un projet. C'est une liste des catégories d'équipements qui ont été calculées par les algorithmes de Smart Impulse. Chaque série de données a un label, un type (notamment une catégorie `total` qui est la somme des autres), et des `data`: une liste de valeurs `[timestamp_in_utc, value_in_watt_hour]`. Le timestamp correspond au début de la journée, minuit dans le fuseau horaire du projet, et converti en UTC. La valeur correspond à l'énergie de la catégorie pour la journée.

### `yarn test`

Lance le runner de test en mode interactif.\
**Un test est en place pour vérifier que l'application se charge.**\
Pour plus de détails, se reporter à la documentation [running tests](https://facebook.github.io/create-react-app/docs/running-tests).


## Préparation

1. Si vous n'avez pas **nodejs en version >= 12**, suivre les [instructions d'installation de nodejs](https://nodejs.org/en/download/)
2. Si vous n'avez pas `yarn`, suivre les [instructions d'installation de yarn](https://classic.yarnpkg.com/en/docs/install)
3. Installez les dépendances du test métier en lançant `yarn` depuis le dossier du projet.
4. Lancer le projet avec `yarn start`

## Fonctionnalités

- choisir un projet (building), naviguer entre eux
- choisir une unité de mesure (MWh, kWh, euros)
- choisir une plage de date
- choisir différentes d'agrégations temporelles (jour/semaine/mois/année)
- possibilité de réinitialiser les sélecteurs.

Widgets:
- Un pour voir qu'elle est la somme totale dépensée sur la période sélectionnée
- Un pour voir qu'elle est la plus grosse dépense sur la période sélectionnée
- La liste des catégories d'équipements avec la dépense la plus onéreuse en fonction de l'agrégation temporelle

Graph (avec Chart JS)
- les axes se mettent à jour en fonction des agrégations.
- il est possible de zoomer sur le graphique.
- un tooltip apparaît lorsque l'on survole la donnée. Il affiche la période temporelle correspondante, le nom de la catégorie d'équipement et sa valeur.
- afin de vérifier les données affichées, j'ai mis la data originelle dans un Excel que vous pouvez voir ici: https://docs.google.com/spreadsheets/d/1h__ajn0ucDsoZF7_srji6-AX1LdF3DGXBvvB6glAjSA/edit#gid=0
- Il est possible d'afficher ou non la légende

## Screenshots

<img width="1510" alt="Capture d’écran 2023-11-26 à 22 02 45" src="https://github.com/MrOrgani/test-smart-impulse/assets/42295371/0d618dc0-87f8-488c-99a9-b7ece1dfb11a">

<img width="1509" alt="Capture d’écran 2023-11-26 à 22 03 09" src="https://github.com/MrOrgani/test-smart-impulse/assets/42295371/885613d9-8a92-43a7-bbcd-e112f6f97d0b">

<img width="1511" alt="Capture d’écran 2023-11-26 à 22 04 38" src="https://github.com/MrOrgani/test-smart-impulse/assets/42295371/8d12e68c-072e-4020-913f-8966440eea6f">


