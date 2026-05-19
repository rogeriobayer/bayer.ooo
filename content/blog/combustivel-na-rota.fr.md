---
title: "Comment je me suis retrouvé à Foz do Iguaçu avec un quart de réservoir et j'ai fini par construire un chercheur de carburant"
slug: combustivel-na-rota
date: 2026-05-19T10:00:00.000Z
lang: fr
excerpt: "L'histoire d'un manque de planification et d'un réservoir presque vide qui m'ont poussé à construire un outil pour trouver du carburant pas cher le long de n'importe quel itinéraire au Paraná."
tags:
  - react
  - cloudflare
  - ux
  - open-source
cover: /blog/combustivel.png
author: Rogério Bayer
---

La planification d'un voyage est généralement la partie amusante — jusqu'à ce que la réalité frappe à la porte. J'avais mes bagages prêts et je m'apprêtais à quitter Curitiba pour Foz do Iguaçu quand j'ai remarqué l'aiguille : un quart de réservoir. Plus de 630 kilomètres de route devant moi, et je n'avais aucune idée d'où je m'arrêterais pour faire le plein ni combien cela me coûterait.

Le Paraná dispose d'un excellent outil appelé Menor Preço, alimenté par les données en temps réel du programme Nota Paraná. Le problème réside dans le postulat de conception : l'application officielle fonctionne comme un radar. Elle capte votre position actuelle, trace un rayon de 20 km et affiche ce qui se trouve autour.

Pour quelqu'un qui planifie une traversée de l'État depuis son canapé, c'est inutile. Vous ne voulez pas connaître le prix à la station-service du coin ; vous voulez connaître le prix à Guarapuava ou Cascavel avant même de démarrer le moteur.

