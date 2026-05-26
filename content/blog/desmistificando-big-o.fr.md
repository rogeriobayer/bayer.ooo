---
title: "Ce qu'il faut savoir par cœur sur le Big O"
slug: desmistificando-big-o
date: 2026-05-26T10:00:00.000Z
lang: fr
excerpt: "Un guide pratique et direct pour comprendre la notation Big O, analyser l'efficacité des algorithmes et développer l'intuition du code qui passe à l'échelle sans complications mathématiques."
tags:
  - algorithms
  - big-o
  - computer-science
  - javascript
  - performance
cover: /blog/desmistificando-big-o.png
author: Rogério Bayer
---

Si vous êtes dans le monde du développement logiciel, vous avez certainement déjà croisé l'expression **Big O**. Pour ceux qui commencent, ou même pour ceux qui codent depuis un certain temps, ce concept semble généralement être un monstre à sept têtes plein de formules mathématiques.

Mais la vérité est que le Big O n'est pas à propos de mathématiques complexes. C'est à propos d'**échelle et de contexte**.

- - -

## Qu'est-ce que la notation Big O, finalement ?

Le Big O est simplement le langage que nous utilisons pour parler de **la vitesse à laquelle une fonction ralentit à mesure que le volume de données augmente**.

Au lieu de mesurer la performance du code en secondes — ce qui serait injuste, puisque l'ordinateur de votre ami pourrait être un superordinateur et le vôtre pas —, le Big O mesure l'**efficacité algorithmique** en comptant le nombre d'étapes ou d'opérations que l'ordinateur doit effectuer.

La règle d'or est simple : moins votre code ralentit lorsque le volume de données augmente, plus il est évolutif.

- - -

## Les Trois Types les Plus Courants au Quotidien

Pour comprendre le concept, vous n'avez besoin de maîtriser que trois scénarios qui couvrent la grande majorité du code que nous écrivons quotidiennement :

### 1. O(1) – Temps Constant (Excellent)

Peu importe si votre base de données contient 1 élément ou 1 million : le nombre d'opérations est toujours le même. C'est une ligne parfaitement droite sur le graphique.

* **Exemple pratique :** Récupérer le premier élément d'un tableau ou lire une propriété d'un objet. L'ordinateur va directement à l'adresse mémoire et résout le problème en 1 étape.

```javascript
function getFirstItem(liste) {
  return liste[0] // Prend toujours 1 étape, peu importe la taille de la liste
}
```

### 2. O(n) – Temps Linéaire (Juste)

Le nombre d'opérations croît dans la même proportion que le nombre d'entrées. Si le tableau augmente, le temps augmente avec lui de manière prévisible.

* **Exemple pratique :** Une boucle simple (comme un `for` ou `forEach`) cherchant un élément spécifique dans une liste non ordonnée.

```javascript
function findItem(liste, cible) {
  liste.forEach(item => {
    if (item === cible) console.log("Trouvé")
  })
}
```

### 3. O(n²) – Temps Quadratique (Évitez si possible)

C'est ici que les choses se compliquent. Le nombre d'opérations croît de manière exponentielle par rapport à la taille des données. Si votre tableau double de taille, votre code devient quatre fois plus lent.

* **Exemple pratique :** Deux boucles imbriquées (l'une dans l'autre), où chaque élément doit être comparé avec tous les autres de la même liste.

```javascript
function findDuplicates(liste) {
  for (let i = 0; i < liste.length; i++) {
    for (let j = 0; j < liste.length; j++) {
      if (i !== j && liste[i] === liste[j]) return true
    }
  }
}
```

- - -

## Le Guide de Survie du Big O (Les 4 Règles de Base)

Pour analyser n'importe quelle fonction sans vous prendre la tête, retenez ces règles pratiques extraites du livre de règles des meilleurs bootcamps :

