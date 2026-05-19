import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function CoreShape({ position, color, geometry }) {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.15;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.8} />
    </mesh>
  );
}

function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        <Float speed={2} rotationIntensity={0.9} floatIntensity={0.8}>
          <CoreShape
            position={[-1.8, 0.4, 0]}
            color="#22c55e"
            geometry={<torusKnotGeometry args={[0.6, 0.2, 160, 12]} />}
          />
        </Float>
        <Float speed={2.4} rotationIntensity={1.1} floatIntensity={1}>
          <CoreShape
            position={[1.8, -0.6, -0.2]}
            color="#38bdf8"
            geometry={<icosahedronGeometry args={[0.85, 1]} />}
          />
        </Float>
        <Float speed={1.6} rotationIntensity={0.7} floatIntensity={0.7}>
          <CoreShape
            position={[0.2, 1.6, -0.6]}
            color="#f97316"
            geometry={<octahedronGeometry args={[0.5, 0]} />}
          />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

export default HeroScene;
