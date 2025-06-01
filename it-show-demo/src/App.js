// App.js
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import CrystalBall from './CrystalBall'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <CrystalBall />
        <OrbitControls enableZoom={false} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}

export default App
