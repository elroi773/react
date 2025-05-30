// src/components/AuroraFloor.jsx
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

const EnhancedAuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    color1: new THREE.Color("#e7c7ff"),
    color2: new THREE.Color("#88f0ff"),
    sparkleIntensity: 0.3,
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
      return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float r = length(uv);
      float angle = atan(uv.y, uv.x);

      float wave = sin((r - uTime * 0.3) * 12.0 + angle * 5.0);
      float intensity = smoothstep(0.6, 0.0, r);
      float sparkle = pow(noise(vUv * 10.0 + uTime * 0.5), 3.0) * sparkleIntensity;

      vec3 color = mix(color1, color2, 0.5 + 0.5 * wave);
      color += sparkle;

      gl_FragColor = vec4(color * intensity, intensity * 0.5);
    }
  `
);
extend({ EnhancedAuroraMaterial });

export default function AuroraFloor() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.3, 0]}>
      <circleGeometry args={[6, 256]} />
      <enhancedAuroraMaterial ref={ref} attach="material" transparent depthWrite={false} />
    </mesh>
  );
}
