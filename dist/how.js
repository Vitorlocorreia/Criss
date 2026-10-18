(() => {
  const experience = document.querySelector('.impact-scroll');
  if (!experience) return;
  const beats = [...experience.querySelectorAll('[data-beat]')];
  const dots = [...experience.querySelectorAll('.flow-dots i')];
  const captions = [...experience.querySelectorAll('.scroll-scene-caption span')];
  const scenes = [1, 3, 4];
  const visual = experience.querySelector('.scroll-visual');
  const story = experience.querySelector('.impact-beats');
  let active = -1;
  function setStep(index) {
    if (index === active) return;
    active = index;
    experience.dataset.scrollStep = String(index);
    experience.dataset.impactStep = String(scenes[index]);
    beats.forEach((beat, i) => beat.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('is-current', i === index));
    captions.forEach((caption, i) => caption.classList.toggle('is-current', i === index));
  }
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
    if (context.conditions.reduce) { setStep(2); return; }
    experience.classList.add('is-scroll-ready');
    const followScroll = () => {
      const mobile = innerWidth <= 720;
      const beatRects = beats.map(beat => beat.getBoundingClientRect());
      const visualRect = visual.getBoundingClientRect();
      const pinned = mobile && visualRect.top <= 1;
      // Keep the text readable until its first line meets the sticky scene.
      // Clip the story too, so no letters can reappear above the illustration.
      story.style.setProperty('--story-clip', pinned ? `${Math.max(0, visualRect.bottom - story.getBoundingClientRect().top)}px` : '0px');
      beats.forEach((beat, i) => {
        const opacity = pinned ? Math.max(0, Math.min(1, (beatRects[i].top + 22 - visualRect.bottom) / 22)) : 1;
        beat.style.setProperty('--beat-opacity', opacity);
      });
      const threshold = innerWidth <= 720 ? Math.min(innerHeight - 60, Math.max(370, innerHeight * .7)) : innerHeight * .6;
      let index = 0;
      beatRects.forEach((rect, i) => { if (rect.top <= threshold) index = i; });
      setStep(index);
    };
    window.addEventListener('scroll', followScroll, { passive: true });
    window.addEventListener('resize', followScroll);
    document.fonts?.ready.then(followScroll);
    followScroll();
    gsap.from('.impact-table', { opacity: 0, y: 10, duration: .85, ease: 'power2.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: experience, start: 'top 90%', once: true } });
    return () => {
      experience.classList.remove('is-scroll-ready');
      story.style.removeProperty('--story-clip');
      beats.forEach(beat => beat.style.removeProperty('--beat-opacity'));
      window.removeEventListener('scroll', followScroll);
      window.removeEventListener('resize', followScroll);
    };
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
