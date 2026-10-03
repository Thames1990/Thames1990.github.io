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

export function shouldDeferReveal(targetTop: number, viewportHeight: number): boolean {
  return targetTop >= viewportHeight;
}

export function formatCounterValue(value: number, prefix: string, suffix: string): string {
  return `${prefix}${value}${suffix}`;
}

export function createAnimationFrameScheduler(callback: FrameRequestCallback, requestFrame = requestAnimationFrame): () => void {
  let framePending = false;

  return () => {
    if (framePending) return;
    framePending = true;
    requestFrame((time) => {
      framePending = false;
      callback(time);
    });
  };
}

let activeController: AbortController | undefined;
let pointerController: AbortController | undefined;
let revealObserver: IntersectionObserver | undefined;
let counterObserver: IntersectionObserver | undefined;

function initReveal() {
  revealObserver?.disconnect();
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    targets.forEach((el) => {
      el.classList.remove('is-pending');
      el.classList.add('is-visible');
    });
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;

        if (!entry.isIntersecting) {
          if (!el.classList.contains('is-visible') && shouldDeferReveal(entry.boundingClientRect.top, window.innerHeight)) {
            el.classList.add('is-pending');
          }
          return;
        }

        if (el.classList.contains('is-pending')) {
          el.style.setProperty('--reveal-delay', String(delayFor(el)));
          el.classList.remove('is-pending');
        }
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  revealObserver = observer;
  targets.forEach((el) => observer.observe(el));
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    if (bar) {
      const doc = document.documentElement;
      const progress = calculateScrollProgress(window.scrollY, doc.scrollHeight, doc.clientHeight);
      bar.style.setProperty('--scroll-progress', String(progress));
    }

  };
  const scheduleUpdate = createAnimationFrameScheduler(update);

  update();
  window.addEventListener('scroll', scheduleUpdate, { passive: true, signal: activeController?.signal });
  window.addEventListener('resize', scheduleUpdate, { signal: activeController?.signal });
}

function initMagnetic(signal: AbortSignal) {
  const items = document.querySelectorAll<HTMLElement>('[data-magnetic]');

  items.forEach((el) => {
    const strength = Number(el.dataset.magneticStrength ?? 18);
    initPointerEffect(el, '--mx', '--my', strength, strength, signal);
  });
}

function initTilt(signal: AbortSignal) {
  const items = document.querySelectorAll<HTMLElement>('[data-tilt]');

  items.forEach((el) => {
    const max = Number(el.dataset.tiltStrength ?? 6);
    initPointerEffect(el, '--rx', '--ry', max * 2, -max * 2, signal);
  });
}

function resetPointerEffects() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
  });
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    el.style.setProperty('--rx', '0');
    el.style.setProperty('--ry', '0');
  });
}

function initPointerEffects() {
  pointerController?.abort();
  pointerController = undefined;
  resetPointerEffects();

  const pointerQuery = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (min-width: 48rem) and (prefers-reduced-motion: no-preference)'
  );

  const bind = () => {
    pointerController?.abort();
    pointerController = undefined;
    resetPointerEffects();
    if (!pointerQuery.matches) return;

    pointerController = new AbortController();
    initMagnetic(pointerController.signal);
    initTilt(pointerController.signal);
  };

  bind();
  pointerQuery.addEventListener('change', bind, { signal: activeController?.signal });
}

function initPointerEffect(
  el: HTMLElement,
  horizontalProperty: string,
  verticalProperty: string,
  horizontalStrength: number,
  verticalStrength: number,
  signal: AbortSignal
) {
  let bounds: DOMRect | undefined;
  let boundsStale = false;
  let clientX = 0;
  let clientY = 0;
  let pointerIsOver = false;

  const reset = () => {
    pointerIsOver = false;
    bounds = undefined;
    boundsStale = false;
    el.style.setProperty(horizontalProperty, '0');
    el.style.setProperty(verticalProperty, '0');
  };

  const update = () => {
    if (!pointerIsOver) return;
    if (boundsStale) {
      bounds = el.getBoundingClientRect();
      boundsStale = false;
    }
    if (!bounds) return;
    el.style.setProperty(
      horizontalProperty,
      String(calculatePointerOffset(clientX, bounds.left, bounds.width, horizontalStrength))
    );
    el.style.setProperty(
      verticalProperty,
      String(calculatePointerOffset(clientY, bounds.top, bounds.height, verticalStrength))
    );
  };
  const scheduleUpdate = createAnimationFrameScheduler(update);

  el.addEventListener(
    'pointerenter',
    (event) => {
      if (event.pointerType === 'touch') return;
      bounds = el.getBoundingClientRect();
      pointerIsOver = true;
      clientX = event.clientX;
      clientY = event.clientY;
      scheduleUpdate();
    },
    { signal }
  );

  el.addEventListener(
    'pointermove',
    (event) => {
      if (!pointerIsOver) return;
      clientX = event.clientX;
      clientY = event.clientY;
      scheduleUpdate();
    },
    { signal }
  );

  el.addEventListener('pointerleave', reset, { signal });
  const refreshBounds = () => {
    if (!pointerIsOver) return;
    boundsStale = true;
    scheduleUpdate();
  };
  window.addEventListener('scroll', refreshBounds, { passive: true, signal });
  window.addEventListener(
    'resize',
    refreshBounds,
    { signal }
  );
  reset();
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

  if (typeof IntersectionObserver === 'undefined') {
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
  initPointerEffects();
  initCounters();
  enableSmoothScroll();
}

// Astro restores scroll with scrollTo() on reload and history navigation; keep that instant
// so restored sections don't animate past reveal targets. In-page hash links stay smooth.
function enableSmoothScroll() {
  document.documentElement.dataset.smoothScroll = '';
}

function disableSmoothScroll() {
  delete document.documentElement.dataset.smoothScroll;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('astro:page-load', init);
  document.addEventListener('astro:before-swap', disableSmoothScroll);
  document.addEventListener('astro:after-swap', enableSmoothScroll);

  // ClientRouter switches history to manual scroll restoration and restores from a deferred
  // module, so a reload paints one frame at the top before jumping back. Handing the outgoing
  // entry back to the browser lets it restore natively before first paint; once the router has
  // applied its exact position, switch back to manual so the browser's load-time restore can't
  // nudge it again.
  window.addEventListener('pagehide', () => {
    history.scrollRestoration = 'auto';
  });
  history.scrollRestoration = 'manual';
}
