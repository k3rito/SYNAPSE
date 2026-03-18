/* eslint-disable react-hooks/purity */
'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const NeuralNetwork3D = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random points for the neural network
  const particlesCount = 200;
  
  const { positions, colors } = useMemo(() => {
    const positionsArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    const colorBase = new THREE.Color('#22D3EE'); // Cyan
    
    for (let i = 0; i < particlesCount; i++) {
      positionsArray[i * 3] = (Math.random() - 0.5) * 10;
      positionsArray[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 10;

      colorsArray[i * 3] = colorBase.r + (Math.random() * 0.2);
      colorsArray[i * 3 + 1] = colorBase.g;
      colorsArray[i * 3 + 2] = colorBase.b + (Math.random() * 0.2);
    }
    
    return { positions: positionsArray, colors: colorsArray };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
