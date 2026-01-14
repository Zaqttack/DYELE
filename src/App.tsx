import {
  Badge,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title
} from "@mantine/core";
import { useMemo, useState, useEffect } from "react";
import dyesData from "./data/dyes.json";
import GuessInput from "./components/GuessInput";
import GuessRow from "./components/GuessRow";
import ResultsModal from "./components/ResultsModal";
import Countdown from "./components/Countdown";
import Strikes from "./components/Strikes";
import { getChicagoDateKey } from "./lib/date";
import {
  compareGuessToTarget,
  formatShareGrid,
  selectDailyDye
} from "./lib/game";
import { loadGameState, saveGameState } from "./lib/storage";
import type { Dye, GameStatus, Guess } from "./types";

const dyes = dyesData as Dye[];
const MAX_ATTEMPTS = 4;

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
    const trimmedSelection = selection.trim();
    if (!trimmedSelection) {
      setError("Pick a dye before submitting.");
      return;
    }
    const guessDye = dyes.find((dye) => dye.displayName === trimmedSelection);
    if (!guessDye) {
      setError("Choose a dye from the list.");
      return;
    }
    if (guesses.some((guess) => guess.dyeId === guessDye.id)) {
      setError("You already guessed that dye.");
      return;
    }
    const feedback = compareGuessToTarget(guessDye, target);
    const nextGuesses = [...guesses, { dyeId: guessDye.id, feedback }];
    const didWin = guessDye.id === target.id;
    const didLose = !didWin && nextGuesses.length >= MAX_ATTEMPTS;

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
        ? `DYELE ${dateKey} ${guesses.length}/${MAX_ATTEMPTS}`
        : `DYELE Practice ${guesses.length}/${MAX_ATTEMPTS}`;
    const message = `${header}\n${grid}`;
    try {
      await navigator.clipboard.writeText(message);
      setError("Results copied to clipboard.");
    } catch {
      window.prompt("Copy your results:", message);
    }
  };

  const orderedGuesses = [...guesses].reverse().map((guess) => ({
    guess,
    dyeName: dyes.find((dye) => dye.id === guess.dyeId)?.displayName
  }));

  const isLocked = status !== "playing";
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - guesses.length);

  return (
    <Container size="md" py={48}>
      <Stack gap="xl">
        <Stack gap="sm">
          <Text
            size="xs"
            tt="uppercase"
            fw={700}
            c="dimmed"
            style={{ letterSpacing: "0.4em" }}
          >
            Daily dye deduction
          </Text>
          <Title order={1} ff="Fraunces, serif" size="3rem">
            DYELE
          </Title>
          <Text size="lg" c="dimmed">
            Guess the mystery food dye. Match the attribute tiles to uncover the
            daily formula.
          </Text>
          <Group gap="xs">
            <Badge color="green" variant="light">
              Match
            </Badge>
            <Badge color="yellow" variant="light">
              Direction hint
            </Badge>
            <Badge color="gray" variant="light">
              No match
            </Badge>
          </Group>
        </Stack>

        <GuessInput
          dyes={dyes}
          value={selection}
          onChange={setSelection}
          onSubmit={handleSubmit}
          disabled={isLocked}
          error={error}
        />

        <Stack gap="md">
          <Strikes remaining={remainingAttempts} total={MAX_ATTEMPTS} />
          {orderedGuesses.map((row, index) => (
            <GuessRow
              key={`${row.guess.dyeId}-${index}`}
              index={guesses.length - index}
              guess={row.guess}
              displayName={row.dyeName}
            />
          ))}
        </Stack>

        <Group justify="space-between" wrap="wrap">
          {mode === "daily" ? <Countdown /> : null}
          <Group>
            {mode === "practice" ? (
              <Button variant="outline" color="dark" onClick={returnToDaily}>
                Return to daily
              </Button>
            ) : null}
            <Button variant="outline" color="dark" onClick={startPractice}>
              Practice
            </Button>
          </Group>
        </Group>

        <Group justify="space-between" wrap="wrap">
          <Text size="sm" c="dimmed">
            A ByteSrc project
          </Text>
          <Button
            component="a"
            href="https://buymeacoffee.com/zaqttack"
            target="_blank"
            rel="noreferrer"
            variant="filled"
            color="dark"
          >
            Buy me a coffee
          </Button>
        </Group>

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
      </Stack>
    </Container>
  );
};

export default App;
