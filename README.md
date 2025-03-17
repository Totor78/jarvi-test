### Exercice Rémi Castel
# Brief
```
J’aimerais bien avoir une page statistiques dans Jarvi pour savoir quels types de messages ont le plus de taux de réponse, entre email / message linkedin / inmail linkedin, afin d’améliorer mes méthodes d’approche.
Si possible je voudrais pouvoir choisir une période temporelle sur laquelle se fait l’analyse, et éventuellement pour un projet donné.
Ce qui serait trop cool aussi ce serait d’avoir l’info si je m’améliore par rapport à la période précédente.
```


# Getting Started 

Check .node-version file to get node version

` yarn install `

then 

` yarn start `

Will start on localhost:3000

# Explication de mon travail

### Etape 1: 

Création d'une vue en SQL sur Hasura pour rassembler les données utiles en me basant sur les données de la table historyentries. 
J'ai créé une vue en gardant la notion temporelle car je vais ensuite pouvoir travailler la data sur le front avec un seul appel API
Script de la création de la vue : 
```
CREATE
OR REPLACE VIEW "public"."view_history_entries_aggregated" AS
SELECT
  count(subquery.is_replied) AS count,
  subquery.type,
  subquery.is_replied,
  (date_trunc('day' :: text, subquery.created_at)) :: date AS date_trunc
FROM
  (
    SELECT
      historyentries.trigger_has_been_replied_to AS is_replied,
      historyentries.user_id,
      historyentries.type,
      historyentries.created_at
    FROM
      historyentries
    WHERE
      (
        (
          historyentries.user_id = '32ca93da-0cf6-4608-91e7-bc6a2dbedcd1' :: uuid
        )
        AND (
          historyentries.type = ANY (
            ARRAY ['EMAIL_SENT'::text, 'LINKEDIN_INMAIL_SENT'::text, 'LINKEDIN_MESSAGE_SENT'::text]
          )
        )
      )
  ) subquery
GROUP BY
  subquery.type,
  subquery.is_replied,
  (date_trunc('day' :: text, subquery.created_at))
ORDER BY
  (date_trunc('day' :: text, subquery.created_at));
  ```

### Etape 2: 

Ensuite j'ai créé le projet en React. Dans un contexte entreprise j'aurai utilisé, en fonction du brief actuel, une solution reporting comme Metabase. Directement pluggé sur la BDD je créé des tableaux de bords plus rapidement pour le client en donnant accès à l'utilisateur à la modification en autonomie des détails autour des graphiques pré définis.

Je commence par créer un premier graphique pour valider la règle métier du taux de réponse. Je suis parti sur Chart.js pour créer des graphiques. J'ai commencé par le camembert de répartition entre les réponses et les non réponses tous projets confondus. 

### Etape 3: 

Une fois l'environnement prêt, j'ai commencé à rajouter les développements liés au brief. J'ai créé 3 graphiques supplémentaires :
    - Le premier est un diagramme en baton avec le détail du taux de réponse par projet.
    - Le second est un diagramme en baton avec le détail du taux de réponse par projet et par année
    - Le dernier est une courbe évolutive du taux de réponse par mois et par projet. Avec la notion de comparaison par rapport au point n-1

La vue par défaut de ces graphiques est globale. J'avais envie de voir ces graphiques avec ces configurations pour avoir une vue d'ensemble avant de paramétrer des détails.

### Etape 4: 

Une fois les graphiques développés, j'ai travaillé sur la possibilité de paramétrer la temporalité des données des graphiques. Ainsi j'ai créé une suite de bouton qui permettent de consulter la donnée en fonction du jour (aujourd'hui), du mois courant, de l'année courante.

Puis j'ai travaillé sur la possibilité de choisir un jour particulier ou un interval de dates. 

### Etape 5: 

J'ai ensuite travaillé sur la possibilité de choisir le projet et d'avoir les informations en fonction. Tout gardant la notion temporelle sélectionnée.

### Dernière étape

Comparaison de périodes : J'ai essayé sans passer trop de temps de rajouter cette notion dans le graphique des pourcentages de réponse par projet. Quand on sélectionne la vue du jour, du mois courant ou de l'année courante, un calcul par rapport à la période d-1, m-1 ou y-1 est effectué.