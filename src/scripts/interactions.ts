/**
 * Shared client-side motion for the site: scroll reveals, a scroll progress
 * bar, magnetic buttons, pointer-tilt cards, and count-up stats. Everything
 * degrades to a static, fully visible page when JavaScript is unavailable
 * or the visitor prefers reduced motion.
 */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function calculateScrollProgress(scrollY: number, scrollHeight: number, clientHeight: number): number {
  const scrollable = scrollHeight - clientHeight;
  return scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
}

export function calculatePointerOffset(
  clientPosition: number,
  edgePosition: number,
  size: number,
  strength: number
): number {
  if (size <= 0 || !Number.isFinite(size)) return 0;
  const relativePosition = (clientPosition - edgePosition) / size - 0.5;
  return relativePosition * strength;
}

export function calculateRevealDelay(index: number): number {
  return Math.min(Math.max(index, 0), 6) * 70;
}

export function formatCounterValue(value: number, prefix: string, suffix: string): string {
  return `${prefix}${value}${suffix}`;
}

let activeController: AbortController | undefined;
let revealObserver: IntersectionObserver | undefined;
let counterObserver: IntersectionObserver | undefined;

function initReveal() {
  revealObserver?.disconnect();
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const groups = new Map<Element, HTMLElement[]>();
  targets.forEach((el) => {
    const parent = el.parentElement ?? document.body;
    const list = groups.get(parent) ?? [];
    list.push(el);
    groups.set(parent, list);
  });

  const delayFor = (el: HTMLElement) => {
    const siblings = groups.get(el.parentElement ?? document.body) ?? [el];
    const index = siblings.indexOf(el);
    return calculateRevealDelay(index);
  };

  // Anything already sitting inside the viewport on first paint should just
  // render immediately. Waiting on the scroll-driven observer for those
  // elements left visible gaps on tall/wide viewports — e.g. the "Selected
  // work" heading would fade in while the case-study cards directly below
  // it stayed invisible until the visitor nudged the page with a scroll.
  const viewportHeight = window.innerHeight;
  const toObserve: HTMLElement[] = [];

  targets.forEach((el) => {
    if (el.getBoundingClientRect().top < viewportHeight) {
      el.classList.add('is-visible');
    } else {
      toObserve.push(el);
    }
  });

  if (!toObserve.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.style.setProperty('--reveal-delay', String(delayFor(el)));
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  revealObserver = observer;
  toObserve.forEach((el) => observer.observe(el));
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const progress = calculateScrollProgress(window.scrollY, doc.scrollHeight, doc.clientHeight);
    bar.style.setProperty('--scroll-progress', String(progress));
  };

  update();
  window.addEventListener('scroll', update, { passive: true, signal: activeController?.signal });
  window.addEventListener('resize', update, { signal: activeController?.signal });
}

function initMagnetic() {
  if (prefersReducedMotion()) return;
  const items = document.querySelectorAll<HTMLElement>('[data-magnetic]');

  items.forEach((el) => {
    const strength = Number(el.dataset.magneticStrength ?? 18);

    const reset = () => {
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    };

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', String(calculatePointerOffset(event.clientX, rect.left, rect.width, strength)));
      el.style.setProperty('--my', String(calculatePointerOffset(event.clientY, rect.top, rect.height, strength)));
    }, { signal: activeController?.signal });

    el.addEventListener('pointerleave', reset, { signal: activeController?.signal });
    reset();
  });
}

function initTilt() {
  if (prefersReducedMotion()) return;
  const items = document.querySelectorAll<HTMLElement>('[data-tilt]');

  items.forEach((el) => {
    const max = Number(el.dataset.tiltStrength ?? 6);

    const reset = () => {
      el.style.setProperty('--rx', '0');
      el.style.setProperty('--ry', '0');
    };

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--rx', String(calculatePointerOffset(event.clientX, rect.left, rect.width, max * 2)));
      el.style.setProperty('--ry', String(calculatePointerOffset(event.clientY, rect.top, rect.height, -max * 2)));
    }, { signal: activeController?.signal });

    el.addEventListener('pointerleave', reset, { signal: activeController?.signal });
    reset();
  });
}

function initCounters() {
  counterObserver?.disconnect();
  const counters = document.querySelectorAll<HTMLElement>('[data-count-to]');
  if (!counters.length) return;

  const animate = (el: HTMLElement) => {
    const to = Number(el.dataset.countTo);
    const suffix = el.dataset.countSuffix ?? '';
    const prefix = el.dataset.countPrefix ?? '';
    if (!Number.isFinite(to)) return;

    if (prefersReducedMotion()) {
      el.textContent = formatCounterValue(to, prefix, suffix);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(to * eased);
      el.textContent = formatCounterValue(value, prefix, suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counterObserver = observer;
  counters.forEach((el) => observer.observe(el));
}

function init() {
  activeController?.abort();
  activeController = new AbortController();
  document.documentElement.classList.add('js');
  initReveal();
  initScrollProgress();
  initMagnetic();
  initTilt();
  initCounters();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('astro:page-load', init);
}
