---
title: "Taste Skill: An Anti-Slop Frontend Framework Worth Trying With Your Agent Stack"
slug: taste-skill
date: 2026-06-29T10:00:00.000Z
lang: en
excerpt: "Testing Taste Skill across GPT-5.5 and DeepSeek V4 Pro — a SKILL.md framework that pushes AI coding agents toward intentional, non-templated design instead of generic AI slop."
tags:
  - ai
  - frontend
  - design
  - taste-skill
  - review
cover: /blog/taste-skill.png
author: Rogério Bayer
---

If you've spent any time generating UI with AI coding agents, you already know the problem: everything starts to look the same. Same hero section, same card grid, same gradient blob in the corner. It's not that the agents are bad at code, it's that they default to the most statistically average layout they've seen, over and over again.

That's exactly the gap **Taste Skill** is trying to close. It's an open-source SKILL.md framework — a set of files that plug into agentic coding tools like Cursor, Claude Code, Codex, Gemini CLI, v0, Lovable, OpenCode, and more — and push them toward intentional, non-templated design instead of generic AI slop. Installation is a single command (`npx skills add Leonxlnx/taste-skill`), and from there the skill injects design rules directly into your agent's workflow: brief inference, design-system mapping, dark mode parity, redesign protocols, and a hard pre-flight checklist the agent has to honestly pass before it's allowed to ship anything.

## My testing setup

I wanted to see how this behaved outside the "happy path" of Claude Code, so I ran it through Codex on two very different backends: GPT-5.5 and DeepSeek V4 Pro. Both models were able to pick up the SKILL.md file, follow the structure, and return usable, coherent output. That's not a small thing — a lot of these prompt-engineering frameworks are quietly tuned for one specific model family and fall apart the moment you swap the underlying LLM. Taste Skill held up reasonably well across both, which says more about how the rules are written than about any single model's raw capability.

## The image generation angle

One thing that surprised me is that Taste Skill isn't only about code output. There are dedicated skills for generating design reference images before any implementation starts — `imagegen-frontend-web`, `imagegen-frontend-mobile`, and `brandkit` — which produce premium-looking reference shots, multi-screen mobile flows, and brand-kit mockups (logos, color systems, typography) up front. The idea is to anchor the agent on a strong visual direction before it touches a single component, instead of letting it improvise the aesthetic mid-generation. It's a nice workflow: generate the reference, lock the direction, then implement against it.

## Soft-skill is my favorite so far

Out of the whole collection, the one I keep coming back to is **soft-skill** — the visual-style variant aimed at calm, expensive-looking interfaces: softer contrast, generous whitespace, smooth motion. The prompt behind it is genuinely heavy. It reads less like a style guide and more like a full creative-direction brief for a UI architect persona, with explicit mandates around spatial rhythm, micro-interactions, and never repeating the same layout twice in a row. That density is exactly why it works — it gives the agent enough constraints to stop defaulting to the generic Bootstrap-card look, without locking it into one rigid template.

In practice, this rewrite-heavy approach pairs really well with harnesses like OpenCode and Codex, where the SKILL.md file effectively becomes the agent's design conscience for the whole session. Instead of nudging the model toward "nicer" UI on every prompt, you load the persona once and the constraints just persist through the rest of the build.

## Worth installing?

If your AI-generated frontends keep coming out looking like every other AI-generated frontend, Taste Skill is worth the five minutes it takes to install. It won't replace having an actual design sense, but it gives your agent enough opinionated structure to stop reaching for the same five layouts every time — and the fact that it held up across both GPT-5.5 and DeepSeek V4 Pro in my tests is a good sign it's not just a one-model trick.
