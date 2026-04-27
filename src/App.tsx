import { AnimatePresence } from "framer-motion";
import { DeepSeaScene } from "./components/scene/DeepSeaScene";
import { TypingOverlay } from "./components/ui/TypingOverlay";
import { HUD } from "./components/ui/HUD";
import { RippleEffect } from "./components/ui/RippleEffect";
import { ResultScreen } from "./components/ui/ResultScreen";
import { useTypingEngine } from "./hooks/useTypingEngine";

const TOTAL_WORDS = 30;

export default function App() {
  const engine = useTypingEngine();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      {/* 3D background scene */}
      <DeepSeaScene wordIndex={engine.currentWordIndex} wpm={engine.wpm} />

      {/* Ripple effect on word completion */}
      <RippleEffect event={engine.completedWordEvent} />

      {/* HUD stats */}
      <HUD
        wpm={engine.wpm}
        rawWpm={engine.rawWpm}
        accuracy={engine.accuracy}
        timeElapsed={engine.timeElapsed}
        wordIndex={engine.currentWordIndex}
        totalWords={TOTAL_WORDS}
        isStarted={engine.isStarted}
        isComplete={engine.isComplete}
      />

      {/* Typing interface overlay */}
      <AnimatePresence>
        {!engine.isComplete && (
          <TypingOverlay
            wordStates={engine.wordStates}
            currentWordIndex={engine.currentWordIndex}
            hasError={engine.hasError}
            isStarted={engine.isStarted}
            isComplete={engine.isComplete}
            handleInput={engine.handleInput}
            handleKeyDown={engine.handleKeyDown}
            currentInput={engine.currentInput}
          />
        )}
      </AnimatePresence>

      {/* Results screen */}
      <AnimatePresence>
        {engine.isComplete && engine.resultData && <ResultScreen {...engine.resultData} onRetry={handleRetry} />}
      </AnimatePresence>
    </>
  );
}
