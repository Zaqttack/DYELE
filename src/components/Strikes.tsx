import { Box, Group, Paper, Stack, Text } from "@mantine/core";

type StrikesProps = {
  remaining: number;
  total: number;
};

const Strikes = ({ remaining, total }: StrikesProps) => {
  const dots = Array.from({ length: total }, (_, index) => index < remaining);

  return (
    <Paper radius="lg" p="md" withBorder shadow="sm">
      <Stack gap="xs">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" style={{ letterSpacing: "0.2em" }}>
          Strikes remaining
        </Text>
        <Group gap="xs">
          {dots.map((active, index) => (
            <Box
              key={`strike-${index}`}
              w={14}
              h={14}
              style={{
                borderRadius: 999,
                backgroundColor: active ? "#121117" : "#d0d0d4"
              }}
            />
          ))}
          <Text size="sm" c="dimmed" fw={600} ml="sm">
            {remaining} of {total} left
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
};

export default Strikes;
