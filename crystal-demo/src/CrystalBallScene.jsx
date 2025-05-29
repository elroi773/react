// CrystalBallScene.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CrystalBall() {
  const meshRef = useRef(null);
  const materialRef = useRef(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float glow = 0.5 + 0.5 * sin(uTime + vUv.y * 10.0);
    vec3 color = mix(vec3(0.1, 0.0, 0.5), vec3(1.0, 0.0, 1.0), vUv.y);
    gl_FragColor = vec4(color * glow, 1.0);
  }
`;

export default function CrystalBallScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 2, 2]} intensity={1} />
      <CrystalBall />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
