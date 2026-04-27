import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CursorLightProps {
  wpm: number;
}

const _ndc = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _target = new THREE.Vector3();

export function CursorLight({ wpm }: CursorLightProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    const light = lightRef.current;
    if (!light) return;

    // Unproject mouse from NDC to world at z=0 plane
    _ndc.set(mouse.current.x, mouse.current.y, 0.5).unproject(camera);
    _dir.copy(_ndc).sub(camera.position).normalize();
    const t = (1 - camera.position.z) / _dir.z;
    _target.copy(camera.position).addScaledVector(_dir, t);
    _target.z = 1;

    light.position.lerp(_target, 0.1);

    const targetIntensity = 0.6 + (wpm / 100) * 3.5;
    light.intensity += (targetIntensity - light.intensity) * 0.08;
  });

  return (
    <pointLight
      ref={lightRef}
      color="#00ffcc"
      intensity={0.6}
      distance={22}
      decay={2}
    />
  );
}
