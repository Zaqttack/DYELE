import {
  Badge,
  Button,
  Checkbox,
  Group,
  Modal,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core";
import { useState } from "react";
import type { HistoryEntry } from "../types";

type HistoryModalProps = {
  opened: boolean;
  onClose: () => void;
  entries: HistoryEntry[];
  onCopy: (entry: HistoryEntry) => void;
};

const formatDailyDate = (dateKey: string): string => {
  const parsed = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateKey;
  }
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const formatPracticeDate = (entry: HistoryEntry): string => {
  const raw = entry.completedAt ?? entry.dateKey;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const HISTORY_FILTER_KEY = "dyele:history:hide-practice";

const loadHidePractice = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(HISTORY_FILTER_KEY) === "1";
};

const HistoryModal = ({ opened, onClose, entries, onCopy }: HistoryModalProps) => {
  const [hidePractice, setHidePractice] = useState(loadHidePractice);
  const sortedEntries = [...entries].sort((a, b) =>
    b.dateKey.localeCompare(a.dateKey)
  );
  const countedEntries = hidePractice
    ? entries.filter((entry) => !entry.isPractice)
    : entries;
  const wins = countedEntries.filter((entry) => entry.status === "won").length;
  const losses = countedEntries.filter((entry) => entry.status === "lost").length;
  const practicePlays = entries.filter((entry) => entry.isPractice).length;
  const visibleEntries = hidePractice
    ? sortedEntries.filter((entry) => !entry.isPractice)
    : sortedEntries;

  return (
    <Modal opened={opened} onClose={onClose} centered size="lg" radius="lg" title="History">
      <ScrollArea.Autosize mah={420} type="scroll">
        <Stack gap="md">
          <Paper withBorder radius="md" p="md">
            <SimpleGrid cols={{ base: 3, sm: 3 }} spacing="sm">
              <Stack gap={2}>
                <Text size="xs" c="dimmed" tt="uppercase">
                  Wins
                </Text>
                <Text size="lg" fw={700}>
                  {wins}
                </Text>
              </Stack>
              <Stack gap={2}>
                <Text size="xs" c="dimmed" tt="uppercase">
                  Losses
                </Text>
                <Text size="lg" fw={700}>
                  {losses}
                </Text>
              </Stack>
              <Stack gap={2}>
                <Text size="xs" c="dimmed" tt="uppercase">
                  Practice
                </Text>
                <Text size="lg" fw={700}>
                  {practicePlays}
                </Text>
              </Stack>
            </SimpleGrid>
          </Paper>
          <Checkbox
            label="Hide practice games"
            checked={hidePractice}
            onChange={(event) => {
              const nextValue = event.currentTarget.checked;
              setHidePractice(nextValue);
              if (typeof window !== "undefined") {
                window.localStorage.setItem(
                  HISTORY_FILTER_KEY,
                  nextValue ? "1" : "0"
                );
              }
            }}
          />
          {visibleEntries.length === 0 ? (
            <Text size="sm" c="dimmed">
              No history yet. Finish a daily puzzle to see it here.
            </Text>
          ) : null}
          {visibleEntries.map((entry) => (
            <Paper key={entry.dateKey} withBorder radius="md" p="md">
              <Stack gap="xs" mb="sm">
                <Group gap="xs">
                  <Title order={5} ff="Fraunces, serif">
                    {entry.isPractice
                      ? formatPracticeDate(entry)
                      : formatDailyDate(entry.dateKey)}
                  </Title>
                  <Badge color={entry.status === "won" ? "green" : "gray"} variant="light">
                    {entry.status === "won" ? "Solved" : "Missed"}
                  </Badge>
                  {entry.isPractice ? (
                    <Badge color="dark" variant="outline">
                      Practice
                    </Badge>
                  ) : null}
                  <Text size="sm" c="dimmed">
                    {entry.attempts}/4 attempts
                  </Text>
                </Group>
              </Stack>
              <Group justify="space-between" align="flex-end" mt="sm">
                <Text
                  size="sm"
                  style={{
                    whiteSpace: "pre",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
                  }}
                >
                  {entry.shareGrid}
                </Text>
                <Button variant="light" color="dark" size="xs" onClick={() => onCopy(entry)}>
                  Copy
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      </ScrollArea.Autosize>
    </Modal>
  );
};

export default HistoryModal;
