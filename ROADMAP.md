# Propositions de versions suivantes — pour validation, non exécutées

Cette feuille de route est une proposition de produit et d'architecture. Aucune des étapes ci-dessous n'est engagée par le commit de la version actuelle. Les jalons EPG dépendent d'une autorisation documentée; une source indisponible ou aux droits incertains n'est jamais remplacée par des données fictives.

## V2.1 — Contrat de données et preuve de provenance

- Évaluer un fournisseur EPG ou XMLTV chaîne par chaîne : titulaire/source des données, licence/réutilisation commerciale ou non, attribution, fréquence permise, cache, redistribution, politique de retrait et contact de signalement.
- Créer un manifeste versionné `sources.json` par flux approuvé : URL, licence/terms datés, date d'examen humain, attribution, identifiants XMLTV, territoire, fuseau, fenêtre de validité, intervalle de rafraîchissement et contact.
- Aucun branchement d'une source sans revue juridique/éditoriale. Si rien ne passe cette revue, conserver l'état vide avec une explication et éventuellement un formulaire de suggestion de source.
- Définir une frontière `EPG provider → validation → modèle normalisé` séparée du client TVmaze; valider les réponses, XML malformé, identifiants inconnus, heures ambiguës et champs optionnels. Horodatage UTC en stockage, fuseau Europe/Paris à l'écran, règles explicites pour les changements d'heure.
- Exécuter une preuve de concept sur un instantané de test non distribué, avec provenance et dates artificielles clairement marquées dans l'environnement de test uniquement; bloquer leur inclusion dans les builds publics.

**Critères d'acceptation :** autorisation et attribution documentées avant affichage; vérification d'intégrité et de fraîcheur; aucune régression qui transforme erreur, absence ou expiration en émission « en cours »; possibilité de désactiver un flux sans supprimer l'interface.

## V2.2 — Acquisition fiable, fraîcheur et résilience

- Si et seulement si le droit et les conditions d'accès sont approuvés, construire une tâche de récupération respectant quotas et cadence fournisseur; pas de récupération en boucle depuis chaque navigateur.
- Envisager un petit service/cache edge avec politique de rétention et en-têtes, ou une génération statique planifiée si elle respecte la licence. Ne pas mettre de compte opérateur, secret ou URL IPTV personnelle dans le dépôt/client.
- Journaliser la provenance, le résultat, l'heure de dernière réussite, la couverture et l'état de fraîcheur; mettre des alertes de taux d'erreur et d'expiration. Éviter de journaliser des données privées.
- Choisir le comportement hors ligne et après expiration : afficher explicitement « données du … », staleness/erreur, ne jamais présenter le cache comme une mise à jour courante; bouton réessayer avec temporisation.
- Limites de taille, parsing sécurisé, validation schéma, délais, annulation, reprises bornées et tests de fichiers XML compressés/invalides.

**Critères d'acceptation :** quotas honorés, import idempotent, fraîcheur visible, pannes fournisseur explicites, et tests de cache/fichier malformé; aucun faux état « direct ».

## V2.3 — Guide quotidien, découverte et navigation

- Afficher seulement les chaînes réellement présentes dans la source choisie; choisir/réordonner/masquer des chaînes et grouper par catégories vérifiées. Distinguer une chaîne indisponible d'un programme sans titre fourni.
- Recherche plein texte sur résultats EPG valides; filtres chaînes, catégories, direct/à venir, favoris, plages horaires et accessibilité clavier; états sans résultat clairs.
- Jour/date, saut à maintenant, précédent/suivant, fuseau indiqué; créneaux alignés par heure et gestion des programmes traversant minuit/plusieurs jours.
- Fiches à partir des seuls champs source fournis, provenance, heure de dernière mise à jour, durée, classification, résumé et crédits selon disponibilité/droits. N'afficher pas d'informations inventées pour remplir les trous.
- Indicateur « en cours » et barre de progression calculés exclusivement à partir d'horodatages EPG valides, ajustés à la fraîcheur et au fuseau.
- Favoris chaînes/programmes robustes aux suppressions de catalogue, persistance locale et export/import utilisateur facultatif.
- Responsive mobile : liste compacte par chaîne avec navigation temporelle et alternative accessible à la grille horizontale; contraste, lecteur d'écran, commandes de zoom et tests clavier.

**Critères d'acceptation :** calculs de dates testés sur DST et minuit, correspondances de chaînes déterministes, interface utilisable sans souris, et données absentes jamais remplacées par un titre de secours fictif.

## V2.4 — Fiches enrichies et bandes-annonces sous contrôle

- Séparer métadonnées catalogue et programmation dans l'interface et les types de données; les identifiants de liaison ne sont utilisés qu'avec correspondance vérifiable (titre, année, personnes ou identifiant éditorial), jamais uniquement un titre homonyme.
- Documenter l'attribution, cache, quotas, couverture linguistique et conditions de TVmaze; masquer les images qui échouent, garder un texte de remplacement et limiter les requêtes.
- Pour les trailers : préférer URL de source officielle/ayant droit ou API explicitement autorisée; ne pas scraper YouTube. Une recherche externe est un simple lien sortant et ne garantit ni vidéo officielle, disponibilité ni droits. Pas d'autoplay ni d'intégration avant validation des conditions, confidentialité et consentement applicables.
- Ajouter liens « source de la fiche » et « signaler une erreur », date de mise à jour et indication des champs non fournis.

**Critères d'acceptation :** association de fiche auditable, titres ambigus sans enrichissement automatique, attribution visible et respect des restrictions de chaque source.

## V2.5 — Qualité, vie privée et lancement progressif

- Suite de tests unitaires (normalisation, filtrage, fuseaux, favoris), tests d'intégration (source simulée au test, jamais au build de production), parcours navigateur mobile/desktop et tests a11y automatisés/manuels.
- Tests de contrat par snapshots minimisés/anonymisés dont la licence permet la conservation; fixtures fictives marquées exclusivement test et garde CI qui échoue si elles se glissent en bundle.
- Stratégie erreurs : états vide/chargement/périmé/partiel/échec distincts, nouvelle tentative manuelle, messages non techniques; Sentry/analytics uniquement après décision explicite et revue vie privée.
- Sécurité front : politique CSP/ressources externes documentées, inventaire des données et rétention.
- Déploiement progressif, page d'état des flux, journal des versions de source et procédure de retrait/incident.

**Critères d'acceptation :** aucun secret dans le client, aucune télémétrie sans décision informée, contrôles régression/contraste/clavier réussis, et rollback rapide du flux indépendamment du déploiement de l'app.

## Décisions attendues avant démarrage

1. Quelle juridiction, quels usages (personnel, public, commercial) et quel budget de licence/hébergement sont visés ?
2. Qui peut autoriser la republication de chaque programme, logo, synopsis, image et trailer ?
3. Quels diffuseurs, territoires, langues, fraîcheur et historique sont prioritaires ?
4. Service statique seulement, ou accepte-t-on un backend et ses coûts/obligations de sécurité ?
5. Quelles attentes de confidentialité, cookies, conservation et synchronisation des favoris ?
