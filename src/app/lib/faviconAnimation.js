const FRAME_COUNT = 210;
const FRAME_INTERVAL = 33;
const STATIC_FRAME = "/favicon-frames/loop-000.png";

function getFrameSource(index) {
  return `/favicon-frames/loop-${String(index).padStart(3, "0")}.png`;
}

export function startFaviconAnimation() {
  const favicon = document.querySelector("link[data-animated-favicon]");

  if (!favicon) {
    return undefined;
  }

  const originalHref = favicon.getAttribute("href");
  const originalType = favicon.getAttribute("type");
  let animationTimer;
  let frameIndex = 0;
  let lastStartedAt = Number.NEGATIVE_INFINITY;
  favicon.setAttribute("data-animation-state", "initialized");

  const publishSource = (source) => {
    favicon.remove();
    favicon.setAttribute("type", "image/png");
    favicon.setAttribute("href", source);
    document.head.appendChild(favicon);
  };

  const playAnimation = () => {
    const startedAt = performance.now();

    if (startedAt - lastStartedAt < 500) {
      return;
    }

    lastStartedAt = startedAt;
    frameIndex = 0;
    clearInterval(animationTimer);
    favicon.setAttribute("data-animation-state", "playing");
    publishSource(getFrameSource(frameIndex));

    animationTimer = window.setInterval(() => {
      frameIndex = (frameIndex + 1) % FRAME_COUNT;
      publishSource(getFrameSource(frameIndex));
    }, FRAME_INTERVAL);
  };

  const replayWhenVisible = () => {
    if (!document.hidden) {
      playAnimation();
    }
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    publishSource(STATIC_FRAME);
  } else {
    playAnimation();
    document.addEventListener("visibilitychange", replayWhenVisible);
    window.addEventListener("focus", playAnimation);
  }

  return () => {
    clearInterval(animationTimer);
    document.removeEventListener("visibilitychange", replayWhenVisible);
    window.removeEventListener("focus", playAnimation);
    favicon.remove();

    if (originalHref) {
      favicon.setAttribute("href", originalHref);
    }

    if (originalType) {
      favicon.setAttribute("type", originalType);
    }

    document.head.appendChild(favicon);
  };
}
