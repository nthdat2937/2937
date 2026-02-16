// ========================================
//  CLAUDE — Consciousness Beyond Code
//  Main Application Logic
// ========================================

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ---- Config ----
const CONFIG = {
    particles: {
        count: 6000,
        size: 2.0,
        speed: 0.0004,
        morphSpeed: 0.001,
        connectionDistance: 1.8,
        maxConnections: 800,
    },
    colors: {
        primary: new THREE.Color('#D97757'),
        secondary: new THREE.Color('#E8956A'),
        ambient: new THREE.Color('#2a1a14'),
        bg: new THREE.Color('#0a0a0f'),
    },
    bloom: {
        strength: 0.6,
        radius: 0.4,
        threshold: 0.2,
    }
};

// ---- State ----
const state = {
    mouse: new THREE.Vector2(0, 0),
    targetMouse: new THREE.Vector2(0, 0),
    scrollProgress: 0,
    isLoaded: false,
    time: 0,
    currentShape: 0,
};

// ---- Three.js Setup ----
const canvas = document.getElementById('webgl');
const scene = new THREE.Scene();
scene.background = CONFIG.colors.bg;
scene.fog = new THREE.FogExp2(CONFIG.colors.bg, 0.04);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 12);

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ---- Post Processing ----
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    CONFIG.bloom.strength,
    CONFIG.bloom.radius,
    CONFIG.bloom.threshold
);
composer.addPass(bloomPass);

// ---- Generate Shape Positions ----
function generateSphere(count, radius = 4) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = radius * (0.8 + Math.random() * 0.2);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
}

function generateTorus(count, majorR = 3.5, minorR = 1.2) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const r = minorR * (0.8 + Math.random() * 0.2);
        positions[i * 3] = (majorR + r * Math.cos(v)) * Math.cos(u);
        positions[i * 3 + 1] = (majorR + r * Math.cos(v)) * Math.sin(u);
        positions[i * 3 + 2] = r * Math.sin(v);
    }
    return positions;
}

function generateDNA(count) {
    const positions = new Float32Array(count * 3);
    const height = 10;
    const radius = 2.5;
    for (let i = 0; i < count; i++) {
        const t = (i / count) * height - height / 2;
        const strand = Math.random() > 0.5 ? 0 : Math.PI;
        const angle = (t / height) * Math.PI * 6 + strand;
        const r = radius * (0.9 + Math.random() * 0.1);
        positions[i * 3] = r * Math.cos(angle);
        positions[i * 3 + 1] = t;
        positions[i * 3 + 2] = r * Math.sin(angle);
    }
    return positions;
}

function generateBrain(count) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Generate brain-like shape: two lobes
        const side = Math.random() > 0.5 ? 1 : -1;
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * Math.PI * 2;
        let r = 3 * (0.7 + Math.random() * 0.3);
        const x = r * Math.sin(theta) * Math.cos(phi) * 0.8 + side * 0.8;
        const y = r * Math.cos(theta) * 1.1;
        const z = r * Math.sin(theta) * Math.sin(phi) * 0.9;
        // Add cortex folds (sine distortion)
        const fold = Math.sin(y * 3) * 0.3 + Math.sin(x * 4) * 0.15;
        positions[i * 3] = x + fold * 0.5;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z + fold * 0.3;
    }
    return positions;
}

