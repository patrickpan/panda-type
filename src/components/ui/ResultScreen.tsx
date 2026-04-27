import styled from "styled-components";
import { motion } from "framer-motion";
import { ResultData } from "#root/hooks/useTypingEngine";

interface ResultScreenProps extends ResultData {
  onRetry: () => void;
}

const Screen = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
`;

const Heading = styled(motion.div)`
  font-family: var(--font-display);
  font-size: clamp(1rem, 3vw, 1.6rem);
  letter-spacing: 0.4em;
  color: rgba(0, 255, 204, 0.6);
  text-transform: uppercase;
`;

const Panel = styled(motion.div)`
  position: relative;
  overflow: hidden;
  background: rgba(0, 12, 30, 0.85);
  border: 1px solid rgba(0, 255, 204, 0.2);
  border-radius: 6px;
  padding: 36px 48px;
  backdrop-filter: blur(16px);
  box-shadow:
    0 0 80px rgba(0, 0, 0, 0.7),
    inset 0 0 60px rgba(0, 20, 50, 0.4);
`;

const Scanline = styled.div`
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 255, 204, 0.012) 3px,
    rgba(0, 255, 204, 0.012) 4px
  );
  pointer-events: none;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  position: relative;
  z-index: 1;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 16px 28px;
  min-width: 120px;
  background: rgba(0, 255, 204, 0.04);
  border: 1px solid rgba(0, 255, 204, 0.15);
  border-radius: 4px;
`;

const StatLabel = styled.div`
  font-family: var(--font-display);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: rgba(0, 255, 204, 0.5);
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 900;
  line-height: 1;
  color: #00ffcc;
  text-shadow:
    0 0 20px rgba(0, 255, 204, 0.5),
    0 0 60px rgba(0, 255, 204, 0.2);
`;

const StatUnit = styled.span`
  font-size: 1rem;
  margin-left: 4px;
  opacity: 0.6;
`;

const RetryButton = styled(motion.button)`
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: rgba(0, 255, 204, 0.8);
  background: transparent;
  border: 1px solid rgba(0, 255, 204, 0.3);
  border-radius: 3px;
  padding: 12px 36px;
  cursor: pointer;
  text-transform: uppercase;
`;

function BigStat({
  label,
  value,
  unit,
  testId,
}: {
  label: string;
  value: string | number;
  unit?: string;
  testId: string;
}) {
  return (
    <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <StatLabel>{label}</StatLabel>
      <StatValue data-testid={testId}>
        {value}
        {unit && <StatUnit>{unit}</StatUnit>}
      </StatValue>
    </StatCard>
  );
}

export function ResultScreen({ wpm, rawWpm, accuracy, timeTaken, onRetry }: ResultScreenProps) {
  const minutes = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;

  return (
    <Screen initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Heading initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        ◈ SESSION TERMINATED — RESULTS
      </Heading>

      <Panel
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Scanline />
        <StatsRow>
          <BigStat label="WPM" value={wpm} testId="result-wpm" />
          <BigStat label="RAW WPM" value={rawWpm} testId="result-raw-wpm" />
          <BigStat label="ACCURACY" value={accuracy} unit="%" testId="result-accuracy" />
          <BigStat label="TIME" value={timeStr} testId="result-time" />
        </StatsRow>
      </Panel>

      <RetryButton
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(0,255,204,0.3)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onRetry}
      >
        ↺ TEST AGAIN
      </RetryButton>
    </Screen>
  );
}
