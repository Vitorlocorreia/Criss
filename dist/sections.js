const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const mobileViewport = matchMedia('(max-width: 720px)');
const demoTabs = [...document.querySelectorAll('[data-phone]')];
const devices = [...document.querySelectorAll('[data-device]')];
function setDemo(name, focus = false) {
  demoTabs.forEach(tab => {
    const active = tab.dataset.phone === name;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  devices.forEach(device => {
    const active = device.dataset.device === name;
    device.classList.toggle('is-active', active);
    device.setAttribute('aria-hidden', String(mobileViewport.matches && !active));
    device.inert = mobileViewport.matches && !active;
  });
}
demoTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setDemo(tab.dataset.phone));
  tab.addEventListener('keydown', event => {
    const keys = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 };
    if (event.key in keys) { event.preventDefault(); setDemo(demoTabs[keys[event.key]].dataset.phone, true); }
  });
});
mobileViewport.addEventListener('change', () => setDemo(document.querySelector('[data-phone][aria-selected="true"]').dataset.phone));
setDemo('receipt');

const receiptButton = document.querySelector('#simulate-receipt');
let receiptTimer;
receiptButton.addEventListener('click', () => {
  clearTimeout(receiptTimer);
  receiptButton.disabled = true;
  receiptButton.textContent = 'Validando a nota de exemplo…';
  const result = document.querySelector('.receipt-result');
  result.querySelector('strong').textContent = 'Validando a demonstração…';
  result.querySelector('small').textContent = 'Nenhum documento real é enviado.';
  receiptTimer = setTimeout(() => {
    result.querySelector('strong').textContent = 'Impacto demonstrado!';
    result.querySelector('small').textContent = 'R$ 4,50 para o projeto · valor ilustrativo';
    receiptButton.innerHTML = 'Simular novamente <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg>';
    receiptButton.disabled = false;
  }, motionPreference.matches ? 0 : 1000);
});

document.querySelector('#company-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = ['Olá! Quero saber mais sobre a CRIS para empresas.', '', `Nome: ${String(data.get('name')).trim()}`, `WhatsApp: ${String(data.get('phone')).trim()}`, data.get('company') ? `Empresa: ${String(data.get('company')).trim()}` : '', data.get('message') ? `Mensagem: ${String(data.get('message')).trim()}` : ''].filter(Boolean).join('\n');
  window.open(`https://wa.me/5581989049119?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  document.querySelector('#company-feedback').textContent = 'Mensagem preparada. Confira os dados e continue a conversa no WhatsApp.';
});

if (window.gsap && window.ScrollTrigger && !motionPreference.matches) {
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  document.querySelectorAll('.journey-step').forEach((step, index) => {
    ScrollTrigger.create({ trigger: step, start: mobileViewport.matches ? 'top 80%' : `top ${83 - index * 4}%`, onEnter: () => step.classList.add('is-passed'), onLeaveBack: () => step.classList.remove('is-passed') });
  });
  gsap.from('.phone-stage', { opacity: 0, y: 45, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.phone-stage', start: 'top 87%', once: true } });
  gsap.from('.balance-chart i', { scaleY: 0, transformOrigin: 'bottom', stagger: .035, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: '.phone-stage', start: 'top 65%', once: true } });
  const scan = gsap.fromTo('.scan-line', { y: 0 }, { y: 85, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
  ScrollTrigger.create({ trigger: '.pocket', start: 'top bottom', end: 'bottom top', onToggle: self => self.isActive ? scan.play() : scan.pause() });
  gsap.to('.launch-rings', { y: -25, ease: 'none', scrollTrigger: { trigger: '.prelaunch', start: 'top bottom', end: 'bottom top', scrub: .8 } });
  document.querySelectorAll('.faq details').forEach(detail => {
    detail.addEventListener('toggle', () => { if (detail.open) gsap.fromTo(detail.querySelector('.faq-answer'), { opacity: 0, y: -5 }, { opacity: 1, y: 0, duration: .3, clearProps: 'transform,opacity' }); });
  });
}
