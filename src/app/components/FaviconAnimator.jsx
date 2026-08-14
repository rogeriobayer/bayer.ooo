"use client";

import { useEffect } from "react";
import { startFaviconAnimation } from "../lib/faviconAnimation";

export function FaviconAnimator() {
  useEffect(() => startFaviconAnimation(), []);

  return null;
}

export default FaviconAnimator;
