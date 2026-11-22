# Clairon

Un guide TV français statique, sans publicité, qui donne à la programmation l’allure d’un petit programme de salle. Cette première version privilégie une grille lisible, l’ordre des chaînes, les programmes en cours et une recherche de fiches de séries.

## Lancer l’application

Aucun build, gestionnaire de paquets, compte ni secret n’est requis. Ouvrez simplement `index.html` dans un navigateur récent. Pour servir le dossier en local :

```sh
python3 -m http.server 8000
```

Puis ouvrez <http://localhost:8000>. La page et la grille de démonstration fonctionnent sans serveur applicatif. La recherche en catalogue requiert une connexion Internet. Le navigateur conserve le choix du thème localement.

## Données et API

La grille (chaînes, intitulés, catégories, durées) est embarquée dans `app.js` et est **fictive** : les horaires sont recalculés autour de l’heure locale du navigateur, mais ne représentent aucune diffusion réelle. La date peut être parcourue, les fiches sont ouvertes depuis les cellules et « En direct » désigne le créneau de démonstration situé autour de l’heure locale.

La recherche de séries interroge l’API publique **TVmaze** (`https://api.tvmaze.com/search/shows?q=…`) directement depuis le navigateur. Elle peut afficher les métadonnées/résumés du catalogue et relier à sa fiche TVmaze. Les affiches renvoyées par TVmaze peuvent être chargées depuis leur hébergeur. Clairon ne possède pas de clé API et n’en exige aucune. La recherche de bande-annonce ouvre une recherche YouTube, elle ne certifie ni ne fournit une bande-annonce intégrée.

- Documentation de l’API : <https://www.tvmaze.com/api>
- Conditions d’utilisation : <https://www.tvmaze.com/terms-of-use>

## Fonctionnalités de cette version

- Grille responsive à six créneaux avec huit chaînes dans un ordre explicite.
- Rangée « À l’antenne », indicateur de progression et fiches programme.
- Filtre Films & séries, navigation par jour, mode clair/sombre et recherche catalogue.
- Aucun emplacement publicitaire, SDK de suivi, backend ou secret.

## Limites connues

Il ne s’agit pas d’un guide de diffusion réel : pas d’EPG, pas de synchronisation avec un opérateur, pas de géolocalisation, de compte, de favoris ou de notifications. La composition de la grille ne change pas selon le jour. Les fiches des titres de démonstration ne sont pas des fiches de catalogue vérifiées. TVmaze est un catalogue de séries, pas une source de programmation des chaînes françaises; ses données et images dépendent de sa disponibilité, et sa couverture varie. Aucune bande-annonce n’est intégrée ou garantie.

## Licence & attribution

Le code Clairon est fourni sous licence MIT (voir `LICENSE`). Les données et images récupérées à l’exécution restent soumises aux conditions de TVmaze et des ayants droit. Le nom et les marques des chaînes sont cités à titre indicatif pour cette maquette; aucun partenariat ni affiliation n’est revendiqué.
