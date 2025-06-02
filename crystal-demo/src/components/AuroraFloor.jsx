// src/components/AuroraFloor.jsx
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

const EnhancedAuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    color1: new THREE.Color("#6a0dad"),  // 진보라
    color2: new THREE.Color("#b57edc"),  // 연보라
    color3: new THREE.Color("#ffffaa"),  // 노란빛 포인트
    intensity: 0.5,
  },
  `
    varying vec3 vPosition;
    void main() {
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform float intensity;
    varying vec3 vPosition;

    float wavePattern(vec3 pos) {
      float r = length(pos.xz);
      float angle = atan(pos.z, pos.x) + uTime * 0.2;
      return sin(r * 4.0 - uTime * 2.0 + angle * 3.0);
    }

    float fbmNoise(vec3 pos) {
      float n = sin(dot(pos, vec3(12.9898, 78.233, 45.543))) * 43758.5453;
      return fract(n);
    }

    void main() {
      float wave = wavePattern(vPosition);
      float noise = fbmNoise(vPosition * 2.0 + uTime * 0.5);
      float blend = 0.5 + 0.5 * wave;
      vec3 color = mix(color1, color2, blend);

      // 노란빛 포인트
      float highlight = smoothstep(0.8, 1.0, noise + 0.3 * sin(uTime * 4.0));
      color = mix(color, color3, highlight);

      float alpha = intensity * (0.3 + 0.7 * abs(wave)) * (0.6 + 0.4 * noise);
      gl_FragColor = vec4(color, alpha);
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
      <circleGeometry args={[15, 128]} />
      <enhancedAuroraMaterial ref={ref} attach="material" transparent depthWrite={false} />
    </mesh>
  );
}
