import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CLetterMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  // Create the C shape geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Create C shape using arc and lines
    const outerRadius = 1.2;
    const innerRadius = 0.7;
    const gapAngle = Math.PI * 0.6; // 108 degrees opening
    
    // Start from the bottom of the opening
    const startAngle = -gapAngle / 2;
    const endAngle = Math.PI * 2 - gapAngle / 2;
    
    // Outer arc (clockwise from bottom opening to top opening)
    shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
    
    // Line to inner radius at top opening
    const topX = Math.cos(endAngle) * innerRadius;
    const topY = Math.sin(endAngle) * innerRadius;
    shape.lineTo(topX, topY);
    
    // Inner arc (counter-clockwise from top opening to bottom opening)
    shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
    
    // Close the shape
    shape.closePath();
    
    // Extrude the shape
    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Continuous slow rotation
      meshRef.current.rotation.z += 0.002;
      
      // Subtle floating motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Hover scale effect
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color="#e8e8e8"
        metalness={0.95}
        roughness={0.02}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
        reflectivity={0.9}
        emissive="#222222"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

const CLetterComponent = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* ULTRA-BRIGHT LIGHTING SETUP */}
        <ambientLight intensity={2.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-10, -10, 5]} intensity={6} />
        <pointLight position={[5, 0, 10]} intensity={5} />
        <pointLight position={[-5, 0, 10]} intensity={5} />
        <pointLight position={[0, 5, 10]} intensity={4} />
        <pointLight position={[0, -5, 10]} intensity={4} />
        
        {/* Additional bright lights for maximum illumination */}
        <directionalLight position={[0, 0, 10]} intensity={6} />
        <directionalLight position={[15, 0, 5]} intensity={4} />
        <directionalLight position={[-15, 0, 5]} intensity={4} />
        <pointLight position={[0, 0, 15]} intensity={6} />
        <pointLight position={[10, 10, 10]} intensity={3} />
        <pointLight position={[-10, -10, 10]} intensity={3} />
        <pointLight position={[10, -10, 10]} intensity={3} />
        <pointLight position={[-10, 10, 10]} intensity={3} />
        
        {/* Environment sphere for reflections */}
        <mesh position={[0, 0, -50]} scale={[100, 100, 100]}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
        </mesh>
        
        <CLetterMesh />
      </Canvas>
    </div>
  );
};

export { CLetterComponent };