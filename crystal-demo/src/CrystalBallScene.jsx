// CrystalBallScene.jsx
import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Environment, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";

// Shader for the Crystal Ball's core material (MeshTransmissionMaterial is complex, so we use a placeholder if needed)
// For this version, we'll keep the original MeshTransmissionMaterial for the ball itself
// and add an outer shell for the elemental effect.

// Enhanced Aurora Floor Shader Material
const EnhancedAuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    color1: new THREE.Color("#e7c7ff"), // Light purple
    color2: new THREE.Color("#88f0ff"), // Light blue
    sparkleIntensity: 0.2,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float sparkleIntensity;
    varying vec2 vUv;

    // Simple noise function
    float noise(vec2 uv) {
      return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0; // Center UVs
      float r = length(uv); // Distance from center
      float angle = atan(uv.y, uv.x); // Angle

      // Wave pattern based on radius and angle, animated with time
      float wave = sin((r - uTime * 0.2) * 10.0 + angle * 4.0);
      // Intensity falls off towards the edges
      float intensity = smoothstep(0.7, 0.0, r); // Adjusted for a softer edge on a larger circle
      
      // Sparkle effect
      float sparkle = pow(noise(vUv * 15.0 + uTime * 0.4), 3.0) * sparkleIntensity;

      vec3 color = mix(color1, color2, 0.5 + 0.5 * wave);
      color += sparkle;

      gl_FragColor = vec4(color * intensity, intensity * 0.6); // Alpha based on intensity
    }
  `
);
extend({ EnhancedAuroraMaterial });

function EnhancedAuroraFloor() {
  const materialRef = useRef();
  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]}> {/* Lowered slightly */}
      <circleGeometry args={[8, 128]} /> {/* Made larger */}
      <enhancedAuroraMaterial ref={materialRef} transparent depthWrite={false} />
    </mesh>
  );
}

// Elemental Interaction Shader Material (for the shell around the crystal ball)
const ElementalInteractionMaterial = shaderMaterial(
  {
    uTime: 0,
    uEmberColor: new THREE.Color("#FF6B6B"), // Fiery Red/Orange
    uWadeColor: new THREE.Color("#4ECDC4"),  // Watery Cyan/Blue
    uInteractionColor: new THREE.Color("#FFFFA0"), // Light Yellow/White for interaction
    uNoiseScale: 3.5,
    uSwirlSpeed: 0.2,
    uInteractionRadius: 1.8, // How far the influence of elemental points spreads
  },
  // Vertex Shader
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
  // Fragment Shader
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

    // Fractional Brownian Motion (FBM) for organic noise
    float fbm(vec2 p) {
        float total = 0.0;
        float amplitude = 0.6; // Start with higher amplitude
        float frequency = 1.0;
        for (int i = 0; i < 4; i++) { // 4 octaves
            total += sin(p.x * frequency + uTime * uSwirlSpeed * 0.4 + float(i) * 1.57) * cos(p.y * frequency + uTime * uSwirlSpeed * 0.25 + float(i) * 1.1) * amplitude;
            frequency *= 2.0;
            amplitude *= 0.5;
        }
        return total;
    }

    void main() {
        // Conceptual elemental points moving in space around the origin (0,0,0)
        // Their paths create a dynamic interaction zone on the sphere's surface.
        float radius = 1.5; // Radius of elemental point orbits
        vec3 emberPoint = vec3(sin(uTime * 0.25) * radius, cos(uTime * 0.15) * radius, sin(uTime * 0.35 + 1.0) * radius);
        vec3 wadePoint = vec3(cos(uTime * 0.2 + 3.14) * radius, sin(uTime * 0.3 + 3.14) * radius, cos(uTime * 0.25 - 2.0) * radius);

        // Calculate distance from the current surface point to the elemental points
        float distToEmber = distance(vWorldPosition, emberPoint);
        float distToWade = distance(vWorldPosition, wadePoint);

        // Calculate influence of each element based on proximity
        // smoothstep creates a softer falloff
        float emberInfluence = 1.0 - smoothstep(0.0, uInteractionRadius, distToEmber);
        float wadeInfluence = 1.0 - smoothstep(0.0, uInteractionRadius, distToWade);
        
        // Swirling patterns using FBM, mapped using UVs
        // vUv * uNoiseScale controls the density of the noise pattern
        float noisePattern = fbm(vUv * uNoiseScale);

        // Base color is a mix of Ember and Wade colors, influenced by the noise pattern
        vec3 baseColor = mix(uEmberColor, uWadeColor, 0.5 + 0.5 * noisePattern); 
        
        // Modulate base color by individual elemental influences
        vec3 color = mix(baseColor, uEmberColor, emberInfluence * 0.7); // Ember has stronger presence
        color = mix(color, uWadeColor, wadeInfluence * 0.7);     // Wade also contributes

        // Highlight the interaction zone where influences overlap
        float interactionStrength = emberInfluence * wadeInfluence;
        // Make the interaction glow brighter and pulsate
        float pulsatingInteraction = interactionStrength * (0.6 + 0.4 * sin(uTime * 3.0 + noisePattern * 2.0));
        color = mix(color, uInteractionColor, pulsatingInteraction * 1.5); // Boost interaction color

        // Rim lighting effect to give a sense of volume and glow at the edges
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float rimFactor = 1.0 - dot(viewDirection, vNormal);
        rimFactor = pow(rimFactor, 2.5); // Control rim sharpness/spread
        color += uInteractionColor * rimFactor * 0.3 * (emberInfluence + wadeInfluence + interactionStrength);


        // Alpha (opacity) calculation
        // Base alpha from the noise pattern to create some transparency variations
        float baseAlpha = 0.3 + abs(noisePattern) * 0.3;
        // Increase opacity based on elemental influences and interaction
        float influenceAlpha = (emberInfluence + wadeInfluence + interactionStrength) * 0.5;
        float finalAlpha = clamp(baseAlpha + influenceAlpha, 0.2, 0.85); // Keep it somewhat transparent but visible

        gl_FragColor = vec4(color, finalAlpha);
    }
  `
);
extend({ ElementalInteractionMaterial });

