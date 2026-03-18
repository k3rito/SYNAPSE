import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';

function ChatbotModel() {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/chatbot.glb');

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
      modelRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.05 - 0.1;
    }
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      scale={[2.2, 2.2, 2.2]} 
      position={[0, -0.8, 0]}
    />
  );
}

// useGLTF.preload('/models/chatbot.glb');

export const ChatbotOrb = () => {
  // Use actual WebGL support hook or check
  const isWebGLSupported = useWebGLSupport();

  return (
    <div className="w-[50px] h-[50px] relative flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300">
      {/* Outer Glow Aura - Reduced by 60% */}
      <div className="absolute inset-0 bg-brand-cyan/10 blur-md rounded-full scale-110 animate-pulse" />
      <div className="absolute inset-2 bg-brand-cyan/20 blur-sm rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* 3D Model Canvas OR Static Fallback */}
      <div className="relative w-full h-full z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
        {!isWebGLSupported ? (
          /* Static High-Tech Orb Fallback */
          <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-cyan to-white/40 border border-brand-cyan/30 animate-glow-pulse flex items-center justify-center">
            <div className="w-1/2 h-1/2 bg-deep-black rounded-full shadow-[inset_0_0_5px_#22D3EE]" />
          </div>
        ) : (
          <Canvas 
            camera={{ position: [0, 0, 4.5], fov: 40 }} 
            gl={{ 
              alpha: true,
              preserveDrawingBuffer: true, 
              powerPreference: "high-performance",
              antialias: true 
            }}
          >
            <ambientLight intensity={2.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-5, -5, -5]} intensity={1.5} color="#22D3EE" />
            <Suspense fallback={null}>
              <ChatbotModel />
            </Suspense>
          </Canvas>
        )}
      </div>
    </div>
  );
};
