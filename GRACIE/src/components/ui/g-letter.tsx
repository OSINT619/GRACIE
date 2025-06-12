'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ExtrudeGeometry, Shape } from 'three'
import * as THREE from 'three'

const GLetter = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const shape = new Shape();
    
    // Create the letter "G" shape
    const outerRadius = 3;
    const innerRadius = 1.8;
    const gapWidth = 1.5;
    const barLength = 1.2;
    
    // Outer circle
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    
    // Inner circle (hole)
    const hole = new Shape();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
    shape.holes.push(hole);
    
    // Create the gap on the right side
    const gapShape = new Shape();
    gapShape.moveTo(outerRadius - 0.5, -gapWidth / 2);
    gapShape.lineTo(outerRadius + 1, -gapWidth / 2);
    gapShape.lineTo(outerRadius + 1, gapWidth / 2);
    gapShape.lineTo(outerRadius - 0.5, gapWidth / 2);
    gapShape.closePath();
    shape.holes.push(gapShape);
    
    // Create the horizontal bar
    const barShape = new Shape();
    barShape.moveTo(innerRadius, -0.3);
    barShape.lineTo(innerRadius + barLength, -0.3);
    barShape.lineTo(innerRadius + barLength, 0.3);
    barShape.lineTo(innerRadius, 0.3);
    barShape.closePath();
    
    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelSegments: 8,
      curveSegments: 32
    };

    const mainGeometry = new ExtrudeGeometry(shape, extrudeSettings);
    const barGeometry = new ExtrudeGeometry(barShape, extrudeSettings);
    
    // Merge geometries
    const mergedGeometry = new THREE.BufferGeometry();
    const mainPositions = mainGeometry.attributes.position.array;
    const barPositions = barGeometry.attributes.position.array;
    
    const totalVertices = mainPositions.length + barPositions.length;
    const positions = new Float32Array(totalVertices);
    
    positions.set(mainPositions, 0);
    positions.set(barPositions, mainPositions.length);
    
    mergedGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    mergedGeometry.computeVertexNormals();
    
    // Cleanup
    mainGeometry.dispose();
    barGeometry.dispose();
    
    return mergedGeometry;
  }, []);
  
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation
      meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <meshPhysicalMaterial 
        color="#232323" 
        roughness={0.3} 
        metalness={1}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
};

function HoverDetector({ onHoverChange }: { onHoverChange: (hovered: boolean) => void }) {
  const { camera, raycaster, pointer, scene } = useThree();
  
  useFrame(() => {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    onHoverChange(intersects.length > 0);
  });
  
  return null;
}

export function GLetterComponent() {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div className="h-full w-full bg-black relative z-0">
      <Canvas camera={{ 
        position: [0, 8, 12], 
        fov: 35 
      }}>
        <ambientLight intensity={0.8} />
        
        <directionalLight 
          position={[10, 15, 10]} 
          intensity={8}
          castShadow
        />
        
        <directionalLight 
          position={[-10, 10, -5]} 
          intensity={6}
          color="#ffffff"
        />
        
        <pointLight 
          position={[0, 20, 3]} 
          intensity={2}
          distance={50}
        />
        
        <group scale={isHovered ? 1.2 : 1}>
          <GLetter />
        </group>
        
        <HoverDetector onHoverChange={setIsHovered} />
      </Canvas>
    </div>
  )
}