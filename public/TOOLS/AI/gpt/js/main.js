import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const dom = {
  loader: document.getElementById('loader'),
  loaderBar: document.getElementById('loader-bar'),
  loaderPercent: document.getElementById('loader-percent'),
  cursorDot: document.getElementById('cursor-dot'),
  cursorRing: document.getElementById('cursor-ring'),
  canvas: document.getElementById('webgl'),
  parallaxEls: Array.from(document.querySelectorAll('[data-depth]')),
  revealEls: Array.from(document.querySelectorAll('.reveal')),
  glowEls: Array.from(document.querySelectorAll('.glow-hover')),
  magneticEls: Array.from(document.querySelectorAll('.magnetic')),
  splitTargets: Array.from(document.querySelectorAll('.split-target')),
};

const state = {
  mouse: { x: 0, y: 0 },
  scrollProgress: 0,
  viewport: { w: window.innerWidth, h: window.innerHeight },
};

let coreGroup;
let coreMesh;
let wireMesh;
let knotMesh;
let stars;
let renderer;
let composer;
let camera;
let scene;

const splitPayload = [];

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function setupLenis() {
  if (prefersReducedMotion || !window.Lenis || !gsap || !ScrollTrigger) {
    return;
  }

  const lenis = new window.Lenis({
    duration: 1.15,
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 1.1,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function setupCursor() {
  if (window.innerWidth <= 1120 || prefersReducedMotion) {
    document.body.classList.add('no-cursor');
    return;
  }

  let dotX = window.innerWidth / 2;
  let dotY = window.innerHeight / 2;
  let ringX = dotX;
  let ringY = dotY;

  const updateCursor = () => {
    dotX = lerp(dotX, state.mouse.x, 0.32);
    dotY = lerp(dotY, state.mouse.y, 0.32);
    ringX = lerp(ringX, state.mouse.x, 0.14);
    ringY = lerp(ringY, state.mouse.y, 0.14);

    dom.cursorDot.style.left = `${dotX}px`;
    dom.cursorDot.style.top = `${dotY}px`;
    dom.cursorRing.style.left = `${ringX}px`;
    dom.cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(updateCursor);
  };

  updateCursor();

  if (!gsap) {
    return;
  }

  const hoverables = Array.from(document.querySelectorAll('a, button, .tilt-card'));
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(dom.cursorRing, { scale: 1.5, duration: 0.2, ease: 'power2.out' });
      gsap.to(dom.cursorDot, { scale: 0.7, duration: 0.2, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(dom.cursorRing, { scale: 1, duration: 0.2, ease: 'power2.out' });
      gsap.to(dom.cursorDot, { scale: 1, duration: 0.2, ease: 'power2.out' });
    });
  });
}

function setupHoverFX() {
  dom.glowEls.forEach((el) => {
    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--glow-x', `${x}%`);
      el.style.setProperty('--glow-y', `${y}%`);
    });
  });

  dom.magneticEls.forEach((el) => {
    if (!gsap) {
      return;
    }

    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - rect.left - rect.width / 2;
      const dy = event.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: dx * 0.22,
        y: dy * 0.26,
        duration: 0.35,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'elastic.out(1, 0.38)',
      });
    });
  });

  if (!prefersReducedMotion && window.VanillaTilt) {
    window.VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 8,
      speed: 380,
      glare: true,
      'max-glare': 0.2,
      perspective: 900,
      scale: 1.02,
      gyroscope: false,
    });
  }
}

function setupSplitText() {
  if (!window.SplitType) {
    return;
  }

  dom.splitTargets.forEach((el) => {
    const split = new window.SplitType(el, { types: 'chars' });
    splitPayload.push({
      element: el,
      chars: split.chars,
      isHero: el.closest('#hero') !== null,
    });
  });
}

