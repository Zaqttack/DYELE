import {
  Badge,
  Button,
  Group,
  Modal,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core";
import type { HistoryEntry } from "../types";

type HistoryModalProps = {
  opened: boolean;
  onClose: () => void;
  entries: HistoryEntry[];
  onCopy: (entry: HistoryEntry) => void;
};

const formatEntryDate = (entry: HistoryEntry): string => {
  if (!entry.isPractice) {
    return entry.dateKey;
  }
  const parsed = new Date(entry.dateKey);
  if (Number.isNaN(parsed.getTime())) {
    return entry.dateKey;
  }
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const HistoryModal = ({ opened, onClose, entries, onCopy }: HistoryModalProps) => {
  const sortedEntries = [...entries].sort((a, b) =>
    b.dateKey.localeCompare(a.dateKey)
  );
  const wins = entries.filter((entry) => entry.status === "won").length;
  const losses = entries.filter((entry) => entry.status === "lost").length;
  const practicePlays = entries.filter((entry) => entry.isPractice).length;

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
          {sortedEntries.length === 0 ? (
            <Text size="sm" c="dimmed">
              No history yet. Finish a daily puzzle to see it here.
            </Text>
          ) : null}
          {sortedEntries.map((entry) => (
            <Paper key={entry.dateKey} withBorder radius="md" p="md">
              <Group justify="space-between" align="center" mb="sm">
                <Group gap="xs">
                  <Title order={5} ff="Fraunces, serif">
                    {formatEntryDate(entry)}
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
                <Button variant="light" color="dark" size="xs" onClick={() => onCopy(entry)}>
                  Copy
                </Button>
              </Group>
              <Text
                size="sm"
                style={{ whiteSpace: "pre", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              >
                {entry.shareGrid}
              </Text>
            </Paper>
          ))}
        </Stack>
      </ScrollArea.Autosize>
    </Modal>
  );
};

export default HistoryModal;
