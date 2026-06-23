"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

function Sphere({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const color = useMemo(() => {
    if (progress >= 100) return new THREE.Color("#34d399");
    if (progress >= 50) return new THREE.Color("#38bdf8");
    return new THREE.Color("#ff6b6b");
  }, [progress]);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Mouse interaction parallax
    const targetRotX = pointer.y * 0.4 + Math.sin(t * 0.1) * 0.1;
    const targetRotY = pointer.x * 0.4 + t * 0.15;

    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;

    meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.02);
  });

  return (
    <group ref={groupRef}>
      {/* Main sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 128, 128]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.15}
          metalness={0.1}
          distort={0.35}
          speed={2}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>

      {/* Outer atmosphere */}
      <mesh>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>

      {/* Floating particles */}
      <Sparkles
        count={60}
        scale={5}
        size={4}
        speed={0.4}
        color={color}
        opacity={0.6}
      />
    </group>
  );
}

function Scene({ progress }: { progress: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#a78bfa" />
      <pointLight position={[5, -5, -5]} intensity={0.6} color="#38bdf8" />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere progress={progress} />
      </Float>
    </>
  );
}

export function InteractiveSphere({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cream/20 border-t-cream rounded-full animate-spin" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Scene progress={progress} />
        </Canvas>
      </Suspense>
    </div>
  );
}
