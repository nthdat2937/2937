// Vertex Shader for the Gemini Core
// Displaces vertices based on noise and time to create a liquid/pulsing effect
export const coreVertexShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

// Classic Perlin 3D Noise 
// (Source: https://github.com/stegu/webgl-noise/blob/master/src/classicnoise3D.glsl)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float pnoise(vec3 P, vec3 rep) {
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.y, Pi0.y, Pi1.y, Pi1.y);
  vec4 iz = vec4(Pi0.z, Pi0.z, Pi0.z, Pi0.z);
  vec4 iw = vec4(Pi1.z, Pi1.z, Pi1.z, Pi1.z);
  vec4 i = permute(permute(ix) + iy) + iz;
  vec4 j = permute(i);
  vec4 i1 = permute(ix + vec4(1.0));
  vec4 j1 = permute(i1);
  vec4 C = taylorInvSqrt(vec4(dot(j,j), dot(j1,j1), dot(i,i), dot(i1,i1)));
  vec4 G0 = C.x * j;
  vec4 G1 = C.y * j1;
  vec4 G2 = C.z * i;
  vec4 G3 = C.w * i1;
  vec4 P0 = vec4(Pf0.x, Pf0.y, Pf0.z, 1.0);
  vec4 P1 = vec4(Pf0.x, Pf1.y, Pf0.z, 1.0);
  vec4 P2 = vec4(Pf0.x, Pf0.y, Pf1.z, 1.0);
  vec4 P3 = vec4(Pf0.x, Pf1.y, Pf1.z, 1.0);
  return 42.0 * dot(0.5 - abs(0.5 - step(0.0, P0)), 
         step(0.0, P0) * dot(G0, P0) + step(0.0, P1) * dot(G1, P1) + 
         step(0.0, P2) * dot(G2, P2) + step(0.0, P3) * dot(G3, P3));
}
// End noise

void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;

    // Displacement logic
    float noise = pnoise(position * 2.0 + uTime * 0.5, vec3(10.0));
    vDisplacement = noise;
    
    vec3 newPosition = position + normal * (noise * 0.2);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

// Fragment Shader for Gemeni Core
// Uses Fresnel effect for inner glow and color gradients
export const coreFragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
    // Fresnel
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = dot(viewDirection, vNormal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 2.0);

    // Color mixing based on displacement
    vec3 color = mix(uColor1, uColor2, vDisplacement * 0.5 + 0.5);
    
    // Add fresnel glow
    color += vec3(fresnel * 0.8);

    gl_FragColor = vec4(color, 1.0);
}
`;

// Vertex Shader for Particles
export const particleVertexShader = `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Size attenuation
    gl_PointSize = aScale * uPixelRatio * (50.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

// Fragment Shader for Particles
export const particleFragmentShader = `
void main() {
    // Circular particle
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;
    
    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}
`;
