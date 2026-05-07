---
title: "Vue 3: watch vs watchEffect — Qual usar na Composition API?"
slug: "watch-vs-watch-effect"
date: "2026-05-07T10:00:00.000Z"
lang: "pt"
excerpt: "Descubra as diferenças práticas entre watch e watchEffect na Composition API do Vue 3, e saiba exatamente quando usar cada um para evitar bugs e melhorar a performance."
tags: ["vue", "javascript", "composition-api"]
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
author: "Rogério Bayer"
---

Se você já começou a explorar a **Composition API** do Vue 3, com certeza cruzou o caminho dessas duas funções. À primeira vista, `watch` e `watchEffect` parecem fazer a mesma coisa: observam uma mudança e reagem a ela.

Mas, na prática, eles têm personalidades bem diferentes. Escolher o errado não vai quebrar seu código, mas pode te dar dores de cabeça com performance ou comportamentos inesperados.

---

## watchEffect: O Observador Inteligente (e um pouco ansioso)

O `watchEffect` é para quem gosta de praticidade. Você entrega uma função para ele, e o Vue "rastreia" automaticamente tudo o que é reativo ali dentro. Se você usou uma variável dentro do bloco, o Vue entende que deve rodar aquilo de novo quando essa variável mudar.

### Por que usar?
Ele é excelente para quando você tem múltiplas dependências ou quer que algo aconteça **imediatamente** assim que o componente for montado.

```javascript
// Ele roda na hora!
watchEffect(() => {
  console.log(`Buscando dados para o ID: ${userId.value}`)
  // O Vue percebe sozinho que depende de userId
})
```

*   **Ponto positivo:** Menos código. Você não precisa listar as dependências manualmente.
*   **Ponto de atenção:** Ele é "faminto". Qualquer variável reativa que você encostar dentro dele vira uma dependência, o que pode causar re-execuções desnecessárias se você não tomar cuidado.

---

## watch: O Observador Detalhista

O `watch` é mais conservador e preciso. Você precisa dizer exatamente o que ele deve vigiar. Diferente do seu "irmão" ansioso, o `watch` é **preguiçoso (lazy)**: ele não roda na criação do componente, apenas quando a fonte monitorada muda de fato.

### A grande vantagem: O Antes e o Depois
O `watch` te dá acesso ao valor antigo (`oldValue`), algo que o `watchEffect` não faz. Isso é crucial para lógicas de comparação.

```javascript
watch(count, (newValue, oldValue) => {
  if (newValue > oldValue) {
    console.log("O número subiu!")
  }
})
```

*   **Ponto positivo:** Controle total. Você decide exatamente o que dispara o efeito.
*   **Ponto de atenção:** Se precisar que ele rode logo de cara, você terá que passar um objeto de configuração: `{ immediate: true }`.

---

## Qual escolher? O Guia Rápido

Para não errar mais, pense assim:

| Situação | Use... |
| :--- | :--- |
| Preciso comparar o valor novo com o antigo. | **watch** |
| Quero que o código rode assim que o app carregar. | **watchEffect** |
| Tenho 3 ou 4 variáveis que influenciam o mesmo efeito. | **watchEffect** |
| Quero evitar que o efeito rode sem necessidade. | **watch** |
| Vou fazer um `fetch` simples baseado em um ID. | **watchEffect** |

---

## Um detalhe que ninguém te conta

Ambos aceitam uma função mágica chamada `onCleanup`. Ela serve para "limpar a bagunça" antes do efeito rodar novamente. Imagine que você iniciou um `setTimeout` ou uma requisição de API; se a variável mudar antes de terminar, você usa o cleanup para cancelar a operação anterior e não sobrecarregar o navegador.

No fim das contas, o **watch** é sua ferramenta de precisão (cirúrgico), enquanto o **watchEffect** é sua ferramenta de conveniência (automático).

Na dúvida? Comece com o `watch`. Ter controle explícito sobre o que faz seu código rodar geralmente evita bugs difíceis de rastrear no futuro.

Qual deles você tem usado mais nos seus projetos recentes?
