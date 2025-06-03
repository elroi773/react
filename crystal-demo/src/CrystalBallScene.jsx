import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function CrystalBall() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.2, 128, 128]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0.05}
        thickness={1.5}
        chromaticAberration={0.4}
        distortion={0.8}
        temporalDistortion={0.8}
        iridescence={1}
        iridescenceIOR={1.4}
        clearcoat={1}
        clearcoatRoughness={0.1}
        attenuationColor="#c1a0ff"
        attenuationDistance={0.5}
        backside
      />
    </mesh>
  );
}

function GlowParticles() {
  const count = 150;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 1.0;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" opacity={0.7} transparent />
    </points>
  );
}

function FloorReflection() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.25 + 0.15 * Math.sin(clock.getElapsedTime());
    }
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.21, 0]}>
      <circleGeometry args={[5, 128]} />
      <meshBasicMaterial color="#a96fff" transparent opacity={0.3} />
    </mesh>
  );
}

export default function CrystalBallScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 5, 2]} intensity={1.2} />
      <group>
        <CrystalBall />
        <GlowParticles />
        <FloorReflection />
      </group>
      <Environment preset="sunset" />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}
