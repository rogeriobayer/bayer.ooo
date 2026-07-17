---
title: "Wiki LLM : comment créer une mémoire permanente pour l'IA dans votre projet"
slug: wiki-llm
date: 2026-07-17T10:00:00.000Z
lang: fr
excerpt: "Des outils comme Claude Code, Cursor et Codex peuvent analyser du code, créer des fonctionnalités et expliquer des architectures complexes. Mais le contexte construit durant une conversation disparaît à la fin de la session. Une Wiki LLM résout ce problème en créant une base de connaissance permanente pour l'IA."
tags:
  - llm
  - ai
  - architecture
  - documentation
  - best-practices
cover: /blog/wiki-llm.png
author: Rogério Bayer
---

## Le problème que Wiki LLM résout

Des outils comme Claude Code, Cursor et Codex peuvent analyser du code, créer des fonctionnalités et expliquer des architectures complexes. Mais il y a une limitation qui apparaît rapidement : le contexte construit durant une conversation disparaît lorsque la session se termine. La fois suivante, vous devez tout réexpliquer. Les décisions du projet, les patrons adoptés, les contraintes techniques, la raison pour laquelle cette intégration fonctionne de cette manière spécifique.

À mesure que le système grandit, ce processus devient lent et sujet aux erreurs. L'IA propose des approches que l'équipe a déjà écartées. Elle suggère des bibliothèques qui ne font pas partie de la stack. Elle ignore que cet endpoint a une limitation de concurrence qui a causé un incident en production.

Une Wiki LLM tente de résoudre ce problème en créant une base de connaissance permanente, structurée et maintenue avec l'aide de l'intelligence artificielle elle-même.

## Ce que c'est et comment s'organiser

Au lieu de dépendre de l'historique des conversations, l'agent consulte un wiki local contenant des informations sur l'architecture, les règles métier, les décisions techniques, les intégrations, les incidents et les apprentissages accumulés durant le développement. Ce sont des fichiers Markdown stockés à l'intérieur ou à proximité du dépôt.

Une structure possible serait :

```
project-wiki/
├── raw/                    # sources originales : documents, réunions, specs
├── wiki/                   # connaissances synthétisées par l'IA
│   ├── architecture/
│   ├── features/
│   ├── business-rules/
│   ├── decisions/
│   └── troubleshooting/
├── index.md
├── log.md
└── AGENTS.md
```

Le dossier **raw** conserve les sources originales sans modification. Le dossier **wiki** contient les connaissances organisées par l'agent en pages plus petites et connectées. Le fichier **AGENTS.md** définit comment l'IA doit travailler avec cette base : quand créer des pages, comment enregistrer les sources et quels fichiers ne peuvent pas être modifiés.

La différence avec une documentation classique est que le wiki est écrit en pensant à celui qui va le consulter, qu'il soit développeur ou agent IA. Une décision architecturale n'est pas seulement enregistrée : elle est accessible, référencée et connectée à d'autres pages pertinentes.

## Ce qui change concrètement

Imaginez que l'équipe a décidé d'utiliser React Query pour contrôler l'état distant de l'application. Avec un wiki, cela devient une page dans `wiki/architecture/server-state.md` expliquant la décision, les règles d'utilisation et les raisons pour lesquelles d'autres approches ont été écartées. La prochaine fois qu'un agent implémente une fonctionnalité qui récupère des données d'API, il consulte cette page avant de proposer de stocker la réponse dans Redux.

Il en va de même pour les incidents. Si une intégration de paiement a cassé parce que cette API n'accepte pas les requêtes simultanées, l'incident peut devenir une page dans `wiki/troubleshooting/concurrent-payment-requests.md` avec les symptômes, la cause, la solution et comment éviter que cela ne se reproduise. Lorsqu'un agent travaillera sur cette intégration à l'avenir, l'historique sera disponible.

Cela change le type de travail que l'IA effectue. Au lieu de traiter chaque tâche comme une conversation isolée, l'agent commence à travailler avec une mémoire partagée du projet. Il ne génère pas seulement du code techniquement fonctionnel. Il génère quelque chose de plus proche du standard réel du produit.

## Où cela fait le plus de différence

Le wiki tend à être plus utile dans certains contextes spécifiques.

**Dans les projets legacy**, où les règles importantes n'existent que dans la mémoire des développeurs les plus anciens, un agent peut analyser le code et créer des pages qui documentent le comportement existant de manière incrémentale. Chaque tâche effectuée dans le système améliore également la documentation disponible pour les tâches futures.

