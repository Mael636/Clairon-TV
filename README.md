# Clairon

Clairon est une interface française de guide TV qui distingue strictement un **programme de diffusion vérifié** d'un **catalogue de séries**. Aucune chaîne, émission, heure ou information « en direct » n'est générée localement. Tant qu'une source EPG utilisable et dont les droits de réutilisation sont vérifiés n'est pas configurée, la grille reste volontairement vide et l'application explique pourquoi.

## Lancer l'application

Aucun build, gestionnaire de paquets, compte, secret ou serveur applicatif n'est requis. Ouvrez `index.html` dans un navigateur récent, ou servez le dossier :

```sh
python3 -m http.server 8000
```

Puis ouvrez <http://localhost:8000>. Le thème choisi et les identifiants de favoris sont conservés localement dans le navigateur. La recherche de catalogue nécessite une connexion Internet.

## Sources et politique des données

### Guide de diffusion

Aucune source EPG n'est activée dans cette version. La page publique [XML TV FR – fichiers XML](https://www.xmltvfr.fr/xmltv.php) répertorie des guides XMLTV et indique pour le fichier TNT un programme disponible jusqu'à cinq jours; son site annonce une mise à jour journalière. Cela établit une source publique identifiable et une couverture déclarée, mais pas le droit de Clairon à traiter, mettre en cache ou republier ces programmes. [La documentation du générateur](https://www.xmltvfr.fr/docs.php) indique une licence Apache-2.0 pour le logiciel, ce qui **ne prouve pas à lui seul la licence ou les droits de republication des grilles collectées à partir de multiples sources**. Nous n'avons donc ni téléchargé ni intégré le flux : sans conditions explicites applicables aux données EPG et à leur republication, il n'est pas une source autorisée vérifiée pour cette application. Le lien de l'interface mène directement à la page des fichiers, sans présenter leur contenu comme validé ou exploitable par Clairon.

Avant d'activer un flux, il faudra examiner les conditions/licences en vigueur portant précisément sur les données EPG, identifier la source et l'attribution requise, confirmer la couverture des chaînes françaises, les règles de fréquence/mise en cache, et tester la fraîcheur, les fuseaux horaires, les identifiants des chaînes et les droits de republication. Faute de validation, l'état vide est le comportement attendu, pas un incident.

### Catalogue de séries

La recherche et les fiches de séries utilisent l'API publique [TVmaze](https://www.tvmaze.com/api) (`/search/shows` et `/shows/{id}`). C'est un catalogue éditorial, **pas** un EPG de chaînes françaises; ses résultats ne sont jamais introduits dans la grille. Les résumés sont rendus comme texte, les images externes chargées uniquement en HTTPS. Les favoris stockent uniquement des identifiants TVmaze sur l'appareil. Les fiches sortantes pointent vers TVmaze. Clairon ne référence ni ne revendique de bandes-annonces. Consultez les [conditions d'utilisation de TVmaze](https://www.tvmaze.com/terms-of-use) et celles des ayants droit.

## Fonctionnalités

- État vide de programmation transparent; aucune grille de démonstration ou faux indicateur « en direct ».
- Recherche de séries TVmaze avec états de chargement, absence de résultat et erreur réseau.
- Fiches de catalogue, filtres Découvrir/Mes favoris et favoris conservés localement.
- Navigation calendaire, thème clair/sombre, raccourci `/`, boîtes de dialogue accessibles, interface responsive et prise en compte de la réduction des animations.
- Pas de compte, suivi, publicité, clé API ou backend.

La navigation par date est prête côté interface mais ne peut pas afficher un programme sans flux EPG vérifié. Les filtres et la recherche concernent le catalogue de séries, et non les chaînes ni les horaires.

## Tests

Avec Node.js 18 ou plus récent :

```sh
node --test tests/*.test.js
node --check app.js
node --check core.js
```

## Licence et attribution

Le code Clairon est fourni sous licence MIT (voir `LICENSE`). Les métadonnées/images TVmaze et marques tierces demeurent sous leurs propres conditions. Clairon est un projet indépendant, sans affiliation aux diffuseurs ou à TVmaze.
