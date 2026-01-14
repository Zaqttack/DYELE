import { useMemo, useState, useEffect } from "react";
import dyesData from "./data/dyes.json";
import GuessInput from "./components/GuessInput";
import GuessRow from "./components/GuessRow";
import ResultsModal from "./components/ResultsModal";
import Countdown from "./components/Countdown";
import { getChicagoDateKey } from "./lib/date";
import {
  compareGuessToTarget,
  formatShareGrid,
  selectDailyDye
} from "./lib/game";
import { loadGameState, saveGameState } from "./lib/storage";
import type { Dye, GameStatus, Guess } from "./types";

const dyes = dyesData as Dye[];

const getRandomDye = (list: Dye[]): Dye => {
  if (window.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return list[buffer[0] % list.length];
  }
  return list[Math.floor(Math.random() * list.length)];
};

const App = () => {
  const dateKey = getChicagoDateKey();
  const dailyTarget = useMemo(() => selectDailyDye(dyes, dateKey), [dateKey]);
  const [mode, setMode] = useState<"daily" | "practice">("daily");
  const [target, setTarget] = useState<Dye>(dailyTarget);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [selection, setSelection] = useState("");
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (mode !== "daily") {
      return;
    }
    setTarget(dailyTarget);
    const saved = loadGameState(dateKey);
    if (saved) {
      setGuesses(saved.guesses);
      setStatus(saved.status);
    } else {
      setGuesses([]);
      setStatus("playing");
    }
    setSelection("");
  }, [mode, dateKey, dailyTarget]);

  useEffect(() => {
    if (mode !== "daily") {
      return;
    }
    saveGameState(dateKey, { dateKey, guesses, status });
  }, [dateKey, guesses, mode, status]);

  useEffect(() => {
    if (status === "won" || status === "lost") {
      setShowResults(true);
    }
  }, [status]);

  const startPractice = () => {
    setMode("practice");
    setTarget(getRandomDye(dyes));
    setGuesses([]);
    setStatus("playing");
    setSelection("");
    setError("");
    setShowResults(false);
  };

  const returnToDaily = () => {
    setMode("daily");
    setShowResults(false);
  };

  const handleSubmit = () => {
    if (!selection) {
      setError("Pick a dye before submitting.");
      return;
    }
    if (guesses.some((guess) => guess.dyeId === selection)) {
      setError("You already guessed that dye.");
      return;
    }
    const guessDye = dyes.find((dye) => dye.id === selection);
    if (!guessDye) {
      setError("That dye is not in the list.");
      return;
    }
    const feedback = compareGuessToTarget(guessDye, target);
    const nextGuesses = [...guesses, { dyeId: selection, feedback }];
    const didWin = selection === target.id;
    const didLose = !didWin && nextGuesses.length >= 6;

    setGuesses(nextGuesses);
    setSelection("");
    setError("");
    if (didWin) {
      setStatus("won");
    } else if (didLose) {
      setStatus("lost");
    }
  };

  const handleShare = async () => {
    const grid = formatShareGrid(guesses);
    const header =
      mode === "daily"
        ? `DYELE ${dateKey} ${guesses.length}/6`
        : `DYELE Practice ${guesses.length}/6`;
    const message = `${header}\n${grid}`;
    try {
      await navigator.clipboard.writeText(message);
      setError("Results copied to clipboard.");
    } catch {
      window.prompt("Copy your results:", message);
    }
  };

  const rows = Array.from({ length: 6 }, (_, index) => {
    const guess = guesses[index];
    const dyeName = guess
      ? dyes.find((dye) => dye.id === guess.dyeId)?.displayName
      : undefined;
    return { guess, dyeName };
  });

  const isLocked = status !== "playing";

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-inkMuted">
          Daily dye deduction
        </p>
        <h1 className="font-display text-5xl text-ink">DYELE</h1>
        <p className="max-w-2xl text-lg text-inkMuted">
          Guess the mystery food dye. Match the attribute tiles to uncover the
          daily formula.
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-inkMuted">
          <span className="rounded-full bg-match/20 px-3 py-1 text-ink">
            Match
          </span>
          <span className="rounded-full bg-hint/30 px-3 py-1 text-ink">
            Direction hint
          </span>
          <span className="rounded-full bg-miss/60 px-3 py-1 text-inkMuted">
            No match
          </span>
        </div>
      </header>

      <GuessInput
        dyes={dyes}
        value={selection}
        onChange={setSelection}
        onSubmit={handleSubmit}
        disabled={isLocked}
        error={error}
      />

      <section className="grid gap-4">
        {rows.map((row, index) => (
          <GuessRow
            key={`row-${index}`}
            index={index}
            guess={row.guess}
            displayName={row.dyeName}
          />
        ))}
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4">
        {mode === "daily" ? <Countdown /> : null}
        <div className="flex flex-wrap gap-3">
          {mode === "practice" ? (
            <button
              type="button"
              className="rounded-xl border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
              onClick={returnToDaily}
            >
              Return to daily
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-xl border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
            onClick={startPractice}
          >
            Practice
          </button>
        </div>
      </footer>

      {showResults ? (
        <ResultsModal
          status={status}
          attempts={guesses.length}
          target={target}
          onClose={() => setShowResults(false)}
          onShare={handleShare}
          onPractice={startPractice}
          isDaily={mode === "daily"}
        />
      ) : null}
    </div>
  );
};

export default App;
