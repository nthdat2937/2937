import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { coreVertexShader, coreFragmentShader, particleVertexShader, particleFragmentShader } from './shaders.js';

// --- Configuration ---
const CONFIG = {
    bloomStrength: 2.0,
    bloomRadius: 0.5,
    bloomThreshold: 0.1,
    coreColor1: '#2b00ff', // Deep Blue
    coreColor2: '#00d5ff', // Cyan
};

// --- DOM Elements ---
const canvas = document.querySelector('#webgl');
const loader = document.querySelector('#loader');

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030005, 0.02); // Tighter fog for depth

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Post Processing ---
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
);
bloomPass.threshold = CONFIG.bloomThreshold;
bloomPass.strength = CONFIG.bloomStrength;
bloomPass.radius = CONFIG.bloomRadius;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// --- Objects ---

// 1. The Core (Shader Material)
const coreGeometry = new THREE.IcosahedronGeometry(1.2, 30); // High detail for smooth noise
const coreMaterial = new THREE.ShaderMaterial({
    vertexShader: coreVertexShader,
    fragmentShader: coreFragmentShader,
    uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(CONFIG.coreColor1) },
        uColor2: { value: new THREE.Color(CONFIG.coreColor2) }
    },
    wireframe: false,
    transparent: true,
    side: THREE.DoubleSide
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

// 2. Starfield Particles 
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);
const scaleArray = new Float32Array(particlesCount);

for(let i = 0; i < particlesCount; i++) {
    // Random position in a sphere
    const i3 = i * 3;
    const r = 10 + Math.random() * 20; // Distance from center
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    posArray[i3] = r * Math.sin(phi) * Math.cos(theta);
    posArray[i3+1] = r * Math.sin(phi) * Math.sin(theta);
    posArray[i3+2] = r * Math.cos(phi);

    scaleArray[i] = Math.random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// --- Interaction State ---
const mouse = new THREE.Vector2();
const targetMouse = new THREE.Vector2();
let scrollProgress = 0;

window.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// --- Animation Loop ---
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = clock.getDelta();

    // Update Uniforms
    coreMaterial.uniforms.uTime.value = elapsedTime;
    particlesMaterial.uniforms.uTime.value = elapsedTime;

    // Smooth Mouse Interaction
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    // Core Rotation & Movement
    core.rotation.y = elapsedTime * 0.1;
    core.rotation.x = mouse.y * 0.2;
    core.rotation.z = mouse.x * 0.2;
    
    // Parallax effect on Core
    core.position.x = mouse.x * 0.5;
    core.position.y = mouse.y * 0.5;

    // Particles Rotation
    particles.rotation.y = elapsedTime * 0.02 + scrollProgress * 0.1;

    // Camera Scroll Interaction (Simulated)
    // In a real impl, we'd map lenis scroll to this
    
    // Render
    composer.render();

    window.requestAnimationFrame(tick);
}

// --- Resize Handler ---
window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Update composer
    composer.setSize(window.innerWidth, window.innerHeight);
    
    // Update Uniforms
    particlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
});

// --- Init sequence ---
window.addEventListener('load', () => {
    // Smooth Scroll initialization
    const lenis = new Lenis();

    lenis.on('scroll', (e) => {
        // e.progress is 0 to 1
        // We can capture this if lenis provides it, or calculate manual scroll %
        // Simple approx from window.scrollY
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        scrollProgress = window.scrollY / totalHeight;
        
        // Move camera based on scroll
        camera.position.z = 4 + scrollProgress * 5; // Move back as we scroll?
        camera.rotation.x = -scrollProgress * 0.5;
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Hide loader
    setTimeout(() => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                loader.style.display = 'none';
            }
        });
        
        // Intro animations
        const tl = gsap.timeline();
        
        tl.from('.hero-title .line', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        })
        .from('.hero-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, "-=0.5")
        .from('#explore-btn', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, "-=0.6")
        .from('.hud-nav', {
            y: -20,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        }, "-=1");

    }, 500); // Shorter delay for dev

    // --- Scroll Animations (GSAP) ---
    
    // Feature 1: Neural Architecture
    // Move Core to the right, Camera slight zoom
    gsap.to(core.position, {
        x: 2,
        y: 0.5,
        scrollTrigger: {
            trigger: "#feature-1",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    });

    gsap.to(coreMaterial.uniforms.uColor1.value, {
        r: 1.0, g: 0.2, b: 0.5, // Pink/Red shift
        scrollTrigger: {
            trigger: "#feature-1",
            start: "top center",
            end: "bottom center",
            scrub: true
        }
    });

    // Feature 2: Quantum Processing
    // Move Core to the left
    gsap.to(core.position, {
        x: -2,
        y: -0.5,
        scrollTrigger: {
            trigger: "#feature-2",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    });

    // Intensify distortion on scroll
    gsap.to(coreMaterial.uniforms.uTime, {
        value: 100, // Speed up time roughly
        scrollTrigger: {
            trigger: "#feature-2",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // Footer: Center and Explode
    gsap.to(core.scale, {
        x: 3, y: 3, z: 3,
        scrollTrigger: {
            trigger: ".footer-section",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });
    
    gsap.to(core.position, {
        x: 0, y: 0,
        scrollTrigger: {
            trigger: ".footer-section",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });

    tick();
});