function generateConstellation(count) {
    const positions = new Float32Array(count * 3);
    const nodes = 20;
    const nodePositions = [];
    for (let n = 0; n < nodes; n++) {
        nodePositions.push([
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        ]);
    }
    for (let i = 0; i < count; i++) {
        const node = nodePositions[Math.floor(Math.random() * nodes)];
        const spread = 0.6;
        positions[i * 3] = node[0] + (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = node[1] + (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = node[2] + (Math.random() - 0.5) * spread;
    }
    return positions;
}

// ---- Create Particle System ----
const shapes = [
    generateSphere(CONFIG.particles.count),
    generateTorus(CONFIG.particles.count),
    generateDNA(CONFIG.particles.count),
    generateBrain(CONFIG.particles.count),
    generateConstellation(CONFIG.particles.count),
];

// Vertex shader
const vertexShader = `
    uniform float uTime;
    uniform float uSize;
    uniform float uMorphProgress;
    uniform vec2 uMouse;
    attribute vec3 aTarget;
    attribute float aRandom;
    varying float vAlpha;
    varying float vRandom;

    void main() {
        vec3 morphed = mix(position, aTarget, uMorphProgress);

        // Add organic motion
        float wave = sin(morphed.x * 2.0 + uTime * 0.5) * 0.15;
        wave += cos(morphed.y * 1.5 + uTime * 0.3) * 0.1;
        wave += sin(morphed.z * 1.8 + uTime * 0.4) * 0.12;
        morphed += normalize(morphed) * wave * aRandom;

        // Mouse interaction - repel nearby particles
        vec3 screenMorphed = morphed;
        float distToMouse = length(screenMorphed.xy - uMouse * 4.0);
        if (distToMouse < 2.5) {
            vec2 repelDir = normalize(screenMorphed.xy - uMouse * 4.0);
            float repelForce = (2.5 - distToMouse) * 0.4;
            morphed.xy += repelDir * repelForce;
        }

        vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);
        gl_PointSize = uSize * (300.0 / -mvPosition.z) * (0.5 + aRandom * 0.5);
        gl_Position = projectionMatrix * mvPosition;

        vAlpha = 0.4 + aRandom * 0.6;
        vRandom = aRandom;
    }
`;

// Fragment shader
const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uTime;
    varying float vAlpha;
    varying float vRandom;

    void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
        vec3 color = mix(uColor1, uColor2, vRandom + sin(uTime * 0.5) * 0.2);

        // Core glow
        float core = smoothstep(0.3, 0.0, dist);
        color += vec3(1.0) * core * 0.3;

        gl_FragColor = vec4(color, alpha * 0.7);
    }
`;

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(shapes[0].slice(), 3));
geometry.setAttribute('aTarget', new THREE.BufferAttribute(shapes[1].slice(), 3));

const randoms = new Float32Array(CONFIG.particles.count);
for (let i = 0; i < CONFIG.particles.count; i++) {
    randoms[i] = Math.random();
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime: { value: 0 },
        uSize: { value: CONFIG.particles.size },
        uMorphProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor1: { value: CONFIG.colors.primary },
        uColor2: { value: CONFIG.colors.secondary },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Connection lines
const lineGeometry = new THREE.BufferGeometry();
const linePositions = new Float32Array(CONFIG.particles.maxConnections * 6);
const lineColors = new Float32Array(CONFIG.particles.maxConnections * 6);
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
lineGeometry.setDrawRange(0, 0);

const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});

const connections = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(connections);

// ---- Ambient light particles ----
const dustCount = 500;
const dustGeometry = new THREE.BufferGeometry();
const dustPositions = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 30;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
}
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

const dustMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: CONFIG.colors.primary,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});

const dust = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dust);

// ---- Update Connections ----
function updateConnections() {
    const positions = geometry.attributes.position.array;
    const linePos = lineGeometry.attributes.position.array;
    const lineCol = lineGeometry.attributes.color.array;
    let vertexCount = 0;
    const dist = CONFIG.particles.connectionDistance;
    const maxConn = CONFIG.particles.maxConnections;

    // Sample random pairs for performance
    for (let k = 0; k < maxConn * 2; k++) {
        const i = Math.floor(Math.random() * CONFIG.particles.count);
        const j = Math.floor(Math.random() * CONFIG.particles.count);
        if (i === j) continue;

        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (d < dist) {
            const alpha = 1 - d / dist;
            const idx = vertexCount * 6;
            linePos[idx] = positions[i * 3];
            linePos[idx + 1] = positions[i * 3 + 1];
            linePos[idx + 2] = positions[i * 3 + 2];
            linePos[idx + 3] = positions[j * 3];
            linePos[idx + 4] = positions[j * 3 + 1];
            linePos[idx + 5] = positions[j * 3 + 2];

            const r = 0.85 * alpha, g = 0.47 * alpha, b = 0.34 * alpha;
            lineCol[idx] = r; lineCol[idx + 1] = g; lineCol[idx + 2] = b;
            lineCol[idx + 3] = r; lineCol[idx + 4] = g; lineCol[idx + 5] = b;

            vertexCount++;
            if (vertexCount >= maxConn) break;
        }
    }

    lineGeometry.setDrawRange(0, vertexCount * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
}

// ---- Morphing ----
let morphTimeout = null;
function morphToShape(index) {
    const current = state.currentShape;
    const next = index % shapes.length;
    if (current === next) return;

    const positions = geometry.attributes.position;
    const targets = geometry.attributes.aTarget;

    // Copy current to position, set new target
    for (let i = 0; i < CONFIG.particles.count * 3; i++) {
        positions.array[i] = positions.array[i] * (1 - material.uniforms.uMorphProgress.value) +
            targets.array[i] * material.uniforms.uMorphProgress.value;
    }
    positions.needsUpdate = true;

    // Set new target
    const newTarget = shapes[next];
    for (let i = 0; i < CONFIG.particles.count * 3; i++) {
        targets.array[i] = newTarget[i];
    }
    targets.needsUpdate = true;

    material.uniforms.uMorphProgress.value = 0;

    gsap.to(material.uniforms.uMorphProgress, {
        value: 1,
        duration: 2.5,
        ease: 'power2.inOut',
    });

    state.currentShape = next;
}

// Auto-morph cycle
function startMorphCycle() {
    let shapeIndex = 1;
    morphTimeout = setInterval(() => {
        shapeIndex++;
        morphToShape(shapeIndex);
    }, 6000);
}

// ---- Animation Loop ----
function animate() {
    requestAnimationFrame(animate);
    state.time += 0.016;

    // Smooth mouse
    state.mouse.lerp(state.targetMouse, 0.05);
    material.uniforms.uMouse.value.copy(state.mouse);
    material.uniforms.uTime.value = state.time;

    // Rotate particles
    particles.rotation.y += 0.0008;
    particles.rotation.x = Math.sin(state.time * 0.1) * 0.1;

    // Camera parallax from mouse
    camera.position.x += (state.mouse.x * 1.5 - camera.position.x) * 0.02;
    camera.position.y += (state.mouse.y * 0.8 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    // Dust rotation
    dust.rotation.y += 0.0002;
    dust.rotation.x += 0.0001;

    // Update connections every few frames
    if (Math.floor(state.time * 60) % 3 === 0) {
        updateConnections();
    }

    composer.render();
}

// ---- GSAP & Scroll Animation ----
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Lenis smooth scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Nav visibility
    ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
            document.getElementById('main-nav').classList.toggle('visible', self.progress > 0);
        }
    });

    // Hero entrance animation
    const heroTL = gsap.timeline({ delay: 0.5 });

    heroTL
        .to('.hero-eyebrow', { opacity: 1, duration: 1, ease: 'power2.out' })
        .to('.title-word', {
            y: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out',
        }, '-=0.5')
        .to('.hero-description', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.5')
        .to('.hero-actions', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.4')
        .to('.hero-stats', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.3')
        .to('.scroll-indicator', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.2');

    // Stat counter animation
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        gsap.to(el, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
            }
        });
    });

    // Reveal-up animations
    gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            }
        });
    });

    // Section headers
    gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.from(header.querySelector('.section-number'), {
            opacity: 0,
            x: -20,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
            }
        });
    });

    // Capability cards stagger
    gsap.utils.toArray('.capability-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.capabilities-grid',
                start: 'top 75%',
            }
        });
    });

    // Pillar cards stagger
    gsap.utils.toArray('.pillar').forEach((pillar, i) => {
        gsap.from(pillar, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.pillars-grid',
                start: 'top 80%',
            }
        });
    });

    // Morph particles on scroll
    ScrollTrigger.create({
        trigger: '#about',
        start: 'top center',
        onEnter: () => morphToShape(1),
    });
    ScrollTrigger.create({
        trigger: '#capabilities',
        start: 'top center',
        onEnter: () => morphToShape(2),
    });
    ScrollTrigger.create({
        trigger: '#philosophy',
        start: 'top center',
        onEnter: () => morphToShape(3),
    });
    ScrollTrigger.create({
        trigger: '#experience',
        start: 'top center',
        onEnter: () => morphToShape(4),
    });

    // Parallax on sections
    gsap.utils.toArray('.section').forEach((section) => {
        gsap.to(section, {
            backgroundPositionY: '50%',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });
    });

    // Active nav link tracking
    const sections = ['hero', 'about', 'capabilities', 'philosophy', 'experience'];
    sections.forEach(id => {
        ScrollTrigger.create({
            trigger: `#${id}`,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveNav(id),
            onEnterBack: () => setActiveNav(id),
        });
    });

    // Smooth scroll to section on nav click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            gsap.to(window, { scrollTo: target, duration: 1.5, ease: 'power2.inOut' });
        });
    });

    // Enter button
    document.getElementById('enter-btn')?.addEventListener('click', () => {
        gsap.to(window, { scrollTo: '#about', duration: 1.5, ease: 'power2.inOut' });
    });
}

