# 3D Integration Guide

This dashboard is prepared for a clickable, rotating 3D car. You can integrate via React Three Fiber (R3F) for maximum control, or Spline for quick embedding. The code exposes a future `onSelectPart(partId)` hook so you can route part selections to real-time metrics.

## Recommended Sources

- Spline — spline.design
  - Fast prototyping and sharing. Great for early demos.
  - Use `@splinetool/react-spline` component to embed.
- Sketchfab — sketchfab.com
  - Search for GLB/GLTF car models; filter for “Downloadable” and check license (prefer CC0).
  - Optimize in Blender: remove interior detail if unnecessary, simplify materials.
- OEM/Open datasets
  - Convert CAD to GLB/GLTF via Blender. Keep triangle count reasonable.

Prefer GLB (binary GLTF). Use DRACO compression when possible; target < 10 MB.

## File Placement

- Place assets under `/assets/3d/`.
- Example: `/assets/3d/car.glb`. Avoid hotlinking.

## Option A — React Three Fiber (recommended)

Replace the placeholder in `components/dashboard/three-d-view.tsx`:

\`\`\`tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'

function CarModel(props: JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF('/assets/3d/car.glb')
  return <primitive object={scene} {...props} />
}

export default function ThreeDViewR3F({ onSelectPart, autoRotate = true }) {
  return (
    <Canvas camera={{ position: [3, 2, 5], fov: 50 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <Environment preset="city" />
        <group rotation={[0, 0.6, 0]}>
          <CarModel />
        </group>
        <OrbitControls enablePan={false} autoRotate={autoRotate} />
      </Suspense>
    </Canvas>
  )
}
\`\`\`

Clickable parts:
- Name meshes (e.g., Wheel_FL, Engine) in Blender.
- Traverse scene and attach `onPointerDown={(e) => onSelectPart?.(e.object.name)}`.
- Drive metrics by updating shared state (SWR/store) when a part is selected.

Performance:
- Bake AO, prefer PBR textures with small resolution, limit shadows, and reuse materials.

## Option B — Spline (fastest)

\`\`\`tsx
import Spline from '@splinetool/react-spline'

export default function ThreeDViewSpline({ onSelectPart }) {
  return <Spline scene="https://prod.spline.design/your-id/scene.splinecode" />
}
\`\`\`

Map Spline object names to features using `onMouseDown` events if exposed.

## Real-time Monitoring (later)

- Keep a global store (e.g., SWR) with `selectedPart`, `metrics`, and `healthScore`.
- Connect to a streaming API or WebSocket to push updates.
- Update `MetricsPanel` via props or shared store; throttle UI updates to 250ms.

## Accessibility

- Provide keyboard navigation to select parts (Tab highlights; Enter to select).
- Offer a list of parts as an alternative to 3D interaction.
- Respect `prefers-reduced-motion` by pausing auto-rotation.
