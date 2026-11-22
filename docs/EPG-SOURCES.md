# Évaluation des sources EPG françaises — phase 1

**Revue documentaire : 22 novembre 2026.** Cette note constate les déclarations accessibles sur les pages de fournisseurs; elle n'est ni un avis juridique, ni une autorisation, ni une validation des flux. Revoir les conditions avant toute acquisition, car elles évoluent.

## Décision

**Aucun flux de programmation n'est autorisé/configuré sur la base de cette revue.** Une URL téléchargeable, un accès gratuit/public, une licence de logiciel collecteur ou une API ne suffisent pas à établir le droit de Clairon de récupérer, conserver, afficher et republier un EPG dérivé. Pas de programmation, horaire, logo ou synopsis copié ou fabriqué. L'état vide reste intentionnel.

Une piste a une licence de réutilisation explicitement déclarée mais une portée insuffisante pour un guide quotidien : le dataset historique limité aux premiers programmes de soirée de la TNT à l'automne 2026. Il ne constitue pas un EPG actuel et n'est pas intégré.

## Sources vérifiées

| Source | Droits et réutilisation | Couverture / fraîcheur déclarées | Décision |
|---|---|---|---|
| [XML TV Fr — fichiers](https://www.xmltvfr.fr/xmltv.php) et [documentation du générateur](https://www.xmltvfr.fr/docs.php) | La page rend des XML disponibles, mais les pages examinées n'établissent pas de licence des grilles ni l'autorisation de Clairon de les republicher. La documentation indique Apache-2.0 pour le **logiciel** générateur, qui recueille des données de multiples sources : cela ne prouve pas les droits sur les données sous-jacentes. Attribution, cache, republication commerciale ou non et retrait des données : non établis. | Au moment de la consultation : TNT France, environ 401 chaînes France métropolitaine ou environ 782 chaînes complètes; jusqu'à cinq jours. La page affichait une mise à jour le 22/11/2026 vers 02:41 et annonce une mise à jour journalière; aucune garantie de complétude/SLA par chaîne. | Piste à contacter, **ne pas intégrer ni télécharger** avant confirmation écrite couvrant les droits sur l'EPG agrégé, l'attribution, les conditions d'accès, le cache/rafraîchissement, la republication et le retrait. |
| [EPG-plus — accès aux données](https://www.epg-plus.com/fr/access-the-data/) | Déclare que les données sont protégées par le droit d'auteur des propriétaires respectifs et réservées à un usage privé, non commercial. Le jeton Plus obtenu après don ne confère pas de droit de republication. | XMLTV standard/Plus; l'accès Plus indique toutes les chaînes sur sept jours, version « small » sur quatre jours; recommande cache et téléchargements limités aux fichiers modifiés. Fraîcheur individuelle non validée ici. | **Rejetée** pour guide public Clairon : restriction d'usage explicite. |
| [Programme TV Simple — dataset prime-time TNT automne 2026](https://www.data.gouv.fr/datasets/programmes-de-premiere-partie-de-soiree-de-la-tnt-automne-2026) et [Licence Ouverte 2.0](https://www.etalab.gouv.fr/licence-ouverte-open-licence) | La fiche du jeu déclare Licence Ouverte 2.0 : réutilisation selon ses termes, avec attribution requise; vérifier les éventuelles limites de champs tiers et respecter la licence. | 21 chaînes gratuites, hors info en continu; premier programme du soir par chaîne/date, du 15/09 au 15/11/2026, 1 235 entrées. Horaires issus des grilles publiées; année/pays ajoutés seulement aux œuvres identifiées à confiance élevée dans TMDB. Dernière mise à jour déclarée : 16/11/2026. Pas un EPG complet, actuel ou continu. | Droits déclarés pour le dataset sous licence, mais **inadéquat à une grille quotidienne**. Usage historique distinct à examiner sur les ressources exactes; non intégré. |
| [Open API Radio France](https://developers.radiofrance.fr/doc) | Accès GraphQL avec clé sur demande. La documentation consultée ne permet pas d'établir la licence de republication des données; clé ≠ permission. | Grilles/données des chaînes Radio France seulement; pas un guide TV français exhaustif. Fraîcheur/cache non établis dans cette revue. | Ne pas intégrer avant clarification des droits, attribution et conditions d'accès; couverture partielle même si autorisée. |
| [iptv-org/epg](https://github.com/iptv-org/epg) et [iptv-org/api](https://github.com/iptv-org/api) | Outils et catalogue de sources hétérogènes; licence du code ou du catalogue ne prouve pas les droits sur les programmes des sites tiers. Il faut examiner chaque flux à sa source. | Couverture et fraîcheur dépendent des différents fournisseurs; aucune garantie globale établie. | Index de pistes seulement, pas une autorisation de données. |
| [Grille France TV](https://www.france.tv/chaines/) et autres grilles web | Consultation publique ne vaut pas autorisation de collecte automatisée, stockage ou republication; conditions des données et des champs tiers non établies ici. | Grille éditoriale d'un diffuseur, couverture propriétaire; pas de flux global licencié établi. | Pas de scraping/réutilisation sans permission explicite. |

## Critères impératifs d'activation

1. **Chaîne de droits** documentée : fournisseur, producteurs et titulaires/sources amont; licence portant sur les données, non seulement sur le logiciel, le format ou l'API.
2. **Usages** expressément couverts : récupération automatisée, transformation, cache/rétention, affichage public et republication de données dérivées, commercialité, territoire/durée, retrait.
3. **Attribution** exigée : texte, lien, emplacement; compatibilité avec l'interface et d'éventuels exports.
4. **Accès** : clé/inscription, quotas, cadence, cache, format, limites anti-scraping et redistribution du fichier/champs.
5. **Adéquation** : chaînes/identifiants, territoire, fuseau et changements d'heure, champs, fenêtre temporelle et lacunes.
6. **Fraîcheur et qualité** : horodatage contrôlable, données partielles/périmées, tests de cohérence et possibilité de désactivation/retrait.

**Règle :** toute incertitude substantielle sur les droits de republication ou toute restriction incompatible bloque l'intégration. Ne pas remplacer les trous par des données d'une source non vérifiée ou des horaires inventés. Afficher provenance et date de fraîcheur uniquement après validation.

## Prochaines étapes

- Demander à XML TV Fr confirmation écrite de l'autorisation Clairon, la provenance/licence des données agrégées, l'attribution, la republication commerciale/non commerciale, les règles de fréquence/cache/rétention et la procédure de retrait.
- Constituer pour chaque source candidate un dossier avec conditions datées et droits champ par champ lorsque nécessaire; faire confirmer toute ambiguïté.
- Préciser juridiction, usage public/commercial, chaînes/territoire, fraîcheur, budget et infrastructure visés.
- N'examiner le dataset Programme TV Simple que pour un usage historique défini, après lecture de ses ressources et contraintes de provenance.
- Reprendre l'intégration et les tests EPG de la roadmap seulement après validation; conserver jusque-là l'état vide.

Les couvertures, volumes et dates ci-dessus sont les déclarations observées le 22/11/2026, pas un engagement de service. Les conditions officielles en vigueur prévalent. Cette revue ne conclut pas à un droit que la documentation examinée n'établit pas.
