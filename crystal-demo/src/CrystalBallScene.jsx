// src/components/CrystalBallScene.jsx
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Environment, shaderMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/////////////////////////
// 1. Aurora Floor Shader
/////////////////////////
const EnhancedAuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    color1: new THREE.Color('#e7c7ff'),
    color2: new THREE.Color('#88f0ff'),
    sparkleIntensity: 0.2,
  },
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  `uniform float uTime;
   uniform vec3 color1;
   uniform vec3 color2;
   uniform float sparkleIntensity;
   varying vec2 vUv;

   float noise(vec2 uv) {
     return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
   }

   void main() {
     vec2 uv = vUv * 2.0 - 1.0;
     float r = length(uv);
     float angle = atan(uv.y, uv.x);
     float wave = sin((r - uTime * 0.2) * 10.0 + angle * 4.0);
     float intensity = smoothstep(0.7, 0.0, r);
     float sparkle = pow(noise(vUv * 15.0 + uTime * 0.4), 3.0) * sparkleIntensity;
     vec3 color = mix(color1, color2, 0.5 + 0.5 * wave);
     color += sparkle;
     gl_FragColor = vec4(color * intensity, intensity * 0.6);
   }`
);
extend({ EnhancedAuroraMaterial });

function AuroraFloor() {
  const materialRef = useRef();
  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]}>
      <circleGeometry args={[8, 128]} />
      <enhancedAuroraMaterial ref={materialRef} transparent depthWrite={false} />
    </mesh>
  );
}

/////////////////////////
// 2. Crystal Ball
/////////////////////////
function CrystalBall() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.05;
    meshRef.current.rotation.y = t * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 128, 128]} />
      <MeshTransmissionMaterial
        transmission={0.98}
        roughness={0.03}
        thickness={1.2}
        chromaticAberration={0.06}
        anisotropy={0.1}
        distortion={0.05}
        distortionScale={0.7}
        temporalDistortion={0.15}
        backside
      />
    </mesh>
  );
}

/////////////////////////
// 3. Dome Material (From Dome.jsx)
/////////////////////////
const DomeMaterial = shaderMaterial(
  {
    uTime: 0,
    color1: new THREE.Color("#6a0dad"),
    color2: new THREE.Color("#b57edc"),
    color3: new THREE.Color("#ffffaa"),
    intensity: 0.3,
  },
  `varying vec3 vPosition;
   void main() {
     vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  `uniform float uTime;
   uniform vec3 color1;
   uniform vec3 color2;
   uniform vec3 color3;
   uniform float intensity;
   varying vec3 vPosition;

   float wavePattern(vec3 pos) {
     float r = length(pos.xy);
     float angle = atan(pos.y, pos.x) + uTime * 0.1;
     return sin(r * 6.0 - uTime * 2.0 + angle * 3.0);
   }

   float fbmNoise(vec3 pos) {
     float n = sin(dot(pos, vec3(12.9898, 78.233, 45.543))) * 43758.5453;
     return fract(n);
   }

   void main() {
     float wave = wavePattern(vPosition);
     float noise = fbmNoise(vPosition * 2.0 + uTime * 0.3);
     float blend = 0.5 + 0.5 * wave;
     vec3 color = mix(color1, color2, blend);

     float highlight = smoothstep(0.75, 1.0, noise + 0.3 * sin(uTime * 3.0));
     color = mix(color, color3, highlight);

     float alpha = intensity * (0.4 + 0.6 * abs(wave)) * (0.5 + 0.5 * noise);
     gl_FragColor = vec4(color, alpha);
   }`
);
extend({ DomeMaterial });

function Dome() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh scale={[3, 3, 3]}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <domeMaterial ref={ref} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/////////////////////////
// 4. Final Scene
/////////////////////////
export default function CrystalBallScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
      <color attach="background" args={['#0e0e1a']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Dome />
        <CrystalBall />
        <AuroraFloor />
        <Environment preset="dawn" />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={true} />
      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.1} luminanceSmoothing={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
