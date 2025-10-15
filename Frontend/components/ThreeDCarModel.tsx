"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

interface ThreeDCarModelProps {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: boolean;
}

function Model({ 
  modelPath, 
  scale = 1, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  autoRotate = false
}: ThreeDCarModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={modelRef}
      scale={scale}
      position={position}
      rotation={rotation}
    >
      <primitive object={scene.clone()} />
    </mesh>
  );
}

export function ThreeDCarModel({
  modelPath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = false,
  className = "",
  ...props
}: ThreeDCarModelProps & {
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} {...props}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model 
          modelPath={modelPath} 
          scale={scale} 
          position={position} 
          rotation={rotation}
          autoRotate={autoRotate}
        />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}