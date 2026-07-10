---
title: "Hash Tables in JavaScript: the structure that can save you in a technical interview"
slug: hash-tables
date: 2026-07-10T10:00:00.000Z
lang: en
excerpt: "Understand how hash tables work, when to use them over other data structures, and how they turn O(n²) interview problems into clean O(n) solutions with JavaScript's Map, Set, and plain objects."
tags:
  - javascript
  - algorithms
  - data-structures
  - hash-tables
  - computer-science
  - performance
cover: /blog/hash-tables.png
author: Rogério Bayer
---

There is a specific moment in a technical interview that most developers recognize. You solve the problem. It works. Then the interviewer asks: "can you do better?" And the answer, more often than not, involves a hash table.

The reason is not that hash tables are clever. It is that they solve a very specific and very common problem: you are searching through a collection repeatedly, and every search costs O(n). Put that inside a loop and you have O(n²). Replace the inner search with a hash table lookup and the whole algorithm becomes O(n). That is usually the optimization the interviewer is waiting for.

- - -

## How it works

A hash table converts a key into an array address using a hash function. The same key always maps to the same address, so both reads and writes cost O(1) regardless of how much data is stored. There is no scanning, no comparing, no iterating. You compute the address and go directly to the data.

The hash function processes each character of the key using its numeric code, multiplies by position, and uses modulo to stay within the array bounds:

```javascript
js_hash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * i) % this.data.length;
  }
  return hash;
}
```

With enough data and a fixed number of slots, two different keys will eventually produce the same address. That is a collision. The standard fix is storing a list at each slot instead of a single value, so collisions just add to the list. You still arrive at the right slot in O(1) via the hash, then scan a short list for the exact key. With a large array and a decent hash function, those lists stay small enough that the cost stays effectively constant.

- - -

## How hash tables compare to other structures

Each structure has a job. The mistake is reaching for the familiar one instead of the right one.

* **Array:** O(1) access by index, O(n) search by value. Fast when you know the position. Slow when you are searching by content.
* **Linked list:** flexible insertion and deletion at known positions, but always O(n) to find a value. No shortcut to a specific element.
* **Binary search tree:** O(log n) search, and data stays sorted. Better than O(n), worse than O(1). The real advantage is ordered traversal and range queries, things a hash table cannot do.
* **Heap:** O(1) access to the minimum or maximum value, O(log n) insertion. The right choice when you need the extreme value repeatedly from a changing dataset.
* **Hash table:** O(1) lookup by key. No ordering, extra memory cost, but nothing beats it for point lookups.

The signal for a hash table is specific: you need fast lookups by key, you do not need ordering, and trading memory for speed makes sense in context.

- - -

## The interview pattern

Most problems where hash tables help follow the same shape. You have data you need to reference as you move through a collection. Instead of going back and searching each time, you store what you have already seen and check it in O(1).

Two Sum is the example that comes up most. The naive approach checks every pair of numbers, which is O(n²). With a hash table, you walk through the array once. For each number, you check if its complement already exists in the table. If it does, you found the pair. If not, you store the current number and keep going.

```javascript
function twoSum(nums, target) {
  const seen = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen[complement] !== undefined) return [seen[complement], i];
    seen[nums[i]] = i;
  }
}
```

One pass. Done. Frequency counting, duplicate detection, grouping by property: the same structure applies to all of them.

In JavaScript, `Map` and `Set` are the native implementations. `Map` preserves insertion order and accepts any type as a key, not just strings. `Set` stores unique values with O(1) existence checks via `has()`. A plain object covers most cases but has edge cases around key types and prototype properties. Knowing which one fits is part of writing intentional code, not just working code.

- - -

## When not to reach for it

Hash tables trade memory for speed. In most interview problems that trade is fine. In production systems with tight memory budgets, it is a real cost.

They also fall short when the problem needs ordering. If you need sorted traversal, a binary search tree fits better. If you need the minimum or maximum from a changing dataset, use a heap. Hash tables are fast at point lookups. Range queries and ordering are not what they are built for.

The pattern to watch for in interviews is a loop with an inner search. When you see that, there is a good chance one pass with a hash table gets you to a better complexity class.
