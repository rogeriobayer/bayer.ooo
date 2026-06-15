---
title: "Treinando um modelo de IA para foco: como cheguei a 90% de acurácia com 156 exemplos"
slug: focus-patrol-model
date: 2026-06-15T10:00:00.000Z
lang: pt
excerpt: "Como treinei um Qwen2.5-0.5B para classificar abas do navegador com 90% de acurácia usando apenas 156 exemplos, LoRA e quantização Int4 — tudo rodando 100% on-device."
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

## O contexto: o que é o Focus Patrol

O [Focus Patrol](https://focuspatrol.bayer.ooo/) é uma extensão para Chrome (e qualquer navegador baseado em Chromium) com uma proposta simples: monitorar suas abas abertas e te ajudar a manter o foco, sem nunca enviar nada para fora do seu navegador.

A extensão classifica cada aba em três categorias, **foco**, **neutro** ou **distração**, e te dá um retrato em tempo real de como você está usando seu tempo. Tem modo silencioso (notificações discretas via badge), estatísticas detalhadas de sequências de foco, limites de distração configuráveis e um sistema de fallback em três camadas para a IA: primeiro tenta usar a Gemini Nano nativa do Chrome, depois cai para Llama 3.2 via WebLLM, e se nada disso estiver disponível, usa um filtro local simples.

O ponto central é a privacidade: **toda a análise acontece no dispositivo**. A extensão nem pede permissão de rede, é literalmente impossível mandar seus dados de navegação para algum servidor, porque essa capacidade não existe no código.

É dentro desse contexto que entra o trabalho deste post. Hoje, quando o Gemini Nano não está disponível, a extensão cai para o Llama 3.2 via WebLLM, que funciona bem mas consome bastante GPU e memória do navegador do usuário, além de exigir um download grande. A ideia é substituir essa camada por um modelo próprio, treinado especificamente para essa tarefa de classificação, bem mais leve e que rode tranquilamente no dispositivo sem pesar tanto na máquina de quem está usando. O resultado desse trabalho vai substituir o Llama 3.2 dentro da nova estrutura de IA da extensão.

## A escolha do modelo base

Optei pelo **Qwen2.5-0.5B-Instruct**, um modelo de apenas 500 milhões de parâmetros. A lógica é simples: modelo pequeno demais não entende contexto, modelo grande demais não cabe num download de extensão nem roda rápido no navegador. O Qwen2.5-0.5B ficou no meio do caminho, leve o suficiente para download rápido, e com capacidade suficiente para aprender a tarefa de classificação.

O desafio era treinar esse modelo com um dataset bem pequeno, só 176 exemplos rotulados, e encontrar o equilíbrio certo entre viés de classe, capacidade do modelo e generalização. Esse post documenta cada experimento que fiz para chegar lá: o que funcionou, o que não funcionou, e por quê.

## O dataset

Comecei com **176 exemplos** de navegação real, cobrindo 60 domínios únicos entre produtividade, comunicação, entretenimento, compras e notícias. Dividi em três partes: 136 para treino, 20 para validação (usados durante o treinamento para verificar se o modelo está generalizando) e 20 para teste (usados só no final, para medir o resultado real).

Olhando a distribuição, o problema já ficava evidente: no treino, **foco** tinha 50 exemplos (37%), **neutro** tinha 62 (46%) e **distração** tinha só 24 (18%). Esse desbalanceamento, distração sendo a classe minoritária, foi a raiz de quase todos os problemas que apareceram nos experimentos seguintes.

## Metodologia: o que é LoRA e por que usei

Usei **PEFT LoRA** (Low-Rank Adaptation), uma técnica de fine-tuning eficiente. Em vez de re-treinar todos os 500 milhões de parâmetros do modelo (o que exigiria muito mais dados, tempo e memória), o LoRA congela o modelo base inteiro e adiciona pequenas matrizes "extras" em cada camada, treinando só essas matrizes. No meu caso, isso reduziu os parâmetros treináveis de 500M para cerca de **8,8 milhões**, só 1,75% do total do modelo.

Treinei tudo em Apple Silicon MPS, no MacBook Pro mesmo, sem precisar de GPU dedicada. A configuração principal foi: LoRA rank 16, alpha 32, dropout de 0,1, learning rate de 1×10⁻⁴ com cosine schedule (a taxa de aprendizado começa mais alta e vai diminuindo suavemente ao longo do treino), batch size efetivo de 8, sequências de até 1024 tokens, e tudo em precisão float32.

## A jornada: 9 experimentos, um de cada vez

Cada versão testou uma hipótese diferente. Vou explicar o que cada uma fez, por que fiz aquela mudança, e o que aconteceu.

### V1, Baseline, sem fine-tuning nenhum

Antes de treinar qualquer coisa, precisava saber: o quão bom é o modelo "out of the box"? Testei o Qwen2.5 **1.5B** (a versão 3x maior do modelo) só com um prompt de few-shot, ou seja, dando 12 exemplos de classificação direto no prompt, sem treinar nada.

Resultado: **65% de acurácia**. Um ponto de partida razoável, mas usando um modelo 3x mais pesado do que o que eu queria usar de fato.

### V2, Primeiro fine-tuning, dados originais

Aqui treinei o Qwen2.5-0.5B (o modelo menor que eu realmente queria usar) com os 136 exemplos originais de treino, LoRA r=16, por 3 épocas (uma "época" é uma passada completa pelo dataset de treino).

Resultado: também **65%**, mas o padrão de erro contava a história real. O modelo aprendeu a "jogar seguro": como neutro é 46% do dataset, qualquer coisa duvidosa ele classifica como neutro. Acertou 100% dos exemplos de neutro, mas **zerou completamente** a classe distração, nunca classificou nada como distração, nem quando devia.

### V3, Tentando corrigir o desbalanceamento via oversampling forçado

Diagnóstico do V2: o desbalanceamento das classes estava distorcendo o aprendizado. Solução tentada: forçar 62 exemplos de cada classe via oversampling (repetir exemplos da classe minoritária), totalizando 186 exemplos balanceados.

Resultado: **60%**, pior que antes. O modelo passou a classificar quase tudo como distração, agora ele "joga seguro" na direção contrária. Foco subiu para 80%, mas neutro despencou para 25%, e distração foi para 100% (só porque ele praticamente nunca classifica como outra coisa). A correção foi pior que o problema original.

### V4, O ponto de virada: oversample suave + prompt melhorado ⭐

Aprendizado do V3: balanceamento total é exagerado. Em vez disso, fiz um **oversample suave de apenas 2x na classe distração** (chegando a 160 exemplos no total, sem tocar nas outras classes), e, igualmente importante, melhorei bastante o prompt do sistema, adicionando regras específicas por plataforma. Por exemplo: YouTube com conteúdo educacional conta como foco, ChatGPT conta como neutro, GitHub conta como foco, e assim por diante para várias plataformas comuns.

Resultado: salto para **85%**. Foco ficou perfeito (100%), neutro quase perfeito (88%). Distração ainda zerou, os dois exemplos de teste de Twitch foram classificados errado, mas o avanço foi enorme em relação às versões anteriores.

### V5, Será que mais épocas ajuda?

Testei treinar por mais tempo: 10 épocas, com early stopping (parada antecipada quando o modelo para de melhorar) configurado mas que terminou não interrompendo a tempo.

Resultado: **80%**, pior que o V4. O que aconteceu: o eval loss (o "erro" medido no conjunto de validação, que indica se o modelo está generalizando ou só memorizando o treino) começa a subir depois da época 3. Continuar treinando além disso faz o modelo decorar o treino em vez de aprender padrões gerais. Distração foi a 100%, mas neutro caiu para 62%, outro trade-off, e no saldo geral, pior. Conclusão: mais épocas não é igual a modelo melhor.

### V6, A hipótese errada: mais parâmetros treináveis

Pensei: e se eu der mais "capacidade" ao LoRA? Dobrei o rank de 16 para 32, o que quase dobra os parâmetros treináveis (de 8,8M para 17,6M).

Resultado: **55%**, o pior de todos os experimentos. Foco despencou para 30%. Com um dataset tão pequeno (136-160 exemplos), dar mais parâmetros treináveis ao modelo só aumenta o overfitting, ele tem capacidade demais para memorizar detalhes específicos do treino, e generaliza pior para casos novos.

### V7, O campeão: a mudança mais simples de todas ✨

Depois de seis experimentos ajustando hiperparâmetros, balanceamento e arquitetura, fiz a mudança mais óbvia e que eu tinha deixado por último: peguei os **20 exemplos do conjunto de validação e joguei dentro do treino**. Em vez de 136, o treino passou a ter **156 exemplos**.

Resultado: **90% de acurácia no teste**, o melhor de todo o projeto, e por uma margem boa. Neutro e distração ficaram perfeitos (100% cada). Foco ficou em 80%, os dois erros restantes são casos de borda que seriam difíceis até para um humano classificar.

A lição aqui é direta: depois de seis tentativas de "engenharia", balanceamento, épocas, rank do LoRA, o que mais moveu o ponteiro foi simplesmente ter um pouco mais de dado de treino.

## O dilema do balanceamento de classes

Olhando os experimentos em conjunto, o padrão central do projeto é um trade-off constante: melhorar a classe distração quase sempre custa algo em neutro, e vice-versa. A distribuição natural do dataset (46% neutro) vicia o modelo para "neutro". Balanceamento forçado total (33% cada classe, como no V3) vicia para "distração". O ponto ideal foi um meio-termo: oversample modesto de 2x só na classe minoritária, sem rebalancear as outras (V4 e V7).

E em todos os experimentos que deram certo, o padrão do eval loss se repete: ele para de cair entre as épocas 2 e 3. Depois disso, o train loss continua descendo (o modelo continua "aprendendo" o treino de cor), mas o eval loss estabiliza ou sobe (ele para de generalizar melhor). O melhor checkpoint está sempre por volta da época 3, mesmo quando configurei o treino para rodar 5 ou 10 épocas.

## Otimizando para produção: de 988 MB para 305 MB

O modelo campeão (V7), salvo em fp16, ocupa 988 MB. Pesado demais para o download de uma extensão de navegador. Apliquei quantização **ONNX Int4**, uma técnica que reduz a precisão numérica dos pesos do modelo, de modo que cada peso ocupa menos espaço, mas o modelo continua funcionando de forma muito parecida.

| Formato | Tamanho | Redução | Acurácia | Recomendação |
|---|---|---|---|---|
| PyTorch fp32 | ~1.8 GB | base | 90% | Não |
| PyTorch fp16 | 988 MB | -45% | 90% | Sim |
| ONNX Int8 | 474 MB | -52% | ~90% | Sim |
| **ONNX Int4** | **305 MB** | **-69%** | **~90%** | **Melhor opção** |
| SmolLM2-135M fp16 | 270 MB | -73% | 70% | Muito fraco |

A quantização Int4 reduziu o modelo em 69% (de 988 MB para 305 MB) com perda de acurácia insignificante. Esse é o tamanho viável para distribuir dentro de uma extensão Chrome.

## O experimento extra: testando um modelo ainda menor

Para entender o limite inferior de tamanho, testei o **SmolLM2-135M-Instruct**, da HuggingFace, 3,7x menor que o Qwen2.5-0.5B. Aumentei o dataset artificialmente (com paráfrases e domain swapping, ou seja, trocando domínios entre exemplos para criar variações) e treinei por 10 épocas com LoRA r=16.

O resultado mostrou claramente a limitação: o eval loss estabilizou em torno de 0,37, bem acima dos ~0,21 do Qwen2.5-0.5B. A acurácia ficou em apenas 70%, com a classe distração zerada de novo. Mesmo com mais dados e mais épocas, 135M parâmetros não foi suficiente capacidade para essa tarefa. O Qwen2.5-0.5B em Int4, 305 MB, 90% de acurácia, continua sendo o ponto ideal entre tamanho e desempenho.

## Lições aprendidas

**Qualidade e quantidade de dados pesam mais que parâmetros.** Adicionar 20 exemplos curados ao treino (V7) rendeu +25 pontos percentuais de acurácia. Dobrar o LoRA rank (V6) rendeu -10 pontos. A diferença é gritante.

**Balanceamento de classes é uma corda bamba.** Nem deixar a distribuição natural como está, nem forçar balanceamento total, o equilíbrio certo foi um oversample modesto, só na classe que estava sub-representada.

**Early stopping em torno da época 3-4.** Em todos os experimentos, o eval loss parou de melhorar depois da época 3. Treinar além disso só piora a generalização, mesmo que o train loss continue caindo.

**Prompt engineering é um multiplicador de força.** Um prompt com regras específicas por plataforma (V4) adicionou cerca de 15 pontos percentuais de acurácia mesmo antes de qualquer fine-tuning.

**Quantização Int4 é essencial para produção.** Reduzir de 988 MB para 305 MB com perda de acurácia insignificante é o que torna esse modelo viável para rodar dentro de uma extensão de navegador.

---

## O que vem a seguir

Esse modelo, `rogeriobayer/focus-patrol-qwen2.5-0.5b-v7-int4`, 305 MB, ONNX Int4, 90% de acurácia, vai substituir o Llama 3.2 dentro da nova estrutura de IA da extensão [Focus Patrol](https://focuspatrol.bayer.ooo/). Ele roda inteiramente via Transformers.js, direto no navegador, 100% on-device, sem enviar absolutamente nada para fora do seu computador, e usando muito menos GPU e memória do que o Llama 3.2 exigia.

O modelo está disponível no HuggingFace em [huggingface.co/rogeriobayer/focus-patrol-qwen2.5-0.5b-v7](https://huggingface.co/rogeriobayer/focus-patrol-qwen2.5-0.5b-v7/tree/main).

