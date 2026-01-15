import { Box, Group, Paper, SimpleGrid, Text } from "@mantine/core";
import AttributeTile from "./AttributeTile";
import { VISIBLE_ATTRIBUTE_META } from "../lib/game";
import type { Guess } from "../types";

type GuessRowProps = {
  index: number;
  guess?: Guess;
  displayName?: string;
  colorHex?: string;
};

const GuessRow = ({ index, guess, displayName, colorHex }: GuessRowProps) => {
  const feedbackMap = new Map(
    guess?.feedback.map((item) => [item.key, item.value])
  );
  return (
    <Paper radius="lg" p="md" withBorder shadow="sm">
      <Group justify="space-between" align="center" mb="sm">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" style={{ letterSpacing: "0.2em" }}>
          Guess {index}
        </Text>
        <Group gap="xs">
          <Box
            w={12}
            h={12}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(18, 17, 23, 0.15)",
              backgroundColor: colorHex ?? "#d0d0d4"
            }}
          />
          <Text size="lg" fw={600} ff="Fraunces, serif">
            {displayName ?? "—"}
          </Text>
        </Group>
      </Group>
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="sm">
        {VISIBLE_ATTRIBUTE_META.map((item) => (
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
