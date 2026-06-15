---
title: "Entraîner un modèle d'IA pour la concentration : comment j'ai atteint 90 % de précision avec 156 exemples"
slug: focus-patrol-model
date: 2026-06-15T10:00:00.000Z
lang: fr
excerpt: "Comment j'ai entraîné un Qwen2.5-0.5B à classer les onglets du navigateur avec 90 % de précision en utilisant seulement 156 exemples, LoRA et la quantification Int4 — le tout fonctionnant 100 % sur l'appareil."
tags:
  - ai
  - machine-learning
  - llm
  - fine-tuning
  - chrome-extension
  - on-device
  - privacy
cover: /blog/focus-patrol-model.png
author: Rogério Bayer
---

## Le contexte : qu'est-ce que Focus Patrol

[Focus Patrol](https://focuspatrol.bayer.ooo/) est une extension pour Chrome (et tout navigateur basé sur Chromium) avec une proposition simple : surveiller vos onglets ouverts et vous aider à rester concentré, sans jamais envoyer de données hors de votre navigateur.

L'extension classe chaque onglet en trois catégories, **concentration**, **neutre** ou **distraction**, et vous donne un portrait en temps réel de la façon dont vous utilisez votre temps. Elle dispose d'un mode silencieux (notifications discrètes via badge), de statistiques détaillées sur les séquences de concentration, de limites de distraction configurables et d'un système de repli à trois niveaux pour l'IA : elle essaie d'abord d'utiliser Gemini Nano natif de Chrome, puis tombe sur Llama 3.2 via WebLLM, et si rien de tout cela n'est disponible, utilise un filtre local simple.

Le point central est la confidentialité : **toute l'analyse se fait sur l'appareil**. L'extension ne demande même pas de permissions réseau — il est littéralement impossible d'envoyer vos données de navigation vers un serveur, car cette capacité n'existe pas dans le code.

C'est dans ce contexte que s'inscrit le travail de cet article. Aujourd'hui, lorsque Gemini Nano n'est pas disponible, l'extension se rabat sur Llama 3.2 via WebLLM, qui fonctionne bien mais consomme beaucoup de GPU et de mémoire du navigateur, en plus d'exiger un téléchargement volumineux. L'idée est de remplacer cette couche par un modèle personnalisé, spécifiquement entraîné pour cette tâche de classification, beaucoup plus léger et fonctionnant sans problème sur l'appareil sans alourdir la machine de l'utilisateur. Le résultat de ce travail remplacera Llama 3.2 dans la nouvelle architecture IA de l'extension.

## Le choix du modèle de base

J'ai opté pour **Qwen2.5-0.5B-Instruct**, un modèle de seulement 500 millions de paramètres. La logique est simple : un modèle trop petit ne comprend pas le contexte, un modèle trop grand ne tient pas dans un téléchargement d'extension ni ne tourne assez vite dans le navigateur. Le Qwen2.5-0.5B se situe au milieu — assez léger pour un téléchargement rapide, avec une capacité suffisante pour apprendre la tâche de classification.

Le défi était d'entraîner ce modèle avec un tout petit ensemble de données, seulement 176 exemples étiquetés, et de trouver le bon équilibre entre biais de classe, capacité du modèle et généralisation. Cet article documente chaque expérience que j'ai menée pour y parvenir : ce qui a fonctionné, ce qui n'a pas fonctionné, et pourquoi.

## L'ensemble de données

J'ai commencé avec **176 exemples** de navigation réelle, couvrant 60 domaines uniques entre productivité, communication, divertissement, achats et actualités. Je les ai divisés en trois parties : 136 pour l'entraînement, 20 pour la validation (utilisés pendant l'entraînement pour vérifier si le modèle généralise) et 20 pour le test (utilisés seulement à la fin pour mesurer le résultat réel).

En regardant la distribution, le problème était déjà évident : dans l'entraînement, **concentration** avait 50 exemples (37 %), **neutre** en avait 62 (46 %) et **distraction** seulement 24 (18 %). Ce déséquilibre — la distraction étant la classe minoritaire — a été la racine de presque tous les problèmes apparus dans les expériences suivantes.

## Méthodologie : qu'est-ce que LoRA et pourquoi je l'ai utilisé

J'ai utilisé **PEFT LoRA** (Low-Rank Adaptation), une technique de fine-tuning efficace. Au lieu de ré-entraîner les 500 millions de paramètres du modèle (ce qui exigerait beaucoup plus de données, de temps et de mémoire), LoRA gèle tout le modèle de base et ajoute de petites matrices "supplémentaires" à chaque couche, n'entraînant que ces matrices. Dans mon cas, cela a réduit les paramètres entraînables de 500M à environ **8,8 millions**, soit seulement 1,75 % du modèle total.

J'ai tout entraîné sur Apple Silicon MPS, sur mon MacBook Pro, sans avoir besoin de GPU dédié. La configuration principale était : LoRA rank 16, alpha 32, dropout de 0,1, learning rate de 1×10⁻⁴ avec cosine schedule (le taux d'apprentissage commence plus haut et diminue progressivement au cours de l'entraînement), batch size effectif de 8, séquences jusqu'à 1024 tokens, le tout en précision float32.

## Le parcours : 9 expériences, une par une

Chaque version a testé une hypothèse différente. Je vais expliquer ce que chacune a fait, pourquoi j'ai fait ce changement, et ce qui s'est passé.

### V1, Baseline, sans aucun fine-tuning

Avant d'entraîner quoi que ce soit, je devais savoir : à quel point le modèle est-il bon "prêt à l'emploi" ? J'ai testé Qwen2.5 **1.5B** (la version 3x plus grande du modèle) avec seulement un prompt few-shot — 12 exemples de classification directement dans le prompt, sans aucun entraînement.

Résultat : **65 % de précision**. Un point de départ raisonnable, mais en utilisant un modèle 3x plus lourd que celui que je voulais réellement utiliser.

### V2, Premier fine-tuning, données originales

Ici, j'ai entraîné Qwen2.5-0.5B (le modèle plus petit que je voulais vraiment utiliser) avec les 136 exemples d'entraînement originaux, LoRA r=16, pendant 3 époques.

Résultat : également **65 %**, mais le schéma d'erreur racontait la vraie histoire. Le modèle a appris à "jouer la sécurité" : comme neutre représente 46 % de l'ensemble de données, tout ce qui est douteux est classé comme neutre. Il a obtenu 100 % des exemples neutres, mais a **complètement ignoré** la classe distraction — il n'a jamais rien classé comme distraction, même quand il aurait dû.

### V3, Tentative de correction du déséquilibre par suréchantillonnage forcé

Diagnostic de V2 : le déséquilibre des classes faussait l'apprentissage. Solution essayée : forcer 62 exemples par classe via suréchantillonnage (répétition d'exemples de la classe minoritaire), totalisant 186 exemples équilibrés.

Résultat : **60 %**, pire qu'avant. Le modèle a commencé à classer presque tout comme distraction — maintenant il "joue la sécurité" dans la direction opposée. La concentration est montée à 80 %, mais le neutre a chuté à 25 %, et la distraction a atteint 100 % (simplement parce qu'il ne classifie pratiquement jamais comme autre chose). La correction était pire que le problème original.

