import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  Title
} from "@mantine/core";
import { useMemo, useState, useEffect, useRef } from "react";
import dyesData from "./data/dyes.json";
import GuessInput from "./components/GuessInput";
import GuessRow from "./components/GuessRow";
import ResultsModal from "./components/ResultsModal";
import Countdown from "./components/Countdown";
import Strikes from "./components/Strikes";
import ChangeLogModal from "./components/ChangeLogModal";
import SourcesPlansModal from "./components/SourcesPlansModal";
import HistoryModal from "./components/HistoryModal";
import { getChicagoDateKey } from "./lib/date";
import {
  compareGuessToTarget,
  formatShareGrid,
  selectDailyDye
} from "./lib/game";
import {
  clearGameState,
  loadAllGameStates,
  loadGameState,
  loadHistory,
  saveHistory,
  saveGameState,
  upsertHistoryEntry
} from "./lib/storage";
import type { Dye, GameStatus, Guess, HistoryEntry } from "./types";

const dyes = dyesData as Dye[];
const MAX_ATTEMPTS = 4;
const CHANGELOG_ENTRIES = [
  {
    date: "2026-01-15",
    items: [
      "Daily progress stays saved when you come back.",
      "New popups for updates, sources, and history.",
      "Fresh visuals: color swatches and cleaner cards.",
      "More details in the dye picker to help guide choices.",
      "History view with shareable past results."
    ]
  },
  {
    date: "2026-01-14",
    items: [
      "Initial public release of DYELE.",
      "Daily puzzle, practice mode, and share results."
    ]
  }
];

const getRandomDye = (list: Dye[]): Dye => {
  if (window.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return list[buffer[0] % list.length];
  }
  return list[Math.floor(Math.random() * list.length)];
};

