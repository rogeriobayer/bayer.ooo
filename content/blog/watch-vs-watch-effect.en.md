---
title: "Vue 3: watch vs watchEffect — Which One to Use in the Composition API?"
slug: "watch-vs-watch-effect"
date: "2026-05-07T10:00:00.000Z"
lang: "en"
excerpt: "Discover the practical differences between watch and watchEffect in Vue 3's Composition API, and learn exactly when to use each one to avoid bugs and improve performance."
tags: ["vue", "javascript", "composition-api"]
cover: "/blog/vue-effect.png"
author: "Rogério Bayer"
---

If you've started exploring the Vue 3 **Composition API**, you've definitely come across these two functions. At first glance, `watch` and `watchEffect` seem to do the same thing: they observe a change and react to it.

But in practice, they have very different personalities. Choosing the wrong one won't break your code, but it can give you headaches with performance or unexpected behaviors.

---

## watchEffect: The Smart (and a bit eager) Watcher

`watchEffect` is for those who like convenience. You hand it a function, and Vue automatically "tracks" everything reactive inside it. If you used a variable inside the block, Vue understands it needs to run that code again when that variable changes.

### Why use it?
It's excellent when you have multiple dependencies or want something to happen **immediately** as soon as the component is mounted.

```javascript
// It runs right away!
watchEffect(() => {
  console.log(`Fetching data for ID: ${userId.value}`)
  // Vue automatically notices the dependency on userId
})
```

*   **Pro:** Less code. You don't need to list dependencies manually.
*   **Caveat:** It's "hungry". Any reactive variable you touch inside it becomes a dependency, which can cause unnecessary re-runs if you're not careful.

---

## watch: The Meticulous Watcher

`watch` is more conservative and precise. You need to tell it exactly what to watch. Unlike its eager "sibling", `watch` is **lazy**: it doesn't run on component creation, only when the monitored source actually changes.

### The big advantage: Before and After
`watch` gives you access to the old value (`oldValue`), something `watchEffect` doesn't do. This is crucial for comparison logic.

```javascript
watch(count, (newValue, oldValue) => {
  if (newValue > oldValue) {
    console.log("The number went up!")
  }
})
```

*   **Pro:** Total control. You decide exactly what triggers the effect.
*   **Caveat:** If you need it to run right away, you'll have to pass a configuration object: `{ immediate: true }`.

---

## Which one to choose? The Quick Guide

To stop guessing, think like this:

| Scenario | Use... |
| :--- | :--- |
| I need to compare the new value with the old one. | **watch** |
| I want the code to run as soon as the app loads. | **watchEffect** |
| I have 3 or 4 variables influencing the same effect. | **watchEffect** |
| I want to avoid the effect running unnecessarily. | **watch** |
| I'm doing a simple `fetch` based on an ID. | **watchEffect** |

---

## A detail no one tells you

Both accept a magic function called `onCleanup`. It's used to "clean up the mess" before the effect runs again. Imagine you started a `setTimeout` or an API request; if the variable changes before it finishes, you use cleanup to cancel the previous operation and not overload the browser.

At the end of the day, **watch** is your precision tool (surgical), while **watchEffect** is your convenience tool (automatic).

In doubt? Start with `watch`. Having explicit control over what makes your code run usually avoids hard-to-track bugs in the future.

Which one have you been using more in your recent projects?