### V4, Le tournant : suréchantillonnage doux + prompt amélioré ⭐

Leçon de V3 : l'équilibrage total est excessif. Au lieu de cela, j'ai appliqué un **suréchantillonnage doux de seulement 2x sur la classe distraction** (atteignant 160 exemples au total, sans toucher aux autres classes), et tout aussi important, j'ai considérablement amélioré le prompt système, ajoutant des règles spécifiques par plateforme. Par exemple : YouTube avec du contenu éducatif compte comme concentration, ChatGPT comme neutre, GitHub comme concentration, et ainsi de suite pour plusieurs plateformes courantes.

Résultat : bond à **85 %**. La concentration était parfaite (100 %), le neutre presque parfait (88 %). La distraction était encore à zéro — les deux exemples de test Twitch ont été mal classés — mais l'amélioration était énorme par rapport aux versions précédentes.

### V5, Est-ce que plus d'époques aide ?

J'ai essayé d'entraîner plus longtemps : 10 époques, avec early stopping configuré mais qui n'a finalement pas interrompu à temps.

Résultat : **80 %**, pire que V4. Ce qui s'est passé : l' eval loss (l'"erreur" mesurée sur l'ensemble de validation, qui indique si le modèle généralise ou simplement mémorise l'entraînement) commence à augmenter après l'époque 3. Continuer à entraîner au-delà fait mémoriser les données d'entraînement au lieu d'apprendre des schémas généraux. La distraction est montée à 100 %, mais le neutre a chuté à 62 % — un autre compromis, et globalement, pire. Conclusion : plus d'époques ne signifie pas un meilleur modèle.

### V6, La mauvaise hypothèse : plus de paramètres entraînables

J'ai pensé : et si je donnais plus de "capacité" à LoRA ? J'ai doublé le rank de 16 à 32, ce qui double presque les paramètres entraînables (de 8,8M à 17,6M).

Résultat : **55 %**, le pire de toutes les expériences. La concentration a chuté à 30 %. Avec un ensemble de données aussi petit (136-160 exemples), donner plus de paramètres entraînables au modèle ne fait qu'augmenter le surapprentissage — il a trop de capacité à mémoriser des détails spécifiques de l'entraînement et généralise moins bien aux nouveaux cas.

### V7, Le champion : le changement le plus simple de tous ✨

Après six expériences à ajuster les hyperparamètres, l'équilibrage et l'architecture, j'ai fait le changement le plus évident que j'avais gardé pour la fin : j'ai pris les **20 exemples de l'ensemble de validation et je les ai fusionnés dans l'ensemble d'entraînement**. Au lieu de 136, l'entraînement comptait maintenant **156 exemples**.

Résultat : **90 % de précision sur l'ensemble de test** — le meilleur de tout le projet, et par une marge confortable. Le neutre et la distraction étaient parfaits (100 % chacun). La concentration est arrivée à 80 %, les deux erreurs restantes étant des cas limites difficiles à classer même pour un humain.

La leçon est directe : après six tentatives d'"ingénierie" — équilibrage, époques, rang LoRA — ce qui a le plus fait bouger l'aiguille a été simplement d'avoir un peu plus de données d'entraînement.

## Le dilemme de l'équilibrage des classes

En regardant toutes les expériences ensemble, le schéma central du projet est un compromis constant : améliorer la classe distraction coûte presque toujours quelque chose au neutre, et vice versa. La distribution naturelle de l'ensemble de données (46 % neutre) biaise le modèle vers "neutre". L'équilibrage total forcé (33 % chaque classe, comme dans V3) biaise vers "distraction". Le point idéal était un juste milieu : un suréchantillonnage modeste de 2x seulement sur la classe minoritaire, sans rééquilibrer les autres (V4 et V7).

Et dans toutes les expériences qui ont fonctionné, le schéma de l' eval loss se répète : il cesse de diminuer entre les époques 2 et 3. Après cela, la loss d'entraînement continue de descendre (le modèle continue "d'apprendre" l'entraînement par cœur), mais l' eval loss se stabilise ou augmente (il cesse de mieux généraliser). Le meilleur checkpoint se trouve toujours autour de l'époque 3, même quand j'ai configuré l'entraînement pour 5 ou 10 époques.

## Optimisation pour la production : de 988 Mo à 305 Mo

Le modèle champion (V7), sauvegardé en fp16, occupe 988 Mo. Trop lourd pour le téléchargement d'une extension de navigateur. J'ai appliqué la quantification **ONNX Int4**, une technique qui réduit la précision numérique des poids du modèle, de sorte que chaque poids prend moins de place, tout en continuant à fonctionner de manière très similaire.

| Format | Taille | Réduction | Précision | Recommandation |
|---|---|---|---|---|
| PyTorch fp32 | ~1.8 Go | référence | 90 % | Non |
| PyTorch fp16 | 988 Mo | -45 % | 90 % | Oui |
| ONNX Int8 | 474 Mo | -52 % | ~90 % | Oui |
| **ONNX Int4** | **305 Mo** | **-69 %** | **~90 %** | **Meilleure option** |
| SmolLM2-135M fp16 | 270 Mo | -73 % | 70 % | Trop faible |

La quantification Int4 a réduit le modèle de 69 % (de 988 Mo à 305 Mo) avec une perte de précision négligeable. C'est la taille viable pour la distribution dans une extension Chrome.

## L'expérience supplémentaire : tester un modèle encore plus petit

Pour comprendre la limite inférieure de taille, j'ai testé **SmolLM2-135M-Instruct** de HuggingFace, 3,7x plus petit que Qwen2.5-0.5B. J'ai augmenté l'ensemble de données artificiellement (avec des paraphrases et du domain swapping — échange de domaines entre exemples pour créer des variations) et entraîné pendant 10 époques avec LoRA r=16.

Le résultat a clairement montré la limitation : l' eval loss s'est stabilisée autour de 0,37, bien au-dessus des ~0,21 de Qwen2.5-0.5B. La précision n'était que de 70 %, avec la classe distraction encore une fois à zéro. Même avec plus de données et plus d'époques, 135M paramètres n'étaient pas une capacité suffisante pour cette tâche. Le Qwen2.5-0.5B en Int4, 305 Mo, 90 % de précision, reste le point idéal entre taille et performance.

## Leçons apprises

**La qualité et la quantité des données pèsent plus que les paramètres.** Ajouter 20 exemples choisis à l'entraînement (V7) a rapporté +25 points de pourcentage de précision. Doubler le rang LoRA (V6) a perdu 10 points. La différence est saisissante.

**L'équilibrage des classes est une corde raide.** Ni laisser la distribution naturelle telle quelle, ni forcer un équilibrage total — le bon équilibre était un suréchantillonnage modeste, uniquement sur la classe sous-représentée.

**Early stopping autour de l'époque 3-4.** Dans toutes les expériences, l' eval loss a cessé de s'améliorer après l'époque 3. Entraîner au-delà ne fait qu'empirer la généralisation, même si la loss d'entraînement continue de baisser.

**Le prompt engineering est un multiplicateur de force.** Un prompt avec des règles spécifiques par plateforme (V4) a ajouté environ 15 points de pourcentage de précision avant même tout fine-tuning.

**La quantification Int4 est essentielle pour la production.** Réduire de 988 Mo à 305 Mo avec une perte de précision négligeable est ce qui rend ce modèle viable pour fonctionner dans une extension de navigateur.

---

## La suite

Ce modèle, `rogeriobayer/focus-patrol-qwen2.5-0.5b-v7-int4`, 305 Mo, ONNX Int4, 90 % de précision, remplacera Llama 3.2 dans la nouvelle architecture IA de l'extension [Focus Patrol](https://focuspatrol.bayer.ooo/). Il fonctionne entièrement via Transformers.js, directement dans le navigateur, 100 % sur l'appareil, sans rien envoyer hors de votre ordinateur, et en utilisant beaucoup moins de GPU et de mémoire que Llama 3.2.

Le modèle est disponible sur HuggingFace à [huggingface.co/rogeriobayer/focus-patrol-qwen2.5-0.5b-v7](https://huggingface.co/rogeriobayer/focus-patrol-qwen2.5-0.5b-v7/tree/main).

