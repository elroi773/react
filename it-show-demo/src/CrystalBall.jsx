// src/CrystalBall.jsx
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function CrystalBall() {
  const ref = useRef()

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        color="#aaf"
        transmission={1}
        roughness={0}
        thickness={1}
        ior={1.5}
        reflectivity={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  )
}