* **Règle 1 : Regardez toujours le pire scénario :** Si vous recherchez une chaîne de caractères dans une liste, le Big O suppose qu'elle est en dernière position ou qu'elle n'y est pas du tout.
* **Règle 2 : Supprimez les constantes :** Un code qui effectue `O(2n)` étapes est simplifié à `O(n)`. Les petits détails n'ont pas d'importance lorsque nous parlons d'échelle massive.
* **Règle 3 : Des entrées différentes demandent des variables différentes :** Si votre fonction reçoit deux tableaux séparés et fait une boucle sur chacun, le Big O est `O(a + b)`. Si les boucles sont imbriquées, cela devient `O(a * b)`.
* **Règle 4 : Concentrez-vous sur le terme dominant :** Si une fonction a une boucle simple `O(n)` puis une boucle double `O(n²)`, le Big O total de cette fonction est simplement **O(n²)**. Nous éliminons les termes non dominants car, à l'échelle de millions de données, la boucle simple devient insignifiante à côté du dommage causé par la boucle double.

- - -

## Compléter la Carte : Les Autres Types de Big O

Pour que votre carte mentale soit 100% complète, il existe trois autres types qui apparaissent fréquemment dans les algorithmes plus complexes et les structures de données :

### O(log n) – Temps Logarithmique (Très Bon)

C'est le fameux modèle "diviser pour régner". À chaque étape que votre algorithme effectue, la taille du problème est réduite de moitié. C'est une courbe qui croît très lentement, ce qui la rend extrêmement efficace pour de grands volumes de données.

* **Exemple pratique :** **Recherche Binaire**. Dans un annuaire déjà trié, vous ouvrez exactement au milieu. Si le nom que vous cherchez est avant, vous écartez la moitié droite entière et répétez le processus avec ce qui reste.

### O(n log n) – Temps Linéarithmique (Bon)

C'est le temps consommé par les algorithmes de tri les plus efficaces du marché. Cela se produit lorsque vous devez diviser un problème en parties logarithmiques `O(log n)` et, pour chacune de ces divisions, vous devez traiter les données de manière linéaire `O(n)`.

* **Exemple pratique :** Des algorithmes de tri modernes comme **Merge Sort** et **Heapsort**.

### O(2^n) – Temps Exponentiel (Terrible)

L'opposé du logarithmique. Ici, à chaque nouvel élément ajouté à votre entrée, le nombre d'opérations de l'ordinateur **double**. Le graphique monte comme une fusée verticale. Des algorithmes comme celui-ci font planter le navigateur ou le serveur avec des entrées étonnamment petites (comme 40 ou 50 éléments).

* **Exemple pratique :** Des algorithmes de récursion simples pour calculer la séquence de Fibonacci sans optimisation (memoization).

- - -

## L'Astuce en Or de la Big O Cheat Sheet

Si vous voulez une antisèche rapide pour référence ou à coller à côté de votre écran pendant que vous étudiez pour des entretiens techniques, les gens de [**bigocheatsheet.com**](https://bigocheatsheet.com) résument la performance des algorithmes dans un classement universel de couleurs :

* 🟢 **Excellent :** `O(1)` et `O(log n)`
* 🟡 **Bon / Juste :** `O(n)`
* 🟠 **Mauvais :** `O(n log n)`
* 🔴 **Horrible :** `O(n²)`, `O(2^n)` et `O(n!)`

### Qu'est-ce qui cause la complexité dans votre code ?

Pour en finir avec ce sujet, souvenez-vous que la complexité peut être de **Temps** (CPU travaillant) ou d'**Espace** (Mémoire RAM allouée).

* **Ce qui consomme du Temps :** Opérations mathématiques de base, comparaisons (`===`), boucles (`for`, `while`) et appels de fonctions externes.
* **Ce qui consomme de l'Espace :** Création de nouvelles variables, structures de données supplémentaires (comme des tableaux ou objets auxiliaires) et l'empilement des appels de fonctions (Call Stack) dans les récursions.

Comprendre le Big O ne sert pas à calculer des portées parfaites sur papier au quotidien, mais plutôt à développer l'**intuition du code**. Lors de la conception d'une architecture ou de la création d'une méthode côté frontend, vous commencez à jeter un œil à la structure et à comprendre immédiatement si cette logique tiendra le coup lorsque le volume de données réelles commencera à croître.
