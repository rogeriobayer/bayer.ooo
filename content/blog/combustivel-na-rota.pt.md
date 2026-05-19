---
title: "Como fui parar em Foz do Iguaçu com um quarto de tanque e acabei construindo um buscador de combustível"
slug: combustivel-na-rota
date: 2026-05-19T10:00:00.000Z
lang: pt
excerpt: "Uma história de como a falta de planejamento e um tanque quase vazio me levaram a construir uma ferramenta para encontrar combustível barato ao longo de qualquer rota no Paraná."
tags:
  - react
  - cloudflare
  - ux
  - open-source
cover: /blog/combustivel.png
author: Rogério Bayer
---

O planejamento de uma viagem costuma ser a parte divertida, até que a realidade bate à porta. Eu estava de malas prontas para sair de Curitiba rumo a Foz do Iguaçu quando notei o ponteiro: um quarto de tanque. São mais de 630 quilômetros de estrada e eu não fazia ideia de onde pararia para abastecer ou quanto o meu orçamento sofreria com isso.

O Paraná tem uma ferramenta excelente chamada Menor Preço, alimentada pelos dados do Nota Paraná em tempo real. O problema é a premissa do design: o app oficial funciona como um radar. Ele pega sua localização atual, desenha um raio de 20 km e mostra o que tem em volta.

Para quem está sentado no sofá planejando uma travessia pelo estado, isso é inútil. Você não quer saber o preço no posto da esquina; você quer saber o preço em Guarapuava ou Cascavel antes mesmo de dar a partida.

A situação me incomodou o suficiente para eu parar de planejar a viagem e começar a planejar uma ferramenta. O resultado está em [combustivel.bayer.ooo](https://combustivel.bayer.ooo).

## O Problema: Dados Certos, Pergunta Errada

A Secretaria da Fazenda fornece os dados, mas a interface oficial limita a busca a um ponto fixo. Se você quer percorrer a BR 277 inteira, precisaria abrir o app a cada 40 km para descobrir se o próximo posto é mais barato. Se você está em Curitiba, ele não mostra postos em Ponta Grossa; se está em Ponta Grossa, não mostra em Guarapuava.

O desafio não era a falta de informação, mas o **contexto espacial**. Uma rota não é um ponto; é uma linha que atravessa dezenas de municípios. A pergunta correta a ser feita ao sistema não era "onde está o combustível barato agora?", mas sim "onde está o combustível barato ao longo deste trajeto?".

## A Solução: Amostrando a Estrada

Para resolver isso, decidi construir uma camada de inteligência sobre os dados existentes. A lógica funciona em quatro etapas:

**1. Geocodificação:** Quando você digita a partida e o destino, o navegador pergunta ao **Nominatim** (o geocodificador do OpenStreetMap) onde esses lugares ficam. Ele devolve latitude e longitude.

**2. Roteirização:** Com as coordenadas em mãos, a aplicação chama o **OSRM** (Open Source Routing Machine), que traça a rota rodoviária. A resposta inclui a geometria completa da estrada: uma sequência de milhares de pontos que descrevem cada curva da BR 277.

**3. Amostragem Inteligente:** Consultar a API do governo para cada coordenada da linha seria ineficiente e pesado. Em vez disso, fragmentei a rota em segmentos, coletando um ponto de referência a cada 20 km, aproximadamente. Uma viagem de Curitiba a Foz vira cerca de 30 pontos de consulta.

**4. Busca em Lote:** Para cada um desses pontos amostrados, o sistema dispara uma consulta num raio de 20 km. As requisições rodam em paralelo, e os resultados são combinados, deduplicados e ordenados.

A busca local também existe. Se você prefere consultar preços perto de uma cidade específica, sem traçar rota, basta digitar o nome do município. O sistema faz a mesma consulta por geohash em um raio de 20 km — mas com uma única requisição, já que não há rota para amostrar.

## O Stack Técnico (e por que ficou mais rápido)

Como desenvolvedor, busquei uma arquitetura que fosse leve e fácil de manter. O frontend foi feito em **React** com **Leaflet** para os mapas, e as consultas são cacheadas com **TanStack Query**. O proxy das APIs roda em um **Cloudflare Worker**, o que permite hospedar o site e o backend no mesmo domínio sem dor de cabeça com CORS.

De quebra, o resultado ficou consideravelmente mais rápido e fluido que o app público. O segredo está no cache agressivo do TanStack Query ao mover o mapa e na eficiência do Cloudflare Workers em orquestrar as chamadas em paralelo.

### Na prática: como são as requisições

Toda a comunicação acontece pelo navegador. Se você abrir o DevTools (F12) na aba Rede, vai ver exatamente esse fluxo de chamadas reais:

#### Geocodificação: endereço para coordenadas

```bash
curl "https://nominatim.openstreetmap.org/search?q=Curitiba&format=json&limit=5&countrycodes=br&addressdetails=1"
```

```json
[
  {
    "lat": "-25.4284",
    "lon": "-49.2733",
    "display_name": "Curitiba, Paraná, Região Sul, Brasil"
  }
]
```

#### Roteirização: coordenadas para rota

O OSRM recebe os pontos e devolve a linha da estrada, a distância em metros e a duração em segundos:

```bash
curl "https://router.project-osrm.org/route/v1/driving/-49.2733,-25.4284;-54.5648,-25.5483?overview=full&geometries=geojson"
```

```json
{
  "routes": [
    {
      "geometry": {
        "coordinates": [
          [-49.2733, -25.4284],
          [-49.2801, -25.4302]
        ]
      },
      "distance": 632584.7,
      "duration": 26041.2
    }
  ]
}
```

#### Consulta de preços: geohash para postos

Cada ponto da amostragem é convertido em um **geohash** de precisão 12. Isso garante que a consulta na API do governo seja cirúrgica, protegendo a precisão sem expor coordenadas brutas:

```bash
curl "https://menorpreco.notaparana.pr.gov.br/api/v1/produtos?local=6gkzwgjzn820&raio=20&data=3&ordem=0&tp_comb=1"
```

*Os parâmetros indicam o geohash (`local`), o raio de 20km (`raio`), as últimas 24h (`data=3`) e o tipo de combustível (`tp_comb=1` para gasolina).*

## O que a ferramenta entrega

Você pode testar agora em [combustivel.bayer.ooo](https://combustivel.bayer.ooo). Quando você joga o trajeto na tela, o app desenha a rota e lista os postos em ordem de preço, proximidade ou atualização. Cada item traz o valor do litro, o endereço, o horário da última nota emitida e botões diretos para abrir no Google Maps ou Waze.

Se a rota passar fora do Paraná ou de Pernambuco — os únicos estados que abrem esses dados atualmente —, o app exibe um aviso amigável de cobertura reduzida, evitando que o usuário ache que o sistema quebrou.

## Resultado e Aprendizado

A maior lição desse projeto não foi sobre código, mas sobre **UX**. Às vezes, o valor de um produto não está em criar um dado novo, mas em mudar a forma como o usuário interage com o dado que já existe. A tecnologia estava lá, o que faltava era o contexto adequado para quem está na estrada.

Consegui testar a ferramenta na prática em uma viagem para Foz do Iguaçu durante o Carnaval. A paz de espírito de saber exatamente em qual cidade parar para aproveitar uma diferença de R$ 0,30 por litro pagou cada hora de desenvolvimento.

O projeto provou que, com as APIs certas e a pergunta correta, dá para transformar a ansiedade de um tanque vazio em uma interface limpa, rápida e extremamente útil.
