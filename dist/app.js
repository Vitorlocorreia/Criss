import * as THREE from './assets/three.module.js';

const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = reducedQuery.matches;
const gsap = window.gsap;
if (gsap && window.ScrollTrigger) {
  gsap.registerPlugin(window.ScrollTrigger);
  if (!reduced) {
    const revealHero = () => {
      gsap.from('.title-line > span', { yPercent: 110, duration: 1.15, stagger: .09, ease: 'power3.out', delay: .08 });
      gsap.from('.hero-enter', { opacity: 0, y: 18, duration: .85, stagger: .1, ease: 'power2.out', delay: .35 });
      gsap.from('.hero-backdrop', { opacity: 0, scale: 1.045, duration: 1.8, ease: 'power2.out', delay: .05 });
      gsap.from('.art-caption', { opacity: 0, y: 12, duration: .9, delay: .7 });
    };
    if (document.documentElement.classList.contains('intro-pending') && document.documentElement.dataset.intro !== 'revealing') window.addEventListener('cris:intro-complete', revealHero, { once: true });
    else revealHero();
    document.querySelectorAll('.reveal').forEach((el) => gsap.from(el, { opacity: 0, y: 22, duration: .85, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 91%', once: true } }));
    gsap.to('.connection-progress', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.pillars', start: 'top 88%', end: 'top 45%', scrub: .6 } });
  } else gsap.set('.connection-progress', { strokeDashoffset: 0 });
}

const canvas = document.querySelector('#cycle');
const container = document.querySelector('.hero-art');
const button = document.querySelector('.motion-toggle');
let paused = false;
let visible = true;
let renderer;
let frame;
let redraw = () => {};

try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 30);
  camera.position.set(0, 0, 6.8);
  const hemisphere = new THREE.HemisphereLight(0xfff9e9, 0x667562, 1.5);
  scene.add(hemisphere);
  const key = new THREE.DirectionalLight(0xfff4db, 3);
  key.position.set(-3, 5, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe2eddd, 1.6);
  fill.position.set(4, -1, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffd397, 3);
  rim.position.set(2, 3, -3); scene.add(rim);

  const environment = new THREE.Scene();
  environment.background = new THREE.Color(0x919b89);
  const lightPanel = (w, h, x, y, z, color, intensity = 1) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    panel.material.color.multiplyScalar(intensity); panel.position.set(x, y, z); panel.lookAt(0, 0, 0); environment.add(panel);
  };
  lightPanel(4, 7, -4, 3, 4, 0xfff9e9, 2);
  lightPanel(2, 7, 4, 1, 2, 0xe4eddd, 1.3);
  lightPanel(5, 2, 0, 5, -2, 0xffdbab, 2);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(environment, .02).texture;
  scene.environment = envMap; pmrem.dispose();

  const group = new THREE.Group(); scene.add(group);
  const segments = 320;
  const vertices = [], indices = [];
  const edges = [[], [], [], []];
  const radial = new THREE.Vector3(), binormal = new THREE.Vector3(0, 0, 1);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments * Math.PI * 2;
    const radius = 1.49 + .045 * Math.sin(3 * t + .6);
    const center = new THREE.Vector3(Math.cos(t) * radius, Math.sin(t) * radius * 1.02, .065 * Math.sin(2 * t));
    radial.set(Math.cos(t), Math.sin(t), 0);
    const twist = t * 2 + .6 + .15 * Math.sin(t);
    const widthAxis = radial.clone().multiplyScalar(Math.cos(twist)).addScaledVector(binormal, Math.sin(twist));
    const depthAxis = radial.clone().multiplyScalar(-Math.sin(twist)).addScaledVector(binormal, Math.cos(twist));
    const halfWidth = .21 + .035 * Math.sin(2 * t + 1);
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([u,v], j) => {
      const p = center.clone().addScaledVector(widthAxis, u * halfWidth).addScaledVector(depthAxis, v * .014);
      vertices.push(p.x, p.y, p.z); edges[j].push(p);
    });
    if (i < segments) for (let j = 0; j < 4; j++) {
      const a = i * 4 + j, b = i * 4 + (j + 1) % 4, c = (i + 1) * 4 + j, d = (i + 1) * 4 + (j + 1) % 4;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  const material = new THREE.MeshPhysicalMaterial({ color: 0x082317, roughness: .4, metalness: .45, clearcoat: .22, clearcoatRoughness: .45, sheen: .3, sheenColor: new THREE.Color(0x496b43), side: THREE.DoubleSide, envMapIntensity: .7 });
  group.add(new THREE.Mesh(geometry, material));
  for (const points of [edges[0], edges[2]]) {
    const curve = new THREE.CatmullRomCurve3(points, true);
    const edgeGeometry = new THREE.TubeGeometry(curve, segments, .005, 5, true);
    group.add(new THREE.Mesh(edgeGeometry, new THREE.MeshStandardMaterial({ color: 0xb59a66, metalness: .7, roughness: .4 })));
  }
  group.rotation.set(.07, -.14, -.15);
  const entrance = { value: reduced ? 1 : 0 };
  if (gsap && !reduced) gsap.to(entrance, { value: 1, duration: 1.65, ease: 'power3.out', delay: .15 });
  else entrance.value = 1;
  const pointer = new THREE.Vector2(), smoothed = new THREE.Vector2();
  const pointerSurface = document.querySelector('.hero');
  pointerSurface.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const r = pointerSurface.getBoundingClientRect();
    pointer.set((e.clientX - r.left) / r.width - .5, (e.clientY - r.top) / r.height - .5);
  });
  pointerSurface.addEventListener('pointerleave', () => pointer.set(0, 0));
  const resize = () => {
    const r = container.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); redraw();
  };
  new ResizeObserver(resize).observe(container);
  const start = performance.now();
  let last = start, elapsed = 0;
  redraw = () => renderer.render(scene, camera);
  const animate = (now) => {
    frame = undefined;
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!paused && !reduced) elapsed += dt;
    smoothed.lerp(reduced ? new THREE.Vector2() : pointer, .05);
    const idle = reduced || paused ? 0 : 1;
    group.rotation.x = .07 + smoothed.y * .13 + Math.sin(elapsed * .4) * .025 * idle;
    group.rotation.y = -.14 + smoothed.x * .22 + Math.sin(elapsed * .3) * .06 * idle;
    group.rotation.z = -.15 + Math.sin(elapsed * .2) * .025 * idle + (1 - entrance.value) * .3;
    const scale = .94 + entrance.value * .06;
    group.scale.setScalar(scale); group.position.y = -(1 - entrance.value) * .12;
    renderer.render(scene, camera);
    if (visible && !document.hidden && !paused && !reduced) frame = requestAnimationFrame(animate);
  };
  const resume = () => { last = performance.now(); if (frame === undefined) frame = requestAnimationFrame(animate); };
  button.addEventListener('click', () => {
    paused = !paused; button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Retomar animação' : 'Pausar animação');
    button.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    if (frame !== undefined) { cancelAnimationFrame(frame); frame = undefined; } resume();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) resume(); else if (frame !== undefined) { cancelAnimationFrame(frame); frame = undefined; }
  }, { rootMargin: '80px' }).observe(container);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame !== undefined) { cancelAnimationFrame(frame); frame = undefined; }
    else if (visible) resume();
  });
  reducedQuery.addEventListener('change', e => { reduced = e.matches; entrance.value = 1; if (frame !== undefined) { cancelAnimationFrame(frame); frame = undefined; } resume(); });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); if (frame !== undefined) cancelAnimationFrame(frame); document.body.classList.remove('has-3d'); });
  resize(); resume(); document.body.classList.add('has-3d');
} catch (error) {
  document.body.classList.remove('has-3d');
  console.warn('A apresentação está usando a versão estática do ciclo.', error.message);
}