function setActiveNav(id) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const active = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (active) active.classList.add('active');
}

// ---- Terminal Typing Effect ----
function initTerminal() {
    const lines = [
        { text: 'claude.think("What does it mean to understand?")', delay: 2000 },
        { text: '\n  → Processing with 200B parameters...', delay: 800 },
        { text: '\n  → Analyzing across 175 languages...', delay: 600 },
        { text: '\n  → Applying Constitutional AI framework...', delay: 700 },
        { text: '\n\n  "Understanding is not about having answers.\n   It\'s about knowing the right questions to ask,\n   and being honest about what remains unknown."', delay: 100 },
        { text: '\n\n  — Claude, Session #∞', delay: 500 },
    ];

    const target = document.getElementById('typing-target');
    if (!target) return;

    let lineIndex = 0;
    let charIndex = 0;
    let isStarted = false;

    ScrollTrigger.create({
        trigger: '#experience',
        start: 'top 60%',
        once: true,
        onEnter: () => {
            if (!isStarted) {
                isStarted = true;
                typeNext();
            }
        }
    });

    function typeNext() {
        if (lineIndex >= lines.length) return;

        const line = lines[lineIndex];
        if (charIndex < line.text.length) {
            target.textContent += line.text[charIndex];
            charIndex++;
            setTimeout(typeNext, 20 + Math.random() * 30);
        } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeNext, lines[lineIndex - 1].delay);
        }
    }
}

