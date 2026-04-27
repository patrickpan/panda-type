import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface CameraControllerProps {
  wordIndex: number;
}

const Z_STEP = 5; // world units advanced per completed word
const CAMERA_START_Z = 10;

export const getCameraTargetZ = (wordIndex: number) =>
  CAMERA_START_Z - wordIndex * Z_STEP;

export function CameraController({ wordIndex }: CameraControllerProps) {
  const { camera } = useThree();
  const targetZ = useRef(CAMERA_START_Z);

  useEffect(() => {
    targetZ.current = getCameraTargetZ(wordIndex);
  }, [wordIndex]);

  useFrame(() => {
    camera.position.z += (targetZ.current - camera.position.z) * 0.05;
  });

  return null;
}