Cette situation m'a suffisamment agacé pour que j'arrête de planifier le voyage et que je commence à planifier un outil. Le résultat est disponible sur [combustivel.bayer.ooo](https://combustivel.bayer.ooo).

## Le Problème : Bonnes Données, Mauvaise Question

La Recette de l'État fournit les données, mais l'interface officielle limite la recherche à un point fixe. Si vous voulez parcourir toute la BR 277, vous devriez ouvrir l'application tous les 40 km pour vérifier si la prochaine station est moins chère. Si vous êtes à Curitiba, elle n'affiche pas les stations à Ponta Grossa ; si vous êtes à Ponta Grossa, elle n'affiche pas Guarapuava.

Le défi n'était pas le manque d'information — c'était le **contexte spatial**. Un itinéraire n'est pas un point ; c'est une ligne qui traverse des dizaines de municipalités. La bonne question à poser au système n'était pas « où est le carburant pas cher maintenant ? », mais plutôt « où est le carburant pas cher le long de ce trajet ? ».

## La Solution : Échantillonner la Route

Pour résoudre ce problème, j'ai construit une couche d'intelligence au-dessus des données existantes. La logique fonctionne en quatre étapes :

**1. Géocodage :** Lorsque vous saisissez le départ et la destination, le navigateur demande à **Nominatim** (le géocodeur d'OpenStreetMap) où se trouvent ces lieux. Il renvoie la latitude et la longitude.

**2. Routage :** Avec les coordonnées en main, l'application appelle **OSRM** (Open Source Routing Machine), qui trace l'itinéraire routier. La réponse inclut la géométrie complète de la route : une séquence de milliers de points décrivant chaque courbe de la BR 277.

**3. Échantillonnage Intelligent :** Interroger l'API gouvernementale pour chaque coordonnée de la ligne serait inefficace et lourd. Au lieu de cela, j'ai fragmenté l'itinéraire en segments, collectant un point de référence tous les 20 km environ. Un voyage de Curitiba à Foz devient environ 30 points de requête.

**4. Recherche par Lots :** Pour chaque point échantillonné, le système envoie une requête dans un rayon de 20 km. Les requêtes s'exécutent en parallèle, et les résultats sont combinés, dédupliqués et triés.

La recherche locale existe également. Si vous préférez consulter les prix près d'une ville spécifique sans tracer d'itinéraire, il suffit de saisir le nom de la municipalité. Le système effectue la même requête par geohash dans un rayon de 20 km — mais avec une seule requête, puisqu'il n'y a pas d'itinéraire à échantillonner.

## La Stack Technique (et pourquoi c'est plus rapide)

En tant que développeur, j'ai cherché une architecture légère et facile à maintenir. Le frontend est construit avec **React** et **Leaflet** pour les cartes, et les requêtes sont mises en cache avec **TanStack Query**. Le proxy des API tourne sur un **Cloudflare Worker**, ce qui permet d'héberger le site et le backend sur le même domaine sans se soucier du CORS.

En prime, le résultat est considérablement plus rapide et plus fluide que l'application publique. Le secret réside dans le cache agressif de TanStack Query lors du déplacement de la carte et dans l'efficacité des Cloudflare Workers pour orchestrer les appels en parallèle.

### En pratique : comment fonctionnent les requêtes

Toute la communication passe par le navigateur. Si vous ouvrez les DevTools (F12) dans l'onglet Réseau, vous verrez exactement ce flux de requêtes réelles :

#### Géocodage : adresse vers coordonnées

```bash
curl "https://nominatim.openstreetmap.org/search?q=Curitiba&format=json&limit=5&countrycodes=br&addressdetails=1"
```

```json
[
  {
    "lat": "-25.4284",
    "lon": "-49.2733",
    "display_name": "Curitiba, Paraná, Região Sul, Brasil"
  }
]
```

#### Routage : coordonnées vers itinéraire

OSRM reçoit les points et renvoie la ligne de la route, la distance en mètres et la durée en secondes :

```bash
curl "https://router.project-osrm.org/route/v1/driving/-49.2733,-25.4284;-54.5648,-25.5483?overview=full&geometries=geojson"
```

```json
{
  "routes": [
    {
      "geometry": {
        "coordinates": [
          [-49.2733, -25.4284],
          [-49.2801, -25.4302]
        ]
      },
      "distance": 632584.7,
      "duration": 26041.2
    }
  ]
}
```

#### Consultation des prix : geohash vers stations

Chaque point d'échantillonnage est converti en un **geohash** de précision 12. Cela garantit que la requête à l'API gouvernementale soit chirurgicale, préservant la précision sans exposer les coordonnées brutes :

```bash
curl "https://menorpreco.notaparana.pr.gov.br/api/v1/produtos?local=6gkzwgjzn820&raio=20&data=3&ordem=0&tp_comb=1"
```

*Les paramètres indiquent le geohash (`local`), le rayon de 20 km (`raio`), les dernières 24h (`data=3`) et le type de carburant (`tp_comb=1` pour l'essence).*

## Ce que l'outil apporte

Vous pouvez l'essayer dès maintenant sur [combustivel.bayer.ooo](https://combustivel.bayer.ooo). Lorsque vous tracez un itinéraire sur l'écran, l'application dessine le chemin et liste les stations par prix, proximité ou date de mise à jour. Chaque entrée affiche le prix au litre, l'adresse, l'horodatage du dernier reçu émis et des boutons directs pour ouvrir dans Google Maps ou Waze.

Si l'itinéraire passe en dehors du Paraná ou du Pernambouc — les seuls États qui ouvrent actuellement ces données —, l'application affiche un avis de couverture réduite, évitant à l'utilisateur de penser que le système est en panne.

## Résultat et Leçons Apprises

La plus grande leçon de ce projet n'était pas sur le code — c'était sur l'**UX**. Parfois, la valeur d'un produit ne réside pas dans la création de nouvelles données, mais dans la façon de changer l'interaction de l'utilisateur avec des données qui existent déjà. La technologie était là ; ce qui manquait, c'était le contexte approprié pour quelqu'un sur la route.

J'ai pu tester l'outil en pratique lors d'un voyage à Foz do Iguaçu pendant le Carnaval. La tranquillité d'esprit de savoir exactement dans quelle ville s'arrêter pour profiter d'une différence de R$ 0,30 par litre a payé chaque heure de développement.

Le projet a prouvé qu'avec les bonnes API et la bonne question, on peut transformer l'anxiété d'un réservoir vide en une interface propre, rapide et extrêmement utile.
