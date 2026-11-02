// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { disposeInteractions, initializeInteractions } from './interactions';

class TestIntersectionObserver {
  static instances: TestIntersectionObserver[] = [];
  readonly observed: Element[] = [];
  readonly disconnect = vi.fn();
  readonly observe = vi.fn((target: Element) => {
    this.observed.push(target);
  });
  readonly unobserve = vi.fn();

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit
  ) {
    TestIntersectionObserver.instances.push(this);
  }
}

describe('interaction lifecycle', () => {
  let frames: FrameRequestCallback[];
  let pointerQuery: MediaQueryList;
  let pointerMatches: boolean;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-smooth-scroll');
    TestIntersectionObserver.instances = [];
    frames = [];
    pointerMatches = false;
    const pointerEvents = new EventTarget();
    pointerQuery = {
      get matches() {
        return pointerMatches;
      },
      media: '(hover: hover) and (pointer: fine)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: pointerEvents.addEventListener.bind(pointerEvents),
      removeEventListener: pointerEvents.removeEventListener.bind(pointerEvents),
      dispatchEvent: pointerEvents.dispatchEvent.bind(pointerEvents),
    };

    vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
      if (query.includes('hover: hover')) return pointerQuery;
      return { matches: false } as MediaQueryList;
    });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(vi.fn());
    disposeInteractions();
  });

  afterEach(() => {
    disposeInteractions();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('initializes observers and page state through the lifecycle interface', () => {
    document.body.innerHTML = '<div data-reveal></div><div data-count-to="8"></div>';

    initializeInteractions();

    expect(document.documentElement.classList.contains('js')).toBe(true);
    expect(document.documentElement.hasAttribute('data-smooth-scroll')).toBe(true);
    expect(TestIntersectionObserver.instances).toHaveLength(2);
    expect(TestIntersectionObserver.instances[0].observed).toHaveLength(1);
    expect(TestIntersectionObserver.instances[1].observed).toHaveLength(1);
  });

  it('reinitializes after Astro page navigation', () => {
    document.body.innerHTML = '<div data-reveal></div>';
    disposeInteractions();

    document.dispatchEvent(new Event('astro:page-load'));

    expect(document.documentElement.hasAttribute('data-smooth-scroll')).toBe(true);
    expect(TestIntersectionObserver.instances).toHaveLength(1);
  });

  it('rebinds pointer effects when the viewport media query changes', () => {
    const item = document.createElement('button');
    item.dataset.magnetic = '';
    item.getBoundingClientRect = vi.fn(() => new DOMRect(0, 0, 100, 100));
    document.body.append(item);
    pointerMatches = true;

    initializeInteractions();
    item.dispatchEvent(Object.assign(new Event('pointerenter'), {
      pointerType: 'mouse',
      clientX: 100,
      clientY: 100,
    }));
    frames.shift()?.(16);
    expect(item.style.getPropertyValue('--mx')).toBe('9');

    pointerMatches = false;
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'matches', { value: false });
    pointerQuery.dispatchEvent(changeEvent);

    expect(item.style.getPropertyValue('--mx')).toBe('0');
    const frameCount = frames.length;
    item.dispatchEvent(Object.assign(new Event('pointerenter'), {
      pointerType: 'mouse',
      clientX: 100,
      clientY: 100,
    }));
    expect(frames).toHaveLength(frameCount);
  });

  it('disconnects observers, aborts listeners, and cancels pending frames on dispose', () => {
    document.body.innerHTML = `
      <div id="scroll-progress"></div>
      <div data-reveal></div>
      <div data-count-to="8"></div>
      <button data-magnetic></button>
    `;
    pointerMatches = true;
    initializeInteractions();
    document.querySelector('[data-magnetic]')?.dispatchEvent(Object.assign(new Event('pointerenter'), {
      pointerType: 'mouse',
      clientX: 10,
      clientY: 10,
    }));

    const observers = [...TestIntersectionObserver.instances];
    const pendingFrameCount = frames.length;
    expect(pendingFrameCount).toBeGreaterThan(0);

    disposeInteractions();

    expect(observers.every((observer) => observer.disconnect.mock.calls.length > 0)).toBe(true);
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
    expect(frames).toHaveLength(pendingFrameCount);
    expect(document.documentElement.hasAttribute('data-smooth-scroll')).toBe(false);
  });

  it('removes scroll listeners on dispose', () => {
    document.body.innerHTML = '<div id="scroll-progress"></div>';
    initializeInteractions();
    window.dispatchEvent(new Event('scroll'));
    frames.shift()?.(16);

    disposeInteractions();
    window.dispatchEvent(new Event('scroll'));

    expect(frames).toHaveLength(0);
  });
});
