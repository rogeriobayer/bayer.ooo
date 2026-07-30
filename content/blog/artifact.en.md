---
title: "What Exactly Is an Artifact?"
slug: artifact
date: 2026-07-30T10:00:00.000Z
lang: en
excerpt: "Artifacts look like finished products — clickable, styled, instant. But self-contained code that runs in your browser is not the same as a deployed website, and the difference matters."
tags:
  - claude
  - ai
  - artifacts
  - prototyping
cover: /blog/artifact.png
author: Rogério Bayer
---

One question I keep getting from non-technical people lately, mostly because of Claude: what exactly is an artifact?

It comes up because Claude can generate something that looks exactly like a working product. You type a prompt, and seconds later there is a fully styled interface on your screen. You can click buttons, fill forms, see data update in real time. It feels real because visually it is.

## What an Artifact Actually Is

An artifact is self-contained code, usually HTML, CSS and JavaScript, that runs directly in your browser without any server behind it. Claude generates it on the spot and renders it right there in the conversation. No setup, no deployment, no waiting. You describe what you want and it appears.

That is what makes artifacts useful. They are the fastest way to prototype an idea, test a layout, explore an interaction, or explain a concept visually. A calculator, a color palette tool, a data visualization, a form mockup, a simple game: artifacts handle all of that well. Some can even store small amounts of data locally in your browser, so certain things persist between sessions.

## The Important Distinction

But they are not websites. That distinction matters more than it sounds. A real hosted website lives on a server with a domain that anyone can access. It stores data in a way that works across devices and users. It handles authentication, payments, emails, file uploads. It scales. It stays up when you close your laptop. None of that exists in an artifact by default.

The confusion is understandable because the output looks finished. But there is a gap between something that renders correctly in a browser and something that is actually deployed and ready for real users. Artifacts deliberately skip that infrastructure to stay fast and simple. That is a feature, not a limitation, as long as you know what you are working with.