**Dans les systèmes avec des règles métier complexes**, produits financiers, plateformes de recrutement, ERP, outils de santé, les règles sont dispersées entre le code, les tickets, les feuilles de calcul et les conversations. Un wiki permet de consolider cela dans des pages spécifiques par domaine. Avant d'implémenter une modification du flux d'annulation d'abonnement, l'agent peut vérifier les règles enregistrées.

**Dans les projets avec plusieurs agents**, le wiki sert de point de contexte central. Lorsque différents agents travaillent sur l'écriture de code, la création de tests et la révision de sécurité, ils consultent tous les mêmes décisions et limitations avant d'exécuter les tâches.

**Dans l'onboarding**, que ce soit pour des personnes ou de nouveaux agents analysant le dépôt pour la première fois, le wiki offre un parcours de lecture structuré au lieu de dépendre de la personne disponible pour expliquer.

## Comment le maintenir à jour

Créer le wiki est la première étape. Le vrai défi est d'éviter qu'il ne vieillisse.

Le flux peut être divisé en trois opérations. L'**ingestion** se produit lorsqu'une nouvelle source est ajoutée : une spécification, un rapport d'incident, une décision d'architecture. L'agent analyse le matériel, crée les pages nécessaires et met à jour les existantes. La **consultation** se produit lorsque quelqu'un a besoin d'une réponse en utilisant le wiki, et les bonnes réponses peuvent devenir de nouvelles pages lorsqu'elles représentent des analyses utiles pour l'avenir.

La troisième opération est une **révision périodique** du wiki lui-même : liens brisés, pages sans sources, informations contradictoires, contenu obsolète, décisions remplacées par des versions plus récentes. Cela peut être exécuté durant les pull requests ou à des intervalles définis par l'équipe.

Le fichier **AGENTS.md** définit ces règles de manière explicite :

```markdown
Avant d'implémenter une fonctionnalité :
1. Consultez index.md et recherchez les pages liées à la fonctionnalité.
2. Lisez les décisions architecturales pertinentes.
3. Vérifiez les incidents et régressions connus.

Après avoir terminé une tâche :
1. Mettez à jour les pages affectées par le changement.
2. Enregistrez les nouvelles règles métier ou décisions importantes.
3. Ajoutez les problèmes rencontrés au troubleshooting.

Ne modifiez jamais les fichiers dans raw/.
Toute affirmation importante doit pointer vers une source traçable.
```

## Ce qu'il ne remplace pas

Le wiki fonctionne comme une couche d'organisation au-dessus des sources originales, pas comme un remplacement. La documentation officielle, les contrats d'API, le code et les tickets continuent d'exister. Le wiki connecte et synthétise ces informations.

Le contenu généré par l'IA ne doit pas non plus être traité comme une vérité sans révision. Les décisions critiques, les règles financières, les exigences légales et les configurations de sécurité doivent passer par l'équipe avant de devenir des références permanentes. Le rôle du wiki est d'élargir l'accès à la connaissance, pas d'éliminer la responsabilité de ceux qui comprennent le système.

## Quand ça ne vaut pas le coup

Les petits projets, les expériences rapides ou les applications avec peu de règles n'ont probablement pas besoin de cette structure. Maintenir un wiki a un coût réel : il faut réviser les pages, mettre à jour les informations et corriger les incohérences. Pour un prototype jetable, un README.md bien écrit suffit.

Le wiki tend à justifier l'investissement lorsque le projet a une longue durée de vie, plusieurs développeurs, une architecture complexe, de nombreuses règles métier, des systèmes legacy ou une utilisation intensive d'agents IA. Dans ces cas, la différence entre un agent qui connaît l'historique du système et un qui repart de zéro à chaque session est significative.

## Par où commencer

Il n'est pas nécessaire de mettre en place une structure complète dès le départ. Une première version peut être simple :

```
wiki/
├── architecture.md
├── business-rules.md
├── coding-standards.md
├── known-issues.md
└── decisions.md

index.md
AGENTS.md
```

Au fur et à mesure que le volume d'informations augmente, les pages se divisent en catégories. Le plus important est le flux : l'agent consulte avant de travailler, enregistre ce qu'il apprend, et l'équipe valide ce qui entre comme référence permanente.

La valeur ne réside pas dans la taille du wiki, mais dans la régularité avec laquelle il est utilisé.
