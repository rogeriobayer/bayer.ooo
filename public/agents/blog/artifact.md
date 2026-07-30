# What Exactly Is an Artifact?
- Author: Rogério Bayer
- Date: Thu Jul 30 2026 07:00:00 GMT-0300 (Brasilia Standard Time)
- URL: https://bayer.ooo/blog/artifact
- Languages: en, fr, pt
- Tags: claude, ai, artifacts, prototyping
- Excerpt: One question I keep getting from non-technical people lately, mostly because of Claude: what exactly is an artifact?
---
One question I keep getting from non-technical people lately, mostly because of Claude: what exactly is an artifact?

It comes up because Claude can generate something that looks exactly like a working product. You type a prompt, and seconds later there is a fully styled interface on your screen. You can click buttons, fill forms, see data update in real time. It feels real because visually it is.

## What an Artifact Actually Is

An artifact is self-contained code, usually HTML, CSS and JavaScript, that runs directly in your browser without any server behind it. Claude generates it on the spot and renders it right there in the conversation. No setup, no deployment, no waiting. You describe what you want and it appears.

That is what makes artifacts useful. They are the fastest way to prototype an idea, test a layout, explore an interaction, or explain a concept visually. A calculator, a color palette tool, a data visualization, a form mockup, a simple game: artifacts handle all of that well. Some can even store small amounts of data locally in your browser, so certain things persist between sessions.

## The Important Distinction

But they are not websites. That distinction matters more than it sounds. A real hosted website lives on a server with a domain that anyone can access. It stores data in a way that works across devices and users. It handles authentication, payments, emails, file uploads. It scales. It stays up when you close your laptop. None of that exists in an artifact by default.

The confusion is understandable because the output looks finished. But there is a gap between something that renders correctly in a browser and something that is actually deployed and ready for real users. Artifacts deliberately skip that infrastructure to stay fast and simple. That is a feature, not a limitation, as long as you know what you are working with.