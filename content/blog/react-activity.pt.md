---
title: "React <Activity>: quando esconder não é a mesma coisa que desmontar"
slug: react-activity
date: 2026-07-02T10:00:00.000Z
lang: pt
excerpt: O React 19.2 trouxe o componente <Activity>, que permite esconder e
  restaurar a interface e o estado interno dos filhos sem desmontá-los. Entenda
  quando usar, quando evitar e por que isso muda a forma de pensar em
  visibilidade no React.
tags:
  - react
  - javascript
  - activity
cover: /blog/react-activity.png
author: Rogério Bayer
---

Durante anos, esconder um componente no React significava uma coisa: remover ele do DOM. A renderização condicional com `{condition && <Component />}` é o padrão que todo dev React conhece desde o primeiro tutorial. Ela funciona. O problema é que "funcionar" aqui tem um custo escondido: quando você remove o componente, você destrói o estado junto.

Troca de aba numa dashboard? O scroll foi pro início. Formulário parcialmente preenchido? Perdido. Vídeo tocando? Para, rebufferiza e volta do começo quando o usuário volta. Durante anos, os workarounds foram feios: mover tudo pra Zustand ou Redux, usar portals com `display: none`, instalar libs como `react-activation`. Todos funcionam, todos fazem você sentir que está brigando com o framework.

O React 19.2, lançado em outubro de 2025, trouxe uma resposta nativa: o componente `<Activity>`, que permite esconder e restaurar a interface e o estado interno dos filhos sem desmontá-los.

- - -

## O uso é direto

```jsx
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <VideoPlayer />
</Activity>
```

Quando `mode="hidden"`, o React renderiza o componente em segundo plano com a menor prioridade possível. O componente fica totalmente renderizado, mas com `display: none`. Os Effects não rodam. E quando o modo volta para `"visible"`, o componente aparece instantaneamente, sem re-render.

- - -

## Parece o `v-show` do Vue?

Sim, e não por acaso. A ideia é manter seções da interface renderizadas, mas inativas, em vez de removê-las completamente. O `v-show` do Vue faz exatamente isso há anos: troca `display: none` em vez de desmontar, preservando o estado local do componente. Quem vem do Vue já conhece esse comportamento de cor.

A diferença é que o `<Activity>` vai além do CSS. Ele opera no sistema de prioridade de fibras do React, de forma que árvores escondidas nunca bloqueiam o conteúdo visível. Quando `hidden`, os Effects são desmontados (com cleanup), mas o estado React e o DOM são preservados. Quando volta a `visible`, os Effects rodam de novo. É como se o componente tivesse sido pausado, não destruído.

Outro ponto que o `v-show` não cobre: o `<Activity>` permite pré-renderizar componentes em segundo plano antes de o usuário precisar deles. Imagens, estilos e outros recursos são carregados antecipadamente, e quando o componente fica visível, tudo aparece instantaneamente.

- - -

## Onde faz sentido usar

O caso mais óbvio são tabs com estado. Uma dashboard onde o usuário alterna entre abas e espera encontrar tudo onde deixou, sem recarregar dados, sem perder scroll, sem resetar filtros. Um player de vídeo onde a posição de reprodução precisa ser preservada. Um formulário longo que fica temporariamente escondido enquanto o usuário navega para outra seção e volta.

O `<Activity>` também participa da hidratação seletiva no SSR. Partes menos críticas da página podem hidratar com menor prioridade, deixando o conteúdo principal interativo mais rápido. Isso é particularmente útil em páginas pesadas onde nem tudo precisa estar pronto ao mesmo tempo.

- - -

## Onde não compensa

Nem todo caso de show/hide precisa de `<Activity>`. Se o componente não tem estado relevante a preservar, a renderização condicional comum é mais simples e mais barata. Manter um componente no DOM tem um custo de memória: o React está segurando aquela árvore, aquele DOM, aqueles dados. Fazer isso com vinte abas simultâneas ou listas longas de itens escondidos pode virar um problema de memória antes de virar uma solução de performance.

Também vale atenção com tags como `<video>` e `<audio>`: como o DOM não é destruído quando o componente fica `hidden`, esses elementos continuam tocando em background se você não adicionar cleanup nos Effects. A API não faz isso automaticamente.

Outro cenário onde `<Activity>` não ajuda: componentes que precisam buscar dados frescos sempre que ficam visíveis. Se o usuário volta para uma aba e você quer garantir que os dados estão atualizados, preservar o estado pode ser o oposto do que você precisa. Aí a renderização condicional tradicional, que desmonta e remonta, continua sendo a escolha certa.

- - -

## O ponto real

O `<Activity>` separa visibilidade de tempo de vida do componente. Essa distinção parece pequena, mas é a que faltava no React há anos. Quem nunca perdeu estado de componente num toggle de tab, num modal que fecha, num drawer que colapsa, sabe exatamente o que isso resolve.

Não é a feature mais glamourosa do React 19.2. Mas é uma das mais práticas. E para quem já conhecia `v-show` no Vue, a sensação é de um colega de profissão que finalmente chegou na mesma conclusão, só que um pouco mais tarde.
