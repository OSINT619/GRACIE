'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ExtrudeGeometry, Shape } from 'three'
import * as THREE from 'three'

interface GLetterProps {
  position?: [number, number, number];
  scale?: number;
}

const GLetter3D = ({ position = [0, 0, 0], scale = 1 }: GLetterProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  const geometry = useMemo(() => {
    const shape = new Shape();
    
    // Create the letter G shape
    const outerRadius = 2;
    const innerRadius = 1.2;
    const gapWidth = 0.8;
    const barLength = 1.2;
    
    // Outer circle
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    
    // Inner circle (hole)
    const hole = new Shape();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
    shape.holes.push(hole);
    
    // Create the gap on the right side
    const gapShape = new Shape();
    gapShape.moveTo(outerRadius - 0.2, gapWidth);
    gapShape.lineTo(outerRadius + 0.5, gapWidth);
    gapShape.lineTo(outerRadius + 0.5, -gapWidth);
    gapShape.lineTo(outerRadius - 0.2, -gapWidth);
    gapShape.closePath();
    shape.holes.push(gapShape);
    
    // Create the horizontal bar
    const barShape = new Shape();
    barShape.moveTo(innerRadius, 0.3);
    barShape.lineTo(innerRadius + barLength, 0.3);
    barShape.lineTo(innerRadius + barLength, -0.3);
    barShape.lineTo(innerRadius, -0.3);
    barShape.closePath();
    
    // Combine shapes
    const combinedShape = new Shape();
    combinedShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    
    const innerHole = new Shape();
    innerHole.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
    combinedShape.holes.push(innerHole);
    
    // Add gap
    const gap = new Shape();
    gap.moveTo(outerRadius - 0.2, gapWidth);
    gap.lineTo(outerRadius + 0.5, gapWidth);
    gap.lineTo(outerRadius + 0.5, -gapWidth);
    gap.lineTo(outerRadius - 0.2, -gapWidth);
    gap.closePath();
    combinedShape.holes.push(gap);

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelSegments: 16,
      curveSegments: 32
    };

    const geometry = new ExtrudeGeometry(combinedShape, extrudeSettings);
    geometry.center();
    
    // Create the horizontal bar separately
    const barGeometry = new ExtrudeGeometry(barShape, extrudeSettings);
    
    return { mainGeometry: geometry, barGeometry };
  }, []);

  useEffect(() => {
    return () => {
      geometry.mainGeometry.dispose();
      geometry.barGeometry.dispose();
    };
  }, [geometry]);

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.2 : 1;
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      meshRef.current.scale.setScalar(newScale * scale);
      
      // Subtle rotation
      meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        geometry={geometry.mainGeometry}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshPhysicalMaterial 
          color="#232323" 
          roughness={0.3} 
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Horizontal bar */}
      <mesh
        geometry={geometry.barGeometry}
        position={[0, 0, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshPhysicalMaterial 
          color="#232323" 
          roughness={0.3} 
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  );
};

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={80}
        castShadow
      />
      
      <directionalLight 
        position={[-10, 10, -5]} 
        intensity={40.5}
        color="#ffffff"
      />
      
      <directionalLight 
        position={[5, -10, 15]} 
        intensity={70}
        color="#f0f8ff"
      />
      
      <pointLight 
        position={[0, 20, 3]} 
        intensity={50}
        distance={50}
      />
      
      <pointLight 
        position={[15, 5, 15]} 
        intensity={0.8}
        distance={40}
        color="#299bee"
      />
      
      <GLetter3D scale={1.5} />
    </>
  );
}

export function GLetterComponent() {
  return (
    <div className="h-full w-full bg-black relative z-0">
      <Canvas 
        camera={{ 
          position: [0, 0, 8], 
          fov: 50 
        }}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}