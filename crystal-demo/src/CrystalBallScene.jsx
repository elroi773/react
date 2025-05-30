// CrystalBallScene.jsx
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Environment, MeshTransmissionMaterial, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// 쉘에 흐르는 반사광 셰이더 머티리얼 정의
const SurfaceLightMaterial = shaderMaterial(
  { uTime: 0, color: new THREE.Color("#cc88ff") },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 color;
    varying vec2 vUv;

    void main() {
      float wave = 0.5 + 0.5 * sin((vUv.y + uTime * 0.6) * 10.0);
      float edge = smoothstep(0.4, 0.6, vUv.y);
      vec3 finalColor = color * wave * edge;
      gl_FragColor = vec4(finalColor, wave * 0.5);
    }
  `
);
extend({ SurfaceLightMaterial });

function CrystalBall() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 128, 128]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0.05}
        thickness={1.5}
        chromaticAberration={0.2}
        anisotropy={0.3}
        distortion={0.6}
        temporalDistortion={0.6}
        iridescence={1}
        iridescenceIOR={1.6}
        clearcoat={1}
        clearcoatRoughness={0.15}
        attenuationColor="#c1a0ff"
        attenuationDistance={0.6}
        backside
      />
    </mesh>
  );
}

function InnerParticles() {
  const meshRef = useRef();
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 1.1;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#e0c2ff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingGlow() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.material.opacity = 0.2 + Math.sin(t * 1.5) * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshBasicMaterial color="#b688ff" transparent opacity={0.4} />
    </mesh>
  );
}

function RadiantWaves() {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.2;
  });

  return (
    <group ref={groupRef}>
      {[...Array(4)].map((_, i) => (
        <mesh key={i}>
          <ringGeometry args={[1.7 + i * 0.3, 1.8 + i * 0.3, 64]} />
          <meshBasicMaterial
            color="#cc99ff"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function SurfaceWaveShell() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh>
      <sphereGeometry args={[1.23, 128, 128]} />
      <surfaceLightMaterial ref={ref} attach="material" transparent depthWrite={false} />
    </mesh>
  );
}

export default function CrystalBallScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 2]} intensity={1} />
      <group>
        <FloatingGlow />
        <RadiantWaves />
        <InnerParticles />
        <CrystalBall />
        <SurfaceWaveShell />
      </group>
      <Environment preset="sunset" />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}