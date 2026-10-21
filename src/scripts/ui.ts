/** Header state, mobile menu, scrollspy, scroll reveals and service tabs. */

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => (header.dataset.scrolled = String(window.scrollY > 8));
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const setMenu = (open: boolean) => {
    header.dataset.menu = open ? 'open' : 'closed';
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };

  toggle?.addEventListener('click', () => setMenu(header.dataset.menu !== 'open'));
  header
    .querySelectorAll('[data-menu-link], #mobile-menu a, #mobile-menu [data-open-booking]')
    .forEach((el) => el.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.dataset.menu === 'open') {
      setMenu(false);
      toggle?.focus();
    }
  });
  matchMedia('(min-width: 64rem)').addEventListener('change', (e) => e.matches && setMenu(false));

  // Scrollspy: highlight the nav link of the section crossing the viewport middle
  // (sections without a nav link, like hero and contact, clear the highlight).
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  const sections = document.querySelectorAll<HTMLElement>('main > section[id]');
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const l of links) l.setAttribute('aria-current', String(l.hash === `#${entry.target.id}`));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => spy.observe(s));
}

export function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

export function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    const list = root.querySelector<HTMLElement>('[role="tablist"]')!;
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')];

    const select = (index: number, opts: { focus?: boolean; animate?: boolean } = {}) => {
      tabs.forEach((t, i) => {
        const on = i === index;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p, i) => (p.hidden = i !== index));

      const tab = tabs[index];
      if (opts.focus) tab.focus({ preventScroll: true });
      if (list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: tab.offsetLeft - 16, behavior: reduceMotion() ? 'auto' : 'smooth' });
      }
      if (opts.animate && !reduceMotion()) {
        panels[index].animate(
          [
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        );
      }
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i, { animate: true }));
      tab.addEventListener('keydown', (e) => {
        const keys: Record<string, number> = {
          ArrowRight: (i + 1) % tabs.length,
          ArrowLeft: (i - 1 + tabs.length) % tabs.length,
          Home: 0,
          End: tabs.length - 1,
        };
        if (!(e.key in keys)) return;
        e.preventDefault();
        select(keys[e.key], { focus: true, animate: true });
      });
    });

    panels.forEach((p, i) => (p.hidden = i !== 0));
  });
}

/** Director ⇄ Architect viewport: mode toggle, gentle auto-cycle, running timecode. */
export function initViewport() {
  const root = document.querySelector<HTMLElement>('[data-viewport]');
  if (!root) return;

  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-mode-btn]')];
  const caption = root.querySelector<HTMLElement>('[data-mode-caption]');
  const timecode = root.querySelector<HTMLElement>('[data-timecode]');
  let autoplay = !reduceMotion();
  let cycle: number | undefined;
  let raf = 0;

  const setMode = (mode: string) => {
    root.dataset.mode = mode;
    for (const b of buttons) {
      const on = b.dataset.modeBtn === mode;
      b.setAttribute('aria-pressed', String(on));
      if (on && caption) caption.textContent = b.dataset.caption ?? '';
    }
  };

  const stopCycle = () => {
    clearInterval(cycle);
    cycle = undefined;
  };
  const startCycle = () => {
    if (!autoplay || cycle) return;
    cycle = window.setInterval(() => setMode(root.dataset.mode === 'director' ? 'architect' : 'director'), 6500);
  };

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      autoplay = false;
      stopCycle();
      setMode(b.dataset.modeBtn!);
    }),
  );

  // Broadcast-style timecode starting at 01:00:00:00, 24 fps.
  const t0 = performance.now();
  const pad = (n: number) => String(n).padStart(2, '0');
  let lastFrame = -1;
  const tick = (now: number) => {
    const frames = Math.floor(((now - t0) / 1000) * 24);
    if (frames !== lastFrame && timecode) {
      lastFrame = frames;
      const s = 3600 + Math.floor(frames / 24);
      timecode.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(frames % 24)}`;
    }
    raf = requestAnimationFrame(tick);
  };

  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startCycle();
        if (!raf) raf = requestAnimationFrame(tick);
      } else {
        stopCycle();
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { threshold: 0.35 },
  ).observe(root);
}
