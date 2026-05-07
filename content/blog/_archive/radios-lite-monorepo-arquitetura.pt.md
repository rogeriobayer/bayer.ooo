---
title: "Arquitetura de Monorepo no Radios Lite: Core, Overrides e Domínios"
slug: "radios-lite-monorepo-arquitetura"
date: "2026-05-05T10:00:00.000Z"
lang: "pt"
excerpt: "Como o projeto Radios Lite adota uma arquitetura de monorepo baseada em domínios, com um núcleo compartilhado e overrides por país, garantindo escalabilidade e manutenção centralizada."
tags: ["arquitetura", "monorepo", "extensões", "domínios"]
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
author: "Rogério Bayer"
---

Todo projeto que cresce em múltiplas vertentes — no caso do Radios Lite, em extensões para diferentes países — encontra, cedo ou tarde, o dilema da divergência. Correções de bugs se multiplicam, releases se tornam imprevisíveis e o custo cognitivo de manter N bases de código sobe exponencialmente. A solução adotada no monorepo do Radios Lite não é uma invenção nova, mas a aplicação disciplinada de padrões arquiteturais consolidados.

## O Modelo de Domínio

A decisão fundamental foi separar o universo do projeto em dois domínios bem definidos: o **domínio genérico** (o núcleo compartilhado) e os **domínios específicos** (as variantes por país). Esse mapeamento segue de perto os princípios do Domain-Driven Design, onde cada país é tratado como um subdomínio com regras próprias, mas que herda invariantes do domínio raiz.

O núcleo, chamado de `radios-core`, encapsula tudo que é invariante: o ciclo de vida da extensão, o gerenciamento de áudio offscreen, as interfaces de popup e settings, e as utilidades de runtime. Ele é propositalmente neutro — não sabe que existe um Canadá, um México ou um Brasil. Essa neutralidade é intencional. Quanto menos o núcleo assume sobre seus consumidores, mais estável ele se torna.

## A Estratégia de Overrides

As variantes por país não reescrevem o núcleo. Elas o complementam por meio de um padrão que combina **Template Method** com **Strategy**. O núcleo define o esqueleto do comportamento (o template), e cada país injeta, via overrides, apenas as partes variáveis: manifestos, assets visuais, catálogos de rádios e, o mais importante, configurações declarativas de texto e comportamento.

Essa camada de configuração declarativa é o que permite que o mesmo código de popup, settings, background e offscreen sirva a todos os países sem modificação. Cada variante declara, em um único arquivo de configuração, suas strings localizadas, idiomas suportados e particularidades de comportamento. O núcleo consome essa configuração em tempo de execução, adaptando-se ao contexto sem saber de antemão quem o está consumindo.

## O Pipeline como Contrato

O processo de build não é apenas empacotamento — ele é o **guardião da arquitetura**. O pipeline copia o núcleo e aplica os overrides por cima, respeitando uma regra rígida: certos arquivos do núcleo são insobregraváveis. Se uma variante de país tentar introduzir seu próprio `settings.js`, `popup.html`, `background.js` ou `offscreen.js`, o build falha. Esse comportamento é uma forma de **arquitetura restritiva**: o sistema impede, mecanicamente, que a organização do código se degrade com o tempo.

Essa verificação é feita por um health check do workspace que valida a estrutura, a sintaxe e, acima de tudo, o contrato entre núcleo e variantes. Contratos quebrados são detectados antes mesmo de chegarem a um commit.

## Adaptação e Escalabilidade

Quando surge a necessidade de adicionar um novo país, o trabalho é essencialmente declarativo: criar uma pasta de aplicação, definir as diferenças no arquivo de configuração, manter os overrides mínimos necessários e executar o release. O núcleo não precisa ser tocado. Isso reduz drasticamente o tempo de entrada de novos mercados e elimina a regressão em código compartilhado.

Esse modelo é uma aplicação prática do **Open/Closed Principle**: o núcleo está fechado para modificação, mas aberto para extensão via configuração e overrides controlados. A escalabilidade não vem de complexidade adicionada, mas de restrições bem escolhidas.

## Lições Práticas

A arquitetura do Radios Lite demonstra que monorepos só funcionam quando há uma separação clara de responsabilidades e mecanismos que impedem violações silenciosas. Deixar cada time ou variante livre para modificar o que quiser no núcleo é um caminho certo para a divergência. A disciplina arquitetural, aplicada via ferramentas de build e health checks, garante que a simplicidade do modelo se preserve mesmo à medida que o número de variantes cresce.

No fim, a decisão mais importante não foi técnica — foi de modelagem de domínio. Escolher o que pertence ao núcleo e o que pertence ao contexto delimitado de cada país define, sozinha, a saúde do projeto a longo prazo.
