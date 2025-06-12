import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GLetterMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  // Create the precise G shape geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Define the G shape parameters
    const outerRadius = 1.0;
    const innerRadius = 0.6;
    const gapWidth = 0.4;
    const barLength = 0.5;
    const barThickness = 0.15;
    
    // Start drawing the outer contour of the G
    // Begin at the top of the opening (right side)
    shape.moveTo(outerRadius, gapWidth);
    
    // Draw the main arc from top-right, going counter-clockwise
    // Top arc (from opening to left side)
    shape.absarc(0, 0, outerRadius, Math.asin(gapWidth / outerRadius), Math.PI - Math.asin(gapWidth / outerRadius), false);
    
    // Left arc (top-left to bottom-left)
    shape.absarc(0, 0, outerRadius, Math.PI - Math.asin(gapWidth / outerRadius), Math.PI + Math.asin(gapWidth / outerRadius), false);
    
    // Bottom arc (bottom-left to bottom-right of opening)
    shape.absarc(0, 0, outerRadius, Math.PI + Math.asin(gapWidth / outerRadius), 2 * Math.PI - Math.asin(gapWidth / outerRadius), false);
    
    // Now we're at the bottom of the opening
    // Draw line up to where the horizontal bar starts
    shape.lineTo(outerRadius, -barThickness / 2);
    
    // Draw the horizontal bar (going left)
    shape.lineTo(outerRadius - barLength, -barThickness / 2);
    shape.lineTo(outerRadius - barLength, barThickness / 2);
    shape.lineTo(outerRadius, barThickness / 2);
    
    // Complete the opening by going back to start
    shape.lineTo(outerRadius, gapWidth);
    
    // Create the inner hole
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    
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
      
      // Hover scale effect
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
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
        color="#1a1a1a"
        metalness={0.95}
        roughness={0.05}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        reflectivity={0.9}
        envMapIntensity={1.5}
      />
    </mesh>
  );
};

const GLetterComponent = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Enhanced lighting for chrome effect */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={10.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-10, -10, 5]} intensity={0.8} />
        <pointLight position={[5, 0, 10]} intensity={0.6} />
        <pointLight position={[-5, 0, 10]} intensity={0.4} />
        
        {/* Environment map for reflections */}
        <mesh visible={false}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
        </mesh>
        
        <GLetterMesh />
      </Canvas>
    </div>
  );
};

export { GLetterComponent };