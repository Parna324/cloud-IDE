import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function Orb({ position, color, scale }) {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x += delta * 0.25;
    meshRef.current.rotation.y += delta * 0.18;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
    </mesh>
  );
}

function SceneContent() {
  const colors = useMemo(
    () => ["#38bdf8", "#22c55e", "#f97316", "#a855f7"],
    [],
  );

  return (
    <group>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 4, 4]} intensity={1.1} />

      <Orb position={[-2.3, 1.1, -1]} color={colors[0]} scale={0.8} />
      <Orb position={[1.8, -0.9, -0.5]} color={colors[1]} scale={1.1} />
      <Orb position={[0.2, 1.7, -0.8]} color={colors[2]} scale={0.6} />
      <Orb position={[-0.2, -1.6, -1]} color={colors[3]} scale={0.7} />
    </group>
  );
}

function SceneBackdrop({ className }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

export default SceneBackdrop;
