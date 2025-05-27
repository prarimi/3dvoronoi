import { useMemo } from 'react';
import { Vector3, BufferGeometry, BufferAttribute } from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { Edges } from '@react-three/drei';

function generateRandomPoints(count: number, bounds: number): Vector3[] {
  return Array.from({ length: count }, () => new Vector3(
    (Math.random() - 0.5) * bounds,
    (Math.random() - 0.5) * bounds,
    (Math.random() - 0.5) * bounds
  ));
}

function getMidpoint(p1: Vector3, p2: Vector3): Vector3 {
  return new Vector3().addVectors(p1, p2).multiplyScalar(0.5);
}

function distanceToPlane(point: Vector3, planePoint: Vector3, planeNormal: Vector3): number {
  const v = new Vector3().subVectors(point, planePoint);
  return v.dot(planeNormal);
}

interface VoronoiMeshProps {
  numPoints: number;
}

export const VoronoiMesh = ({ numPoints }: VoronoiMeshProps) => {
  const points = useMemo(() => generateRandomPoints(numPoints, 10), [numPoints]);
  
  const cells = useMemo(() => {
    const bounds = 15;
    const virtualBounds = bounds * 2;
    const cells: { vertices: Vector3[]; center: Vector3 }[] = [];

    // Create virtual points at corners and on faces of a large cube
    const virtualPoints: Vector3[] = [];
    
    // Corner points
    [-1, 1].forEach(x => {
      [-1, 1].forEach(y => {
        [-1, 1].forEach(z => {
          virtualPoints.push(new Vector3(
            x * virtualBounds,
            y * virtualBounds,
            z * virtualBounds
          ));
        });
      });
    });

    // Face points
    [-1, 1].forEach(coord => {
      for (let i = -0.5; i <= 0.5; i += 0.5) {
        for (let j = -0.5; j <= 0.5; j += 0.5) {
          virtualPoints.push(
            new Vector3(coord * virtualBounds, i * virtualBounds * 2, j * virtualBounds * 2),
            new Vector3(i * virtualBounds * 2, coord * virtualBounds, j * virtualBounds * 2),
            new Vector3(i * virtualBounds * 2, j * virtualBounds * 2, coord * virtualBounds)
          );
        }
      }
    });

    const allPoints = [...points, ...virtualPoints];

    // Calculate cells for real points only
    points.forEach((centerPoint) => {
      const cellVertices: Vector3[] = [];

      // For each trio of other points, find potential cell vertex
      allPoints.forEach((p1, i1) => {
        if (p1 === centerPoint) return;
        
        allPoints.forEach((p2, i2) => {
          if (i2 <= i1 || p2 === centerPoint) return;
          
          allPoints.forEach((p3, i3) => {
            if (i3 <= i2 || p3 === centerPoint) return;

            try {
              const m1 = getMidpoint(centerPoint, p1);
              const m2 = getMidpoint(centerPoint, p2);
              const m3 = getMidpoint(centerPoint, p3);

              const n1 = new Vector3().subVectors(p1, centerPoint).normalize();
              const n2 = new Vector3().subVectors(p2, centerPoint).normalize();
              const n3 = new Vector3().subVectors(p3, centerPoint).normalize();

              // Solve system of linear equations for intersection point
              const det = n1.x * (n2.y * n3.z - n3.y * n2.z) -
                         n1.y * (n2.x * n3.z - n3.x * n2.z) +
                         n1.z * (n2.x * n3.y - n3.x * n2.y);

              if (Math.abs(det) < 0.0001) return;

              const d1 = n1.dot(m1);
              const d2 = n2.dot(m2);
              const d3 = n3.dot(m3);

              const x = (d1 * (n2.y * n3.z - n3.y * n2.z) -
                        n1.y * (d2 * n3.z - d3 * n2.z) +
                        n1.z * (d2 * n3.y - d3 * n2.y)) / det;

              const y = (n1.x * (d2 * n3.z - d3 * n2.z) -
                        d1 * (n2.x * n3.z - n3.x * n2.z) +
                        n1.z * (n2.x * d3 - n3.x * d2)) / det;

              const z = (n1.x * (n2.y * d3 - n3.y * d2) -
                        n1.y * (n2.x * d3 - n3.x * d2) +
                        d1 * (n2.x * n3.y - n3.x * n2.y)) / det;

              const vertex = new Vector3(x, y, z);

              // Verify vertex is valid
              let isValid = true;
              allPoints.forEach(p => {
                if (p !== centerPoint && vertex.distanceTo(p) < vertex.distanceTo(centerPoint) - 0.0001) {
                  isValid = false;
                }
              });

              // Check if vertex is within bounds
              if (isValid &&
                  Math.abs(x) <= bounds * 1.5 &&
                  Math.abs(y) <= bounds * 1.5 &&
                  Math.abs(z) <= bounds * 1.5) {
                cellVertices.push(vertex);
              }
            } catch (e) {
              console.error('Failed to find intersection:', e);
            }
          });
        });
      });

      // Remove duplicate vertices
      const uniqueVertices: Vector3[] = [];
      cellVertices.forEach((vertex) => {
        if (!uniqueVertices.some(v => vertex.distanceTo(v) < 0.1)) {
          uniqueVertices.push(vertex);
        }
      });

      if (uniqueVertices.length >= 4) {
        cells.push({
          vertices: uniqueVertices,
          center: centerPoint
        });
      }
    });

    return cells;
  }, [points]);

  const cellGeometries = useMemo(() => 
    cells.map(cell => {
      try {
        return new ConvexGeometry(cell.vertices);
      } catch (e) {
        console.error('Failed to create convex geometry:', e);
        return null;
      }
    }).filter((g): g is ConvexGeometry => g !== null)
  , [cells]);
  // Calculate the radius needed for the bounding sphere
  const sphereRadius = useMemo(() => {
    const bounds = 15;
    return Math.sqrt(3) * bounds; // Diagonal of the bounding cube
  }, []);

  return (
    <group>
      {/* Bounding sphere */}
      <mesh>
        <sphereGeometry args={[sphereRadius, 32, 32]} />
        <meshPhysicalMaterial
          transparent={true}
          opacity={0.1}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
          color="#ffffff"
          side={2} // Render both sides
        />
        <Edges
          threshold={15}
          color="#ffffff"
          opacity={0.2}
        />
      </mesh>

      {/* Voronoi cells */}
      {cellGeometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshPhysicalMaterial
            transparent={true}
            opacity={0.3}
            roughness={0.2}
            transmission={0.7}
            thickness={0.5}
            color="#88ccff"
          />
          <Edges
            threshold={15}
            color="#4488ff"
          />
        </mesh>
      ))}
      
      {/* Points */}
      {points.map((point, i) => (
        <mesh key={`point-${i}`} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshPhysicalMaterial
            color="#ff4444"
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};
