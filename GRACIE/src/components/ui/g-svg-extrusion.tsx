'use client'

import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ExtrudeGeometry, Shape } from 'three'
import * as THREE from 'three'

interface GSvgProps {
  position?: [number, number, number];
  scale?: number;
  hoveredG?: boolean;
}

const GSvg = ({ 
  position = [0, 0, 0], 
  scale = 1,
  hoveredG = false
}: GSvgProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentScale, setCurrentScale] = useState(1);
  
  const geometry = useMemo(() => {
    // Create the exact G shape from your SVG
    const shape = new Shape();
    
    // Starting from the top-right of the outer circle, going clockwise
    // Outer circle (radius ~50 units, centered at origin)
    const outerRadius = 50;
    const innerRadius = 25;
    
    // Create outer circle path
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    
    // Create inner circle hole
    const hole = new Shape();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
    shape.holes.push(hole);
    
    // Create the gap on the right side of the G
    const gapShape = new Shape();
    // Gap starts from about 45 degrees and goes to -45 degrees
    const gapStartAngle = Math.PI * 0.25; // 45 degrees
    const gapEndAngle = -Math.PI * 0.25; // -45 degrees
    const gapRadius = outerRadius + 5; // Slightly larger to ensure clean cut
    
    // Create gap rectangle that cuts through the right side
    gapShape.moveTo(innerRadius, -15);
    gapShape.lineTo(outerRadius + 5, -15);
    gapShape.lineTo(outerRadius + 5, 15);
    gapShape.lineTo(innerRadius, 15);
    gapShape.lineTo(innerRadius, -15);
    
    shape.holes.push(gapShape);
    
    // Create the horizontal bar inside the G
    const barShape = new Shape();
    barShape.moveTo(innerRadius, -8);
    barShape.lineTo(35, -8);
    barShape.lineTo(35, 8);
    barShape.lineTo(innerRadius, 8);
    barShape.lineTo(innerRadius, -8);
    
    // Subtract the bar area from holes and add it back as solid
    const finalShape = new Shape();
    
    // Recreate the G with proper boolean operations
    // Outer circle
    finalShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    
    // Inner circle hole
    const innerHole = new Shape();
    innerHole.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
    finalShape.holes.push(innerHole);
    
    // Right side gap - create a rectangular cutout
    const rightGap = new Shape();
    rightGap.moveTo(0, -20);
    rightGap.lineTo(outerRadius + 5, -20);
    rightGap.lineTo(outerRadius + 5, 20);
    rightGap.lineTo(0, 20);
    rightGap.lineTo(0, -20);
    finalShape.holes.push(rightGap);
    
    // Now create the horizontal bar as a separate positive shape
    const horizontalBar = new Shape();
    horizontalBar.moveTo(0, -6);
    horizontalBar.lineTo(30, -6);
    horizontalBar.lineTo(30, 6);
    horizontalBar.lineTo(0, 6);
    horizontalBar.lineTo(0, -6);
    
    // Combine shapes - we'll create two separate geometries and merge them
    const extrudeSettings = {
      depth: 8,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 0.5,
      bevelSegments: 8,
      curveSegments: 32
    };

    const mainGeometry = new ExtrudeGeometry(finalShape, extrudeSettings);
    const barGeometry = new ExtrudeGeometry(horizontalBar, extrudeSettings);
    
    // Merge the geometries
    const mergedGeometry = new THREE.BufferGeometry();
    const mainPositions = mainGeometry.attributes.position.array;
    const barPositions = barGeometry.attributes.position.array;
    
    // Combine position arrays
    const combinedPositions = new Float32Array(mainPositions.length + barPositions.length);
    combinedPositions.set(mainPositions, 0);
    combinedPositions.set(barPositions, mainPositions.length);
    
    mergedGeometry.setAttribute('position', new THREE.BufferAttribute(combinedPositions, 5));
    
    // Compute normals and center
    mergedGeometry.computeVertexNormals();
    mergedGeometry.center();
    
    // Clean up
    mainGeometry.dispose();
    barGeometry.dispose();
    
    return mergedGeometry;
  }, []);
  
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame(() => {
    if (meshRef.current) {
      let targetScale = scale;
      
      if (hoveredG) {
        targetScale = scale * 1.2;
      }
      
      const lerpFactor = 0.2;
      const newScale = currentScale + (targetScale - currentScale) * lerpFactor;
      setCurrentScale(newScale);
      
      meshRef.current.scale.setScalar(newScale);
      
      // Subtle rotation animation
      meshRef.current.rotation.z += 0.002;
    }
  });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.isG = true;
    }
  }, []);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      rotation={[0, 0, 0]}
    >
      <meshPhysicalMaterial 
        color="#2a2a2a" 
        roughness={0.3} 
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={0.8}
        envMapIntensity={1.5}
      />
    </mesh>
  );
};

function HoverDetector({ 
  onHoverChange 
}: {
  onHoverChange: (hoveredG: boolean) => void;
}) {
  const { camera, raycaster, pointer, scene } = useThree();
  
  useFrame(() => {
    raycaster.setFromCamera(pointer, camera);
    
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      for (const intersect of intersects) {
        const mesh = intersect.object;
        if (mesh.userData && mesh.userData.isG) {
          onHoverChange(true);
          return;
        }
      }
    }
    
    onHoverChange(false);
  });
  
  return null;
}

export function GSvgExtrusion() {
  const [hoveredG, setHoveredG] = useState(false);

  return (
    <div className="h-full w-full bg-black relative z-0">
      <Canvas camera={{ 
        position: [0, 0, 200], 
        fov: 10 
      }}>
        <ambientLight intensity={90} />
        
        {/* Main directional lights matching chrome-grid */}
        <directionalLight 
          position={[-10, 15, 10]} 
          intensity={100}
          castShadow
        />
        
        <directionalLight 
          position={[-10, 10, -5]} 
          intensity={90}
          color="#299bee"
        />
        
        <directionalLight 
          position={[5, -10, 15]} 
          intensity={90}
          color="#299bee"
        />
        
        {/* Point lights for additional illumination */}
        <pointLight 
          position={[0, 50, 30]} 
          intensity={100}
          distance={20}
        />
        
        <pointLight 
          position={[50, 0, 50]} 
          intensity={50}
          distance={15}
          color="#ffffff"
        />
        
        <pointLight 
          position={[50, 0, -50]} 
          intensity={90}
          distance={50}
          color="#ffffff"
        />
        
        <HoverDetector onHoverChange={setHoveredG} />
        
        <GSvg 
          position={[0, 0, 0]}
          scale={1}
          hoveredG={hoveredG}
        />
      </Canvas>
    </div>
  )
}