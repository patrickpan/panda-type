import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { DataWalls } from "./DataWalls";
import { MarineSnow } from "./MarineSnow";
import { CameraController } from "./CameraController";
import { CursorLight } from "./CursorLight";

interface DeepSeaSceneProps {
  wordIndex: number;
  wpm: number;
}

// Glowing nodes distributed along the Z corridor that the camera flies through
function DataNodes() {
  const nodes = useMemo(() => {
    const rng = (n: number) => (Math.random() - 0.5) * n;
    return Array.from({ length: 24 }, (_, i) => ({
      z: -(i + 1) * 8 - rng(4),
      x: rng(8),
      y: rng(6),
      scale: 0.08 + Math.random() * 0.14,
      hue: Math.random() > 0.75 ? "#00ccff" : "#00ffcc",
    }));
  }, []);

  return (
    <>
      {nodes.map((n, i) => (
        <group key={i} position={[n.x, n.y, n.z]}>
          <mesh>
            <sphereGeometry args={[n.scale, 8, 8]} />
            <meshBasicMaterial color={n.hue} />
          </mesh>
          <pointLight color={n.hue} intensity={0.4} distance={6} decay={2} />
        </group>
      ))}
    </>
  );
}

export function DeepSeaScene({ wordIndex, wpm }: DeepSeaSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 65, near: 0.1, far: 300 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => gl.setClearColor("#000814")}
    >
      {/* Corridor fog — walls dissolve to black ahead */}
      <fog attach="fog" args={["#000814", 20, 85]} />

      <ambientLight intensity={0.04} color="#001833" />

      <CameraController wordIndex={wordIndex} />
      <DataWalls />
      <DataNodes />
      <MarineSnow wpm={wpm} />
      <CursorLight wpm={wpm} />
    </Canvas>
  );
}
