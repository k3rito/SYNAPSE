'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Environment, 
  PerspectiveCamera, 
  ContactShadows, 
  Stars,
  useGLTF,
  MeshDistortMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { WebGLErrorBoundary } from '@/components/home/ErrorBoundary';


const CinematicModel = () => {
  // Production model path
  const modelPath = '/models/synapse-bg.glb';
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <WebGLErrorBoundary>
        <Suspense fallback={<mesh><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color="#22d3ee" wireframe /></mesh>}>
          <GLBModel path={modelPath} />
        </Suspense>
      </WebGLErrorBoundary>
    </Float>
  );
};

// Separate component for GLB loading to catch its suspension and errors
const GLBModel = ({ path }: { path: string }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
};


const Scene = () => {
  // In a real scenario, we'd use useGLTF(modelPath) 
  // For now, let's create a premium abstract geometry that represents the "Synapse"
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[10, 3, 100, 16]} />
        <MeshDistortMaterial
          color="#22d3ee"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#115e59"
          emissiveIntensity={2}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Floating particles/synapses */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

export const CinematicBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-deep-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/5 via-transparent to-deep-black pointer-events-none" />
      
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#22d3ee" />
        
        <CinematicModel />
        
        <Environment preset="night" />
        <ContactShadows position={[0, -15, 0]} opacity={0.4} scale={40} blur={2} far={15} />
      </Canvas>
      
      {/* Cinematic overlay effects */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none" />
    </div>
  );
};

export default CinematicBackground;
