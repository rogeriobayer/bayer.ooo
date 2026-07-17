---
title: "Wiki LLM: como criar uma memória permanente para a IA dentro do seu projeto"
slug: wiki-llm
date: 2026-07-17T10:00:00.000Z
lang: pt
excerpt: "Ferramentas como Claude Code, Cursor e Codex conseguem analisar código, criar funcionalidades e explicar arquiteturas complexas. Mas o contexto construído durante uma conversa desaparece quando a sessão termina. Uma Wiki LLM resolve isso criando uma base de conhecimento permanente para a IA."
tags:
  - llm
  - ai
  - architecture
  - documentation
  - best-practices
cover: /blog/wiki-llm.png
author: Rogério Bayer
---

## O problema que a Wiki LLM resolve

Ferramentas como Claude Code, Cursor e Codex conseguem analisar código, criar funcionalidades e explicar arquiteturas complexas. Mas existe uma limitação que aparece cedo: o contexto construído durante uma conversa desaparece quando a sessão termina. Na próxima vez, você explica tudo de novo. As decisões do projeto, os padrões adotados, as limitações técnicas, o motivo pelo qual aquela integração funciona daquele jeito específico.

Conforme o sistema cresce, esse processo fica lento e sujeito a erros. A IA propõe abordagens que o time já descartou. Sugere bibliotecas que não estão no stack. Não sabe que aquele endpoint tem uma limitação de concorrência que causou um incidente em produção.

Uma Wiki LLM tenta resolver esse problema criando uma base de conhecimento permanente, estruturada e mantida com a ajuda da própria inteligência artificial.

## O que é e como se organiza

Em vez de depender do histórico de conversas, o agente passa a consultar uma wiki local com informações sobre arquitetura, regras de negócio, decisões técnicas, integrações, incidentes e aprendizados acumulados durante o desenvolvimento. São arquivos Markdown armazenados dentro ou próximos ao repositório.

Uma estrutura possível seria:

```
project-wiki/
├── raw/                    # fontes originais: documentos, reuniões, specs
├── wiki/                   # conhecimento sintetizado pela IA
│   ├── architecture/
│   ├── features/
│   ├── business-rules/
│   ├── decisions/
│   └── troubleshooting/
├── index.md
├── log.md
└── AGENTS.md
```

A pasta **raw** guarda as fontes originais sem modificação. A pasta **wiki** contém o conhecimento organizado pelo agente em páginas menores e conectadas. O arquivo **AGENTS.md** define como a IA deve trabalhar com essa base: quando criar páginas, como registrar fontes e quais arquivos não podem ser alterados.

A diferença para uma documentação comum é que a wiki é escrita pensando em quem vai consultar, seja um desenvolvedor ou um agente de IA. Uma decisão arquitetural não fica só registrada: ela fica acessível, referenciada e conectada a outras páginas relevantes.

## O que muda na prática

Imagine que o time decidiu usar React Query para controlar o estado remoto da aplicação. Com uma wiki, isso vira uma página em `wiki/architecture/server-state.md` explicando a decisão, as regras de uso e os motivos pelos quais outras abordagens foram descartadas. Na próxima vez que um agente for implementar uma feature que busca dados da API, ele consulta essa página antes de propor armazenar a resposta no Redux.

O mesmo vale para incidentes. Se uma integração de pagamento quebrou porque aquela API não aceita requisições simultâneas, o incidente pode virar uma página em `wiki/troubleshooting/concurrent-payment-requests.md` com os sintomas, a causa, a solução e como evitar que aconteça de novo. Quando um agente trabalhar nessa integração no futuro, o histórico está disponível.

Isso muda o tipo de trabalho que a IA faz. Em vez de tratar cada tarefa como uma conversa isolada, o agente passa a trabalhar com uma memória compartilhada do projeto. Ele não gera apenas código tecnicamente funcional. Gera algo mais próximo do padrão real do produto.

## Onde faz mais diferença

A wiki tende a ser mais útil em alguns contextos específicos.