// ---- Card Glow Effect ----
function initCardGlow() {
    document.querySelectorAll('.capability-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });
}

// ---- Cursor Glow ----
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    document.addEventListener('mousemove', (e) => {
        gsap.to(glow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.8,
            ease: 'power2.out',
        });

        // Update Three.js mouse
        state.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        state.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
}

// ---- DNA Canvas (About Section) ----
function initDNACanvas() {
    const container = document.getElementById('dna-canvas');
    if (!container) return;

    const dnaCanvas = document.createElement('canvas');
    dnaCanvas.width = container.clientWidth * 2;
    dnaCanvas.height = container.clientHeight * 2;
    dnaCanvas.style.width = '100%';
    dnaCanvas.style.height = '100%';
    container.appendChild(dnaCanvas);

    const ctx = dnaCanvas.getContext('2d');
    let t = 0;

    function drawDNA() {
        ctx.clearRect(0, 0, dnaCanvas.width, dnaCanvas.height);
        const w = dnaCanvas.width;
        const h = dnaCanvas.height;
        const cx = w / 2;
        const cy = h / 2;

        // Draw neural network / constellation
        const nodes = [];
        const nodeCount = 30;
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2 + t * 0.3;
            const r = 100 + Math.sin(angle * 3 + t) * 60 + Math.cos(i * 0.7 + t * 0.5) * 40;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            nodes.push({ x, y });
        }

        // Draw connections
        ctx.strokeStyle = 'rgba(217, 119, 87, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    ctx.globalAlpha = (1 - dist / 200) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        nodes.forEach((node, i) => {
            const pulse = Math.sin(t * 2 + i * 0.5) * 0.5 + 0.5;
            const size = 3 + pulse * 3;

            ctx.globalAlpha = 0.3 + pulse * 0.4;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(217, 119, 87, ${0.05 + pulse * 0.05})`;
            ctx.fill();

            ctx.globalAlpha = 0.6 + pulse * 0.4;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(217, 119, 87, ${0.5 + pulse * 0.3})`;
            ctx.fill();
        });

        // Center orb
        ctx.globalAlpha = 1;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
        gradient.addColorStop(0, 'rgba(217, 119, 87, 0.15)');
        gradient.addColorStop(0.5, 'rgba(217, 119, 87, 0.03)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.fill();

        t += 0.01;
        requestAnimationFrame(drawDNA);
    }

    drawDNA();
}

// ---- Loading Sequence ----
function initLoader() {
    const bar = document.querySelector('.loader-bar');
    const percent = document.querySelector('.loader-percent');
    const loader = document.getElementById('loader');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;

        if (bar) bar.style.width = progress + '%';
        if (percent) percent.textContent = Math.floor(progress) + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        loader.style.display = 'none';
                        state.isLoaded = true;
                        startMorphCycle();
                    }
                });
            }, 400);
        }
    }, 150);
}

// ---- Window Events ----
function initEvents() {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ---- Init ----
function init() {
    initLoader();
    initCursorGlow();
    initCardGlow();
    initDNACanvas();
    initGSAP();
    initTerminal();
    initEvents();
    animate();
}

init();
