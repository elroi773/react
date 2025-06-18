import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { FloatingParticles } from "./components/Particles";


function CrystalBall() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const floatY = 0.05 + Math.sin(t * 1.2) * 0.08; // 부드러운 상하 움직임
    const swayX = Math.sin(t * 0.7) * 0.03; // 좌우 흔들림
    const swayZ = Math.sin(t * 0.9 + 1) * 0.02; // 앞뒤 흔들림
    const rollZ = Math.sin(t * 0.5) * 0.05; // 살짝 z축 회전

    meshRef.current.position.set(swayX, floatY, swayZ);
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.y = t * 0.6;
    meshRef.current.rotation.z = rollZ;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.05, 0]}>
      <sphereGeometry args={[1.0, 128, 128]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0.05}
        thickness={5} // <- 깊이감 있게
        chromaticAberration={1}
        distortion={0.5}
        temporalDistortion={1}
        iridescence={1}
        iridescenceIOR={1.6}
        clearcoat={1}
        clearcoatRoughness={0.02}
        attenuationColor="#f5c8ff" // 밝은 핑보라색
        attenuationDistance={2.5} // 더 깊게 퍼지도록
        backside
      />
    </mesh>
  );
}

function ShimmeringReflection() {
  const shaderMaterial = useRef();

  useFrame(({ clock }) => {
    if (shaderMaterial.current) {
      shaderMaterial.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.7, 0]}>
      <circleGeometry args={[2.5, 64]} />
      <shaderMaterial
        ref={shaderMaterial}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color("#ffbbff") },
          uColor2: { value: new THREE.Color("#a0e9ff") },
          uColor2: { value: new THREE.Color("#ffd5f2") },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          varying vec2 vUv;
          void main() {
            float len = length(vUv - 0.5);
            float wave = sin((vUv.x + vUv.y) * 20.0 + uTime * 3.0) * 0.1;
            float alpha = smoothstep(0.5, 0.2, len) * (0.3 + wave);
            vec3 color = mix(uColor1, uColor2, vUv.y + 0.2 * sin(uTime));
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

function GradientBackground() {
  const shaderMaterial = useRef();

  useFrame(({ clock }) => {
    if (shaderMaterial.current) {
      shaderMaterial.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[10, 10, 10]} rotation={[0, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={shaderMaterial}
        side={THREE.BackSide}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vPosition;

          void main() {
            float y = normalize(vPosition).y;
            vec3 topColor = vec3(0.8, 0.5, 1.0);   // 보라빛
            vec3 bottomColor = vec3(0.2, 0.0, 0.3); // 짙은 자주
            vec3 color = mix(bottomColor, topColor, smoothstep(-1.0, 1.0, y));
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function CrystalBallScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 5, 2]} intensity={2} />
      <group>
        <GradientBackground />
        <CrystalBall />
        <FloatingParticles /> {/* 내부 입자 */}
        {/* <GlowParticles /> */}
        {/* <ShimmeringReflection /> */}
      </group>

      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}
