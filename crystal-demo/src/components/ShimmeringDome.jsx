import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ShimmeringDome() {
    const domeRef = useRef();
    const shaderRef = useRef();
  
    useFrame(({ clock }) => {
      if (domeRef.current && shaderRef.current) {
        domeRef.current.rotation.y = clock.getElapsedTime() * 0.1;
        shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      }
    });
  
    return (
      <mesh ref={domeRef} scale={[1.7, 1.7, 1.7]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={shaderRef}
          side={THREE.BackSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#c69bff") },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform vec3 uColor;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 1.0, 0.0)), 2.0);
              float glow = sin(uTime * 1.5 + length(vNormal)) * 0.1 + 0.2;
              gl_FragColor = vec4(uColor, intensity * glow);
            }
          `}
        />
      </mesh>
    );
  }
  