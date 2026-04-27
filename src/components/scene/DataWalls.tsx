import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CHARS = "01アイウエオカキクコ$#@!{}[]|\\<>∑∆∇⟨⟩λψΩ";
const FONT_PX = 11;
const CANVAS_W = 192;
const CANVAS_H = 512;
const COLS = Math.floor(CANVAS_W / FONT_PX);

interface Drop {
  y: number;
  speed: number;
  brightness: number;
}

// Corridor extends from z=+20 to z=-230 (total 250 units).
// Camera travels from z=10 toward z=-140, wall covers the full range.
const WALL_LENGTH = 250; // world units along Z
const WALL_HEIGHT = 18; // world units in Y
const WALL_CENTER_Z = -105; // midpoint of wall along Z

function CorridorWall({ x }: { x: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef(0);

  const { canvas, texture, drops } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000814";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const drops: Drop[] = Array.from({ length: COLS }, () => ({
      y: Math.random() * (CANVAS_H / FONT_PX),
      speed: 0.25 + Math.random() * 0.5,
      brightness: 0.35 + Math.random() * 0.65,
    }));

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // Tile texture along Z corridor length and Y height
    texture.repeat.set(14, 1.5);
    return { canvas, texture, drops };
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, delta) => {
    frameRef.current++;
    if (frameRef.current % 2 !== 0) return;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(0, 8, 20, 0.16)";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.font = `${FONT_PX}px monospace`;

    for (let col = 0; col < COLS; col++) {
      const drop = drops[col];
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const px = col * FONT_PX;
      const py = drop.y * FONT_PX;
      const b = Math.floor(210 * drop.brightness);

      ctx.fillStyle = `rgba(${Math.floor(b * 0.65)}, ${b}, ${Math.floor(b * 0.88)}, 0.95)`;
      ctx.fillText(char, px, py);

      if (drop.y > 2) {
        const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = `rgba(0, ${Math.floor(90 * drop.brightness)}, ${Math.floor(60 * drop.brightness)}, 0.4)`;
        ctx.fillText(trailChar, px, py - FONT_PX * 2);
      }

      drop.y += drop.speed;
      if (drop.y * FONT_PX > CANVAS_H + FONT_PX * 4) {
        drop.y = -Math.random() * 8;
        drop.speed = 0.25 + Math.random() * 0.5;
        drop.brightness = 0.3 + Math.random() * 0.7;
      }
    }

    texture.needsUpdate = true;
  });

  // Left wall faces +X (inward): rotY = +PI/2
  // Right wall faces -X (inward): rotY = -PI/2
  const rotY = x < 0 ? Math.PI / 2 : -Math.PI / 2;

  return (
    <mesh ref={meshRef} position={[x, 0, WALL_CENTER_Z]} rotation={[0, rotY, 0]}>
      <planeGeometry args={[WALL_LENGTH, WALL_HEIGHT]} />
      <meshBasicMaterial map={texture} transparent opacity={0.9} />
    </mesh>
  );
}

function FloorStrip() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000510";
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = "rgba(0,255,204,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 128; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 128);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(128, i);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 30);
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0, -5.5, WALL_CENTER_Z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[12, WALL_LENGTH]} />
      <meshBasicMaterial map={texture} transparent opacity={0.55} />
    </mesh>
  );
}

export function DataWalls() {
  return (
    <>
      <CorridorWall x={-6} />
      <CorridorWall x={6} />
      <FloorStrip />
    </>
  );
}
