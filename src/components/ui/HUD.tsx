import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

interface HUDProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  timeElapsed: number;
  wordIndex: number;
  totalWords: number;
  isStarted: boolean;
  isComplete: boolean;
}

const TopCenter = styled.div`
  position: fixed;
  top: 22px;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
`;

const TopInner = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Title = styled.div`
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  color: rgba(0, 255, 204, 0.45);
  text-transform: uppercase;
  white-space: nowrap;
`;

const SectorLabel = styled(motion.div)`
  font-family: var(--font-display);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: rgba(0, 255, 204, 0.35);
  white-space: nowrap;
`;

const BottomBar = styled(motion.div)`
  position: fixed;
  bottom: 28px;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const StatsPanel = styled.div`
  display: flex;
  gap: 24px;
  background: rgba(0, 12, 30, 0.75);
  border: 1px solid rgba(0, 255, 204, 0.2);
  border-radius: 8px;
  padding: 10px 18px;
  backdrop-filter: blur(8px);
`;

const Divider = styled.div`
  width: 1px;
  background: rgba(0, 255, 204, 0.15);
  align-self: stretch;
`;

const StatLabel = styled.div`
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: rgba(0, 255, 204, 0.5);
  font-family: var(--font-display);
  margin-bottom: 2px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.4rem;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-cyan);
  text-shadow: 0 0 12px rgba(0, 255, 204, 0.6);
  letter-spacing: 0.05em;
  text-align: center;
`;

const StatUnit = styled.span`
  font-size: 0.7rem;
  margin-left: 3px;
  opacity: 0.6;
`;

const ProgressTrack = styled.div`
  width: 340px;
  height: 2px;
  background: rgba(0, 255, 204, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 255, 204, 0.4), rgba(0, 255, 204, 0.9));
  box-shadow: 0 0 8px rgba(0, 255, 204, 0.6);
`;

function StatBox({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div>
      <StatLabel>{label}</StatLabel>
      <StatValue>
        {value}
        {unit && <StatUnit>{unit}</StatUnit>}
      </StatValue>
    </div>
  );
}

export function HUD({ wpm, rawWpm, accuracy, timeElapsed, wordIndex, totalWords, isStarted, isComplete }: HUDProps) {
  const minutes = Math.floor(timeElapsed / 60);
  const secs = Math.floor(timeElapsed % 60);
  const timeStr = minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  const progress = totalWords > 0 ? (wordIndex / totalWords) * 100 : 0;

  return (
    <>
      <TopCenter>
        <TopInner
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Title>◈ PANDA TYPE</Title>
          <AnimatePresence>
            {isStarted && (
              <SectorLabel initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                SECTOR {Math.min(wordIndex + 1, totalWords)} / {totalWords} &nbsp;▶
              </SectorLabel>
            )}
          </AnimatePresence>
        </TopInner>
      </TopCenter>

      <AnimatePresence>
        {isStarted && !isComplete && (
          <BottomBar
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <StatsPanel>
              <StatBox label="WPM" value={isNaN(wpm) ? 0 : wpm} />
              <Divider />
              <StatBox label="RAW" value={isNaN(rawWpm) ? 0 : rawWpm} />
              <Divider />
              <StatBox label="ACC" value={accuracy} unit="%" />
              <Divider />
              <StatBox label="TIME" value={timeStr} />
            </StatsPanel>
            <ProgressTrack>
              <ProgressFill animate={{ width: `${progress}%` }} transition={{ ease: "easeOut", duration: 0.3 }} />
            </ProgressTrack>
          </BottomBar>
        )}
      </AnimatePresence>
    </>
  );
}
