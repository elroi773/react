import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function CrystalBall() {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.1; // 지구 자전처럼 느리게
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
        side={THREE.DoubleSide}
        transparent={true}
      />
    </mesh>
  );
}

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment Shader
const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float pulse = sin(uTime * 2.0 + vUv.y * 10.0) * 0.5 + 0.5;
    vec3 baseColor = mix(vec3(0.2, 0.0, 0.5), vec3(1.0, 0.4, 1.0), vUv.y);
    vec3 glow = baseColor * pulse * 1.5;
    gl_FragColor = vec4(glow, 0.9);
  }
`;

export default function CrystalBallScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={2} color="#ff66ff" />
      <CrystalBall />
      <OrbitControls enableZoom={false} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
      <Sparkles count={40} size={5} scale={[4, 4, 4]} speed={0.3} color="#ffccff" />
    </Canvas>
  );
}
