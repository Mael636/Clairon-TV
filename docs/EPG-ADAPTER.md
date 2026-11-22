# Intégration EPG : frontière technique et blocage juridique

## État effectif

Aucune source d'EPG n'est actuellement autorisée et configurée pour Clairon. L'application ne doit donc pas afficher de fausses chaînes, horaires, descriptions ou marqueurs « en direct ». `epg.js` est un contrat/normaliseur testé, pas un flux de programmes, et il n'est pas branché comme s'il avait des listings. Son chargement est désactivé par défaut : il faut à la fois `enabled: true` et `rightsConfirmed: true` pour effectuer une requête. Ces indicateurs ne remplacent pas l'examen et la conservation des autorisations écrites.

## Revue des sources et décision

Vérification documentaire au 22 novembre 2026, à revalider avant déploiement :

- XML TV Fr expose des fichiers XML contenant, selon sa page, jusqu'à cinq jours et des centaines de chaînes. Sa documentation explique l'agrégation de services tiers et la licence Apache-2.0 du **logiciel générateur**. Les pages consultées ne donnent pas de licence sur les données de programmes ni de permission de republication. Une URL publique, une source consultable, une licence du code ou un format ouvert ne créent pas ce droit. **Ne pas consommer ni republier avant confirmation écrite couvrant les données amont, collecte, transformation, affichage public, rétention/cache, attribution et retrait.**
- EPG-plus précise que les données relèvent des ayants droit et sont réservées à un usage privé non commercial. Un accès par don/token ne confère pas de droit à un guide public. **Incompatible avec l'usage public de Clairon.**
- TVmaze fournit un catalogue de séries et des calendriers d'épisodes, pas un EPG complet des chaînes françaises. Ses métadonnées ne peuvent être confondues avec une grille de diffusion française. Les calendriers d'épisodes ne sont pas utilisés comme substitute.
- Des données historiques à licence ouverte ne sont pas un guide actuel, complet, ni renouvelable. Ne pas les mélanger à une grille quotidienne.

Sources officielles examinées : [XML TV Fr — flux](https://www.xmltvfr.fr/xmltv.php), [documentation du générateur](https://www.xmltvfr.fr/docs.php), [EPG-plus — accès aux données](https://www.epg-plus.com/fr/access-the-data/), [API TVmaze](https://www.tvmaze.com/api). Cette revue documentaire n'est pas un avis juridique. Les conditions officielles en vigueur prévalent.

## Contrat d'intégration

Une source déjà autorisée peut être adaptée à `{ channels: [{ id, name, number, logo, sourceUrl }], programmes: [{ channelId, title, start, end, synopsis, category, episode, image, sourceUrl, trailerUrl }] }`. Les horaires doivent être des dates ISO avec un fuseau explicite. `normalize` filtre les programmes mal formés/orphelins et les URL non HTTPS, respecte un ordre explicite de chaînes, et `atTime` calcule programme en cours/suivant seulement sur des intervalles réels. Résumé, lien de source, image et bande-annonce restent optionnels et ne sont affichés que s'ils sont fournis et conformes.

Avant activation, obtenir et archiver les conditions portant sur la republication des données et champs, confirmer l'attribution, l'usage commercial/non commercial, le territoire, quotas, cadence/cache/rétention, retrait, couverture et fuseau. Une source protégée ou authentifiée nécessitera vraisemblablement un petit backend/proxy autorisé; ne pas exposer de jeton dans le navigateur. Le fournisseur doit définir son URL HTTPS, schéma/adaptateur, fuseau et chaîne de provenance. Tester les erreurs HTTP, timeout, données périmées, décalages horaires et DST; conserver l'état vide en panne, ne pas substituer de fausses données.

L'interface courante reste un catalogue TVmaze avec calendrier de navigation, favoris et thème; elle n'a pas de grille de chaînes EPG active. L'adaptateur fournit une frontière testée, pas à lui seul l'interface finale de grille. L'étape suivante est l'autorisation écrite, puis l'adaptateur fournisseur, l'intégration de la grille responsive/maintenant-suivant, l'attribution/horodatage visible et les tests d'acceptation avec un flux permis.
