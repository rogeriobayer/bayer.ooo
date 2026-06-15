---
title: "Training an AI Model for Focus: How I Hit 90% Accuracy with 156 Examples"
slug: focus-patrol-model
date: 2026-06-15T10:00:00.000Z
lang: en
excerpt: "How I trained a Qwen2.5-0.5B to classify browser tabs with 90% accuracy using just 156 examples, LoRA, and Int4 quantization — running 100% on-device."
tags:
  - ai
  - machine-learning
  - llm
  - fine-tuning
  - chrome-extension
  - on-device
  - privacy
cover: /blog/focus-patrol-model.png
author: Rogério Bayer
---

## The context: what is Focus Patrol

[Focus Patrol](https://focuspatrol.bayer.ooo/) is a Chrome extension (and any Chromium-based browser) with a simple premise: monitor your open tabs and help you stay focused — without ever sending a single byte outside your browser.

The extension classifies each tab into three categories, **focus**, **neutral**, or **distraction**, giving you a real-time picture of how you're spending your time. It features a silent mode (discreet badge notifications), detailed focus streak statistics, configurable distraction limits, and a three-layer AI fallback system: it first tries Chrome's native Gemini Nano, then falls back to Llama 3.2 via WebLLM, and if neither is available, uses a simple local filter.

Privacy is the core principle: **all analysis happens on-device**. The extension doesn't even request network permissions — it's literally impossible to send your browsing data to any server because that capability doesn't exist in the code.

This is the context for the work in this post. Today, when Gemini Nano is unavailable, the extension falls back to Llama 3.2 via WebLLM, which works well but consumes significant GPU and browser memory, and requires a large download. The idea is to replace that layer with a custom model, trained specifically for this classification task — much lighter, running smoothly on-device without weighing down the user's machine. The result of this work will replace Llama 3.2 within the extension's new AI architecture.

## Choosing the base model

I went with **Qwen2.5-0.5B-Instruct**, a model with only 500 million parameters. The reasoning is straightforward: a model too small can't understand context, a model too large won't fit in an extension download or run fast enough in the browser. Qwen2.5-0.5B sits right in the middle — light enough for fast downloads, with enough capacity to learn the classification task.

The challenge was training this model on a very small dataset, only 176 labeled examples, and finding the right balance between class bias, model capacity, and generalization. This post documents every experiment I ran to get there: what worked, what didn't, and why.

## The dataset

I started with **176 examples** of real browsing data, covering 60 unique domains across productivity, communication, entertainment, shopping, and news. I split them into three sets: 136 for training, 20 for validation (used during training to check whether the model is generalizing), and 20 for testing (used only at the end to measure real performance).

Looking at the distribution, the problem was immediately clear: in the training set, **focus** had 50 examples (37%), **neutral** had 62 (46%), and **distraction** had only 24 (18%). This imbalance — distraction being the minority class — was the root cause of nearly every issue that surfaced in the following experiments.

## Methodology: what is LoRA and why I used it

I used **PEFT LoRA** (Low-Rank Adaptation), an efficient fine-tuning technique. Instead of retraining all 500 million parameters (which would require much more data, time, and memory), LoRA freezes the entire base model and adds small "extra" matrices to each layer, training only those matrices. In my case, this reduced the trainable parameters from 500M to about **8.8 million** — just 1.75% of the total model.

I trained everything on Apple Silicon MPS, on my MacBook Pro, without needing a dedicated GPU. The main configuration was: LoRA rank 16, alpha 32, dropout 0.1, learning rate 1×10⁻⁴ with cosine schedule (the learning rate starts higher and decreases smoothly throughout training), effective batch size of 8, sequences up to 1024 tokens, all in float32 precision.

## The journey: 9 experiments, one at a time

Each version tested a different hypothesis. I'll explain what each one did, why I made that change, and what happened.

### V1, Baseline, no fine-tuning at all

Before training anything, I needed to know: how good is the model "out of the box"? I tested Qwen2.5 **1.5B** (the 3x larger version of the model) with just a few-shot prompt — 12 classification examples directly in the prompt, without any training.

Result: **65% accuracy**. A reasonable starting point, but using a model 3x heavier than what I actually wanted to use.

### V2, First fine-tuning, original data

Here I trained Qwen2.5-0.5B (the smaller model I actually wanted to use) on the original 136 training examples, LoRA r=16, for 3 epochs.

Result: also **65%**, but the error pattern told the real story. The model learned to "play it safe": since neutral is 46% of the dataset, anything questionable gets classified as neutral. It got 100% of neutral examples right, but **completely zeroed out** the distraction class — never classified anything as distraction, even when it should have.

### V3, Trying to fix imbalance with forced oversampling

Diagnosis from V2: class imbalance was distorting learning. Attempted fix: force 62 examples per class via oversampling (repeating minority class examples), totaling 186 balanced examples.

Result: **60%**, worse than before. The model started classifying almost everything as distraction — now it "plays it safe" in the opposite direction. Focus went up to 80%, but neutral plummeted to 25%, and distraction hit 100% (only because it practically never classifies as anything else). The fix was worse than the original problem.

### V4, The turning point: gentle oversampling + improved prompt ⭐

Lesson from V3: total balancing is too aggressive. Instead, I applied a **gentle 2x oversampling only to the distraction class** (bringing it to 160 total examples, without touching the other classes), and just as importantly, I significantly improved the system prompt, adding platform-specific rules. For example: YouTube with educational content counts as focus, ChatGPT counts as neutral, GitHub counts as focus, and so on for several common platforms.

Result: jump to **85%**. Focus was perfect (100%), neutral nearly perfect (88%). Distraction still zeroed — the two Twitch test examples were misclassified — but the improvement was enormous compared to previous versions.

### V5, Do more epochs help?

I tried training longer: 10 epochs, with early stopping configured but it ended up not triggering in time.

Result: **80%**, worse than V4. What happened: the eval loss (the "error" measured on the validation set, which indicates whether the model is generalizing or just memorizing the training data) starts rising after epoch 3. Continuing to train beyond that makes the model memorize training data instead of learning general patterns. Distraction hit 100%, but neutral dropped to 62% — another trade-off, and overall, worse. Conclusion: more epochs doesn't equal a better model.

### V6, The wrong hypothesis: more trainable parameters

I thought: what if I give LoRA more "capacity"? I doubled the rank from 16 to 32, which nearly doubles the trainable parameters (from 8.8M to 17.6M).

Result: **55%**, the worst of all experiments. Focus plummeted to 30%. With such a small dataset (136-160 examples), giving the model more trainable parameters only increases overfitting — it has too much capacity to memorize specific training details, and generalizes worse to new cases.

### V7, The champion: the simplest change of all ✨

After six experiments tweaking hyperparameters, balancing, and architecture, I made the most obvious change I had left for last: I took the **20 examples from the validation set and merged them into the training set**. Instead of 136, the training set now had **156 examples**.

Result: **90% accuracy on the test set** — the best of the entire project, and by a solid margin. Neutral and distraction were perfect (100% each). Focus came in at 80%, with the two remaining errors being edge cases that would be difficult even for a human to classify.

The lesson is straightforward: after six attempts at "engineering" — balancing, epochs, LoRA rank — what moved the needle most was simply having a bit more training data.

## The class balancing dilemma

Looking at all experiments together, the central pattern of the project is a constant trade-off: improving the distraction class almost always costs something in neutral, and vice versa. The natural dataset distribution (46% neutral) biases the model toward "neutral". Forced total balancing (33% each class, as in V3) biases toward "distraction". The sweet spot was a middle ground: modest 2x oversampling only on the minority class, without rebalancing the others (V4 and V7).

And in every experiment that worked, the eval loss pattern repeats: it stops dropping between epochs 2 and 3. After that, training loss keeps going down (the model keeps "learning" the training data by heart), but eval loss stabilizes or rises (it stops generalizing better). The best checkpoint is always around epoch 3, even when I configured training for 5 or 10 epochs.

## Optimizing for production: from 988 MB to 305 MB

The champion model (V7), saved in fp16, occupies 988 MB. Too heavy for a browser extension download. I applied **ONNX Int4 quantization**, a technique that reduces the numerical precision of the model weights, so each weight takes less space, while the model continues to behave very similarly.

| Format | Size | Reduction | Accuracy | Recommendation |
|---|---|---|---|---|
| PyTorch fp32 | ~1.8 GB | baseline | 90% | No |
| PyTorch fp16 | 988 MB | -45% | 90% | Yes |
| ONNX Int8 | 474 MB | -52% | ~90% | Yes |
| **ONNX Int4** | **305 MB** | **-69%** | **~90%** | **Best option** |
| SmolLM2-135M fp16 | 270 MB | -73% | 70% | Too weak |

Int4 quantization reduced the model by 69% (from 988 MB to 305 MB) with negligible accuracy loss. This is the viable size for distribution inside a Chrome extension.

## The extra experiment: testing an even smaller model

To understand the lower size limit, I tested **SmolLM2-135M-Instruct** from HuggingFace, 3.7x smaller than Qwen2.5-0.5B. I augmented the dataset artificially (with paraphrasing and domain swapping — trading domains between examples to create variations) and trained for 10 epochs with LoRA r=16.

The result clearly showed the limitation: eval loss stabilized around 0.37, well above the ~0.21 of Qwen2.5-0.5B. Accuracy was only 70%, with the distraction class zeroed out again. Even with more data and more epochs, 135M parameters wasn't enough capacity for this task. Qwen2.5-0.5B in Int4, 305 MB, 90% accuracy, remains the sweet spot between size and performance.

## Lessons learned

**Data quality and quantity matter more than parameters.** Adding 20 curated examples to training (V7) gained +25 percentage points of accuracy. Doubling the LoRA rank (V6) lost 10 points. The difference is staggering.

**Class balancing is a tightrope walk.** Neither leaving the natural distribution as is, nor forcing total balance — the right equilibrium was a modest oversample, only on the underrepresented class.

**Early stopping around epoch 3-4.** In every experiment, eval loss stopped improving after epoch 3. Training beyond that only hurts generalization, even if training loss keeps dropping.

**Prompt engineering is a force multiplier.** A prompt with platform-specific rules (V4) added about 15 percentage points of accuracy even before any fine-tuning.

**Int4 quantization is essential for production.** Shrinking from 988 MB to 305 MB with negligible accuracy loss is what makes this model viable for running inside a browser extension.

---

## What's next

This model, `rogeriobayer/focus-patrol-qwen2.5-0.5b-v7-int4`, 305 MB, ONNX Int4, 90% accuracy, will replace Llama 3.2 within the new AI architecture of the [Focus Patrol](https://focuspatrol.bayer.ooo/) extension. It runs entirely via Transformers.js, directly in the browser, 100% on-device, without sending anything out of your computer, and using far less GPU and memory than Llama 3.2 required.

The model is available on HuggingFace at [huggingface.co/rogeriobayer/focus-patrol-qwen2.5-0.5b-v7](https://huggingface.co/rogeriobayer/focus-patrol-qwen2.5-0.5b-v7/tree/main).

