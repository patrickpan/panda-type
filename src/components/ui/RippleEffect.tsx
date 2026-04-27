import { useEffect, useRef, useState } from "react";
import { CompletedWordEvent } from "#root/hooks/useTypingEngine";

interface RippleEntry {
  id: number;
  x: number;
  y: number;
  correct: boolean;
}

let nextId = 0;

interface RippleEffectProps {
  event: CompletedWordEvent | null;
}

export function RippleEffect({ event }: RippleEffectProps) {
  const [ripples, setRipples] = useState<RippleEntry[]>([]);
  const prevTimestamp = useRef<number | null>(null);

  useEffect(() => {
    if (!event || event.timestamp === prevTimestamp.current) return;
    prevTimestamp.current = event.timestamp;

    const entry: RippleEntry = {
      id: nextId++,
      // Place ripple at screen center since typing area is centered
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      correct: event.correct,
    };
    setRipples((prev) => [...prev, entry]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== entry.id));
    }, 750);
  }, [event]);

  return (
    <>
      {ripples.map((r) => (
        <div
          key={r.id}
          className="ripple-ring"
          style={{
            left: r.x,
            top: r.y,
            borderColor: r.correct ? "var(--color-cyan)" : "var(--color-red)",
            boxShadow: `0 0 24px ${r.correct ? "var(--color-cyan)" : "var(--color-red)"}`,
          }}
        />
      ))}
    </>
  );
}
