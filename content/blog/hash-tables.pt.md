---
title: "Hash Tables em JavaScript: a estrutura que pode te salvar na entrevista técnica"
slug: hash-tables
date: 2026-07-10T10:00:00.000Z
lang: pt
excerpt: "Entenda como hash tables funcionam, quando usá-las no lugar de outras estruturas de dados e como elas transformam problemas O(n²) de entrevista em soluções O(n) limpas usando Map, Set e objetos em JavaScript."
tags:
  - javascript
  - algorithms
  - data-structures
  - hash-tables
  - computer-science
  - performance
cover: /blog/hash-tables.png
author: Rogério Bayer
---

Existe um momento específico em uma entrevista técnica que a maioria dos desenvolvedores reconhece. Você resolve o problema. Funciona. Aí o entrevistador pergunta: "dá pra fazer melhor?" E a resposta, na maioria das vezes, envolve uma hash table.

A razão não é que hash tables são engenhosas. É que elas resolvem um problema muito específico e muito comum: você está buscando em uma coleção repetidamente, e cada busca custa O(n). Coloque isso dentro de um loop e você tem O(n²). Substitua a busca interna por uma consulta em hash table e o algoritmo inteiro vira O(n). Essa é geralmente a otimização que o entrevistador está esperando.

- - -

## Como funciona

Uma hash table converte uma chave em um endereço de array usando uma função hash. A mesma chave sempre mapeia para o mesmo endereço, então tanto leituras quanto escritas custam O(1), independentemente de quantos dados estão armazenados. Não há varredura, nem comparação, nem iteração. Você calcula o endereço e vai direto ao dado.

A função hash processa cada caractere da chave usando seu código numérico, multiplica pela posição e usa módulo para se manter dentro dos limites do array:

```javascript
js_hash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * i) % this.data.length;
  }
  return hash;
}
```

Com dados suficientes e um número fixo de slots, duas chaves diferentes eventualmente produzirão o mesmo endereço. Isso é uma colisão. A solução padrão é armazenar uma lista em cada slot em vez de um único valor, então colisões simplesmente adicionam à lista. Você ainda chega ao slot certo em O(1) via hash, depois percorre uma lista curta pela chave exata. Com um array grande e uma função hash decente, essas listas ficam pequenas o suficiente para o custo permanecer efetivamente constante.

- - -

## Como hash tables se comparam a outras estruturas

Cada estrutura tem um propósito. O erro é pegar a familiar em vez da correta.

* **Array:** acesso O(1) por índice, busca O(n) por valor. Rápido quando você sabe a posição. Lento quando está procurando por conteúdo.
* **Lista ligada:** inserção e remoção flexíveis em posições conhecidas, mas sempre O(n) para encontrar um valor. Sem atalho para um elemento específico.
* **Árvore binária de busca:** busca O(log n), e os dados permanecem ordenados. Melhor que O(n), pior que O(1). A vantagem real é travessia ordenada e consultas por intervalo, coisas que uma hash table não consegue fazer.
* **Heap:** acesso O(1) ao valor mínimo ou máximo, inserção O(log n). A escolha certa quando você precisa do valor extremo repetidamente de um conjunto de dados em mudança.
* **Hash table:** consulta O(1) por chave. Sem ordenação, custo extra de memória, mas nada supera para buscas pontuais.

O sinal para usar uma hash table é específico: você precisa de buscas rápidas por chave, não precisa de ordenação, e trocar memória por velocidade faz sentido no contexto.

- - -

## O padrão de entrevista

A maioria dos problemas onde hash tables ajudam segue o mesmo formato. Você tem dados que precisa referenciar enquanto percorre uma coleção. Em vez de voltar e buscar cada vez, você armazena o que já viu e verifica em O(1).

Two Sum é o exemplo que mais aparece. A abordagem ingênua verifica cada par de números, o que é O(n²). Com uma hash table, você percorre o array uma única vez. Para cada número, verifica se o complemento dele já existe na tabela. Se existir, você encontrou o par. Se não, armazena o número atual e continua.

```javascript
function twoSum(nums, target) {
  const seen = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen[complement] !== undefined) return [seen[complement], i];
    seen[nums[i]] = i;
  }
}
```

Uma passada. Pronto. Contagem de frequência, detecção de duplicatas, agrupamento por propriedade: a mesma estrutura se aplica a todos eles.

Em JavaScript, `Map` e `Set` são as implementações nativas. `Map` preserva a ordem de inserção e aceita qualquer tipo como chave, não apenas strings. `Set` armazena valores únicos com verificações de existência O(1) via `has()`. Um objeto simples cobre a maioria dos casos, mas tem casos extremos com tipos de chave e propriedades do protótipo. Saber qual se encaixa faz parte de escrever código intencional, não apenas código que funciona.

- - -

## Quando não usar

Hash tables trocam memória por velocidade. Na maioria dos problemas de entrevista, essa troca é aceitável. Em sistemas de produção com orçamentos de memória apertados, é um custo real.

Elas também ficam aquém quando o problema precisa de ordenação. Se você precisa de travessia ordenada, uma árvore binária de busca se encaixa melhor. Se precisa do mínimo ou máximo de um conjunto de dados em mudança, use uma heap. Hash tables são rápidas em buscas pontuais. Consultas por intervalo e ordenação não são o propósito delas.

O padrão para ficar atento em entrevistas é um loop com uma busca interna. Quando você vê isso, há uma boa chance de que uma passada com hash table te leve a uma classe de complexidade melhor.
