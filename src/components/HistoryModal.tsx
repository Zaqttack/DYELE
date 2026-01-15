import {
  Badge,
  Button,
  Group,
  Modal,
  Paper,
  ScrollArea,
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

const HistoryModal = ({ opened, onClose, entries, onCopy }: HistoryModalProps) => {
  const sortedEntries = [...entries].sort((a, b) =>
    b.dateKey.localeCompare(a.dateKey)
  );

  return (
    <Modal opened={opened} onClose={onClose} centered size="lg" radius="lg" title="History">
      <ScrollArea.Autosize mah={420} type="scroll">
        <Stack gap="md">
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
                    {entry.dateKey}
                  </Title>
                  <Badge color={entry.status === "won" ? "green" : "gray"} variant="light">
                    {entry.status === "won" ? "Solved" : "Missed"}
                  </Badge>
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