**Em projetos legados**, onde regras importantes existem só na memória dos desenvolvedores mais antigos, um agente pode analisar o código e criar páginas que documentam o comportamento existente de forma incremental. Cada tarefa realizada no sistema também melhora a documentação disponível para tarefas futuras.

**Em sistemas com regras de negócio complexas**, produtos financeiros, plataformas de recrutamento, ERPs, ferramentas de saúde, as regras estão espalhadas entre código, tickets, planilhas e conversas. Uma wiki permite consolidar isso em páginas específicas por domínio. Antes de implementar uma alteração no fluxo de cancelamento de assinatura, o agente pode verificar as regras registradas.

**Em projetos com múltiplos agentes**, a wiki funciona como ponto central de contexto. Quando diferentes agentes trabalham em escrita de código, criação de testes e revisão de segurança, todos consultam as mesmas decisões e limitações antes de executar tarefas.

**Em onboarding**, tanto de pessoas quanto de agentes novos analisando o repositório pela primeira vez, a wiki oferece uma trilha de leitura estruturada em vez de depender de quem está disponível para explicar.

## Como manter atualizada

Criar a wiki é o primeiro passo. O desafio real é evitar que ela envelheça.

O fluxo pode ser dividido em três operações. A **ingestão** acontece quando uma nova fonte é adicionada: uma especificação, um relatório de incidente, uma decisão de arquitetura. O agente analisa o material, cria páginas necessárias e atualiza as existentes. A **consulta** acontece quando alguém precisa de uma resposta usando a wiki, e boas respostas podem virar novas páginas quando representam análises úteis no futuro.

A terceira operação é uma **revisão periódica** da própria wiki: links quebrados, páginas sem fontes, informações contraditórias, conteúdo desatualizado, decisões substituídas por versões mais recentes. Isso pode ser executado durante pull requests ou em intervalos definidos pelo time.

O arquivo **AGENTS.md** define essas regras de forma explícita:

```markdown
Antes de implementar qualquer funcionalidade:
1. Consulte o index.md e busque páginas relacionadas à feature.
2. Leia decisões arquiteturais relevantes.
3. Verifique incidentes e regressões conhecidos.

Depois de concluir uma tarefa:
1. Atualize páginas afetadas pela mudança.
2. Registre novas regras de negócio ou decisões importantes.
3. Adicione problemas encontrados ao troubleshooting.

Nunca altere arquivos dentro de raw/.
Toda afirmação importante deve apontar para uma fonte rastreável.
```

## O que ela não substitui

A wiki funciona como camada organizadora sobre as fontes originais, não como substituta. A documentação oficial, os contratos de API, o código e os tickets continuam existindo. A wiki conecta e sintetiza essas informações.

Conteúdo gerado por IA também não deve ser tratado como verdade sem revisão. Decisões críticas, regras financeiras, requisitos legais e configurações de segurança precisam passar pelo time antes de virar referência permanente. A função da wiki é ampliar o acesso ao conhecimento, não eliminar a responsabilidade de quem entende o sistema.

## Quando não vale a pena

Projetos pequenos, experimentos rápidos ou aplicações com poucas regras provavelmente não precisam dessa estrutura. Manter uma wiki tem um custo real: é necessário revisar páginas, atualizar informações e corrigir inconsistências. Para um protótipo descartável, um README.md bem escrito resolve.

A wiki tende a justificar o investimento quando o projeto tem longa duração, vários desenvolvedores, arquitetura complexa, muitas regras de negócio, sistemas legados ou uso intensivo de agentes de IA. Nesses casos, a diferença entre um agente que conhece o histórico do sistema e um que começa do zero a cada sessão é significativa.

## Por onde começar

Não é necessário montar uma estrutura completa desde o início. Uma primeira versão pode ser simples:

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

Conforme o volume de informação crescer, as páginas se dividem em categorias. O mais importante é o fluxo: o agente consulta antes de trabalhar, registra o que aprende, e o time valida o que entra como referência permanente.

O valor não está no tamanho da wiki, mas na consistência com que ela é usada.
