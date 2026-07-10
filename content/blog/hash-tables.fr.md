---
title: "Hash Tables en JavaScript : la structure qui peut vous sauver en entretien technique"
slug: hash-tables
date: 2026-07-10T10:00:00.000Z
lang: fr
excerpt: "Comprenez comment fonctionnent les tables de hachage, quand les utiliser plutôt que d'autres structures de données, et comment elles transforment les problèmes d'entretien O(n²) en solutions O(n) propres avec Map, Set et les objets en JavaScript."
tags:
  - javascript
  - algorithms
  - data-structures
  - hash-tables
  - computer-science
  - performance
cover: /blog/hash-tables.png
author: Rogério Bayer
---

Il y a un moment précis dans un entretien technique que la plupart des développeurs reconnaissent. Vous résolvez le problème. Ça marche. Puis l'interviewer demande : « vous pouvez faire mieux ? » Et la réponse, le plus souvent, implique une table de hachage.

La raison n'est pas que les tables de hachage sont astucieuses. C'est qu'elles résolvent un problème très spécifique et très courant : vous parcourez une collection de manière répétée, et chaque recherche coûte O(n). Mettez cela dans une boucle et vous obtenez O(n²). Remplacez la recherche interne par une consultation dans une table de hachage et tout l'algorithme devient O(n). C'est généralement l'optimisation que l'interviewer attend.

- - -

## Comment ça fonctionne

Une table de hachage convertit une clé en adresse de tableau à l'aide d'une fonction de hachage. La même clé correspond toujours à la même adresse, donc les lectures comme les écritures coûtent O(1), quel que soit le volume de données stockées. Pas de balayage, pas de comparaison, pas d'itération. Vous calculez l'adresse et accédez directement à la donnée.

La fonction de hachage traite chaque caractère de la clé en utilisant son code numérique, multiplie par la position et utilise le modulo pour rester dans les limites du tableau :

```javascript
js_hash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * i) % this.data.length;
  }
  return hash;
}
```

Avec suffisamment de données et un nombre fixe d'emplacements, deux clés différentes finiront par produire la même adresse. C'est une collision. La solution standard consiste à stocker une liste à chaque emplacement au lieu d'une valeur unique, de sorte que les collisions s'ajoutent simplement à la liste. Vous arrivez toujours au bon emplacement en O(1) via le hachage, puis parcourez une courte liste pour trouver la clé exacte. Avec un grand tableau et une bonne fonction de hachage, ces listes restent suffisamment petites pour que le coût demeure effectivement constant.

- - -

## Comment les tables de hachage se comparent aux autres structures

Chaque structure a un rôle. L'erreur est de prendre celle qu'on connaît au lieu de la bonne.

* **Tableau :** accès O(1) par indice, recherche O(n) par valeur. Rapide quand vous connaissez la position. Lent quand vous cherchez par contenu.
* **Liste chaînée :** insertion et suppression flexibles à des positions connues, mais toujours O(n) pour trouver une valeur. Pas de raccourci vers un élément spécifique.
* **Arbre binaire de recherche :** recherche O(log n), et les données restent triées. Mieux que O(n), moins bien que O(1). Le véritable avantage est le parcours ordonné et les requêtes par intervalle, choses qu'une table de hachage ne peut pas faire.
* **Tas (Heap) :** accès O(1) à la valeur minimale ou maximale, insertion O(log n). Le bon choix quand vous avez besoin de la valeur extrême de façon répétée dans un ensemble de données changeant.
* **Table de hachage :** recherche O(1) par clé. Pas de tri, coût mémoire supplémentaire, mais rien ne la bat pour les recherches ponctuelles.

Le signal pour utiliser une table de hachage est précis : vous avez besoin de recherches rapides par clé, vous n'avez pas besoin de tri, et échanger de la mémoire contre de la vitesse a du sens dans le contexte.

- - -

## Le schéma d'entretien

La plupart des problèmes où les tables de hachage aident suivent la même structure. Vous avez des données que vous devez référencer en parcourant une collection. Au lieu de revenir en arrière et de chercher à chaque fois, vous stockez ce que vous avez déjà vu et le vérifiez en O(1).

Two Sum est l'exemple qui revient le plus souvent. L'approche naïve vérifie chaque paire de nombres, ce qui donne O(n²). Avec une table de hachage, vous parcourez le tableau une seule fois. Pour chaque nombre, vous vérifiez si son complément existe déjà dans la table. Si oui, vous avez trouvé la paire. Sinon, vous stockez le nombre actuel et continuez.

```javascript
function twoSum(nums, target) {
  const seen = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen[complement] !== undefined) return [seen[complement], i];
    seen[nums[i]] = i;
  }
}
```

Un seul passage. Terminé. Comptage de fréquence, détection de doublons, regroupement par propriété : la même structure s'applique à tous.

En JavaScript, `Map` et `Set` sont les implémentations natives. `Map` préserve l'ordre d'insertion et accepte n'importe quel type comme clé, pas seulement les chaînes. `Set` stocke des valeurs uniques avec des vérifications d'existence en O(1) via `has()`. Un objet simple couvre la plupart des cas mais présente des cas limites concernant les types de clés et les propriétés du prototype. Savoir lequel convient fait partie de l'écriture de code intentionnel, pas seulement de code qui fonctionne.

- - -

## Quand ne pas l'utiliser

Les tables de hachage échangent de la mémoire contre de la vitesse. Dans la plupart des problèmes d'entretien, cet échange est acceptable. Dans les systèmes de production avec des budgets mémoire serrés, c'est un coût réel.

Elles sont également insuffisantes quand le problème nécessite un tri. Si vous avez besoin d'un parcours ordonné, un arbre binaire de recherche convient mieux. Si vous avez besoin du minimum ou du maximum dans un ensemble de données changeant, utilisez un tas. Les tables de hachage sont rapides pour les recherches ponctuelles. Les requêtes par intervalle et le tri ne sont pas leur raison d'être.

Le schéma à repérer en entretien est une boucle avec une recherche interne. Quand vous voyez cela, il y a de bonnes chances qu'un seul passage avec une table de hachage vous amène à une meilleure classe de complexité.
