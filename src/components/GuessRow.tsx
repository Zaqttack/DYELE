import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import AttributeTile from "./AttributeTile";
import { ATTRIBUTE_META } from "../lib/game";
import type { Guess } from "../types";

type GuessRowProps = {
  index: number;
  guess?: Guess;
  displayName?: string;
};

const GuessRow = ({ index, guess, displayName }: GuessRowProps) => {
  const feedbackMap = new Map(
    guess?.feedback.map((item) => [item.key, item.value])
  );
  return (
    <Paper radius="lg" p="md" withBorder shadow="sm">
      <Group justify="space-between" align="center" mb="sm">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" style={{ letterSpacing: "0.2em" }}>
          Guess {index}
        </Text>
        <Text size="lg" fw={600} ff="Fraunces, serif">
          {displayName ?? "—"}
        </Text>
      </Group>
      <SimpleGrid cols={{ base: 2, md: 5 }} spacing="sm">
        {ATTRIBUTE_META.map((item) => (
          <AttributeTile
            key={item.key}
            label={item.label}
            feedback={feedbackMap.get(item.key)}
          />
        ))}
      </SimpleGrid>
    </Paper>
  );
};

export default GuessRow;
