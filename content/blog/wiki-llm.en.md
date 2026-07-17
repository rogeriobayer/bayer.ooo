---
title: "Wiki LLM: how to create a permanent memory for AI inside your project"
slug: wiki-llm
date: 2026-07-17T10:00:00.000Z
lang: en
excerpt: "Tools like Claude Code, Cursor, and Codex can analyze code, build features, and explain complex architectures. But the context built during a conversation disappears when the session ends. A Wiki LLM solves this by creating a permanent knowledge base for AI."
tags:
  - llm
  - ai
  - architecture
  - documentation
  - best-practices
cover: /blog/wiki-llm.png
author: Rogério Bayer
---

## The problem Wiki LLM solves

Tools like Claude Code, Cursor, and Codex can analyze code, build features, and explain complex architectures. But there's a limitation that shows up early: the context built during a conversation disappears when the session ends. Next time, you explain everything all over again. The project decisions, the adopted patterns, the technical constraints, the reason why that integration works in that specific way.

As the system grows, this process becomes slow and error-prone. The AI proposes approaches the team has already discarded. It suggests libraries that aren't in the stack. It doesn't know that endpoint has a concurrency limitation that caused a production incident.

A Wiki LLM attempts to solve this problem by creating a permanent, structured knowledge base maintained with the help of the artificial intelligence itself.

## What it is and how it's organized

Instead of relying on conversation history, the agent consults a local wiki with information about architecture, business rules, technical decisions, integrations, incidents, and lessons learned during development. These are Markdown files stored inside or near the repository.

A possible structure would be:

```
project-wiki/
├── raw/                    # original sources: documents, meetings, specs
├── wiki/                   # knowledge synthesized by the AI
│   ├── architecture/
│   │   features/
│   ├── business-rules/
│   ├── decisions/
│   └── troubleshooting/
├── index.md
├── log.md
└── AGENTS.md
```

The **raw** folder stores original sources unmodified. The **wiki** folder contains knowledge organized by the agent in smaller, connected pages. The **AGENTS.md** file defines how the AI should work with this base: when to create pages, how to record sources, and which files cannot be altered.

The difference from regular documentation is that the wiki is written with the reader in mind, whether a developer or an AI agent. An architectural decision isn't just recorded: it's accessible, referenced, and connected to other relevant pages.

## What changes in practice

Imagine the team decided to use React Query to control the application's remote state. With a wiki, this becomes a page at `wiki/architecture/server-state.md` explaining the decision, the usage rules, and why other approaches were discarded. Next time an agent implements a feature that fetches API data, it checks this page before proposing to store the response in Redux.

The same goes for incidents. If a payment integration broke because that API doesn't accept concurrent requests, the incident can become a page at `wiki/troubleshooting/concurrent-payment-requests.md` with symptoms, cause, solution, and how to prevent it from happening again. When an agent works on that integration in the future, the history is available.

This changes the kind of work the AI does. Instead of treating each task as an isolated conversation, the agent starts working with a shared memory of the project. It doesn't just generate technically functional code. It generates something closer to the product's actual standard.

## Where it makes the biggest difference

The wiki tends to be most useful in specific contexts.

**In legacy projects**, where important rules exist only in the memories of senior developers, an agent can analyze the code and create pages that document existing behavior incrementally. Each task performed in the system also improves the documentation available for future tasks.

**In systems with complex business rules**, financial products, recruitment platforms, ERPs, healthcare tools, the rules are scattered across code, tickets, spreadsheets, and conversations. A wiki allows consolidating this into domain-specific pages. Before implementing a change to the subscription cancellation flow, the agent can check the registered rules.

**In projects with multiple agents**, the wiki works as a central context point. When different agents work on code writing, test creation, and security review, they all consult the same decisions and limitations before executing tasks.

**In onboarding**, whether for people or new agents analyzing the repository for the first time, the wiki offers a structured reading path instead of relying on whoever is available to explain.

## How to keep it updated

Creating the wiki is the first step. The real challenge is preventing it from aging.

The workflow can be divided into three operations. **Ingestion** happens when a new source is added: a specification, an incident report, an architecture decision. The agent analyzes the material, creates necessary pages, and updates existing ones. **Query** happens when someone needs an answer using the wiki, and good answers can become new pages when they represent useful analysis for the future.

The third operation is a **periodic review** of the wiki itself: broken links, pages without sources, contradictory information, outdated content, decisions superseded by newer versions. This can be executed during pull requests or at intervals defined by the team.

The **AGENTS.md** file defines these rules explicitly:

```markdown
Before implementing any feature:
1. Consult index.md and search for pages related to the feature.
2. Read relevant architectural decisions.
3. Check known incidents and regressions.

After completing a task:
1. Update pages affected by the change.
2. Register new business rules or important decisions.
3. Add issues found to troubleshooting.

Never alter files inside raw/.
Every important statement must point to a traceable source.
```

## What it doesn't replace

The wiki works as an organizing layer over the original sources, not as a replacement. Official documentation, API contracts, code, and tickets continue to exist. The wiki connects and synthesizes this information.

AI-generated content should also not be treated as truth without review. Critical decisions, financial rules, legal requirements, and security configurations need to go through the team before becoming permanent references. The wiki's role is to expand access to knowledge, not to eliminate the responsibility of those who understand the system.

## When it's not worth it

Small projects, quick experiments, or applications with few rules probably don't need this structure. Maintaining a wiki has a real cost: you need to review pages, update information, and fix inconsistencies. For a disposable prototype, a well-written README.md suffices.

The wiki tends to justify the investment when the project has a long lifespan, multiple developers, complex architecture, many business rules, legacy systems, or intensive use of AI agents. In these cases, the difference between an agent that knows the system's history and one that starts from zero every session is significant.

## Where to start

You don't need to set up a complete structure from the beginning. A first version can be simple:

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

As the volume of information grows, pages split into categories. The most important thing is the flow: the agent consults before working, records what it learns, and the team validates what enters as a permanent reference.

The value is not in the size of the wiki, but in the consistency with which it is used.
