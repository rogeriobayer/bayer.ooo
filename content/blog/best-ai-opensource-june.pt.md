---
title: "O melhor modelo de IA do momento tem nome e sobrenome"
slug: best-ai-opensource-june
date: 2026-06-04T10:00:00.000Z
lang: pt
excerpt: "Dois meses testando modelos open source no OpenCode por $5/mês — e um vencedor claro saiu dessa."
tags:
  - ai
  - open-source
  - deepseek
  - opencode
  - review
cover: /blog/best-ai-opensource-june.png
author: Rogério Bayer
---

Nos últimos dois meses mergulhei fundo no **OpenCode de $5** testando o que o ecossistema de modelos open source tem de melhor. A ideia era simples: até onde dá pra ir com um plano barato? A resposta me surpreendeu — e tem um modelo que ficou bem acima dos outros.

Antes de chegar no campeão, vale passar pelos outros candidatos que testei, porque o contexto importa.

## Os modelos que testei

### Kimi K2 / 2.6 — Custoso agora
Muito capaz, especialmente para tarefas criativas, frontends e criação de identidade visual. Conseguia criar um design com personalidade de verdade. O problema é que a promoção que dava 3× o uso padrão acabou, e assinar direto no site da Kimi sai $20/mês. A versão gratuita via API do OpenRouter usa modelo quantizado, com TPM lento e desempenho bem abaixo do original. Não compensa mais no setup atual.

### MiniMax M3 — Decepcionante
Lançado no final de maio com muito hype nos benchmarks, mas o resultado bruto não acompanha. Ficou gratuito por alguns dias no OpenCode, mas o desempenho ficou abaixo de modelos menores e mais baratos. Uma tarefa simples com subagentes levou mais de uma hora e entregou resultado mediano. Precisa de bastante otimização ainda.

### GLM 5 / 5.1 — Potente, mas lento
Uma boa opção quando a tarefa vem bem refinada por um modelo maior, como o Claude ou o ChatGPT. Entrega respostas precisas, mas é vagaroso — e o uso máximo pela API do OpenCode é bastante limitado. Acaba caindo no mesmo problema do Kimi 2.6: pouco uso disponível.

### QwQ 3.7 / 3.7+ — Bom, com ressalvas
Modelo sólido, especialmente o 3.7+, mas tende a travar em tarefas mais criativas. Tentei criar alguns frontends com o 3.6 e ele colocava componentes nos lugares errados, tinha dificuldade com CSS e gerava resultados genéricos onde precisava de criatividade e senso de cor. Para lógica e código estruturado, vai bem. Para design, não.

### 🏆 DeepSeek V4 Flash — Campeão do mês
Rápido, barato, resolve. Trabalhei muito com ele tanto pelo OpenCode quanto pela API própria do DeepSeek, e não consegui passar a barreira dos $2 — mesmo gastando quase 5 milhões de tokens. O custo de cache é ínfimo. Dá pra usar como API no seu próprio site, rodar em background, criar endpoints — tudo muito barato. O único ponto fraco é busca na internet: você precisa dar ferramentas externas pra ele, como o Tavily ou Max AI. Mas para resolver problemas diretos, especialmente um de cada vez, é extremamente eficiente.

O **DeepSeek V4 Pro** resolve mais coisas do que o Flash, mas é substancialmente mais caro e a diferença não compensa na maioria dos casos. O Flash sozinho já entrega muito valor.

> **Dica para o próximo mês:** quero experimentar usar o DeepInfra em vez da API do OpenCode para alguns modelos, como o Kimi 2.6 e o MiniMax. Pode ser mais barato do que assinar os planos individuais de $20.

## Os planos que não valem a pena (por enquanto)

Para quem está tentado a assinar direto nas plataformas, aqui está o que cada um cobra mensalmente — e por que prefiro manter tudo dentro do OpenCode de $5:

| Plano | Preço | Veredito |
|-------|-------|----------|
| MiniMax Code | $20/mês | Não compensa dado o desempenho atual do M3. Aguardar otimizações. |
| Kimi Coding | $19/mês | O modelo é capaz, mas caro para o volume de uso que você consegue. |
| GLM Lite | $18/mês | $18 a partir do 2º mês. Vagaroso demais para o preço cobrado. |

Todo o uso que descrevi aqui foi dentro do OpenCode de $5. A única exceção é o DeepSeek, que usei também diretamente pela API deles — e ainda assim não cheguei a $2 de gasto. É difícil bater essa relação custo-benefício.

Se você tem uma tarefa bem definida e quer um modelo open source que entrega rápido, barato e sem drama: **DeepSeek V4 Flash é o nome e o sobrenome do momento.**
