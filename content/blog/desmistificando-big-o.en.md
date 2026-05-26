---
title: "What You Need to Know by Heart About Big O"
slug: desmistificando-big-o
date: 2026-05-26T10:00:00.000Z
lang: en
excerpt: "A practical and straightforward guide to understanding Big O notation, analyzing algorithm efficiency, and developing the coding intuition that scales without mathematical complications."
tags:
  - algorithms
  - big-o
  - computer-science
  - javascript
  - performance
cover: /blog/desmistificando-big-o.png
author: Rogério Bayer
---

If you're in the software development world, you've definitely come across the expression **Big O**. For those just starting out, or even for those who have been coding for a while, this concept usually seems like a seven-headed monster full of mathematical formulas.

But the truth is that Big O is not about complex mathematics. It's about **scale and context**.

- - -

## What is Big O notation, after all?

Big O is simply the language we use to talk about **how fast a function slows down as the volume of data increases**.

Instead of measuring code performance in seconds — which would be unfair, since your friend's computer might be a supercomputer and yours isn't — Big O measures **algorithmic efficiency** by counting the number of steps or operations the computer needs to take.

The golden rule is simple: the less your code slows down when the data volume grows, the more scalable it is.

- - -

## The Three Most Common Types in Everyday Life

To understand the concept, you only need to master three scenarios that cover the vast majority of code we write on a daily basis:

### 1. O(1) – Constant Time (Excellent)

It doesn't matter if your database has 1 item or 1 million: the number of operations is always the same. It's a perfectly straight line on the graph.

* **Practical example:** Getting the first element of an array or reading a property from an object. The computer goes straight to the memory address and resolves it in 1 step.

```javascript
function getFirstItem(list) {
  return list[0] // Always takes 1 step, no matter the list size
}
```

### 2. O(n) – Linear Time (Fair)

The number of operations grows in the same proportion as the number of inputs. If the array grows, the time grows along with it in a predictable way.

* **Practical example:** A simple loop (like a `for` or `forEach`) looking for a specific item in an unordered list.

```javascript
function findItem(list, target) {
  list.forEach(item => {
    if (item === target) console.log("Found")
  })
}
```

### 3. O(n²) – Quadratic Time (Avoid if possible)

This is where things get tricky. The number of operations grows exponentially relative to the data size. If your list doubles in size, your code becomes four times slower.

* **Practical example:** Two nested loops (one inside the other), where each element needs to be compared with all others in the same list.

```javascript
function findDuplicates(list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (i !== j && list[i] === list[j]) return true
    }
  }
}
```

- - -

## The Big O Survival Guide (The 4 Basic Rules)

To analyze any function without needing to rack your brain, keep these practical rules extracted from the playbook of the best bootcamps:

* **Rule 1: Always look at the worst-case scenario:** If you're searching for a string in a list, Big O assumes it's in the last position or not there at all.
* **Rule 2: Drop the constants:** Code that takes `O(2n)` steps is simplified to just `O(n)`. Small details don't matter when we're talking about massive scale.
* **Rule 3: Different inputs require different variables:** If your function receives two separate arrays and loops through each one, the Big O is `O(a + b)`. If the loops are nested, it becomes `O(a * b)`.
* **Rule 4: Focus on the dominant term:** If a function has a simple loop `O(n)` and then a double loop `O(n²)`, the total Big O of that function is just **O(n²)**. We drop the non-dominant terms because, at the scale of millions of data points, the simple loop becomes insignificant next to the damage caused by the double loop.

- - -

## Completing the Map: The Other Big O Types

For your mental map to be 100% complete, there are three more types that appear frequently in more complex algorithms and data structures:

### O(log n) – Logarithmic Time (Very Good)

This is the famous "divide and conquer" pattern. With each step your algorithm takes, the problem size is cut in half. It's a curve that grows very slowly, making it extremely efficient for large volumes of data.

* **Practical example:** **Binary Search**. In an already sorted phone book, you open exactly in the middle. If the name you want is before that point, you discard the entire right half and repeat the process with what remains.

### O(n log n) – Linearithmic Time (Good)

This is the time spent by the most efficient sorting algorithms on the market. It happens when you need to divide a problem into logarithmic parts `O(log n)` and, for each of these divisions, you need to process the data linearly `O(n)`.

* **Practical example:** Modern sorting algorithms like **Merge Sort** and **Heapsort**.

### O(2^n) – Exponential Time (Terrible)

The opposite of logarithmic. Here, for each new element added to your input, the number of computer operations **doubles**. The graph shoots up like a vertical rocket. Algorithms like this crash the browser or server with frighteningly small inputs (like 40 or 50 items).

* **Practical example:** Simple recursive algorithms for calculating the Fibonacci sequence without optimization (memoization).

- - -

## The Golden Tip from the Big O Cheat Sheet

If you want a quick cheat sheet for reference or to stick next to your monitor while studying for technical interviews, the folks at **bigocheatsheet.com** summarize algorithm performance in a universal color ranking:

* 🟢 **Excellent:** `O(1)` and `O(log n)`
* 🟡 **Good / Fair:** `O(n)`
* 🟠 **Bad:** `O(n log n)`
* 🔴 **Horrible:** `O(n²)`, `O(2^n)` and `O(n!)`

### What causes complexity in your code?

To put this to rest, remember that complexity can be of **Time** (CPU working) or **Space** (Allocated RAM memory).

* **What consumes Time:** Basic mathematical operations, comparisons (`===`), loops (`for`, `while`) and external function calls.
* **What consumes Space:** Creating new variables, additional data structures (like auxiliary arrays or objects) and stacking function calls (Call Stack) in recursion.

Understanding Big O isn't about you calculating perfect scopes on paper during your day-to-day, but rather about developing **code intuition**. When designing an architecture or creating a method on the frontend, you start to glance at the structure and immediately understand whether that logic will hold up when the volume of real data starts to scale.
