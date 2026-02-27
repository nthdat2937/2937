import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, TorusKnot, Sphere, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedTorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <TorusKnot 
        ref={meshRef} 
        args={[1.5, 0.4, 128, 32]}
      >
        <meshStandardMaterial 
          color="#00f5ff" 
          emissive="#00f5ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          wireframe={false}
        />
      </TorusKnot>
    </Float>
  );
}

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[0.5, 32, 32]} position={[3, 0, -2]}>
        <meshStandardMaterial 
          color="#bf00ff" 
          emissive="#bf00ff"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  );
}

function AnimatedIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={0.8}>
      <Icosahedron ref={meshRef} args={[0.6, 0]} position={[-3, 1, -1]}>
        <meshStandardMaterial 
          color="#ff00a8" 
          emissive="#ff00a8"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </Icosahedron>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.02} 
        color="#00f5ff" 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#ff00a8" />
      
      <AnimatedTorusKnot />
      <AnimatedSphere />
      <AnimatedIcosahedron />
      <Particles />
      
      <fog attach="fog" args={['#0a0a0f', 5, 20]} />
    </>
  );
}

export function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
