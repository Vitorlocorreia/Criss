(() => {
  const root = document.documentElement;
  const overlay = document.querySelector('.brand-intro');
  if (!overlay) return;
  let finished = false;
  let timeline;
  const onKey = event => { if (event.key === 'Escape') release(); };
  const release = () => {
    if (finished) return;
    finished = true;
    timeline?.kill();
    overlay.remove();
    root.classList.remove('intro-pending');
    root.dataset.intro = 'done';
    document.removeEventListener('keydown', onKey);
    document.querySelectorAll('[data-intro-inert]').forEach(el => { el.inert = false; el.removeAttribute('data-intro-inert'); });
    window.dispatchEvent(new Event('cris:intro-complete'));
    window.ScrollTrigger?.refresh();
  };
  if (!root.classList.contains('intro-pending') || matchMedia('(prefers-reduced-motion: reduce)').matches || (location.hash && location.hash !== '#')) { release(); return; }
  document.querySelectorAll('body > header, body > main, body > footer').forEach(el => { el.inert = true; el.setAttribute('data-intro-inert', ''); });
  overlay.querySelector('.intro-skip').addEventListener('click', release);
  document.addEventListener('keydown', onKey);
  const fontReady = document.fonts?.load('400 100px Fraunces').catch(() => {}) ?? Promise.resolve();
  Promise.race([fontReady, new Promise(resolve => setTimeout(resolve, 450))]).then(() => {
    if (finished) return;
    if (!window.gsap) { release(); return; }
    const gsap = window.gsap;
    timeline = gsap.timeline({ onComplete: release });
    timeline.fromTo('.intro-outline', { opacity: .12 }, { opacity: .4, duration: .65, ease: 'power2.out' }, 0)
      .fromTo('.intro-art', { scale: .98, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: 'power2.out' }, 0)
      .to('.intro-reflection', { opacity: 1, duration: .15 }, .4)
      .fromTo('#intro-light-band', { attr: { x: -400 } }, { attr: { x: 1050 }, duration: 2.05, ease: 'power1.inOut' }, .4)
      .to('.intro-outline', { opacity: .64, duration: .6, ease: 'power1.out' }, 1.65)
      .to('.intro-reflection', { opacity: 0, duration: .3 }, 2.35)
      .to('.intro-bottom-line', { scaleX: 2, opacity: .2, duration: .7 }, 1.6)
      .to('.intro-art', { y: -15, opacity: 0, duration: .45, ease: 'power2.in' }, 2.65)
      .to('.intro-skip, .intro-bottom-line', { opacity: 0, duration: .2 }, 2.65)
      .call(() => { root.dataset.intro = 'revealing'; window.dispatchEvent(new Event('cris:intro-complete')); }, null, 2.85)
      .to(overlay, { clipPath: 'inset(0% 0% 100% 0%)', duration: .85, ease: 'power3.inOut' }, 2.85);
  });
})();
