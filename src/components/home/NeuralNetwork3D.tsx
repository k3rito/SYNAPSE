'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const DATA_COUNT = 15; // Reduced cubes count
const NEURAL_NODES = 12;
const CHIPS_COUNT = 8;

const Microchip = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        {/* Procedural "traces" on the chip */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.6, 0.01, 0.6]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2} />
        </mesh>
      </mesh>
    </Float>
  );
};

const DataCube = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          transparent 
          opacity={0.3} 
          wireframe 
        />
      </mesh>
    </Float>
  );
};

export const NeuralNetwork3D = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate random data for elements
  const data = useMemo(() => ({
    cubePos: Array.from({ length: DATA_COUNT }, () => [
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15
    ] as [number, number, number]),
    chipPos: Array.from({ length: CHIPS_COUNT }, () => [
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    ] as [number, number, number]),
    nodes: Array.from({ length: NEURAL_NODES }, () => [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ] as [number, number, number])
  }), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#22D3EE" />
      
      {/* 1. Data Cubes (Reduced) */}
      {data.cubePos.map((pos, i) => (
        <DataCube key={`cube-${i}`} position={pos} />
      ))}

      {/* 2. Microchips */}
      {data.chipPos.map((pos, i) => (
        <Microchip key={`chip-${i}`} position={pos} />
      ))}

      {/* 3. Neural Network (Nodes and Lines) */}
      {data.nodes.map((pos, i) => (
        <React.Fragment key={`node-net-${i}`}>
          <Float speed={3} floatIntensity={0.5}>
            <Sphere args={[0.1, 16, 16]} position={pos}>
              <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.5} />
            </Sphere>
          </Float>
          {/* Connect to a random other node */}
          {i > 0 && (
            <Line
              points={[pos, data.nodes[i - 1]]}
              color="#22D3EE"
              lineWidth={0.5}
              transparent
              opacity={0.2}
            />
          )}
        </React.Fragment>
      ))}

      {/* 4. Abstract "Robots" (Simplified shapes) */}
      <Float speed={1} rotationIntensity={2} floatIntensity={2} position={[2, 2, -2]}>
        <group>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" />
          </mesh>
        </group>
      </Float>
    </group>
  );
};