function ElementalInteractionShell() {
  const materialRef = useRef();
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[1.05, 1.05, 1.05]}> {/* Slightly larger than the crystal ball */}
      <sphereGeometry args={[1.2, 128, 128]} /> {/* Same geometry as crystal ball, but scaled up by mesh */}
      <elementalInteractionMaterial 
        ref={materialRef} 
        transparent 
        depthWrite={false} // Important for transparency and layering
        side={THREE.FrontSide} // Render only front side, or DoubleSide if needed
      />
    </mesh>
  );
}


// Original CrystalBall component (using MeshTransmissionMaterial for the inner ball)
// We need to import MeshTransmissionMaterial from drei


function CrystalBall() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Subtle rotation for the inner crystal ball
    meshRef.current.rotation.x = t * 0.05;
    meshRef.current.rotation.y = t * 0.08;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.2, 128, 128]} />
      <MeshTransmissionMaterial
        transmission={0.98} // High transmission for clear crystal
        roughness={0.03}    // Very smooth
        thickness={1.2}    // Controls refraction
        chromaticAberration={0.06} // Subtle color separation
        anisotropy={0.1}
        distortion={0.05}      // Slight distortion
        temporalDistortion={0.1}
        iridescence={0.5}
        iridescenceIOR={1.2}
        clearcoat={0.2}
        clearcoatRoughness={0.1}
        attenuationColor="#E6E6FA" // Lavender, for a slight tint
        attenuationDistance={0.5}
        samples={16} // More samples for better quality
        backside // Important for transmission
      />
    </mesh>
  );
}

function InnerParticles() {
  const meshRef = useRef();
  const count = 250; // Increased particle count
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute particles within the crystal ball (radius < 1.15)
      const r = Math.random() * 1.1; 
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    // Slower, more graceful rotation for inner particles
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025} // Slightly smaller particles
        color="#FFF0F5" // LavenderBlush, for a soft magical feel
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending} // Additive blending for a brighter look
      />
    </points>
  );
}

function FloatingGlow() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Pulsating opacity for the glow
    meshRef.current.material.opacity = 0.15 + Math.sin(t * 1.2) * 0.1;
    meshRef.current.scale.setScalar(1 + Math.sin(t*0.8) * 0.05); // Subtle pulsating scale
  });

  return (
    <mesh ref={meshRef} position={[0,0,0]}>
      <sphereGeometry args={[1.7, 64, 64]} /> {/* Slightly larger to encompass the shell */}
      <meshBasicMaterial 
        color="#D8BFD8" // Thistle - a soft purple glow
        transparent 
        opacity={0.25} 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function RadiantWaves() {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1; // Slower rotation for waves
     // Animate opacity of waves
    groupRef.current.children.forEach((child, i) => {
        child.material.opacity = 0.05 + Math.sin(t * 0.5 + i * 0.5) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => ( // 5 waves
        <mesh key={i} rotation-x={Math.PI / 2}> {/* Rotate rings to be horizontal */}
          <ringGeometry args={[1.8 + i * 0.35, 1.9 + i * 0.35, 64]} />
          <meshBasicMaterial
            color="#B0E0E6" // PowderBlue - soft blue waves
            transparent
            opacity={0.1} // Start with lower opacity
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}


export default function CrystalBallScene() {
  return (
    <Canvas 
        camera={{ position: [0, 1, 4.5], fov: 50 }} // Adjusted camera
        gl={{ antialias: true, alpha: true }} // Enable antialiasing and alpha for transparency
        style={{ background: 'linear-gradient(to bottom, #100820, #201030)' }} // Dark mystical background
    >
      <ambientLight intensity={0.4} color="#A080FF" /> {/* Lavender ambient light */}
      <directionalLight 
        position={[4, 4, 3]} 
        intensity={1.2} 
        color="#FFD0A0" // Warm directional light
        castShadow 
      />
      
      {/* Use Suspense for components that might load assets or are complex */}
      <Suspense fallback={null}>
        <EnhancedAuroraFloor />
        <group position={[0, 0.1, 0]}> {/* Slightly lift the main crystal ball group */}
            <FloatingGlow />
            <RadiantWaves />
            <InnerParticles />
            <CrystalBall />
            <ElementalInteractionShell /> 
        </group>
        <Environment preset="night" blur={0.5} /> 
        {/* Using 'night' preset for darker reflections, can try 'sunset' or 'dawn' too */}
      </Suspense>
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} // Allow zoom
        minDistance={2.5}   // Min zoom distance
        maxDistance={10}   // Max zoom distance
        autoRotate={true}  // Gentle auto-rotation
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 4} // Limit vertical rotation
        maxPolarAngle={Math.PI / 1.5} // Limit vertical rotation
      />

      <EffectComposer>
        <Bloom 
            intensity={0.45} // Adjust intensity of the bloom
            luminanceThreshold={0.15} // Pixels brighter than this will bloom
            luminanceSmoothing={0.3}  // Smoothness of the bloom effect
            mipmapBlur={true} // Better quality blur
            kernelSize={5} // KernelSize.SMALL, MEDIUM, LARGE, VERY_LARGE, HUGE
        />
      </EffectComposer>
    </Canvas>
  );
}
