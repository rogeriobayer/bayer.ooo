---
title: "The best AI model right now has a first and last name"
slug: best-ai-opensource-june
date: 2026-06-04T10:00:00.000Z
lang: en
excerpt: "Two months testing open-source models on OpenCode for $5/month — and one clear winner emerged."
tags:
  - ai
  - open-source
  - deepseek
  - opencode
  - review
cover: /blog/best-ai-opensource-june.png
author: Rogério Bayer
---

For the past two months, I've been deep into the **$5 OpenCode plan**, testing the best of what the open-source model ecosystem has to offer. The idea was simple: how far can you go on a cheap plan? The answer surprised me — and one model stood clearly above the rest.

Before getting to the champion, it's worth going through the other candidates I tested, because context matters.

## The models I tested

### Kimi K2 / 2.6 — Pricey now
Very capable, especially for creative tasks, frontends, and visual identity design. It could create designs with real personality. The problem is that the promotion giving 3× standard usage has ended, and subscribing directly to Kimi costs $20/month. The free version via the OpenRouter API uses a quantized model with slow TPM and performance well below the original. No longer worth it in the current setup.

### MiniMax M3 — Disappointing
Launched at the end of May with lots of benchmark hype, but the raw results don't match. It was free for a few days on OpenCode, but performance fell below smaller, cheaper models. A simple task with sub-agents took over an hour and delivered mediocre results. It still needs a lot of optimization.

### GLM 5 / 5.1 — Powerful, but slow
A good option when the task is well refined by a larger model like Claude or ChatGPT. It delivers accurate responses, but it's sluggish — and the maximum usage through the OpenCode API is quite limited. It ends up with the same problem as Kimi 2.6: limited usage available.

### QwQ 3.7 / 3.7+ — Good, with caveats
Solid model, especially the 3.7+, but it tends to stall on more creative tasks. I tried building some frontends with the 3.6 and it placed components in the wrong spots, struggled with CSS, and generated generic results where creativity and color sense were needed. For logic and structured code, it does well. For design, not so much.

### 🏆 DeepSeek V4 Flash — Champion of the month
Fast, cheap, gets the job done. I worked extensively with it both through OpenCode and DeepSeek's own API, and I couldn't break the $2 barrier — even after spending nearly 5 million tokens. The cache cost is negligible. You can use it as an API on your own site, run it in the background, create endpoints — all very cheap. The only weak point is web search: you need to provide external tools like Tavily or Max AI. But for solving direct problems, especially one at a time, it's extremely efficient.

The **DeepSeek V4 Pro** solves more things than the Flash, but it's substantially more expensive and the difference isn't worth it in most cases. The Flash alone already delivers tremendous value.

> **Tip for next month:** I want to try using DeepInfra instead of the OpenCode API for some models, like Kimi 2.6 and MiniMax. It might be cheaper than subscribing to individual $20 plans.

## Plans that aren't worth it (for now)

For those tempted to subscribe directly to the platforms, here's what each charges monthly — and why I prefer to keep everything inside the $5 OpenCode plan:

| Plan | Price | Verdict |
|------|-------|---------|
| MiniMax Code | $20/month | Not worth it given the current M3 performance. Wait for optimizations. |
| Kimi Coding | $19/month | The model is capable, but expensive for the usage volume you get. |
| GLM Lite | $18/month | $18 from the 2nd month onward. Too slow for the price charged. |

All the usage I described here was within the $5 OpenCode plan. The only exception is DeepSeek, which I also used directly through their API — and even then, I never reached $2 in spending. It's hard to beat this cost-benefit ratio.

If you have a well-defined task and want an open-source model that delivers fast, cheap, and without drama: **DeepSeek V4 Flash is the name of the moment.**
