---
name: list-blog-posts
description: Use when an agent needs to discover technical articles published on bayer.ooo.
---

# List blog posts

Fetch `https://bayer.ooo/blog` with `Accept: text/markdown`.
The response contains article titles, excerpts, tags, and canonical URLs.
Prefer the canonical URLs returned by the index and do not guess slugs.
