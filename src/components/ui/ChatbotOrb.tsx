import React, { useRef, Suspense, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, PerformanceMonitor, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';

function ChatbotModel({ isHighPerf }: { isHighPerf: boolean }) {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/chatbot.glb');
  const { pointer } = useThree();

  // Smoothing for mouse tracking
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (modelRef.current) {
      // 1. Smooth Levitation
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      
      // 2. Breathing Scaling
      const breath = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      modelRef.current.scale.set(
        2.2 * breath, 
        2.2 * breath, 
        2.2 * breath
      );

      // 3. Mouse Tracking (Only on Desktop/HighPerf)
      if (isHighPerf) {
        // High Intensity Tracking
        targetRotation.current.y = (pointer.x * Math.PI) / 2.5; 
        targetRotation.current.x = -(pointer.y * Math.PI) / 3.5;
        
        // Smooth but very responsive interpolation (0.15 lerp)
        modelRef.current.rotation.y = THREE.MathUtils.lerp(
          modelRef.current.rotation.y, 
          targetRotation.current.y + (state.clock.elapsedTime * 0.05), // Subtle base rotation
          0.15
        );
        modelRef.current.rotation.x = THREE.MathUtils.lerp(
          modelRef.current.rotation.x,
          targetRotation.current.x,
          0.15
        );
      } else {
        modelRef.current.rotation.y += 0.005;
      }
    }
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      position={[0, -0.6, 0]}
    />
  );
}

export const ChatbotOrb = () => {
  const isWebGLSupported = useWebGLSupport();
  const [dpr, setDpr] = useState(1.5);
  const [isHighPerf, setIsHighPerf] = useState(true);

  return (
    <div 
      id="chatbot-container"
      className="w-[10vw] h-[10vw] min-w-[70px] min-h-[70px] max-w-[150px] max-h-[150px] relative flex items-center justify-center cursor-pointer transition-all duration-300"
    >
      {/* 3D Model Canvas OR Static Fallback */}
      <div className="relative w-full h-full z-10 transition-transform duration-500 hover:scale-110 active:scale-95">
        {!isWebGLSupported ? (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-black border border-brand-cyan/30 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-brand-cyan shadow-[0_0_15px_#22D3EE]" />
          </div>
        ) : (
          <Canvas 
            dpr={dpr}
            gl={{ 
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: true
            }}
          >
            <PerformanceMonitor 
              onIncline={() => { setDpr(2); setIsHighPerf(true); }}
              onDecline={() => { setDpr(1); setIsHighPerf(false); }}
            />
            <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={35} />
            
            <ambientLight intensity={isHighPerf ? 1.5 : 2} />
            <spotLight 
              position={[5, 5, 5]} 
              angle={0.15} 
              penumbra={1} 
              intensity={2} 
              color="#ffffff" 
            />
            <pointLight position={[-5, -5, -5]} intensity={1} color="#22D3EE" />
            
            <Suspense fallback={null}>
              <ChatbotModel isHighPerf={isHighPerf} />
            </Suspense>
          </Canvas>
        )}
      </div>
    </div>
  );
};
