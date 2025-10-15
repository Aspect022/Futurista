"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";

type ThreeDViewProps = {
  onSelectPart?: (partId: string) => void;
  autoRotate?: boolean;
  selectedCar: string;
};

// GLTF model loader component
function CarModel({ carId }: { carId: string }) {
  let modelPath = "";
  
  if (carId === "car-1") {
    modelPath = "/3d-models/car1.glb";
  } else if (carId === "car-2") {
    modelPath = "/3d-models/car2.glb";
  } else if (carId === "car-3") {
    modelPath = "/3d-models/car3.glb";
  } else {
    // Default to car1 if unknown carId
    modelPath = "/3d-models/car1.glb";
  }

  const { scene } = useGLTF(modelPath);
  
  // Find and make specific parts clickable
  useEffect(() => {
    if (!scene) return;

    // If your models have named parts, you can make them interactive here
    scene.traverse((child) => {
      if (child.isMesh) {
        child.userData.name = child.name;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

export default function ThreeDView({
  onSelectPart,
  autoRotate = true,
  selectedCar,
}: ThreeDViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#f6faff,white_60%)]"
      aria-label="3D vehicle viewer"
    >
      <div className="relative h-full w-full">
        <Suspense fallback={
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_0%,#f6faff,white_60%)]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/20 border-t-black"></div>
              <p className="text-sm text-black/60">Loading 3D model...</p>
            </div>
          </div>
        }>
          <Canvas 
            camera={{ position: [3, 2, 5], fov: 50 }} 
            dpr={[1, 2]}
            className="h-full w-full"
          >
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <CarModel carId={selectedCar} />
            <OrbitControls 
              enablePan={false} 
              autoRotate={autoRotate} 
              autoRotateSpeed={2} 
            />
          </Canvas>
        </Suspense>
      </div>

      {/* A11y hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/5 px-3 py-1 text-xs text-black/70">
        {selectedCar === "car-1" ? "Car 1 Model" : selectedCar === "car-2" ? "Car 2 Model" : "Vehicle Model"} — Drag to orbit
      </div>
    </div>
  );
}