// src/components/CrystalBallScene.jsx
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Environment, shaderMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Aurora Floor Shader Material
const EnhancedAuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    color1: new THREE.Color('#e7c7ff'),
    color2: new THREE.Color('#88f0ff'),
    sparkleIntensity: 0.2,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
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
    }
  `
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

// Elemental Interaction Shell Shader Material
const ElementalInteractionMaterial = shaderMaterial(
  {
    uTime: 0,
    uEmberColor: new THREE.Color('#FF6B6B'),
    uWadeColor: new THREE.Color('#4ECDC4'),
    uInteractionColor: new THREE.Color('#FFFFA0'),
    uNoiseScale: 3.5,
    uSwirlSpeed: 0.2,
    uInteractionRadius: 1.8,
  },
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uEmberColor;
    uniform vec3 uWadeColor;
    uniform vec3 uInteractionColor;
    uniform float uNoiseScale;
    uniform float uSwirlSpeed;
    uniform float uInteractionRadius;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    float fbm(vec2 p) {
        float total = 0.0;
        float amplitude = 0.6;
        float frequency = 1.0;
        for (int i = 0; i < 4; i++) {
            total += sin(p.x * frequency + uTime * uSwirlSpeed * 0.4 + float(i) * 1.57)
                    * cos(p.y * frequency + uTime * uSwirlSpeed * 0.25 + float(i) * 1.1) * amplitude;
            frequency *= 2.0;
            amplitude *= 0.5;
        }
        return total;
    }

    void main() {
        float radius = 1.5;
        vec3 emberPoint = vec3(sin(uTime * 0.25) * radius, cos(uTime * 0.15) * radius, sin(uTime * 0.35 + 1.0) * radius);
        vec3 wadePoint = vec3(cos(uTime * 0.2 + 3.14) * radius, sin(uTime * 0.3 + 3.14) * radius, cos(uTime * 0.25 - 2.0) * radius);
        float distToEmber = distance(vWorldPosition, emberPoint);
        float distToWade = distance(vWorldPosition, wadePoint);
        float emberInfluence = 1.0 - smoothstep(0.0, uInteractionRadius, distToEmber);
        float wadeInfluence = 1.0 - smoothstep(0.0, uInteractionRadius, distToWade);
        float noisePattern = fbm(vUv * uNoiseScale);
        vec3 baseColor = mix(uEmberColor, uWadeColor, 0.5 + 0.5 * noisePattern);
        vec3 color = mix(baseColor, uEmberColor, emberInfluence * 0.7);
        color = mix(color, uWadeColor, wadeInfluence * 0.7);
        float interactionStrength = emberInfluence * wadeInfluence;
        float pulsatingInteraction = interactionStrength * (0.6 + 0.4 * sin(uTime * 3.0 + noisePattern * 2.0));
        color = mix(color, uInteractionColor, pulsatingInteraction * 1.5);
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float rimFactor = 1.0 - dot(viewDirection, vNormal);
        rimFactor = pow(rimFactor, 2.5);
        color += uInteractionColor * rimFactor * 0.3 * (emberInfluence + wadeInfluence + interactionStrength);
        float baseAlpha = 0.3 + abs(noisePattern) * 0.3;
        float influenceAlpha = (emberInfluence + wadeInfluence + interactionStrength) * 0.5;
        float finalAlpha = clamp(baseAlpha + influenceAlpha, 0.2, 0.85);
        gl_FragColor = vec4(color, finalAlpha);
    }
  `
);
extend({ ElementalInteractionMaterial });

function Dome() {
  const materialRef = useRef();
  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh scale={[1.05, 1.05, 1.05]}>
      <sphereGeometry args={[1.2, 128, 128]} />
      <elementalInteractionMaterial ref={materialRef} transparent depthWrite={false} side={THREE.FrontSide} />
    </mesh>
  );
}

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

export default function CrystalBallScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
      <color attach="background" args={['#0e0e1a']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <CrystalBall />
        <AuroraFloor />
        <Dome />
        <Environment preset="dawn" />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={true} />
      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.1} luminanceSmoothing={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