const App = () => {
  const [dateKey, setDateKey] = useState(getChicagoDateKey);
  const dailyTarget = useMemo(() => selectDailyDye(dyes, dateKey), [dateKey]);
  const [mode, setMode] = useState<"daily" | "practice">("daily");
  const [target, setTarget] = useState<Dye>(dailyTarget);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [selection, setSelection] = useState("");
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [resultsDismissed, setResultsDismissed] = useState(false);
  const [hasHydratedDaily, setHasHydratedDaily] = useState(false);
  const [suppressResultsOpen, setSuppressResultsOpen] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showSourcesPlans, setShowSourcesPlans] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const suppressResultsOnceRef = useRef(false);

  useEffect(() => {
    setHasHydratedDaily(false);
    if (mode !== "daily") {
      return;
    }
    setTarget(dailyTarget);
    const saved = loadGameState(dateKey);
    if (saved) {
      setGuesses(saved.guesses);
      setStatus(saved.status);
      const dismissed = saved.resultsDismissed ?? false;
      setResultsDismissed(dismissed);
      setShowResults(false);
      setShareMessage("");
      setSuppressResultsOpen(saved.status !== "playing");
      suppressResultsOnceRef.current = saved.status !== "playing";
    } else {
      setGuesses([]);
      setStatus("playing");
      setShowResults(false);
      setResultsDismissed(false);
      setShareMessage("");
      setSuppressResultsOpen(false);
      suppressResultsOnceRef.current = false;
    }
    setSelection("");
    setHasHydratedDaily(true);
  }, [mode, dateKey, dailyTarget]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const existing = loadHistory();
    if (existing.length > 0) {
      setHistoryEntries(existing);
      return;
    }
    const states = loadAllGameStates();
    const migrated = states
      .filter((state) => state.status !== "playing" && state.guesses.length > 0)
      .map((state) => ({
        dateKey: state.dateKey,
        status: state.status,
        attempts: state.guesses.length,
        shareGrid: formatShareGrid(state.guesses)
      }))
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    if (migrated.length > 0) {
      saveHistory(migrated);
      setHistoryEntries(migrated);
      return;
    }
    setHistoryEntries([]);
  }, []);

  useEffect(() => {
    if (mode !== "daily" || !hasHydratedDaily) {
      return;
    }
    saveGameState(dateKey, { dateKey, guesses, status, resultsDismissed });
  }, [dateKey, guesses, mode, resultsDismissed, status, hasHydratedDaily]);

  useEffect(() => {
    if (status === "won" || status === "lost") {
      if (suppressResultsOnceRef.current) {
        suppressResultsOnceRef.current = false;
        return;
      }
      if (suppressResultsOpen) {
        setSuppressResultsOpen(false);
        return;
      }
      setResultsDismissed(false);
      setShowResults(true);
    }
  }, [status, suppressResultsOpen]);

  const startPractice = () => {
    setMode("practice");
    setTarget(getRandomDye(dyes));
    setGuesses([]);
    setStatus("playing");
    setSelection("");
    setError("");
    setShowResults(false);
    setShareMessage("");
    setSuppressResultsOpen(false);
  };

  const resetPractice = () => {
    setTarget(getRandomDye(dyes));
    setGuesses([]);
    setStatus("playing");
    setSelection("");
    setError("");
    setShowResults(false);
    setResultsDismissed(false);
    setShareMessage("");
    setSuppressResultsOpen(false);
  };

  const returnToDaily = () => {
    setMode("daily");
    setShowResults(false);
    setShareMessage("");
    setSuppressResultsOpen(false);
  };

  const resetDaily = () => {
    clearGameState(dateKey);
    setGuesses([]);
    setStatus("playing");
    setSelection("");
    setError("");
    setShowResults(false);
    setResultsDismissed(false);
    setShareMessage("");
    setSuppressResultsOpen(false);
    saveGameState(dateKey, {
      dateKey,
      guesses: [],
      status: "playing",
      resultsDismissed: false
    });
  };

  const getDateKeyDaysAgo = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value ?? "0000";
    const month = parts.find((part) => part.type === "month")?.value ?? "00";
    const day = parts.find((part) => part.type === "day")?.value ?? "00";
    return `${year}-${month}-${day}`;
  };

  const seedHistory = (count = 5) => {
    const emojis = ["🟩", "🟨", "⬜"];
    const existing = loadHistory();
    const seeded: HistoryEntry[] = [];

    for (let i = 1; i <= count; i += 1) {
      const dateKeyForEntry = getDateKeyDaysAgo(i);
      const attempts = Math.floor(Math.random() * MAX_ATTEMPTS) + 1;
      const rows = Array.from({ length: attempts }, () =>
        Array.from({ length: 4 }, () => emojis[Math.floor(Math.random() * 3)]).join("")
      );
      seeded.push({
        dateKey: dateKeyForEntry,
        status: Math.random() > 0.25 ? "won" : "lost",
        attempts,
        shareGrid: rows.join("\n")
      });
    }

    const merged = [
      ...seeded,
      ...existing.filter(
        (entry) => !seeded.some((seed) => seed.dateKey === entry.dateKey)
      )
    ];
    saveHistory(merged);
    setHistoryEntries(merged);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const adminApi = {
      resetDaily,
      resetPractice: resetPractice,
      seedHistory
    };
    (window as typeof window & { __dyeleAdmin?: typeof adminApi }).__dyeleAdmin =
      adminApi;
  }, [dateKey]);

  const handleDailyReset = () => {
    if (mode !== "daily") {
      return;
    }
    const nextDateKey = getChicagoDateKey();
    if (nextDateKey === dateKey) {
      return;
    }
    setDateKey(nextDateKey);
    setTarget(selectDailyDye(dyes, nextDateKey));
    setGuesses([]);
    setStatus("playing");
    setSelection("");
    setError("");
    setShowResults(false);
    setResultsDismissed(false);
    setShareMessage("");
    setSuppressResultsOpen(false);
    setHasHydratedDaily(false);
  };

  const handleSubmit = () => {
    const trimmedSelection = selection.trim();
    if (!trimmedSelection) {
      setError("Pick a dye before submitting.");
      return;
    }
    const normalizedSelection = trimmedSelection.toLowerCase();
    const guessDye = dyes.find(
      (dye) => dye.displayName.toLowerCase() === normalizedSelection
    );
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
    const nextStatus: GameStatus = didWin ? "won" : didLose ? "lost" : "playing";

    setGuesses(nextGuesses);
    setSelection("");
    setError("");
    setStatus(nextStatus);
    if (mode === "daily") {
      if (nextStatus !== "playing") {
        const shareGrid = formatShareGrid(nextGuesses);
        const nextEntry: HistoryEntry = {
          dateKey,
          status: nextStatus,
          attempts: nextGuesses.length,
          shareGrid
        };
        setHistoryEntries(upsertHistoryEntry(nextEntry));
      }
      saveGameState(dateKey, {
        dateKey,
        guesses: nextGuesses,
        status: nextStatus,
        resultsDismissed: nextStatus === "playing" ? resultsDismissed : false
      });
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
      setShareMessage("Results copied to clipboard.");
    } catch {
      window.prompt("Copy your results:", message);
    }
  };

  const handleHistoryCopy = async (entry: HistoryEntry) => {
    const header = `DYELE ${entry.dateKey} ${entry.attempts}/${MAX_ATTEMPTS}`;
    const message = `${header}\n${entry.shareGrid}`;
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      window.prompt("Copy your results:", message);
    }
  };

  const orderedGuesses = [...guesses].reverse().map((guess) => {
    const dye = dyes.find((item) => item.id === guess.dyeId);
    return {
      guess,
      dyeName: dye?.displayName,
      colorHex: dye?.colorHex
    };
  });

  const isLocked = status !== "playing";
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - guesses.length);
  const canReopenResults = status !== "playing" && !showResults;
  const handleCloseResults = () => {
    setShowResults(false);
    setShareMessage("");
    if (status !== "playing") {
      setResultsDismissed(true);
      if (mode === "daily") {
        saveGameState(dateKey, {
          dateKey,
          guesses,
          status,
          resultsDismissed: true
        });
      }
    }
  };

  return (
    <Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Container
        size="md"
        py={48}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Stack gap="xl" style={{ flex: 1 }}>
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
          <Group align="center" gap="sm">
            <Box
              component="img"
              src="/favicon.svg"
              alt="DYELE color picker"
              w={40}
              h={40}
            />
            <Title order={1} ff="Fraunces, serif" size="3rem">
              DYELE
            </Title>
          </Group>
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
          guessedIds={guesses.map((guess) => guess.dyeId)}
          dateKey={dateKey}
          value={selection}
          onChange={setSelection}
          onSubmit={handleSubmit}
          disabled={isLocked}
          error={error}
        />

          <Stack gap="md">
            <Strikes
              remaining={remainingAttempts}
              total={MAX_ATTEMPTS}
              action={
                canReopenResults ? (
                  <Button
                    variant="light"
                    color="dark"
                    onClick={() => setShowResults(true)}
                    size="sm"
                  >
                    View results
                  </Button>
                ) : null
              }
            />
            {orderedGuesses.map((row, index) => (
              <GuessRow
                key={`${row.guess.dyeId}-${index}`}
                index={guesses.length - index}
                guess={row.guess}
                displayName={row.dyeName}
                colorHex={row.colorHex}
              />
            ))}
          </Stack>

          <Paper radius="lg" p="md" withBorder>
            <Group justify="space-between" align="center" wrap="nowrap">
              {mode === "practice" 
                ? (
                <Button variant="outline" color="dark" onClick={resetPractice} size="sm">
                  New DYELE
                </Button>
                ) 
                : <Countdown onDayReset={handleDailyReset} />
              }
              <Switch
                checked={mode === "practice"}
                onChange={(event) =>
                  event.currentTarget.checked ? startPractice() : returnToDaily()
                }
                label="Practice mode"
                size="sm"
              />
            </Group>
          </Paper>
        </Stack>

        <Group justify="space-between" align="top" wrap="wrap" mt="auto" pt="xl">
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              A ByteSrc project
            </Text>
            <Text
              size="sm"
              c="dark"
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                marginTop: 6
              }}
              onClick={() => setShowSourcesPlans(true)}
            >
              Sources &amp; plans
            </Text>
            <Text
              size="sm"
              c="dark"
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                marginTop: 6
              }}
              onClick={() => setShowHistory(true)}
            >
              History
            </Text>
            <Text
              size="sm"
              c="dark"
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                marginTop: 6
              }}
              onClick={() => setShowChangelog(true)}
            >
              Changelog
            </Text>
          </Stack>
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

        <ChangeLogModal
          opened={showChangelog}
          onClose={() => setShowChangelog(false)}
          entries={CHANGELOG_ENTRIES}
        />
        <SourcesPlansModal
          opened={showSourcesPlans}
          onClose={() => setShowSourcesPlans(false)}
        />
        <HistoryModal
          opened={showHistory}
          onClose={() => setShowHistory(false)}
          entries={historyEntries}
          onCopy={handleHistoryCopy}
        />
        {showResults ? (
        <ResultsModal
          status={status}
          attempts={guesses.length}
          target={target}
          onClose={handleCloseResults}
          onShare={handleShare}
          shareMessage={shareMessage}
          onPractice={startPractice}
          isDaily={mode === "daily"}
        />
        ) : null}
      </Container>
    </Box>
  );
};

export default App;
