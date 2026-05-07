---
title: "Architecture de Monorepo dans Radios Lite : Core, Overrides et Domaines"
slug: "radios-lite-monorepo-arquitetura"
date: "2026-05-05T10:00:00.000Z"
lang: "fr"
excerpt: "Comment le projet Radios Lite adopte une architecture de monorepo basée sur les domaines, avec un noyau partagé et des overrides par pays, garantissant scalabilité et maintenance centralisée."
tags: ["architecture", "monorepo", "extensions", "domaines"]
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
author: "Rogério Bayer"
---

Tout projet qui se ramifie en multiples variantes — dans le cas de Radios Lite, des extensions navigateur pour différents pays — finit par affronter le dilemme de la divergence. Les corrections de bugs se multiplient, les releases deviennent imprévisibles et le coût cognitif de maintenir N bases de code croît de manière exponentielle. La solution adoptée dans le monorepo de Radios Lite n'est pas une nouvelle invention, mais l'application disciplinée de patterns architecturaux consolidés.

## Le Modèle de Domaine

La décision fondamentale a été de diviser l'univers du projet en deux domaines clairement définis : le **domaine générique** (le noyau partagé) et les **domaines spécifiques** (les variantes par pays). Ce mapping suit de près les principes du Domain-Driven Design, où chaque pays est traité comme un sous-domaine avec ses propres règles, mais qui hérite des invariants du domaine racine.

Le noyau, appelé `radios-core`, encapsule tout ce qui est invariant : le cycle de vie de l'extension, la gestion audio offscreen, les interfaces popup et settings, et les utilitaires de runtime. Il est délibérément neutre — il ignore l'existence du Canada, du Mexique ou du Brésil. Cette neutralité est intentionnelle. Moins le noyau suppose de choses sur ses consommateurs, plus il devient stable.

## La Stratégie d'Overrides

Les variantes par pays ne réécrivent pas le noyau. Elles le complètent via un pattern qui combine **Template Method** avec **Strategy**. Le noyau définit le squelette du comportement (le template), et chaque pays injecte, via des overrides, uniquement les parties variables : les manifestes, les assets visuels, les catalogues de radios et, le plus important, les configurations déclaratives de texte et de comportement.

Cette couche de configuration déclarative est ce qui permet au même code de popup, settings, background et offscreen de servir tous les pays sans modification. Chaque variante déclare, dans un unique fichier de configuration, ses chaînes localisées, ses langues supportées et ses particularités de comportement. Le noyau consomme cette configuration au runtime, s'adaptant au contexte sans savoir à l'avance qui le consomme.

## Le Pipeline comme Contrat

Le processus de build n'est pas seulement de l'empaquetage — il est le **gardien de l'architecture**. Le pipeline copie le noyau et applique les overrides par-dessus, en respectant une règle stricte : certains fichiers du noyau sont non-surgravables. Si une variante de pays tente d'introduire son propre `settings.js`, `popup.html`, `background.js` ou `offscreen.js`, le build échoue. Ce comportement est une forme d'**architecture restrictive** : le système empêche mécaniquement que l'organisation du code se dégrade avec le temps.

Cette vérification est effectuée par un health check du workspace qui valide la structure, la syntaxe et, surtout, le contrat entre le noyau et les variantes. Les contrats brisés sont détectés avant même d'atteindre un commit.

## Adaptation et Scalabilité

Lorsque survient le besoin d'ajouter un nouveau pays, le travail est essentiellement déclaratif : créer un dossier d'application, définir les différences dans le fichier de configuration, maintenir les overrides au minimum nécessaire et exécuter le release. Le noyau n'a pas besoin d'être touché. Cela réduit drastiquement le time-to-market pour de nouvelles régions et élimine la régression dans le code partagé.

Ce modèle est une application pratique du **Principe Ouvert/Fermé** : le noyau est fermé à la modification, mais ouvert à l'extension via configuration et overrides contrôlés. La scalabilité ne vient pas d'une complexité ajoutée, mais de contraintes bien choisies.

## Leçons Pratiques

L'architecture de Radios Lite démontre que les monorepos ne fonctionnent que lorsqu'il existe une séparation claire des responsabilités et des mécanismes qui empêchent les violations silencieuses. Laisser chaque équipe ou variante libre de modifier le noyau à sa guise est un chemin assuré vers la divergence. La discipline architecturale, appliquée via les outils de build et les health checks, garantit que la simplicité du modèle se préserve même à mesure que le nombre de variantes croît.

Au final, la décision la plus importante n'était pas technique — c'était celle de la modélisation de domaine. Choisir ce qui appartient au noyau et ce qui appartient au contexte délimité de chaque pays définit, à elle seule, la santé du projet sur le long terme.
