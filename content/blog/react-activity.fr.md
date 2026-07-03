---
title: "React <Activity> : quand cacher n'est pas la même chose que démonter"
slug: react-activity
date: 2026-07-02T10:00:00.000Z
lang: fr
excerpt: React 19.2 a introduit le composant <Activity>, qui permet de cacher et
  de restaurer l'interface et l'état interne des enfants sans les démonter.
  Apprenez quand l'utiliser, quand l'éviter et pourquoi cela change la façon de
  penser la visibilité dans React.
tags:
  - react
  - javascript
  - activity
cover: /blog/react-activity.png
author: Rogério Bayer
---

Pendant des années, cacher un composant dans React signifiait une chose : le retirer du DOM. Le rendu conditionnel avec `{condition && <Component />}` est le modèle que tout développeur React apprend dès le premier tutoriel. Il fonctionne. Le problème, c'est que "fonctionner" ici a un coût caché : quand vous retirez le composant, vous détruisez son état en même temps.

Changement d'onglet dans un tableau de bord ? Le scroll revient en haut. Formulaire partiellement rempli ? Perdu. Vidéo en cours de lecture ? Elle s'arrête, se rebufferise et reprend du début quand l'utilisateur revient. Pendant des années, les contournements étaient moches : tout déplacer dans Zustand ou Redux, utiliser des portals avec `display: none`, installer des libs comme `react-activation`. Tout fonctionne, et tout donne l'impression de se battre contre le framework.

React 19.2, sorti en octobre 2025, a apporté une réponse native : le composant `<Activity>`, qui permet de cacher et de restaurer l'interface et l'état interne des enfants sans les démonter.

- - -

## L'utilisation est simple

```jsx
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <VideoPlayer />
</Activity>
```

Quand `mode="hidden"`, React rend le composant en arrière-plan avec la priorité la plus faible possible. Le composant reste entièrement rendu, mais avec `display: none`. Les Effects ne s'exécutent pas. Et quand le mode repasse à `"visible"`, le composant apparaît instantanément, sans re-render.

- - -

## Ça ressemble au `v-show` de Vue ?

Oui, et ce n'est pas un hasard. L'idée est de garder des sections de l'interface rendues mais inactives, plutôt que de les retirer complètement. Le `v-show` de Vue fait exactement cela depuis des années : il bascule `display: none` au lieu de démonter, préservant l'état local du composant. Quiconque vient de Vue connaît déjà ce comportement par cœur.

La différence, c'est que `<Activity>` va au-delà du CSS. Il opère dans le système de priorité des fibres de React, de sorte que les arbres cachés ne bloquent jamais le contenu visible. Quand il est `hidden`, les Effects sont démontés (avec cleanup), mais l'état React et le DOM sont préservés. Quand il redevient `visible`, les Effects s'exécutent à nouveau. C'est comme si le composant avait été mis en pause, pas détruit.

Un autre point que `v-show` ne couvre pas : `<Activity>` permet de pré-rendre des composants en arrière-plan avant que l'utilisateur en ait besoin. Les images, les styles et les autres ressources sont chargés à l'avance, et quand le composant devient visible, tout apparaît instantanément.

- - -

## Où cela a du sens

Le cas d'usage le plus évident est celui des onglets avec état. Un tableau de bord où l'utilisateur alterne entre des onglets et s'attend à retrouver tout là où il l'a laissé, sans recharger de données, sans perdre le scroll, sans réinitialiser les filtres. Un lecteur vidéo où la position de lecture doit être préservée. Un long formulaire temporairement caché pendant que l'utilisateur navigue vers une autre section et revient.

`<Activity>` participe aussi à l'hydratation sélective en SSR. Les parties moins critiques de la page peuvent s'hydrater avec une priorité plus faible, laissant le contenu principal interactif plus rapidement. C'est particulièrement utile sur les pages lourdes où tout n'a pas besoin d'être prêt en même temps.

- - -

## Où cela ne vaut pas le coup

Tous les cas d'affichage/masquage n'ont pas besoin de `<Activity>`. Si le composant n'a pas d'état pertinent à préserver, le rendu conditionnel classique est plus simple et moins coûteux. Garder un composant dans le DOM a un coût mémoire : React retient cet arbre, ce DOM, ces données. Faire cela avec vingt onglets simultanés ou de longues listes d'éléments cachés peut devenir un problème de mémoire avant de devenir une solution de performance.

Il faut aussi faire attention aux balises comme `<video>` et `<audio>` : comme le DOM n'est pas détruit quand le composant devient `hidden`, ces éléments continuent à jouer en arrière-plan si vous n'ajoutez pas de cleanup dans vos Effects. L'API ne le fait pas automatiquement.

Un autre scénario où `<Activity>` n'aide pas : les composants qui doivent récupérer des données fraîches à chaque fois qu'ils deviennent visibles. Si l'utilisateur revient à un onglet et que vous voulez garantir que les données sont à jour, préserver l'état peut être l'opposé de ce dont vous avez besoin. Là, le rendu conditionnel traditionnel, qui démonte et remonte, reste le bon choix.

- - -

## Le vrai point

`<Activity>` sépare la visibilité de la durée de vie du composant. Cette distinction semble minuscule, mais c'est celle qui manquait à React depuis des années. Quiconque a déjà perdu l'état d'un composant lors d'un basculement d'onglet, d'une fermeture de modal ou d'un repli de drawer sait exactement ce que cela résout.

Ce n'est pas la fonctionnalité la plus spectaculaire de React 19.2. Mais c'est l'une des plus pratiques. Et pour ceux qui connaissaient déjà `v-show` dans Vue, l'impression est celle d'un collègue qui arrive enfin à la même conclusion, juste un peu plus tard.
