import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import * as THREE from "three";

function Sphere({ progress }: { progress: number }) {
  const meshRef = useRef<any>(null);
  const wireRef = useRef<any>(null);
  const lightRef = useRef<any>(null);
  const { pointer } = useThree();

  const color = useMemo(() => {
    if (progress >= 100) return new THREE.Color("#34d399");
    if (progress >= 50) return new THREE.Color("#38bdf8");
    return new THREE.Color("#ff6b6b");
  }, [progress]);

  useFrame((state: any) => {
    if (!meshRef.current || !wireRef.current) return;
    const t = state.clock.getElapsedTime();

    const targetRotX = pointer.y * 0.5 + Math.sin(t * 0.1) * 0.1;
    const targetRotY = pointer.x * 0.5 + t * 0.2;

    meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.05;
    wireRef.current.rotation.x = meshRef.current.rotation.x;
    wireRef.current.rotation.y = meshRef.current.rotation.y;

    meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.02);
    wireRef.current.scale.setScalar(1.05 + Math.sin(t * 1.5) * 0.02);

    if (lightRef.current) {
      lightRef.current.position.x = pointer.x * 5;
      lightRef.current.position.y = pointer.y * 5;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          color={color as any}
          roughness={0.2}
          metalness={0.3}
          emissive={color as any}
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color={color as any} transparent opacity={0.15} wireframe />
      </mesh>
      <pointLight ref={lightRef} intensity={2} distance={10} color={color as any} />
    </>
  );
}

function Scene({ progress }: { progress: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#a78bfa" />
      <Sphere progress={progress} />
    </>
  );
}

export function InteractiveSphere({ progress = 0 }: { progress?: number }) {
  return (
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene progress={progress} />
      </Canvas>
    </Suspense>
  );
}
