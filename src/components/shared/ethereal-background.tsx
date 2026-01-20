'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

function FloatingShape({ position }: { position: [number, number, number] }) {
  const geometry = useMemo(() => {
    return Math.random() > 0.5
      ? new THREE.IcosahedronGeometry(1, 0)
      : new THREE.TorusKnotGeometry(0.6, 0.25, 100, 16);
  }, []);

  const meshRef = useRef<THREE.Mesh>(null!);

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshPhysicalMaterial
        roughness={0.2}
        metalness={0.1}
        transmission={0.7}
        ior={1.3}
        thickness={1.5}
        color="#6366f1"
      />
    </mesh>
  );
}

function MouseLight() {
  const light = useRef<THREE.SpotLight>(null!);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useFrame((state) => {
    if (isMounted && light.current) {
      light.current.position.set(
        (state.mouse.x * state.viewport.width) / 2,
        (state.mouse.y * state.viewport.height) / 2,
        3
      );
    }
  });

  return (
    <spotLight
      ref={light}
      color={'#6366f1'}
      intensity={isMounted ? 200 : 0}
      angle={0.2}
      penumbra={1}
      distance={20}
      castShadow
      decay={2}
    />
  );
}


export default function EtherealBackground() {
  const shapes = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => (
      <Float
        key={i}
        speed={0.75}
        rotationIntensity={0.5}
        floatIntensity={1.5}
      >
        <FloatingShape
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            -5 - Math.random() * 10,
          ]}
        />
      </Float>
    ));
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <color attach="background" args={['#27272a']} />
        <ambientLight intensity={0.2} />
        <MouseLight />
        {shapes}
      </Canvas>
    </div>
  );
}
