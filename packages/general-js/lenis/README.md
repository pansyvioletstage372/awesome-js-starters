# lenis

> Lightweight, smooth scroll library — butter-smooth scrolling without the performance cost of heavy alternatives.

**npm:** https://www.npmjs.com/package/lenis  
**GitHub:** https://github.com/darkroomengineering/lenis  
**Docs:** https://lenis.darkroom.engineering

---

## The Problem

Native browser scrolling is snappy but has no easing — it stops instantly. Smooth scroll libraries like `locomotive-scroll` or `smooth-scrollbar` solve this but:

- They're heavy (adding 50–100KB+ to your bundle)
- They interfere with accessibility tools and keyboard navigation
- They break `position: sticky` and other scroll-linked CSS
- They're slow on mobile or cause jank on lower-end devices
- Integrating with GSAP or WebGL animations requires complex workarounds

---

## What It Does

Lenis is a minimal (~5KB) smooth scroll library that intercepts native scroll events and replaces the scroll position with a lerped (linearly interpolated) value. It plays nicely with GSAP ScrollTrigger, Three.js, and other animation libraries. Unlike heavier alternatives, it doesn't use a virtual scroll container — so `position: sticky`, anchor links, and accessibility all work as expected.

With 33K weekly npm downloads, it's a favourite in the creative development community.

---

## Installation

```bash
npm install lenis
```

---

## Usage Example

### Basic setup (vanilla JS)

```ts
import Lenis from "lenis";

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

// Required: run lenis in your animation loop
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

### React with useEffect

```tsx
import { useEffect } from "react";
import Lenis from "lenis";

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);
}

// In your root layout:
export default function Layout({ children }) {
  useLenis();
  return <>{children}</>;
}
```

### Integration with GSAP ScrollTrigger

```ts
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

---

## Screenshot / Demo

> Add a gif showing smooth scrolling in action or a side-by-side comparison.

---

## Why It's a Hidden Gem

Most developers either accept native scrolling or reach for Locomotive Scroll (which has known compatibility issues). Lenis gives you the smooth scroll effect with a fraction of the size and none of the breakage. It's the go-to choice for portfolio sites and interactive experiences.

---

## Submitted by

<!-- @your-github-handle -->
