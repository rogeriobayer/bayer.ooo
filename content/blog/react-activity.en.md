---
title: "React <Activity>: When Hiding Is Not the Same as Unmounting"
slug: react-activity
date: 2026-07-02T10:00:00.000Z
lang: en
excerpt: React 19.2 introduced the <Activity> component, which lets you hide and
  restore UI and internal child state without unmounting them. Learn when to use
  it, when to avoid it, and why it changes how we think about visibility in
  React.
tags:
  - react
  - javascript
  - activity
cover: /blog/react-activity.png
author: Rogério Bayer
---

For years, hiding a component in React meant one thing: removing it from the DOM. Conditional rendering with `{condition && <Component />}` is the pattern every React dev learns from the first tutorial. It works. The problem is that "works" here has a hidden cost: when you remove the component, you destroy its state along with it.

Switching tabs in a dashboard? The scroll resets to the top. A partially filled form? Lost. A playing video? It stops, rebuffers, and starts over when the user comes back. For years, the workarounds were ugly: move everything to Zustand or Redux, use portals with `display: none`, install libraries like `react-activation`. They all work, and they all make you feel like you're fighting the framework.

React 19.2, released in October 2025, brought a native answer: the `<Activity>` component, which lets you hide and restore UI and internal child state without unmounting them.

- - -

## The API is straightforward

```jsx
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <VideoPlayer />
</Activity>
```

When `mode="hidden"`, React renders the component in the background with the lowest possible priority. The component stays fully rendered, but with `display: none`. Effects don't run. And when the mode switches back to `"visible"`, the component appears instantly, without re-rendering.

- - -

## Looks like Vue's `v-show`?

Yes, and not by accident. The idea is to keep sections of the UI rendered but inactive, rather than removing them completely. Vue's `v-show` has been doing exactly this for years: toggling `display: none` instead of unmounting, preserving the component's local state. Anyone coming from Vue already knows this behavior by heart.

The difference is that `<Activity>` goes beyond CSS. It operates within React's fiber priority system, so hidden trees never block visible content. When hidden, Effects are torn down (with cleanup), but React state and the DOM are preserved. When it becomes visible again, Effects run again. It's as if the component was paused, not destroyed.

Another thing `v-show` doesn't cover: `<Activity>` lets you pre-render components in the background before the user needs them. Images, styles, and other resources are loaded ahead of time, so when the component becomes visible, everything appears instantly.

- - -

## Where it makes sense

The most obvious use case is tabs with state. A dashboard where users switch between tabs and expect everything to be where they left it, without reloading data, losing scroll position, or resetting filters. A video player where playback position must be preserved. A long form that gets temporarily hidden while the user navigates to another section and comes back.

`<Activity>` also plays a role in selective hydration with SSR. Less critical parts of the page can hydrate with lower priority, letting the main content become interactive faster. This is especially useful on heavy pages where not everything needs to be ready at the same time.

- - -

## Where it doesn't pay off

Not every show/hide case needs `<Activity>`. If the component has no meaningful state to preserve, regular conditional rendering is simpler and cheaper. Keeping a component in the DOM has a memory cost: React is holding onto that tree, that DOM, that data. Doing this with twenty simultaneous tabs or long lists of hidden items can become a memory problem before it becomes a performance solution.

Also pay attention to tags like `<video>` and `<audio>`: since the DOM isn't destroyed when the component becomes `hidden`, these elements keep playing in the background unless you add cleanup in your Effects. The API doesn't do this automatically.

Another scenario where `<Activity>` doesn't help: components that need to fetch fresh data every time they become visible. If the user returns to a tab and you want to guarantee the data is up to date, preserving state might be the opposite of what you need. In that case, traditional conditional rendering, which unmounts and remounts, remains the right choice.

- - -

## The real point

`<Activity>` separates visibility from component lifetime. That distinction seems small, but it's the one React has been missing for years. Anyone who has ever lost component state on a tab toggle, a closing modal, or a collapsing drawer knows exactly what this solves.

It's not the flashiest feature in React 19.2. But it's one of the most practical. And for those who already knew `v-show` in Vue, it feels like a colleague who finally reached the same conclusion, just a little later.
