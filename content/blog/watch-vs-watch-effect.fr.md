---
title: "Vue 3 : watch vs watchEffect — Lequel utiliser dans la Composition API ?"
slug: "watch-vs-watch-effect"
date: "2026-05-07T10:00:00.000Z"
lang: "fr"
excerpt: "Découvrez les différences pratiques entre watch et watchEffect dans la Composition API de Vue 3, et apprenez exactement quand utiliser chacun pour éviter les bugs et améliorer les performances."
tags: ["vue", "javascript", "composition-api"]
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
author: "Rogério Bayer"
---

Si vous avez commencé à explorer la **Composition API** de Vue 3, vous avez sûrement croisé le chemin de ces deux fonctions. À première vue, `watch` et `watchEffect` semblent faire la même chose : elles observent un changement et y réagissent.

Mais en pratique, elles ont des personnalités bien différentes. Choisir la mauvaise ne cassera pas votre code, mais elle peut vous donner des maux de tête au niveau des performances ou des comportements inattendus.

---

## watchEffect : L'observateur intelligent (et un peu pressé)

`watchEffect` est fait pour ceux qui aiment la praticité. Vous lui passez une fonction, et Vue "trace" automatiquement tout ce qui est réactif à l'intérieur. Si vous utilisez une variable dans le bloc, Vue comprend qu'il doit réexécuter le code lorsque cette variable change.

### Pourquoi l'utiliser ?
Il est excellent lorsque vous avez plusieurs dépendances ou que vous voulez que quelque chose se passe **immédiatement** dès que le composant est monté.

```javascript
// Il s'exécute immédiatement !
watchEffect(() => {
  console.log(`Récupération des données pour l'ID : ${userId.value}`)
  // Vue détecte automatiquement la dépendance à userId
})
```

*   **Point positif :** Moins de code. Vous n'avez pas besoin de lister les dépendances manuellement.
*   **Point d'attention :** Il est "avide". Toute variable réactive que vous touchez à l'intérieur devient une dépendance, ce qui peut provoquer des réexécutions inutiles si vous ne faites pas attention.

---

## watch : L'observateur méticuleux

`watch` est plus conservateur et précis. Vous devez lui dire exactement ce qu'il doit surveiller. Contrairement à son "frère" pressé, `watch` est **paresseux (lazy)** : il ne s'exécute pas à la création du composant, mais uniquement lorsque la source surveillée change réellement.

### Le grand avantage : L'avant et l'après
`watch` vous donne accès à l'ancienne valeur (`oldValue`), ce que `watchEffect` ne fait pas. C'est crucial pour les logiques de comparaison.

```javascript
watch(count, (newValue, oldValue) => {
  if (newValue > oldValue) {
    console.log("Le nombre a augmenté !")
  }
})
```

*   **Point positif :** Contrôle total. Vous décidez exactement ce qui déclenche l'effet.
*   **Point d'attention :** Si vous avez besoin qu'il s'exécute dès le départ, vous devrez passer un objet de configuration : `{ immediate: true }`.

---

## Lequel choisir ? Le guide rapide

Pour ne plus vous tromper, pensez ainsi :

| Situation | Utilisez... |
| :--- | :--- |
| J'ai besoin de comparer la nouvelle valeur avec l'ancienne. | **watch** |
| Je veux que le code s'exécute dès le chargement de l'application. | **watchEffect** |
| J'ai 3 ou 4 variables qui influencent le même effet. | **watchEffect** |
| Je veux éviter que l'effet s'exécute inutilement. | **watch** |
| Je vais faire un `fetch` simple basé sur un ID. | **watchEffect** |

---

## Un détail que personne ne vous dit

Les deux acceptent une fonction magique appelée `onCleanup`. Elle sert à "nettoyer le bazar" avant que l'effet ne se réexécute. Imaginez que vous avez lancé un `setTimeout` ou une requête API ; si la variable change avant la fin, vous utilisez le cleanup pour annuler l'opération précédente et ne pas surcharger le navigateur.

En fin de compte, **watch** est votre outil de précision (chirurgical), tandis que **watchEffect** est votre outil de commodité (automatique).

Dans le doute ? Commencez par `watch`. Avoir un contrôle explicite sur ce qui fait tourner votre code évite généralement des bugs difficiles à tracer dans le futur.

Lequel utilisez-vous le plus dans vos projets récents ?
