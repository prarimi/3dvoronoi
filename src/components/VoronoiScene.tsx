import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VoronoiMesh } from './VoronoiMesh';
import { useState } from 'react';

export const VoronoiScene = () => {
  const [numPoints, setNumPoints] = useState(10);

  return (
    <div className="w-full h-screen relative">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gray-900/70 text-white p-4">
        <h1 className="text-3xl font-bold text-center mb-4">3D Voronoi Diagram</h1>
        <div className="flex items-center justify-center gap-4">
          <label className="flex items-center gap-2">
            Number of Points:
            <input
              type="range"
              min="3"
              max="30"
              value={numPoints}
              onChange={(e) => setNumPoints(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="w-8 text-center">{numPoints}</span>
          </label>
        </div>
      </div>

      <Canvas camera={{ position: [30, 30, 30], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <VoronoiMesh numPoints={numPoints} />
        <OrbitControls enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};
