import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 320;
const LOOK_AHEAD = 160; // how far ahead of camera particles spawn

interface MarineSnowProps {
  wpm: number;
}

export function MarineSnow({ wpm }: MarineSnowProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  const { positions } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = 10 - Math.random() * LOOK_AHEAD;
      sizes[i] = 0.02 + Math.random() * 0.04;
    }
    return { positions, sizes };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const arr = pts.geometry.attributes.position.array as Float32Array;
    // Particles drift subtly; recycled when they go behind camera
    const driftZ = 0.8 + (wpm / 60) * 1.5; // drift toward camera faster at high WPM

    for (let i = 0; i < COUNT; i++) {
      // Move particle slightly toward camera (it stays still; camera flies through)
      arr[i * 3 + 2] += delta * driftZ;
      arr[i * 3 + 0] += delta * (Math.random() - 0.5) * 0.04;
      arr[i * 3 + 1] += delta * (Math.random() - 0.5) * 0.04;

      // Recycle: if particle passed the camera, reset far ahead
      if (arr[i * 3 + 2] > camera.position.z + 8) {
        arr[i * 3 + 0] = (Math.random() - 0.5) * 10;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
        arr[i * 3 + 2] = camera.position.z - LOOK_AHEAD * Math.random();
      }
    }

    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial size={0.035} color="#a0f0e8" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}