function setupGSAPAnimations() {
  if (!gsap) {
    return;
  }

  dom.revealEls
    .filter((el) => !el.closest('#hero'))
    .forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 26 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: ScrollTrigger
          ? {
              trigger: el,
              start: 'top 86%',
              once: true,
            }
          : undefined,
      }
      );
    });

  splitPayload
    .filter((item) => !item.isHero)
    .forEach((item) => {
      gsap.fromTo(
        item.chars,
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.82,
          stagger: 0.015,
          ease: 'power4.out',
          scrollTrigger: ScrollTrigger
            ? {
                trigger: item.element,
                start: 'top 84%',
                once: true,
              }
            : undefined,
        }
      );
    });

  if (ScrollTrigger) {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        state.scrollProgress = self.progress;
      },
    });

    gsap.to('.site-nav', {
      backgroundColor: 'rgba(5, 14, 25, 0.78)',
      borderColor: 'rgba(173, 225, 255, 0.26)',
      scrollTrigger: {
        trigger: '#capabilities',
        start: 'top top',
        end: 'top top',
        scrub: true,
      },
    });

    gsap.utils.toArray('.hero-right .floating-panel').forEach((panel, index) => {
      gsap.to(panel, {
        yPercent: -8 - index * 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    gsap.to('.stats-tape', {
      opacity: 0.55,
      scrollTrigger: {
        trigger: '#stack',
        start: 'top 80%',
        end: 'top 35%',
        scrub: true,
      },
    });
  }
}

function playIntro() {
  if (!gsap) {
    return;
  }

  const heroSplit = splitPayload.find((item) => item.isHero);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.site-nav', { y: -30, autoAlpha: 0, duration: 0.9 })
    .from('.hero .eyebrow', { y: 20, autoAlpha: 0, duration: 0.65 }, '-=0.45')
    .from(
      heroSplit ? heroSplit.chars : '.headline',
      heroSplit
        ? { yPercent: 115, autoAlpha: 0, stagger: 0.015, duration: 0.7 }
        : { y: 22, autoAlpha: 0, duration: 0.8 },
      '-=0.28'
    )
    .from('.hero-copy', { y: 24, autoAlpha: 0, duration: 0.8 }, '-=0.45')
    .from('.hero-actions > *', { y: 20, autoAlpha: 0, stagger: 0.11, duration: 0.72 }, '-=0.5')
    .from('.floating-panel', { y: 28, autoAlpha: 0, stagger: 0.11, duration: 0.74 }, '-=0.55');
}

function bootLoader() {
  if (!dom.loader) {
    return;
  }

  if (!gsap) {
    dom.loader.remove();
    playIntro();
    return;
  }

  const counter = { value: 0 };
  gsap.to(counter, {
    value: 100,
    duration: 1.8,
    ease: 'power2.out',
    onUpdate: () => {
      const current = Math.round(counter.value);
      dom.loaderBar.style.width = `${current}%`;
      dom.loaderPercent.textContent = `${current}%`;
    },
    onComplete: () => {
      gsap.to(dom.loader, {
        autoAlpha: 0,
        duration: 0.62,
        ease: 'power2.inOut',
        onComplete: () => {
          dom.loader.remove();
          playIntro();
        },
      });
    },
  });
}

function setupParallax() {
  if (prefersReducedMotion || dom.parallaxEls.length === 0) {
    return;
  }

  const target = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };

  window.addEventListener('mousemove', (event) => {
    target.x = (event.clientX / state.viewport.w - 0.5) * 2;
    target.y = (event.clientY / state.viewport.h - 0.5) * 2;
  });

  const render = () => {
    smooth.x = lerp(smooth.x, target.x, 0.08);
    smooth.y = lerp(smooth.y, target.y, 0.08);

    dom.parallaxEls.forEach((el) => {
      const depth = Number(el.dataset.depth || 0);
      const x = smooth.x * 26 * depth;
      const y = smooth.y * 20 * depth;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    requestAnimationFrame(render);
  };

  render();
}

function setupThree() {
  if (!dom.canvas) {
    return;
  }

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03070f, 0.055);

  camera = new THREE.PerspectiveCamera(
    52,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.1, window.innerWidth < 900 ? 11.4 : 9.2);

  renderer = new THREE.WebGLRenderer({
    canvas: dom.canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.9,
    0.65,
    0.1
  );
  composer.addPass(bloom);

  const ambient = new THREE.AmbientLight(0x84c9ff, 0.44);
  const key = new THREE.PointLight(0x6ef4c5, 2.2, 22, 2);
  key.position.set(3.5, 2.6, 4.2);
  const fill = new THREE.PointLight(0x0ab2ff, 1.6, 22, 2);
  fill.position.set(-4, -2.5, 2.4);
  scene.add(ambient, key, fill);

  coreGroup = new THREE.Group();
  scene.add(coreGroup);

  coreMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7, 16),
    new THREE.MeshPhysicalMaterial({
      color: 0x8bdcff,
      roughness: 0.18,
      metalness: 0.68,
      transmission: 0.35,
      thickness: 1.3,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x115f8a,
      emissiveIntensity: 0.62,
    })
  );

  wireMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 2),
    new THREE.MeshBasicMaterial({
      color: 0x6ef4c5,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })
  );

  knotMesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(2.9, 0.14, 180, 24),
    new THREE.MeshStandardMaterial({
      color: 0xffd277,
      roughness: 0.32,
      metalness: 0.65,
      emissive: 0x8a5c12,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.55,
    })
  );

  coreGroup.add(knotMesh, wireMesh, coreMesh);

  const starCount = 2200;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const radius = 7 + Math.random() * 24;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starPos[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPos[i3 + 2] = radius * Math.cos(phi);
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

  const starMat = new THREE.PointsMaterial({
    color: 0x95dfff,
    size: 0.038,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  if (gsap && ScrollTrigger) {
    gsap.to(coreGroup.rotation, {
      z: Math.PI * 0.42,
      scrollTrigger: {
        trigger: '#stack',
        start: 'top 85%',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to(coreMesh.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      scrollTrigger: {
        trigger: '#showcase',
        start: 'top 90%',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  const clock = new THREE.Clock();

  const tick = () => {
    const elapsed = clock.getElapsedTime();

    const nx = (state.mouse.x / state.viewport.w - 0.5) * 2;
    const ny = (state.mouse.y / state.viewport.h - 0.5) * 2;

    coreGroup.rotation.x = elapsed * 0.18 + ny * 0.22;
    coreGroup.rotation.y = elapsed * 0.25 + nx * 0.36;

    wireMesh.rotation.x = -elapsed * 0.11;
    wireMesh.rotation.z = elapsed * 0.14;

    knotMesh.rotation.y = -elapsed * 0.09;
    knotMesh.rotation.x = elapsed * 0.07;

    stars.rotation.y = elapsed * 0.01;
    stars.rotation.x = elapsed * 0.006;

    coreGroup.position.x = lerp(coreGroup.position.x, nx * 0.55, 0.055);
    coreGroup.position.y = lerp(coreGroup.position.y, -ny * 0.38 + state.scrollProgress * 0.45, 0.055);

    camera.position.x = lerp(camera.position.x, nx * 0.6, 0.03);
    camera.position.y = lerp(camera.position.y, -ny * 0.32 + state.scrollProgress * 0.9, 0.03);
    camera.lookAt(0, 0, 0);

    composer.render();
    requestAnimationFrame(tick);
  };

  tick();
}

function bindEvents() {
  window.addEventListener('mousemove', (event) => {
    state.mouse.x = event.clientX;
    state.mouse.y = event.clientY;
  });

  window.addEventListener('resize', () => {
    state.viewport.w = window.innerWidth;
    state.viewport.h = window.innerHeight;

    if (!camera || !renderer || !composer) {
      return;
    }

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(window.innerWidth, window.innerHeight);
  });
}

function init() {
  bindEvents();
  setupLenis();
  setupCursor();
  setupHoverFX();
  setupSplitText();
  setupGSAPAnimations();
  setupParallax();
  setupThree();
  bootLoader();
}

init();
