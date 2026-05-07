---
title: "Radios Lite Monorepo Architecture: Core, Overrides and Domains"
slug: "radios-lite-monorepo-arquitetura"
date: "2026-05-05T10:00:00.000Z"
lang: "en"
excerpt: "How the Radios Lite project adopts a domain-based monorepo architecture with a shared core and per-country overrides, ensuring scalability and centralized maintenance."
tags: ["architecture", "monorepo", "extensions", "domains"]
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
author: "Rogério Bayer"
---

Every project that branches into multiple variants — in the case of Radios Lite, browser extensions for different countries — eventually faces the divergence dilemma. Bug fixes multiply, releases become unpredictable, and the cognitive cost of maintaining N separate codebases rises exponentially. The solution adopted in the Radios Lite monorepo is not a new invention, but a disciplined application of well-established architectural patterns.

## The Domain Model

The fundamental decision was to split the project universe into two clearly defined domains: the **generic domain** (the shared core) and the **specific domains** (country variants). This mapping closely follows Domain-Driven Design principles, where each country is treated as a subdomain with its own rules, but inherits invariants from the root domain.

The core, called `radios-core`, encapsulates everything invariant: the extension lifecycle, offscreen audio management, popup and settings interfaces, and runtime utilities. It is deliberately neutral — it knows nothing about Canada, Mexico, or Brazil. This neutrality is intentional. The less the core assumes about its consumers, the more stable it becomes.

## The Override Strategy

Country variants do not rewrite the core. They complement it through a pattern that combines **Template Method** with **Strategy**. The core defines the behavior skeleton (the template), and each country injects, via overrides, only the variable parts: manifests, visual assets, radio catalogs and, most importantly, declarative text and behavior configurations.

This declarative configuration layer is what allows the same popup, settings, background and offscreen code to serve all countries without modification. Each variant declares, in a single configuration file, its localized strings, supported languages and behavioral particularities. The core consumes this configuration at runtime, adapting to context without knowing in advance who is consuming it.

## The Pipeline as a Contract

The build process is not just packaging — it is the **guardian of architecture**. The pipeline copies the core and applies overrides on top, respecting a strict rule: certain core files are non-overridable. If a country variant tries to introduce its own `settings.js`, `popup.html`, `background.js` or `offscreen.js`, the build fails. This behavior is a form of **restrictive architecture**: the system mechanically prevents code organization from degrading over time.

This check is performed by a workspace health check that validates structure, syntax and, above all, the contract between core and variants. Broken contracts are caught before they ever reach a commit.

## Adaptation and Scalability

When the need arises to add a new country, the work is essentially declarative: create an application folder, define differences in the configuration file, keep overrides to the absolute minimum and run the release. The core does not need to be touched. This drastically reduces time-to-market for new regions and eliminates regression in shared code.

This model is a practical application of the **Open/Closed Principle**: the core is closed to modification, but open to extension via configuration and controlled overrides. Scalability does not come from added complexity, but from well-chosen constraints.

## Practical Lessons

The Radios Lite architecture demonstrates that monorepos only work when there is a clear separation of concerns and mechanisms that prevent silent violations. Letting every team or variant freely modify the core is a sure path to divergence. Architectural discipline, enforced via build tools and health checks, ensures that the model's simplicity is preserved even as the number of variants grows.

In the end, the most important decision was not technical — it was domain modeling. Choosing what belongs to the core and what belongs to each country's bounded context alone defines the project's long-term health.
